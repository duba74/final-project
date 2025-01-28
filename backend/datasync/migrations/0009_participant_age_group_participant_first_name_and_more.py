# Generated by Django 5.1.4 on 2025-01-28 22:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datasync', '0008_rename_client_id_participant_client'),
    ]

    operations = [
        migrations.AddField(
            model_name='participant',
            name='age_group',
            field=models.CharField(blank=True, choices=[('lt_30', 'Less than 30'), ('gte_30', '30 or greater')], max_length=7, null=True),
        ),
        migrations.AddField(
            model_name='participant',
            name='first_name',
            field=models.CharField(default='a', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='participant',
            name='last_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='participant',
            name='phone_1',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='participant',
            name='phone_2',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='participant',
            name='sex',
            field=models.CharField(blank=True, choices=[('M', 'Male'), ('F', 'Female')], max_length=1, null=True),
        ),
        migrations.AddField(
            model_name='participant',
            name='village',
            field=models.CharField(default='a', max_length=7),
            preserve_default=False,
        ),
    ]
