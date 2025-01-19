import django
import os
import sys
from django.utils import timezone
from django.db import transaction

sys.path.append(os.getcwd().replace("/scripts/python", ""))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "training.settings")
django.setup()

from coreservices.models import TrainingModule

from scripts.python.mock_modules import MODULE_LIST


@transaction.atomic
def make_module_objects(module_list):
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

    print("Updated modules:", initial_count)
    print("New modules inserted:", inserted_count)

    return module_objs


def execute():
    make_module_objects(MODULE_LIST)

    print("Modules created successfully")


if __name__ == "__main__":
    execute()
