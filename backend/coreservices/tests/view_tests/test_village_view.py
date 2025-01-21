import pytest
from datetime import timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from coreservices.serializers import VillageSerializer
from coreservices.views import VillageView
from coreservices.tests.factories.village_factory import VillageFactory
from coreservices.tests.factories.assignment_factory import AssignmentFactory
from coreservices.tests.factories.staff_factory import StaffFactory


@pytest.mark.django_db
def test_valid_user_success_response(api_client, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("villages")
    headers = {"Authorization": f"Bearer {token}"}

    response = api_client.get(url, headers=headers)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "success"


@pytest.mark.django_db
def test_invalid_user_unauthorized_response(request_factory):
    url = reverse("villages")
    headers = {"Authorization": f"Bearer invalid_token"}
    request = request_factory.get(url, headers=headers)
    view = VillageView.as_view()

    response = view(request)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Invalid token"


@pytest.mark.django_db
def test_missing_authentication_response(request_factory):
    url = reverse("villages")
    request = request_factory.get(url)
    view = VillageView.as_view()

    response = view(request)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Malformed or missing token"


@pytest.mark.django_db
def test_contains_village_data(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("villages")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = VillageView.as_view()

    response = view(request)

    assert isinstance(response.data["data"], list)


@pytest.mark.django_db
def test_returns_assigned_villages(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("villages")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = VillageView.as_view()

    staff = user.staff
    village = VillageFactory(is_active=True)
    today = timezone.now().date()
    assignment = AssignmentFactory(
        staff=staff,
        village=village,
        start_date=today,
    )
    village_obj = VillageSerializer(assignment.village).data

    response = view(request)

    assert village_obj in response.data["data"]


@pytest.mark.django_db
def test_does_not_return_unassigned_villages(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("villages")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = VillageView.as_view()

    other_staff = StaffFactory()
    village = VillageFactory(is_active=True)
    today = timezone.now().date()
    assignment_other_staff = AssignmentFactory(
        staff=other_staff,
        village=village,
        start_date=today,
    )
    village_obj = VillageSerializer(assignment_other_staff.village).data

    response = view(request)

    assert village_obj not in response.data["data"]


@pytest.mark.django_db
def test_does_not_return_expired_assigned_villages(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("villages")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = VillageView.as_view()

    staff = user.staff
    village = VillageFactory(is_active=True)
    today = timezone.now().date()
    assignment = AssignmentFactory(
        staff=staff,
        village=village,
        start_date=(today - timedelta(days=100)),
        end_date=(today - timedelta(days=50)),
    )
    village_obj = VillageSerializer(assignment.village).data

    response = view(request)

    assert village_obj not in response.data["data"]


@pytest.mark.django_db
def test_does_not_return_future_assigned_villages(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("villages")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = VillageView.as_view()

    staff = user.staff
    village = VillageFactory(is_active=True)
    today = timezone.now().date()
    assignment = AssignmentFactory(
        staff=staff,
        village=village,
        start_date=(today + timedelta(days=10)),
    )
    village_obj = VillageSerializer(assignment.village).data

    response = view(request)

    assert village_obj not in response.data["data"]


@pytest.mark.django_db
def test_does_not_return_inactive_villages(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("villages")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = VillageView.as_view()

    staff = user.staff
    village = VillageFactory(is_active=False)
    today = timezone.now().date()
    assignment = AssignmentFactory(
        staff=staff,
        village=village,
        start_date=today,
    )
    village_obj = VillageSerializer(assignment.village).data

    response = view(request)

    assert village_obj not in response.data["data"]
