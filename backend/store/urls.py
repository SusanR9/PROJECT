from django.urls import path # type: ignore
from django.contrib.auth import views as auth_views # type: ignore
from django.urls import path # type: ignore
from .views import create_order, verify_payment

urlpatterns = [
    path("login/", auth_views.LoginView.as_view(template_name="login.html"), name="login"),
    path("logout/", views.user_logout, name="logout"), # type: ignore
    path("checkout/", views.checkout, name="checkout"), # type: ignore
    path("create-order/", views.create_order, name="create_order"), # type: ignore
    path("payment-success/", views.payment_success, name="payment_success"), # type: ignore
    path("home/", views.home, name="home"), # type: ignore

    # optional API routes (if you still use them here)
    path("api/", views.api_root, name="api_root"), # type: ignore
    path("api/products/", views.api_products, name="api_products"), # type: ignore
    path("api/create-order/", views.api_create_order, name="api_create_order"), # type: ignore
]