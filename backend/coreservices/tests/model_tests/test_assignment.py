import pytest
from coreservices.tests.factories.assignment_factory import AssignmentFactory
from coreservices.tests.factories.staff_factory import StaffFactory
from coreservices.tests.factories.village_factory import VillageFactory


def end_date_str(assignment):
    return f" - {assignment.end_date}" if assignment.end_date else ""


@pytest.mark.django_db
def test_assignment_str_has_end_date():
    assignment = AssignmentFactory()

    assert str(
        assignment
    ) == f"{assignment.trainer} - {assignment.village} - {assignment.start_date}" + end_date_str(
        assignment
    )


@pytest.mark.django_db
def test_assignment_str_has_no_end_date():
    assignment = AssignmentFactory(end_date=None)

    assert str(
        assignment
    ) == f"{assignment.staff} - {assignment.village} - {assignment.start_date}" + end_date_str(
        assignment
    )


@pytest.mark.django_db
def test_assignment_trainer_relation():
    staff = StaffFactory()
    assignment = AssignmentFactory(staff=staff)

    assert assignment.staff == staff


@pytest.mark.django_db
def test_assignment_village_relation():
    village = VillageFactory()
    assignment = AssignmentFactory(village=village)

    assert assignment.village == village
