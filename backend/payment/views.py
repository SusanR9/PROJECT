from django.conf import settings
from django.contrib.auth import logout
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
import razorpay
import json
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json


# ✅ Import models from store app (IMPORTANT)
from store.models import Cart, Product

# ✅ Razorpay client
client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

# ✅ CORS helper
def _with_cors(response: HttpResponse) -> HttpResponse:
    response["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


# ✅ API ROOT
def api_root(request: HttpRequest) -> HttpResponse:
    if request.method == "OPTIONS":
        return _with_cors(HttpResponse(status=204))

    cart_items = Cart.objects.select_related("product").all()

    data = {
        "status": "ok",
        "user": request.user.username if request.user.is_authenticated else "Guest",
        "products": Product.objects.count(),
        "cart_units": sum(item.quantity for item in cart_items),
    }

    return _with_cors(JsonResponse(data))


# ✅ PRODUCTS API
def api_products(request: HttpRequest) -> HttpResponse:
    if request.method == "OPTIONS":
        return _with_cors(HttpResponse(status=204))

    data = [
        {
            "id": product.id,
            "name": product.name,
            "price": product.price
        }
        for product in Product.objects.all().order_by("id")
    ]

    return _with_cors(JsonResponse({"items": data}))


# 🔥 ✅ FINAL RAZORPAY ORDER API (ONLY USE THIS ONE)
@csrf_exempt
def create_order(request):
    if request.method == "OPTIONS":
        return _with_cors(HttpResponse(status=204))

    if request.method == "POST":
        try:
            data = json.loads(request.body)

            amount = int(data.get("amount", 0)) * 100  # ₹ → paise

            if amount <= 0:
                return _with_cors(JsonResponse({"error": "Invalid amount"}, status=400))

            order = client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1
            })

            print("ORDER CREATED:", order)  # ✅ DEBUG

            return _with_cors(JsonResponse(order))

        except Exception as e:
            print("ERROR:", str(e))
            return _with_cors(JsonResponse({"error": str(e)}, status=500))

    return _with_cors(JsonResponse({"error": "Only POST allowed"}, status=405))


# ✅ SUCCESS PAGE (NO LOGIN REQUIRED)
def payment_success(request):
    payment_id = request.GET.get("payment_id")
    return JsonResponse({
        "message": "Payment Success",
        "payment_id": payment_id
    })


# ✅ LOGOUT
def user_logout(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})


# ✅ HOME (NO LOGIN REQUIRED)
def home(request):
    return JsonResponse({"message": "Backend running"})


@csrf_exempt
def signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            # ✅ check existing user
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=400)

            # ✅ create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )

            return JsonResponse({"message": "User created successfully"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST allowed"}, status=405)