from django.urls import path
from .views import create_order, payment_verify

urlpatterns = [
    path("create_order/", create_order),
    path("payment_verify/", payment_verify),
]