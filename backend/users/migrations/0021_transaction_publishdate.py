# Generated by Django 4.0.4 on 2022-04-17 01:35

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0020_alter_parkingspace_avg_rating_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='publishDate',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]