# Generated by Django 5.0.2 on 2024-02-28 02:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core_course', '0003_course_joined_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='joined_users',
        ),
    ]