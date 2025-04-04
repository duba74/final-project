# Generated by Django 5.1.4 on 2025-01-18 22:15

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coreservices', '0006_rename_assignment_trainerassignment'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.CharField(max_length=15, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=63)),
            ],
        ),
        migrations.CreateModel(
            name='TrainingModule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('topic', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=7)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
            ],
        ),
        migrations.RemoveField(
            model_name='trainerassignment',
            name='trainer',
        ),
        migrations.RemoveField(
            model_name='trainerassignment',
            name='village',
        ),
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='coreservices.role')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, max_length=36, primary_key=True, serialize=False)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField(blank=True, null=True)),
                ('village', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='coreservices.village')),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='coreservices.staff')),
            ],
        ),
        migrations.DeleteModel(
            name='Trainer',
        ),
        migrations.DeleteModel(
            name='TrainerAssignment',
        ),
    ]
