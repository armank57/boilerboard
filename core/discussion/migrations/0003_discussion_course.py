# Generated by Django 5.0.2 on 2024-02-26 17:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_course', '0001_initial'),
        ('core_label', '0002_discussion_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='discussion',
            name='course',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core_course.course'),
        ),
    ]