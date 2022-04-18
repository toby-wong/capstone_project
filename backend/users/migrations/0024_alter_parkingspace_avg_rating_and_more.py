# Generated by Django 4.0.4 on 2022-04-18 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0023_alter_customuser_phone_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parkingspace',
            name='avg_rating',
            field=models.DecimalField(blank=True, decimal_places=1, default=0, max_digits=2, null=True),
        ),
        migrations.AlterField(
            model_name='parkingspace',
            name='n_ratings',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]