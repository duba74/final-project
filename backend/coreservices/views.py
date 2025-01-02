from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Village
from .serializers import VillageSerializer


class VillageView(APIView):
    def get(self, request, *args, **kwargs):
        queryset = Village.objects.all()

        response_data = VillageSerializer(queryset, many=True)

        return Response(response_data, status=status.HTTP_200_OK)
