from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Village
from .serializers import AuthSerializer, VillageSerializer


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
            "role": user.staff.role.id,
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


class VillageView(APIView):
    def get(self, request, *args, **kwargs):
        queryset = Village.objects.all()

        response_data = VillageSerializer(queryset, many=True)

        return Response(response_data.data, status=status.HTTP_200_OK)
