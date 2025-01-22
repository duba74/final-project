import pytest
from coreservices.models import Client, Village
from coreservices.tests.factories.client_factory import ClientFactory
from coreservices.tests.factories.village_factory import VillageFactory


@pytest.mark.django_db
def test_client_str():
    client = ClientFactory()

    assert str(client) == client.id


@pytest.mark.django_db
def test_village_relation():
    village = VillageFactory()
    client = ClientFactory(village=village)

    assert client.village == village
