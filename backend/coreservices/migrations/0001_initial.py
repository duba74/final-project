# Generated by Django 5.1.4 on 2025-01-02 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Village',
            fields=[
                ('id', models.CharField(max_length=7, primary_key=True, serialize=False)),
                ('is_active', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=255)),
                ('zone_code', models.CharField(max_length=7)),
                ('zone_name', models.CharField(max_length=255)),
                ('district_code', models.CharField(max_length=7)),
                ('district_name', models.CharField(max_length=255)),
                ('country_code', models.CharField(max_length=7)),
                ('country_name', models.CharField(max_length=255)),
                ('latitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('longitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
            ],
        ),
    ]
