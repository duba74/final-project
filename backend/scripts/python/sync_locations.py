import postgres
import django
import os
import sys
import pprint

sys.path.append(os.getcwd().replace("/scripts/python", ""))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "training.settings")
django.setup()

from coreservices.models import *


def get_villages():
    query = """
        SELECT
            code,
            is_active,
            name,
            zone_name,
            zone_code,
            district_name,
            country_name
        FROM
            marts.village
        WHERE
            country_name IN ('Mali', 'Senegal', 'Cote D''Ivoire')
        -- AND is_active
    """

    villages, columns = postgres.query("DW", query)

    return [{c: v for (c, v) in zip(columns, v)} for v in villages]


def make_country_objects(village_list):
    countries = list({v["country_name"] for v in village_list})

    country_codes = {
        "Mali": "ML",
        "Senegal": "SN",
        "Cote D'Ivoire": "CI",
    }

    countries = [(country_codes[c], c) for c in countries]

    initial_count = Country.objects.count()

    country_objs = Country.objects.bulk_create(
        [Country(code=c[0], name=c[1]) for c in countries],
        update_conflicts=True,
        unique_fields=["code"],
        update_fields=["name"],
    )

    inserted_count = Country.objects.count() - initial_count

    print("Updated countries:", initial_count)
    print("New countries inserted:", inserted_count)

    return dict(zip([c[1] for c in countries], country_objs))


def make_district_objects(village_list, countries):
    districts = list(
        {
            (v["district_name"], v["country_name"])
            for v in village_list
            if v["district_name"] and v["country_name"]
        }
    )

    district_codes = {
        "Region Centre Est": "CNE",
        "Bougouni": "BGN",
        "Region Sud Est": "SDE",
        "Sikasso": "SKS",
        "Region Nord": "NRD",
        "Kita": "KTA",
        "Agneby-Tiassa": "ABT",
        "Region Est": "EST",
        "Marahoue": "MRH",
        "Haut-Sassandra": "HTS",
        "Region Thies": "THS",
        "Segou": "SGU",
        "Region Sud Ouest": "SDO",
        "Kolokani": "KLK",
        "Bamako": "BKO",
        "Me": "MEX",
        "Region Nord Ouest": "NDO",
        "Region Ouest": "OST",
        "Region Centre": "CNT",
    }

    districts = [(district_codes[d[0]], d[0], d[1]) for d in districts]

    initial_count = District.objects.count()

    district_objs = District.objects.bulk_create(
        [District(code=d[0], name=d[1], country=countries[d[2]]) for d in districts],
        update_conflicts=True,
        unique_fields=["code"],
        update_fields=["name", "country"],
    )

    inserted_count = District.objects.count() - initial_count

    print("Updated districts:", initial_count)
    print("New districts inserted:", inserted_count)

    return dict(zip([d[1] for d in districts], district_objs))


def make_zone_objects(village_list, districts, countries):
    zones = list(
        {
            (v["zone_code"], v["zone_name"], v["district_name"], v["country_name"])
            for v in village_list
            if v["zone_code"]
            and v["zone_name"]
            and v["district_name"]
            and v["country_name"]
            and "unknown" not in v["zone_name"].lower()
        }
    )

    initial_count = Zone.objects.count()

    zone_objs = Zone.objects.bulk_create(
        [
            Zone(
                code=z[0],
                name=z[1],
                district=districts[z[2]],
                country=countries[z[3]],
            )
            for z in zones
        ],
        update_conflicts=True,
        unique_fields=["code"],
        update_fields=["name", "district", "country"],
    )

    inserted_count = Zone.objects.count() - initial_count

    print("Updated zones:", initial_count)
    print("New zones inserted:", inserted_count)

    return dict(zip([z[0] for z in zones], zone_objs))


def make_village_objects(village_list, zones, districts, countries):
    villages = list(
        {
            (
                v["code"],
                v["name"],
                v["is_active"],
                v["zone_code"],
                v["district_name"],
                v["country_name"],
            )
            for v in village_list
            if v["code"]
            and v["name"]
            and v["zone_code"]
            and v["district_name"]
            and v["country_name"]
            and "unknown" not in v["name"].lower()
            and v["zone_code"] not in ["UMZ", "UNT", "USZ", "UNS", "UNM", "THI", "SIK"]
        }
    )

    initial_count = Village.objects.count()

    village_objs = Village.objects.bulk_create(
        [
            Village(
                code=v[0],
                name=v[1],
                is_active=v[2],
                zone=zones[v[3]],
                district=districts[v[4]],
                country=countries[v[5]],
            )
            for v in villages
        ],
        update_conflicts=True,
        unique_fields=["code"],
        update_fields=["name", "is_active", "zone", "district", "country"],
    )

    inserted_count = Village.objects.count() - initial_count

    print("Updated villages:", initial_count)
    print("New villages inserted:", inserted_count)

    return dict(zip([v[0] for v in villages], village_objs))


def execute():
    try:
        village_list = get_villages()
    except:
        raise Exception("Something went wrong in fetching and parsing villages")
    try:
        country_objs = make_country_objects(village_list)
    except:
        raise Exception("Something went wrong in making country objects")

    try:
        district_objs = make_district_objects(village_list, country_objs)
    except:
        raise Exception("Something went wrong in making district objects")

    try:
        zone_objs = make_zone_objects(village_list, district_objs, country_objs)
    except:
        raise Exception("Something went wrong in making zone objects")

    try:
        make_village_objects(village_list, zone_objs, district_objs, country_objs)
    except:
        raise Exception("Something went wrong in making village objects")

    print("Location sync successful")


if __name__ == "__main__":
    execute()
