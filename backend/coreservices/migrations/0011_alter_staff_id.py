# Generated by Django 5.1.4 on 2025-02-02 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coreservices', '0010_trainingmodule_is_active_client'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='id',
            field=models.CharField(max_length=31, primary_key=True, serialize=False),
        ),
    ]
