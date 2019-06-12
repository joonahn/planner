"""planner_django_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
from django.urls import include, path
from planner.views import LoginView, LogoutView, CheckLoginView

urlpatterns = [
    path('planner/api/', include('planner.urls')),
    path('planner/api/admin/', admin.site.urls),
    path('planner/api/login/', LoginView.as_view(), name='login'),
    path('planner/api/logout/', LogoutView.as_view(), name='logout'),
    path('planner/api/check_login/', CheckLoginView.as_view(), name='check-login'),
]
