import pytest
from datasync.models import Role
from datasync.tests.factories.role_factory import RoleFactory


@pytest.mark.django_db
def test_role_str():
    role = RoleFactory()

    assert str(role) == role.name
