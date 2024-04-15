# Generated by Django 5.0.2 on 2024-03-29 04:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_course', '0006_course_unique_course_code'),
        ('core_posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='course',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='core_course.course'),
            preserve_default=False,
        ),
    ]