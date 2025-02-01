from django.utils import timezone
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils import extract_token, validate_token
from .models import Assignment, Village, Client, TrainingModule
from .serializers import (
    AuthSerializer,
    VillageSerializer,
    ClientSerializer,
    TrainingModuleSerializer,
)


class AuthView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AuthSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response(
                {"status": "error", "message": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, created = Token.objects.get_or_create(user=user)

        user_info = {
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": f"{user.first_name} {user.last_name}",
            "role": (
                user.staff.role.id
                if hasattr(user.staff, "role") and user.staff.role
                else None
            ),
            "country": user.staff.country,
        }

        return Response(
            {
                "status": "success",
                "token": token.key,
                "user": user_info,
            },
            status=status.HTTP_200_OK,
        )


class ValidateTokenView(APIView):
    def get(self, request, *args, **kwargs):
        return validate_token(request)


class AuthenticatedAPIView(APIView):
    def dispatch(self, request, *args, **kwargs):
        token_validation_response = validate_token(request)

        if not token_validation_response.status_code == status.HTTP_200_OK:
            return token_validation_response

        token = Token.objects.get(
            key=extract_token(request.headers.get("Authorization"))
        )
        self.user = token.user

        return super().dispatch(request, *args, **kwargs)


class VillageView(AuthenticatedAPIView):
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()

        assignments = Assignment.objects.filter(
            Q(staff=self.user.staff)
            & Q(start_date__lte=today)
            & (Q(end_date__gte=today) | Q(end_date__isnull=True))
        )

        assigned_village_ids = assignments.values_list("village_id", flat=True)

        villages = Village.objects.filter(id__in=assigned_village_ids, is_active=True)

        data = VillageSerializer(villages, many=True).data

        return Response({"status": "success", "data": data}, status=status.HTTP_200_OK)


class ClientView(AuthenticatedAPIView):
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()

        assignments = Assignment.objects.filter(
            Q(staff=self.user.staff)
            & Q(start_date__lte=today)
            & (Q(end_date__gte=today) | Q(end_date__isnull=True))
        )

        assigned_village_ids = assignments.values_list("village_id", flat=True)

        clients = Client.objects.filter(
            village__in=assigned_village_ids, village__is_active=True
        )

        data = ClientSerializer(clients, many=True).data

        return Response({"status": "success", "data": data}, status=status.HTTP_200_OK)


class TrainingModuleView(AuthenticatedAPIView):
    def get(self, request, *args, **kwargs):
        training_modules = TrainingModule.objects.filter(
            country=self.user.staff.country,
        )

        data = TrainingModuleSerializer(training_modules, many=True).data

        return Response({"status": "success", "data": data}, status=status.HTTP_200_OK)
