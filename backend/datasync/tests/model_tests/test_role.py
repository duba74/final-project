import pytest
from datasync.models import Role


@pytest.mark.django_db
def test_role_str():
    test_role_id = "admin"
    test_role_name = "Admin"
    role = Role(id=test_role_id, name=test_role_name)

    assert str(role) == test_role_name
