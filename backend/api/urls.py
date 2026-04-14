from django.urls import path
from .views import product_list, payment_config, checkout, payment_verify

urlpatterns = [
    path("products/", product_list),
    path("config/", payment_config),
    path("checkout/", checkout),
    path("payment/verify/", payment_verify),
]