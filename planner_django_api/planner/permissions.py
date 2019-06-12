from rest_framework import permissions
from django.contrib.auth.models import AnonymousUser

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.owner == request.user

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ('HEAD', 'OPTIONS'):
            return True
        
        return obj.owner == request.user
