from django.db import models

from core.abstract.models import AbstractModel, AbstractManager

# Create your models here.

class PostManager(AbstractManager):
    def create_post(self, title, content, author, **kwargs):
        #print('Title:', title)
        if title is None:
            raise TypeError('Posts must have a title.')
        if content is None:
            raise TypeError('Posts must have a content.')
        if author is None:
            raise TypeError('Posts must have an author.')

        post = self.model(title=title, content=content, author=author, **kwargs)
        post.save(using=self._db)

        return post

class Post(AbstractModel):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey('core_user.User', on_delete=models.CASCADE, null=True)

    objects = PostManager()

    def __str__(self):
        return f"{self.title}"
    
    class Meta:
        db_table = 'core.posts'