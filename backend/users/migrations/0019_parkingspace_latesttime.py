# Generated by Django 4.0.3 on 2022-04-14 05:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0018_alter_parkingspace_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='parkingspace',
            name='latestTime',
            field=models.DateTimeField(null=True),
        ),
    ]