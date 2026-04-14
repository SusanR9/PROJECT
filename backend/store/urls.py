from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path("login/", auth_views.LoginView.as_view(template_name="login.html"), name="login"),
    path("logout/", views.user_logout, name="logout"),
    path("checkout/", views.checkout, name="checkout"),
    path("create-order/", views.create_order, name="create_order"),
    path("payment-success/", views.payment_success, name="payment_success"),
    path("home/", views.home, name="home"),

    # optional API routes (if you still use them here)
    path("api/", views.api_root, name="api_root"),
    path("api/products/", views.api_products, name="api_products"),
    path("api/create-order/", views.api_create_order, name="api_create_order"),
]