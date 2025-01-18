import factory
from faker import Faker
from django.contrib.auth.models import User

fake = Faker()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    username = factory.LazyAttribute(lambda o: fake.user_name())
    password = factory.PostGenerationMethodCall("set_password", "abcd1234")
