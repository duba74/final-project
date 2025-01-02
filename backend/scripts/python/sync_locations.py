import postgres
import django
import os
import sys

sys.path.append(os.getcwd().replace("/scripts/python", ""))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "training.settings")
django.setup()

from coreservices.models import *


def get_villages_from_dw():
    query = """
        SELECT
            code AS id,
            is_active,
            name,
            zone_code,
            zone_name,
            CASE
                WHEN district_name = 'Region Centre Est' THEN 'CNE'
                WHEN district_name = 'Bougouni' THEN 'BGN'
                WHEN district_name = 'Region Sud Est' THEN 'SDE'
                WHEN district_name = 'Sikasso' THEN 'SKS'
                WHEN district_name = 'Region Nord' THEN 'NRD'
                WHEN district_name = 'Kita' THEN 'KTA'
                WHEN district_name = 'Agneby-Tiassa' THEN 'ABT'
                WHEN district_name = 'Region Est' THEN 'EST'
                WHEN district_name = 'Marahoue' THEN 'MRH'
                WHEN district_name = 'Haut-Sassandra' THEN 'HTS'
                WHEN district_name = 'Region Thies' THEN 'THS'
                WHEN district_name = 'Segou' THEN 'SGU'
                WHEN district_name = 'Region Sud Ouest' THEN 'SDO'
                WHEN district_name = 'Kolokani' THEN 'KLK'
                WHEN district_name = 'Bamako' THEN 'BKO'
                WHEN district_name = 'Me' THEN 'MEX'
                WHEN district_name = 'Region Nord Ouest' THEN 'NDO'
                WHEN district_name = 'Region Ouest' THEN 'OST'
                WHEN district_name = 'Region Centre' THEN 'CNT'
            END AS district_code,
            district_name,
            country_code,
            country_name,
            latitude,
            longitude
        FROM
            marts.village
        WHERE
            country_name IN ('Mali', 'Senegal', 'Cote D''Ivoire')
            AND NOT (country_name = 'Senegal' AND country_code = 'ML')
            AND zone_code IS NOT NULL
            AND district_name IS NOT NULL
            AND country_code IS NOT NULL
    """

    villages, columns = postgres.query("DW", query)

    return [{c: v for (c, v) in zip(columns, v)} for v in villages]


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
        village_list = get_villages_from_dw()
    except:
        raise Exception("Something went wrong in fetching and parsing DW villages")

    try:
        make_village_objects(village_list)
    except:
        raise Exception("Something went wrong in making village objects")

    print("Location sync successful")


if __name__ == "__main__":
    execute()
