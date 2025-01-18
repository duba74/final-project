import pytest
from coreservices.tests.factories.village_factory import VillageFactory
from coreservices.models import Village


# String representation: Ensure the __str__ method returns a meaningful and expected string. This helps with readability and debugging.
@pytest.mark.django_db
def test_village_str():
    village = VillageFactory()

    assert str(village) == f"{village.id} - {village.name}"


# Required fields and constraints:Verify that required fields are enforced and constraints are respected. This ensures data integrity and prevents issues with missing or invalid data.

# Relationships: Test that relationships (e.g., ForeignKey, OneToOneField) are correctly established and managed. This ensures your data relationships work as expected.

# Default values: Check that default values are correctly set. This is especially important for Boolean fields and fields with calculated defaults.

# Field lengths: Ensure that fields with length constraints enforce those constraints. This helps prevent data truncation or validation errors.

# Unique constraints: Test that unique constraints are enforced. This ensures that your data maintains its uniqueness as required.

# Model methods: If your model has custom methods, test them to ensure they return expected results and handle edge cases.
