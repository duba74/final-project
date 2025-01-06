import django
import os
import sys
from django.utils import timezone

sys.path.append(os.getcwd().replace("/scripts/python", ""))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "training.settings")
django.setup()

from datasync.models import *


MODULE_LIST = [
    {
        "id": "m1_ml",
        "created_by": "clintonleex@gmail.com",
        "created_at": timezone.now(),
        "updated_at": timezone.now(),
        "name": "Module 1 - Mali",
        "topic": "Crop Storage",
        "country": "ML",
        "start_date": "2025-01-01",
        "end_date": "2025-01-31",
    },
    {
        "id": "m2_ml",
        "created_by": "clintonleex@gmail.com",
        "created_at": timezone.now(),
        "updated_at": timezone.now(),
        "name": "Module 2 - Mali",
        "topic": "Composting",
        "country": "ML",
        "start_date": "2025-02-01",
        "end_date": "2025-02-28",
    },
    {
        "id": "m1_sn",
        "created_by": "clintonleex@gmail.com",
        "created_at": timezone.now(),
        "updated_at": timezone.now(),
        "name": "Module 1 - Senegal",
        "topic": "Harvesting",
        "country": "SN",
        "start_date": "2025-01-05",
        "end_date": "2025-02-04",
    },
    {
        "id": "m2_sn",
        "created_by": "clintonleex@gmail.com",
        "created_at": timezone.now(),
        "updated_at": timezone.now(),
        "name": "Module 2 - Senegal",
        "topic": "Pest Control",
        "country": "SN",
        "start_date": "2025-02-05",
        "end_date": "2025-03-04",
    },
    {
        "id": "m1_ci",
        "created_by": "clintonleex@gmail.com",
        "created_at": timezone.now(),
        "updated_at": timezone.now(),
        "name": "Module 1 - Côte d'Ivoire",
        "topic": "Planting",
        "country": "CI",
        "start_date": "2025-01-10",
        "end_date": "2025-02-09",
    },
    {
        "id": "m2_ci",
        "created_by": "clintonleex@gmail.com",
        "created_at": timezone.now(),
        "updated_at": timezone.now(),
        "name": "Module 2 - Côte d'Ivoire",
        "topic": "Fertilization",
        "country": "CI",
        "start_date": "2025-02-10",
        "end_date": "2025-03-09",
    },
]


def make_module_objects(module_list):
    if len(module_list) < 1:
        return

    unique_field = ["id"]
    update_fields = [k for k in list(module_list[0].keys()) if not k == unique_field[0]]

    initial_count = TrainingModule.objects.all().count()

    module_objs = TrainingModule.objects.bulk_create(
        [TrainingModule(**m) for m in module_list],
        update_conflicts=True,
        unique_fields=unique_field,
        update_fields=update_fields,
    )

    new_count = TrainingModule.objects.all().count()
    inserted_count = new_count - initial_count

    print("Updated villages:", initial_count)
    print("New villages inserted:", inserted_count)

    return module_objs


def execute(module_list):
    try:
        make_module_objects(module_list)
    except:
        raise Exception("Something went wrong in making village objects")

    print("Modules created successfully")


if __name__ == "__main__":
    execute(MODULE_LIST)
