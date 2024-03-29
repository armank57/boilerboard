from django.db import models

from core.abstract.models import AbstractModel, AbstractManager

# Create your models here.

class PostManager(AbstractManager):
    def create_post(self, title, content, author, topic, **kwargs):
        #print('Title:', title)
        if title is None:
            raise TypeError('Posts must have a title.')
        if content is None:
            raise TypeError('Posts must have a content.')
        if author is None:
            raise TypeError('Posts must have an author.')

        post = self.model(title=title, content=content, author=author, topic=topic, **kwargs)
        post.save(using=self._db)

        return post
    
class Rating(models.Model):
    user = models.ForeignKey('core_user.User', on_delete=models.CASCADE, null=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, null=True)
    upvote = models.BooleanField(default=False)

    # ensures that a user can only rate a post once
    class Meta:
        unique_together = ('user', 'post')


class BadContent(models.Model):
    user = models.ForeignKey('core_user.User', on_delete=models.CASCADE, null=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, null=True)
    reported = models.BooleanField(default=False)
    reportedContent = models.TextField(default='')

    # ensures that a user can only rate a post once
    class Meta:
        unique_together = ('user', 'post')


class Post(AbstractModel):
    title = models.CharField(max_length=255)
    content = models.TextField()
    course = models.ForeignKey('core_course.Course', related_name='posts', on_delete=models.CASCADE)
    author = models.ForeignKey('core_user.User', on_delete=models.CASCADE, null=True)
    topic = models.CharField(max_length=255, null=True)

    # to access ratings for a post, use post.ratings.all()
    # to access posts rated by a user, use user.rated_posts.all()
    ratings = models.ManyToManyField('core_user.User', through=Rating, related_name='rated_posts')

    reports = models.ManyToManyField('core_user.User', through=BadContent, related_name='bad_content')

    objects = PostManager()

    def __str__(self):
        return f"{self.title}"
    
    class Meta:
        db_table = 'core_posts'