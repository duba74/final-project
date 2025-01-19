import pytest
from coreservices.models import Role, Staff
from django.contrib.auth.models import User
from coreservices.tests.factories.staff_factory import StaffFactory
from coreservices.tests.factories.role_factory import RoleFactory


@pytest.mark.django_db
def test_staff_str():
    staff = StaffFactory()

    assert str(staff) == staff.user.username


@pytest.mark.django_db
def test_user_relation():
    staff = StaffFactory()

    assert staff.user is not None


@pytest.mark.django_db
def test_role_relation():
    role = RoleFactory()
    staff = StaffFactory(role=role)

    assert staff.role == role
