from django.conf import settings
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
import razorpay
from django.views.decorators.http import require_POST


from .models import Cart, Product
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def _with_cors(response: HttpResponse) -> HttpResponse:
    response["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

def _api_payload(request: HttpRequest) -> dict:
    cart_items = Cart.objects.select_related("product").all()
    return {
        "status": "ok",
        "user": request.user.username if request.user.is_authenticated else "Guest",
        "products": Product.objects.count(),
        "cart_units": sum(item.quantity for item in cart_items),
        "flows": ["login", "cart", "checkout", "payment", "success"],
    }
def api_root(request: HttpRequest) -> HttpResponse:
    if request.method == "OPTIONS":
        return _with_cors(HttpResponse(status=204))
    return _with_cors(JsonResponse(_api_payload(request)))

def api_products(request: HttpRequest) -> HttpResponse:
    if request.method == "OPTIONS":
        return _with_cors(HttpResponse(status=204))
    
    data = [
        {"id": product.id, "name": product.name, "price": product.price}
        for product in Product.objects.all().order_by("id")
    ]
    return _with_cors(JsonResponse({"items": data}))

@csrf_exempt
def api_create_order(request):
    if request.method == "POST":
        try:
            import json
            data = json.loads(request.body)

            amount = int(data.get("amount", 0)) * 100

            if amount <= 0:
                return JsonResponse({"error": "Invalid amount"}, status=400)

            order = client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1
            })

            print("ORDER CREATED:", order)  # 🔥 DEBUG

            return JsonResponse(order)

        except Exception as e:
            print("ERROR:", str(e))  # 🔥 DEBUG
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)

@login_required(login_url="/login/")
def checkout(request: HttpRequest) -> HttpResponse:
     return render(request, 'checkout.html', {
        'razorpay_key_id': settings.RAZORPAY_KEY_ID
    })

@csrf_exempt

@require_POST
def create_order(request):
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        return JsonResponse(
            {"error": "Razorpay keys are not configured on the server."},
            status=500
        )

    order = client.order.create({
        "amount": 50000,   # ₹500
        "currency": "INR",
        "payment_capture": 1
    })
    return JsonResponse(order)


# ✅ PAYMENT SUCCESS → LOGOUT → LOGIN PAGE
def payment_success(request):
    logout(request)
    return redirect('login')


# ✅ LOGOUT BUTTON
def user_logout(request):
    logout(request)
    return redirect('login')

from django.contrib.auth.decorators import login_required

@login_required(login_url='/login/')
def home(request):
    return render(request, 'home.html')
