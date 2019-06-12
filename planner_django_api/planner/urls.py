from django.urls import path, include
from planner import views
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns

router = DefaultRouter()
router.register(r'planner_data', views.PlannerDataViewSet, 'planner_data')
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
