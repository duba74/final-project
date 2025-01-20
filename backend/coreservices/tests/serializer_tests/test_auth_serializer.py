import pytest
from faker import Faker
from rest_framework.exceptions import ValidationError
from coreservices.serializers import AuthSerializer

fake = Faker()


@pytest.mark.django_db
def test_auth_serializer_valid():
    username = fake.user_name()
    password = fake.password()
    data = {
        "username": username,
        "password": password,
    }
    serializer = AuthSerializer(data=data)

    assert serializer.is_valid()
    assert serializer.validated_data == data


@pytest.mark.django_db
def test_auth_serializer_no_username():
    password = fake.password()
    data = {
        "password": password,
    }
    serializer = AuthSerializer(data=data)

    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
def test_auth_serializer_no_password():
    username = fake.user_name()
    data = {
        "username": username,
    }
    serializer = AuthSerializer(data=data)

    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
def test_auth_serializer_numeric_username():
    username = fake.random_int(1000, 10000)
    data = {
        "username": username,
    }
    serializer = AuthSerializer(data=data)

    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
def test_auth_serializer_numeric_password():
    password = fake.password()
    data = {
        "password": password,
    }
    serializer = AuthSerializer(data=data)

    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)
