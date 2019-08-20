from planner.models import PlannerData
from planner.serializers import PlannerDataSerializer, UserSerializer, ReorderPlannerDataSerializer
from planner.permissions import IsOwner
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render
from django.core.exceptions import PermissionDenied
from rest_framework import viewsets
from rest_framework import views
from rest_framework import authentication
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.decorators import action, api_view
from datetime import datetime
 
@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'plannerdata': reverse('plannerdata-list', request=request, format=format),
    })


class CsrfExemptSessionAuthentication(authentication.SessionAuthentication):
    def enforce_csrf(self, request):
        return

class LoginView(views.APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response("OK")
        else:
            raise PermissionDenied()
    def get(self, request):
        return render(request, 'planner/login.html')
    

class LogoutView(views.APIView):
    def get(self, request):
        logout(request)
        return Response("OK")

class CheckLoginView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        return Response("OK")


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class PlannerDataViewSet(viewsets.ModelViewSet):
    serializer_class = PlannerDataSerializer
    permission_classes = (IsOwner, permissions.IsAuthenticated)
    authentication_classes = (CsrfExemptSessionAuthentication,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        try:
            return PlannerData.objects.all().filter(owner=self.request.user)
        except TypeError:
            raise PermissionDenied()

    @action(methods=['GET'], detail=False)
    def search(self, request):
        filter_dict = {'owner': self.request.user}
        if request.query_params.get('date_str'):
            target_date = datetime.strptime(request.query_params.get('date_str'), "%Y-%m-%d").date()
            filter_dict['plan_date'] = target_date

        if request.query_params.get('plan_type'):
            plan_type = request.query_params.get('plan_type')
            filter_dict['plan_type'] = plan_type

        if request.query_params.get('date_from') and request.query_params.get('date_to'):
            date_from = datetime.strptime(request.query_params.get('date_from'), "%Y-%m-%d").date()
            date_to = datetime.strptime(request.query_params.get('date_to'), "%Y-%m-%d").date()
            filter_dict['plan_date__range'] = [date_from, date_to]

        if not filter_dict:
            plans = PlannerData.objects.none()
        else:
            plans = PlannerData.objects.filter(**filter_dict)
        serializer = self.get_serializer(plans, many=True)
        return Response(serializer.data)

    @action(methods=['patch'], detail=False)
    def change_order(self, request):
        data = JSONParser().parse(request)
        serializer = ReorderPlannerDataSerializer(data=data, many=True)
        if serializer.is_valid():
            for item in serializer.validated_data:
                PlannerData.object.filter(id=item['id']).update(order=item['order'])
            return Response("OK")
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
