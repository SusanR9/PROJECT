from django.urls import path # type: ignore
from .views import create_order
from .views import signup
urlpatterns = [
    path("create-order/", create_order),
    path("api/signup/", signup),
]