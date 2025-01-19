import uuid
from datetime import timedelta
import factory
from faker import Faker
from coreservices.models import Assignment
from .staff_factory import StaffFactory
from .village_factory import VillageFactory

fake = Faker()


class AssignmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Assignment

    id = factory.LazyAttribute(lambda o: uuid.uuid4())
    staff = factory.SubFactory(StaffFactory)
    village = factory.SubFactory(VillageFactory)
    start_date = factory.LazyFunction(fake.date_this_year)

    @factory.lazy_attribute
    def end_date(self):
        return self.start_date + timedelta(days=fake.random_int(min=1, max=90))
