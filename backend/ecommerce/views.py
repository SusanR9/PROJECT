from django.http import JsonResponse # type: ignore
from django.shortcuts import render
def index(request):
    return render(request, "index.html")
def test_api(request):
    return JsonResponse({"message": "Hello from Django 🚀"})

import razorpay # pyright: ignore[reportMissingImports]
from django.conf import settings # type: ignore
from django.http import JsonResponse # type: ignore

def create_order(request):
    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    data = {
        "amount": 50000,  # ₹500 (in paise)
        "currency": "INR",
        "payment_capture": 1
    }

    try:
        order = client.order.create(data=data)
        return JsonResponse(order)
    except Exception as e:
        return JsonResponse({"error": str(e)})