import factory
from faker import Faker
from coreservices.models import Village

fake = Faker()


class VillageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Village

    id = factory.LazyAttribute(lambda o: fake.bothify(text="#####"))
    is_active = factory.Faker("boolean", chance_of_getting_true=75)
    name = factory.Faker("city")
    zone_code = factory.LazyAttribute(lambda o: fake.bothify(text="###"))
    zone_name = factory.Faker("city")
    district_code = factory.LazyAttribute(lambda o: fake.bothify(text="###"))
    district_name = factory.Faker("state")
    country_code = factory.LazyAttribute(lambda o: fake.bothify(text="##"))
    country_name = factory.Faker("country")
    latitude = factory.LazyAttribute(lambda o: fake.latitude())
    longitude = factory.LazyAttribute(lambda o: fake.longitude())
