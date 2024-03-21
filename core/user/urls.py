from django.urls import path
from . import views

urlpatterns = [
    path('get_users/', views.get_users, name='get_users'),
    path('change_role/', views.change_role, name='change_role'),
]