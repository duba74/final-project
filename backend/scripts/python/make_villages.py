import postgres
import django
import os
import sys
import json

sys.path.append(os.getcwd().replace("/scripts/python", ""))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "training.settings")
django.setup()

from coreservices.models import Village


def get_villages_from_json(path):
    with open(path, "r") as file:
        json_data = json.load(file)

    # if isinstance(json_data, list):
    #     for d in json_data:
    #         if isinstance(d, dict):
    #             for k, v in d.items():
    #                 print(f"{k}: {v}")

    return json_data


def make_village_objects(village_list):
    if len(village_list) < 1:
        return

    initial_count = Village.objects.count()

    unique_field = ["id"]
    update_fields = [
        k for k in list(village_list[0].keys()) if not k == unique_field[0]
    ]

    village_objs = Village.objects.bulk_create(
        [Village(**v) for v in village_list],
        update_conflicts=True,
        unique_fields=unique_field,
        update_fields=update_fields,
    )

    inserted_count = Village.objects.count() - initial_count

    print("Updated villages:", initial_count)
    print("New villages inserted:", inserted_count)

    return village_objs


def execute():
    try:
        village_list = get_villages_from_json(
            "/home/clinton/code/final-project/backend/scripts/json/villages.json"
        )
    except:
        raise Exception("Something went wrong in fetching and parsing DW villages")

    try:
        make_village_objects(village_list)
    except:
        raise Exception("Something went wrong in making village objects")

    print("Location sync successful")


if __name__ == "__main__":
    execute()
