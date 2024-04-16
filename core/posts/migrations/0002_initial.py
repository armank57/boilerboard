# Generated by Django 5.0.4 on 2024-04-16 00:23

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core_course', '0002_initial'),
        ('core_posts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='badcontent',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='bookmark',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='core_course.course'),
        ),
        migrations.AddField(
            model_name='post',
            name='reports',
            field=models.ManyToManyField(related_name='bad_content', through='core_posts.BadContent', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='bookmark',
            name='post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core_posts.post'),
        ),
        migrations.AddField(
            model_name='badcontent',
            name='post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core_posts.post'),
        ),
        migrations.AddField(
            model_name='rating',
            name='post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core_posts.post'),
        ),
        migrations.AddField(
            model_name='rating',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='ratings',
            field=models.ManyToManyField(related_name='rated_posts', through='core_posts.Rating', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='bookmark',
            unique_together={('user', 'post')},
        ),
        migrations.AlterUniqueTogether(
            name='badcontent',
            unique_together={('user', 'post')},
        ),
        migrations.AlterUniqueTogether(
            name='rating',
            unique_together={('user', 'post')},
        ),
    ]
