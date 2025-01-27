import pytest
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from coreservices.serializers import VillageSerializer
from coreservices.tests.factories.village_factory import VillageFactory


@pytest.mark.django_db
def test_village_serializer_returns_numeric_lat_long():
    latitude = -10.123456
    longitude = 120.987654
    village = VillageFactory(
        latitude=latitude,
        longitude=longitude,
    )

    data = VillageSerializer(village).data
    response = Response({"data": data})
    response.accepted_renderer = JSONRenderer()
    response.accepted_media_type = "application/json"
    response.renderer_context = {}
    response.render()
    rendered_content = response.content
    json_data = rendered_content.decode("utf-8")

    assert f'"latitude":{latitude},"longitude":{longitude}' in json_data
