# Generated by Django 4.0.3 on 2022-04-08 13:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0015_alter_parkingspace_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parkingspace',
            name='notes',
            field=models.TextField(max_length=10000),
        ),
    ]
