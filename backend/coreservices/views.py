from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Country, District, Zone, Village
from .serializers import (
    CountrySerializer,
    DistrictSerializer,
    ZoneSerializer,
    VillageSerializer,
)
from .utils import convert_to_tz_aware_datetime, get_min_time


class CountryView(APIView):
    def get(self, request, *args, **kwargs):
        last_pulled_at = request.query_params.get("last_pulled_at")

        print(last_pulled_at)

        if last_pulled_at == "null":
            last_pulled_at = get_min_time()
        else:
            last_pulled_at = convert_to_tz_aware_datetime(last_pulled_at)

        queryset = Country.objects.all()

        created = queryset.filter(date_created__gt=last_pulled_at)
        updated = queryset.filter(
            last_modified__gt=last_pulled_at, date_created__lte=last_pulled_at
        )

        # Serialize and return these
        response_data = CountrySerializer(queryset, many=True)

        return Response(response_data, status=status.HTTP_200_OK)


class DistrictView(APIView):
    def get(self, request, *args, **kwargs):
        last_pulled_at = request.query_params.get("last_pulled_at")

        print(last_pulled_at)

        if last_pulled_at == "null":
            last_pulled_at = get_min_time()
        else:
            last_pulled_at = convert_to_tz_aware_datetime(last_pulled_at)

        queryset = District.objects.all()

        created = queryset.filter(date_created__gt=last_pulled_at)
        updated = queryset.filter(
            last_modified__gt=last_pulled_at, date_created__lte=last_pulled_at
        )

        # Serialize and return these
        response_data = DistrictSerializer(queryset, many=True)

        return Response(response_data, status=status.HTTP_200_OK)


class ZoneView(APIView):
    def get(self, request, *args, **kwargs):
        last_pulled_at = request.query_params.get("last_pulled_at")

        print(last_pulled_at)

        if last_pulled_at == "null":
            last_pulled_at = get_min_time()
        else:
            last_pulled_at = convert_to_tz_aware_datetime(last_pulled_at)

        queryset = Zone.objects.all()

        created = queryset.filter(date_created__gt=last_pulled_at)
        updated = queryset.filter(
            last_modified__gt=last_pulled_at, date_created__lte=last_pulled_at
        )

        # Serialize and return these
        response_data = ZoneSerializer(queryset, many=True)

        return Response(response_data, status=status.HTTP_200_OK)


class VillageView(APIView):
    def get(self, request, *args, **kwargs):
        last_pulled_at = request.query_params.get("last_pulled_at")

        print(last_pulled_at)

        if last_pulled_at == "null":
            last_pulled_at = get_min_time()
        else:
            last_pulled_at = convert_to_tz_aware_datetime(last_pulled_at)

        queryset = Village.objects.all()

        created = queryset.filter(date_created__gt=last_pulled_at)
        updated = queryset.filter(
            last_modified__gt=last_pulled_at, date_created__lte=last_pulled_at
        )

        # Serialize and return these
        response_data = VillageSerializer(queryset, many=True)

        return Response(response_data, status=status.HTTP_200_OK)
