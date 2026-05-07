import razorpay
from django.conf import settings
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID,
          settings.RAZORPAY_KEY_SECRET)
)


@csrf_exempt
def checkout(request):

    if request.method == "POST":

        data = json.loads(request.body)

        amount = int(data["amount"]) * 100

        order = client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1
        })

        return JsonResponse({
            "success": True,
            "order_id": order["id"],
            "amount": order["amount"],
            "key": settings.RAZORPAY_KEY_ID
        })

    return JsonResponse({
        "success": False,
        "message": "Invalid request"
    })


@csrf_exempt
def payment_verify(request):

    if request.method == "POST":

        data = json.loads(request.body)

        params_dict = {

            "razorpay_order_id":
            data["razorpay_order_id"],

            "razorpay_payment_id":
            data["razorpay_payment_id"],

            "razorpay_signature":
            data["razorpay_signature"]
        }

        try:

            client.utility.verify_payment_signature(
                params_dict
            )

            return JsonResponse({
                "status": "success"
            })

        except:

            return JsonResponse({
                "status": "failed"
            })

    return JsonResponse({
        "status": "invalid request"
    })