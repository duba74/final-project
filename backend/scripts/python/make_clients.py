import django
import os
import sys
import json

sys.path.append(os.getcwd().replace("/scripts/python", ""))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "training.settings")
django.setup()

from coreservices.models import Client, Village


def get_clients_from_json(path):
    with open(path, "r") as file:
        json_data = json.load(file)

    return json_data


def make_client_objects(client_list):
    if len(client_list) < 1:
        return

    initial_count = Client.objects.count()

    villages_qs = Village.objects.all()
    villages_dict = {v.id: v for v in villages_qs}

    for c in client_list:
        village_id = c["village"]
        if village_id in villages_dict:
            c["village"] = villages_dict[village_id]
        if c["phone_1"] == "":
            c["phone_1"] = None
        if c["phone_2"] == "":
            c["phone_2"] = None
        if c["is_leader"] == "t":
            c["is_leader"] = True
        else:
            c["is_leader"] = False
        if c["last_name"] == "":
            c["last_name"] = None
        if c["sex"] == "":
            c["sex"] = None

    unique_field = ["id"]
    update_fields = [k for k in list(client_list[0].keys()) if not k == unique_field[0]]

    client_objs = Client.objects.bulk_create(
        [Client(**c) for c in client_list],
        update_conflicts=True,
        unique_fields=unique_field,
        update_fields=update_fields,
    )

    inserted_count = Client.objects.count() - initial_count

    print("Updated clients:", initial_count)
    print("New clients inserted:", inserted_count)

    return client_objs


def execute():
    try:
        client_list = get_clients_from_json(
            "/home/clinton/code/final-project/backend/scripts/json/clients.json"
        )
    except:
        raise Exception("Something went wrong in fetching and parsing clients")

    try:
        make_client_objects(client_list)
    except:
        raise Exception("Something went wrong in making client objects")

    print("Clients loaded successfully")


if __name__ == "__main__":
    execute()
