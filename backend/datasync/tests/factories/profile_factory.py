import factory
from faker import Faker
from datasync.models import Profile
from .user_factory import UserFactory
from .role_factory import RoleFactory

fake = Faker()


class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile

    user = factory.SubFactory(UserFactory)
    role = factory.SubFactory(RoleFactory)
