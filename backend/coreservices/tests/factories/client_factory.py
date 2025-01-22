import factory
import factory.random
from faker import Faker
from coreservices.models import Client
from .village_factory import VillageFactory

fake = Faker()


class ClientFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Client

    id = factory.LazyAttribute(lambda o: str(fake.random_int(10000, 9999999)))
    first_name = factory.LazyAttribute(lambda o: fake.first_name())
    last_name = factory.LazyAttribute(lambda o: fake.last_name())
    sex = factory.LazyAttribute(lambda o: fake.random_element(["M", "F"]))
    age_group = factory.LazyAttribute(
        lambda o: fake.random_element(["lt_30", "gte_30"])
    )
    phone_1 = factory.LazyAttribute(lambda o: str(fake.random_int(10000000, 999999999)))
    phone_2 = factory.LazyAttribute(lambda o: str(fake.random_int(10000000, 999999999)))
    is_leader = factory.Faker("boolean", chance_of_getting_true=10)
    village = factory.SubFactory(VillageFactory)
