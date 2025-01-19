import factory
from faker import Faker
from datasync.models import Role

fake = Faker()


class RoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Role

    id = factory.LazyAttribute(lambda o: fake.word())
    name = factory.LazyAttribute(lambda o: fake.job())
