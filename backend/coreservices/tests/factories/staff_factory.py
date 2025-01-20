import factory
from faker import Faker
from coreservices.models import Staff
from .user_factory import UserFactory
from .role_factory import RoleFactory

fake = Faker()


class StaffFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Staff

    user = factory.SubFactory(UserFactory)
    role = factory.SubFactory(RoleFactory)
    country = fake.country_code()
