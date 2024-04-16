# Generated by Django 5.0.2 on 2024-04-10 20:43

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_voice_chat', '0004_voicechatroom_accepted_users_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='voicechatroom',
            name='banned_users',
            field=models.ManyToManyField(blank=True, related_name='banned_rooms', to=settings.AUTH_USER_MODEL),
        ),
    ]
