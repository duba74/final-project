import pytest
from faker import Faker
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from coreservices.tests.factories.user_factory import UserFactory
from coreservices.tests.factories.staff_factory import StaffFactory
from coreservices.tests.factories.role_factory import RoleFactory


fake = Faker()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_credentials(request):
    params = getattr(request, "param", {})
    username = params.get("username", fake.user_name())
    password = params.get("password", fake.password())

    return {"username": username, "password": password}


@pytest.fixture
def create_role(request):
    params = getattr(request, "param", {})
    id = params.get("role_id", fake.word())
    name = params.get("role_name", fake.job())

    return {"id": id, "name": name}


@pytest.fixture
def create_user(create_credentials, create_role):
    credentials = create_credentials
    role = create_role

    role = RoleFactory(id=role["id"], name=role["name"])
    user = UserFactory(
        username=credentials["username"],
    )
    user.set_password(credentials["password"])
    user.save()
    StaffFactory(
        user=user,
        role=role,
    )
    Token.objects.create(user=user)

    return {"user": user, "credentials": credentials}
