"""
URL configuration for TixTrack project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from booking import views

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

# from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', views.concertlist, name='concertlist'),
    path('add_concerts/', views.addconcerts, name='add_concerts'),
    path('edit_concerts/<int:pk>/', views.edit_concert, name='edit_concert'),
    path('delete_concert/<int:pk>/', views.delete_concert, name='delete_concert'),

    path('api/concerts', views.concert_list_api, name='concert_list_api'),
    path('api/concerts/<int:id>/', views.concert_detail),
    path('register/', views.register, name='register'),

    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),

    
    path('create_booking/', views.create_booking, name='create_booking'),

    path('bookings_list/', views.booking_list, name='bookings_list'),

    path('users_list/', views.users_list, name='users_list'),
    path('disable_user/<int:user_id>/', views.disable_user, name='disable_user'),
    path('enable_users/<int:user_id>/', views.enable_user, name='enable_user'),
    path('delete_users/<int:user_id>/', views.delete_user, name='delete_user'),
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
