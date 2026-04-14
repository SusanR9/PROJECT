from django.contrib import admin

from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "amount", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("customer_name", "email", "phone", "razorpay_order_id")
