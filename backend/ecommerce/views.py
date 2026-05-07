import json
import razorpay

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


# ✅ Home Page
def index(request):
    return render(request, "index.html")


# ✅ Test API
def test_api(request):
    return JsonResponse({
        "message": "Hello from Django 🚀"
    })


# ✅ Razorpay Client
client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)


# ✅ Create Order API
@csrf_exempt
def create_order(request):

    if request.method == "POST":

        data = json.loads(request.body)

        amount = int(data["amount"]) * 100

        payment = client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": "1"
        })

        return JsonResponse({
            "order_id": payment["id"],
            "amount": payment["amount"],
            "key": settings.RAZORPAY_KEY_ID
        })


# ✅ Verify Payment API
@csrf_exempt
def payment_verify(request):

    if request.method == "POST":

        body = json.loads(request.body)

        print(body)

        return JsonResponse({
            "status": "success"
        })