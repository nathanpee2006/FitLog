# Generated by Django 5.2 on 2025-04-25 00:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="exercise",
            name="name",
            field=models.CharField(max_length=32, unique=True),
        ),
    ]
