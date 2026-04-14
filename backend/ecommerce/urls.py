from operator import index

from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import redirect
from django.urls import path, re_path
from .views import index

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', lambda request: redirect('home')),  # default
    path('', include('store.urls')),             # frontend
    path('api/', include('api.urls')),   
    path('', include('payment.urls')),     
    path('admin/', admin.site.urls),
    path('', index),              # 👈 main route
    re_path(r'^.*$', index),  
      # backend API
]