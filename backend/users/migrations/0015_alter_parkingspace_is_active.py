# Generated by Django 4.0.3 on 2022-04-08 06:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_alter_parkingspace_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parkingspace',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
