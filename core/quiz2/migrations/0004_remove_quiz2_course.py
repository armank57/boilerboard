# Generated by Django 5.0.2 on 2024-03-01 03:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core_quiz2', '0003_remove_question_answerlist_remove_quiz2_questionlist_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz2',
            name='course',
        ),
    ]
