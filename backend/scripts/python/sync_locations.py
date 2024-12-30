import postgres
import django
import os
import sys
import pprint
import polars as pl

sys.path.append(os.getcwd().replace("/scripts/python", ""))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "training.settings")
django.setup()

from datasync.models import *


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
    """

    villages, columns = postgres.query("DW", query)

    df = pl.DataFrame(
        data=[{c: v for (c, v) in zip(columns, v)} for v in villages],
        schema={
            "id": pl.String,
            "is_active": pl.Boolean,
            "name": pl.String,
            "zone_code": pl.String,
            "zone_name": pl.String,
            "district_code": pl.String,
            "district_name": pl.String,
            "country_code": pl.String,
            "country_name": pl.String,
            "latitude": pl.Decimal,
            "longitude": pl.Decimal,
        },
    )

    return df.filter(~pl.any_horizontal(pl.col(df.columns).is_null()))


def make_zone_list(df):
    return (
        df.select(
            [
                "zone_code",
                "zone_name",
                "district_code",
                "district_name",
                "country_code",
                "country_name",
            ]
        )
        .unique()
        .rename({"zone_code": "id", "zone_name": "name"})
    )


def make_district_list(df):
    return (
        df.select(
            [
                "district_code",
                "district_name",
                "country_code",
                "country_name",
            ]
        )
        .unique()
        .rename({"district_code": "id", "district_name": "name"})
    )


def make_country_list(df):
    return (
        df.select(
            [
                "country_code",
                "country_name",
            ]
        )
        .unique()
        .rename({"country_code": "id", "country_name": "name"})
    )


def get_current_location_dfs():
    country_df = pl.DataFrame(
        data=list(Country.objects.all().values()),
        schema={
            "id": pl.String,
            "created_at": pl.Datetime,
            "updated_at": pl.Datetime,
            "server_deleted_at": pl.Datetime,
            "name": pl.String,
        },
    )
    district_df = pl.DataFrame(
        data=list(District.objects.all().values()),
        schema={
            "id": pl.String,
            "created_at": pl.Datetime,
            "updated_at": pl.Datetime,
            "server_deleted_at": pl.Datetime,
            "name": pl.String,
            "country_code": pl.String,
            "country_name": pl.String,
        },
    )
    zone_df = pl.DataFrame(
        data=list(Zone.objects.all().values()),
        schema={
            "id": pl.String,
            "created_at": pl.Datetime,
            "updated_at": pl.Datetime,
            "server_deleted_at": pl.Datetime,
            "name": pl.String,
            "district_code": pl.String,
            "district_name": pl.String,
            "country_code": pl.String,
            "country_name": pl.String,
        },
    )
    village_df = pl.DataFrame(
        data=list(Village.objects.all().values()),
        schema={
            "id": pl.String,
            "created_at": pl.Datetime,
            "updated_at": pl.Datetime,
            "server_deleted_at": pl.Datetime,
            "is_active": pl.Boolean,
            "name": pl.String,
            "zone_code": pl.String,
            "zone_name": pl.String,
            "district_code": pl.String,
            "district_name": pl.String,
            "country_code": pl.String,
            "country_name": pl.String,
            "latitude": pl.Decimal,
            "longitude": pl.Decimal,
        },
    )

    return country_df, district_df, zone_df, village_df


def join_tables(left_df, right_df):
    return left_df.join(right_df, on="id", how="full")


def get_new_records(df):
    return df.filter(pl.col("id").is_null())


def get_updated_records(df):
    update_cols = [
        "name",
        "zone_code",
        "zone_name",
        "district_code",
        "district_name",
        "country_code",
        "country_name",
        "latitude",
        "longitude",
    ]
    update_cols = list(set(df.columns) & set(update_cols))

    df = df.filter(pl.col("id").is_not_null())
    filters = [(pl.col(c) != pl.col(f"{c}_right")) for c in update_cols]

    return df.filter(filters)


def get_deleted_records(df):
    return df.filter(pl.col("id_right").is_null())


def make_country_objects(village_list):
    countries = list({(v["country_code"], v["country_name"]) for v in village_list})

    initial_count = Country.objects.count()

    country_objs = Country.objects.bulk_create(
        [Country(id=c[0], name=c[1]) for c in countries],
        update_conflicts=True,
        unique_fields=["id"],
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
        dw_village_df = get_villages_from_dw()
        dw_zone_df = make_zone_list(dw_village_df)
        dw_district_df = make_district_list(dw_zone_df)
        dw_country_df = make_country_list(dw_district_df)
    except:
        raise Exception("Something went wrong in fetching and parsing DW villages")

    try:
        country_df, district_df, zone_df, village_df = get_current_location_dfs()
    except:
        raise Exception("Something went wrong getting Django DB locations")

    country_join_df = join_tables(country_df, dw_country_df)
    district_join_df = join_tables(district_df, dw_district_df)
    zone_join_df = join_tables(zone_df, dw_zone_df)
    village_join_df = join_tables(village_df, dw_village_df)

    new_country_df = get_new_records(country_join_df)
    new_district_df = get_new_records(district_join_df)
    new_zone_df = get_new_records(zone_join_df)
    new_village_df = get_new_records(village_join_df)

    updated_country_df = get_updated_records(country_join_df)
    updated_district_df = get_updated_records(district_join_df)
    updated_zone_df = get_updated_records(zone_join_df)
    updated_village_df = get_updated_records(village_join_df)

    deleted_country_df = get_deleted_records(country_join_df)
    deleted_district_df = get_deleted_records(district_join_df)
    deleted_zone_df = get_deleted_records(zone_join_df)
    deleted_village_df = get_deleted_records(village_join_df)

    return

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
