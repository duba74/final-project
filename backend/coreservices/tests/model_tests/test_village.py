import pytest
from coreservices.tests.factories.village_factory import VillageFactory


@pytest.mark.django_db
def test_village_str():
    village = VillageFactory()

    assert str(village) == f"{village.id} - {village.name}"
