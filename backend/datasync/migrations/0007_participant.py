# Generated by Django 5.1.4 on 2025-01-28 21:27

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datasync', '0006_trainingevent_is_canceled'),
    ]

    operations = [
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, max_length=36, primary_key=True, serialize=False)),
                ('created_by', models.CharField(blank=True, max_length=63, null=True)),
                ('created_at', models.DateTimeField()),
                ('updated_at', models.DateTimeField()),
                ('server_deleted_at', models.DateTimeField(blank=True, null=True)),
                ('client_id', models.CharField(blank=True, max_length=15, null=True)),
                ('is_leader', models.BooleanField(default=False)),
                ('tombola_tickets', models.IntegerField(blank=True, null=True)),
                ('pics_purchased', models.IntegerField(blank=True, null=True)),
                ('pics_received', models.IntegerField(blank=True, null=True)),
                ('training_event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='datasync.trainingevent')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
