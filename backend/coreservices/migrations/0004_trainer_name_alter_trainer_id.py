# Generated by Django 5.1.4 on 2025-01-18 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coreservices', '0003_trainer'),
    ]

    operations = [
        migrations.AddField(
            model_name='trainer',
            name='name',
            field=models.CharField(default='a', max_length=65),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='trainer',
            name='id',
            field=models.CharField(max_length=15, primary_key=True, serialize=False),
        ),
    ]
