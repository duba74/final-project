from datetime import datetime
import pytz

from django.utils import timezone


def convert_to_tz_aware_datetime(unix_timestamp_ms):
    unix_timestamp_sec = int(unix_timestamp_ms) / 1000
    naive_datetime = datetime.fromtimestamp(unix_timestamp_sec)

    return timezone.make_aware(naive_datetime, timezone=pytz.UTC)


def get_min_time():
    return timezone.make_aware(datetime.min, timezone=pytz.UTC)


def get_syncable_fields(record, model):
    return {k: v for k, v in record.items() if k in model.SYNCABLE_FIELDS}
