# Generated by Django 5.0.2 on 2024-04-07 23:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_voice_chat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='voicechatroom',
            name='is_private',
            field=models.BooleanField(default=False),
        ),
    ]
