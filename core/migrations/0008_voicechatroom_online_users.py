# Generated by Django 5.0.2 on 2024-03-21 03:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_onlineuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='voicechatroom',
            name='online_users',
            field=models.ManyToManyField(blank=True, to='core.onlineuser'),
        ),
    ]