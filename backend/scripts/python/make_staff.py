import django
import os
import sys
from django.utils import timezone
from django.db import transaction

sys.path.append(os.getcwd().replace("/scripts/python", ""))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "training.settings")
django.setup()

from django.contrib.auth.models import User
from coreservices.models import Role, Staff, Assignment, Village

from scripts.python.mock_roles import ROLE_LIST
from scripts.python.mock_staff import STAFF_LIST
from scripts.python.mock_assignments import ASSIGNMENT_LIST


@transaction.atomic
def create_or_update_roles(role_list):
    for r in role_list:
        role, created = Role.objects.update_or_create(
            id=r["id"],
            defaults={"name": r["name"]},
        )

        if created:
            print(f"Created role: {role}")
        else:
            print(f"Updated role: {role}")


@transaction.atomic
def create_or_update_staff(staff_list):
    for s in staff_list:
        user, created = User.objects.update_or_create(
            username=s["username"],
            defaults={
                "email": s["email"],
                "first_name": s["first_name"],
                "last_name": s["last_name"],
            },
        )

        if created:
            user.set_password(s["password"])
            user.save()
            print(f"Created user: {user}")
        else:
            print(f"Updated user: {user}")

        if s.get("role", None):
            role = Role.objects.get(id=s["role"])
        else:
            role = None

        staff, created = Staff.objects.update_or_create(
            id=user.username,
            user=user,
            defaults={
                "role": role,
                "country": s.get("country", None),
            },
        )

        if created:
            print(f"Created staff: {staff}")
        else:
            print(f"Updated staff: {staff}")


@transaction.atomic
def create_or_update_assignments(assignment_list):
    for a in assignment_list:
        staff = Staff.objects.get(user__username=a["staff"])
        village = Village.objects.get(id=a["village"])

        assignment, created = Assignment.objects.update_or_create(
            staff=staff,
            village=village,
            defaults={
                "start_date": a["start_date"],
                "end_date": a.get("end_date", None),
            },
        )

        if created:
            print(f"Created assignment: {assignment}")
        else:
            print(f"Updated assignment: {assignment}")


def execute():
    create_or_update_roles(ROLE_LIST)
    create_or_update_staff(STAFF_LIST)
    create_or_update_assignments(ASSIGNMENT_LIST)

    print("Role/Staff/Assignment objects created/updated successfully")


if __name__ == "__main__":
    execute()
