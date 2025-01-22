from datetime import timedelta
import factory
import factory.random
from faker import Faker
from coreservices.models import TrainingModule

fake = Faker()


class TrainingModuleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TrainingModule

    id = factory.LazyAttribute(lambda o: str(fake.random_int(10000, 99999)))
    name = factory.LazyAttribute(lambda o: fake.word())
    topic = factory.LazyAttribute(lambda o: fake.sentence())
    country = factory.LazyAttribute(lambda o: fake.country_code())
    start_date = factory.LazyFunction(fake.date_this_year)
    is_active = factory.Faker("boolean", chance_of_getting_true=75)

    @factory.lazy_attribute
    def end_date(self):
        return self.start_date + timedelta(days=fake.random_int(min=1, max=90))
