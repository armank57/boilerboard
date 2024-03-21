# Generated by Django 5.0.2 on 2024-03-20 17:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_course', '0003_remove_course_sections'),
        ('core_section', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sections', to='core_course.course'),
        ),
    ]
