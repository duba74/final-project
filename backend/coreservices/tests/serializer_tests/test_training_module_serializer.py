import pytest
from datetime import date
from coreservices.serializers import TrainingModuleSerializer
from coreservices.tests.factories.training_module_factory import TrainingModuleFactory


@pytest.mark.django_db
def test_training_module_serializer_formats_dates_as_unix_timestamps():
    start_date = date(2025, 1, 1)
    start_date_timestamp = 1735689600000
    end_date = date(2025, 2, 1)
    end_date_timestamp = 1738368000000

    training_module = TrainingModuleFactory(
        start_date=start_date,
        end_date=end_date,
    )

    data = TrainingModuleSerializer(training_module).data

    assert data["start_date"] == start_date_timestamp
    assert data["end_date"] == end_date_timestamp
