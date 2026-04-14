import json
import base64
import hashlib
import hmac
from decimal import Decimal, InvalidOperation
from urllib import error, request as urllib_request

from django.conf import settings # type: ignore
from django.http import JsonResponse # type: ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore
from django.views.decorators.http import require_GET, require_POST # type: ignore
from store.models import Product
from .models import Order


# ---------------- HELPERS ---------------- #

def _product_to_dict(product):
    return {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "category": product.category,
        "description": product.description,
        "price": float(product.price),
        "image": product.image,
        "stock": product.stock,
        "is_featured": product.is_featured,
    }


def _read_json(request):
    try:
        return json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return None


def _razorpay_ready():
    return bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET)


def _create_razorpay_order(order):
    payload = json.dumps({
        "amount": int(order.amount * 100),
        "currency": order.currency,
        "notes": {
            "order_id": str(order.id),
            "customer_name": order.customer_name,
        },
    }).encode("utf-8")

    credentials = f"{settings.RAZORPAY_KEY_ID}:{settings.RAZORPAY_KEY_SECRET}"
    token = base64.b64encode(credentials.encode()).decode()

    req = urllib_request.Request(
        "https://api.razorpay.com/v1/orders",
        data=payload,
        headers={
            "Authorization": f"Basic {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib_request.urlopen(req, timeout=20) as response:
        return json.loads(response.read().decode())


# ---------------- VIEWS ---------------- #

@require_GET
def product_list(request):
    products = Product.objects.all()
    return JsonResponse({"products": [_product_to_dict(p) for p in products]})


@require_GET
def payment_config(request):
    return JsonResponse({
        "key": settings.RAZORPAY_KEY_ID,
        "currency": "INR",
    })


@csrf_exempt
@require_POST
def checkout(request):
    payload = _read_json(request)
    if payload is None:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    customer = payload.get("customer", {})
    items = payload.get("items", [])

    if not items:
        return JsonResponse({"error": "Cart is empty"}, status=400)

    total = Decimal("0.00")
    snapshot = []

    for item in items:
        product_id = item.get("id")
        quantity = int(item.get("quantity", 0))

        if quantity < 1:
            return JsonResponse({"error": "Invalid quantity"}, status=400)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)

        if quantity > product.stock:
            return JsonResponse({
                "error": f"Only {product.stock} left for {product.name}"
            }, status=400)

        line_total = product.price * quantity
        total += line_total

        snapshot.append({
            "id": product.id,
            "name": product.name,
            "price": float(product.price),
            "quantity": quantity,
            "line_total": float(line_total),
        })

    try:
        order = Order.objects.create(
            customer_name=customer.get("name", ""),
            email=customer.get("email", ""),
            phone=customer.get("phone", ""),
            address=customer.get("address", ""),
            amount=total,
            cart_snapshot=snapshot,
        )
    except InvalidOperation:
        return JsonResponse({"error": "Invalid amount"}, status=400)

    if not _razorpay_ready():
        return JsonResponse({"error": "Razorpay not configured"}, status=503)

    try:
        razorpay_order = _create_razorpay_order(order)
    except error.HTTPError:
        return JsonResponse({"error": "Razorpay failed"}, status=500)

    order.razorpay_order_id = razorpay_order["id"]
    order.save()

    return JsonResponse({
        "order": {
            "id": order.id,
            "amount": float(order.amount),
            "currency": order.currency,
            "razorpay_order_id": order.razorpay_order_id,
        }
    })


@csrf_exempt
@require_POST
def payment_verify(request):
    payload = _read_json(request)
    if payload is None:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    order_id = payload.get("order_id")
    payment_id = payload.get("razorpay_payment_id")
    razorpay_order_id = payload.get("razorpay_order_id")
    signature = payload.get("razorpay_signature")

    if not all([order_id, payment_id, razorpay_order_id, signature]):
        return JsonResponse({"error": "Missing fields"}, status=400)

    try:
        order = Order.objects.get(id=order_id, razorpay_order_id=razorpay_order_id)
    except Order.DoesNotExist:
        return JsonResponse({"error": "Order not found"}, status=404)

    body = f"{razorpay_order_id}|{payment_id}"
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()

    if expected != signature:
        order.status = Order.STATUS_FAILED
        order.save()
        return JsonResponse({"error": "Invalid signature"}, status=400)

    order.status = Order.STATUS_PAID
    order.razorpay_payment_id = payment_id
    order.razorpay_signature = signature
    order.save()

    for item in order.cart_snapshot:
        try:
            product = Product.objects.get(id=item["id"])
            product.stock -= int(item["quantity"])
            product.save()
        except Product.DoesNotExist:
            continue

    return JsonResponse({"success": True})