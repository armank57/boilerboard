# Generated by Django 5.0.2 on 2024-03-28 10:29

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core_subject', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=10, unique=True)),
                ('description', models.CharField(max_length=255)),
                ('course_subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='courses', to='core_subject.subject')),
            ],
            options={
                'db_table': 'core.course',
            },
        ),
    ]
