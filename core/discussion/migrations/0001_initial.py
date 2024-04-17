# Generated by Django 5.0.4 on 2024-04-16 23:22

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core_course', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Discussion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=50, null=True)),
                ('rating', models.IntegerField(default=0)),
                ('course', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core_course.course')),
            ],
            options={
                'db_table': "'core.discussion'",
            },
        ),
    ]
