import pytest
from datetime import timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from coreservices.views import ClientView
from coreservices.tests.factories.client_factory import ClientFactory
from coreservices.tests.factories.village_factory import VillageFactory
from coreservices.tests.factories.assignment_factory import AssignmentFactory
from coreservices.tests.factories.staff_factory import StaffFactory


@pytest.mark.django_db
def test_valid_user_success_response(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("clients")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = ClientView.as_view()

    response = view(request)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "success"


@pytest.mark.django_db
def test_invalid_user_unauthorized_response(request_factory):
    url = reverse("clients")
    headers = {"Authorization": f"Bearer invalid_token"}
    request = request_factory.get(url, headers=headers)
    view = ClientView.as_view()

    response = view(request)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Invalid token"


@pytest.mark.django_db
def test_missing_authentication_response(request_factory):
    url = reverse("clients")
    request = request_factory.get(url)
    view = ClientView.as_view()

    response = view(request)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Malformed or missing token"


@pytest.mark.django_db
def test_contains_client_data(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("clients")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = ClientView.as_view()

    response = view(request)

    assert isinstance(response.data["data"], list)


@pytest.mark.django_db
def test_returns_clients_in_assigned_villages(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("clients")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = ClientView.as_view()

    villages = [VillageFactory(is_active=True) for _ in range(2)]
    clients = [ClientFactory(village=v) for v in villages for _ in range(2)]

    staff = user.staff
    today = timezone.now().date()
    assignments = [
        AssignmentFactory(
            staff=staff,
            village=v,
            start_date=today,
        )
        for v in villages
    ]

    response = view(request)

    response_clients = [c["id"] for c in response.data["data"]]

    for c in clients:
        assert c.id in response_clients


@pytest.mark.django_db
def test_does_not_return_clients_in_unassigned_villages(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("clients")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = ClientView.as_view()

    village = VillageFactory(is_active=True)
    client = ClientFactory(village=village)

    other_staff = StaffFactory()
    today = timezone.now().date()
    assignment_other_staff = AssignmentFactory(
        staff=other_staff,
        village=village,
        start_date=today,
    )

    response = view(request)

    response_clients = [c["id"] for c in response.data["data"]]

    assert client.id not in response_clients


@pytest.mark.django_db
def test_does_not_return_clients_in_expired_assigned_villages(
    request_factory, create_user
):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("clients")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = ClientView.as_view()

    village = VillageFactory(is_active=True)
    client = ClientFactory(village=village)

    staff = user.staff
    today = timezone.now().date()
    assignment = AssignmentFactory(
        staff=staff,
        village=village,
        start_date=(today - timedelta(days=100)),
        end_date=(today - timedelta(days=50)),
    )

    response = view(request)

    response_clients = [c["id"] for c in response.data["data"]]

    assert client.id not in response_clients


@pytest.mark.django_db
def test_does_not_return_clients_in_future_assigned_villages(
    request_factory, create_user
):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("clients")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = ClientView.as_view()

    village = VillageFactory(is_active=True)
    client = ClientFactory(village=village)

    staff = user.staff
    today = timezone.now().date()
    assignment = AssignmentFactory(
        staff=staff,
        village=village,
        start_date=(today + timedelta(days=10)),
    )

    response = view(request)

    response_clients = [c["id"] for c in response.data["data"]]

    assert client.id not in response_clients


@pytest.mark.django_db
def test_does_not_return_inactive_villages(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("clients")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = ClientView.as_view()

    village = VillageFactory(is_active=False)
    client = ClientFactory(village=village)

    staff = user.staff
    today = timezone.now().date()
    assignment = AssignmentFactory(
        staff=staff,
        village=village,
        start_date=today,
    )

    response = view(request)

    response_clients = [c["id"] for c in response.data["data"]]

    assert client.id not in response_clients
