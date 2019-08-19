from rest_framework import serializers
from .models import PlannerData
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    plannerdata = serializers.PrimaryKeyRelatedField(many=True, queryset=PlannerData.objects.all())
    class Meta:
        model=User
        fields = ('id', 'username', 'plannerdata')

class PlannerDataSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = PlannerData
        fields = ("id", "plan_date", "finish_timestamp", "create_timestamp",
                  "order", "is_finished", "content", "plan_type", "owner",)


class ReorderPlannerDataSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = PlannerData
        fields = ("id", "order",)
