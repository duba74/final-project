import pytest
from datasync.models import Role, Profile
from django.contrib.auth.models import User
from datasync.tests.factories.profile_factory import ProfileFactory
from datasync.tests.factories.role_factory import RoleFactory


@pytest.mark.django_db
def test_profile_str():
    profile = ProfileFactory()

    assert str(profile) == profile.user.username


@pytest.mark.django_db
def test_user_relation():
    profile = ProfileFactory()

    assert profile.user is not None


@pytest.mark.django_db
def test_role_relation():
    role = RoleFactory()
    profile = ProfileFactory(role=role)

    assert profile.role == role
