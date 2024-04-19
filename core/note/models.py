from django.db import models
from core.abstract.models import AbstractModel
from core.abstract.models import AbstractManager
import uuid
from django.db import models



# Create your models here.

class NoteManager(AbstractManager):
    def create_note(self, title, author, content, **kwargs):
        if title is None:
            raise TypeError('Notes must have a title.')
        if author is None:
            raise TypeError('Notes must have an author.')
        if content is None:
            raise TypeError('Notes must have content.')
        note = self.model(title=title, author=author, content=content, **kwargs)
        note.save(using=self._db)
        return note

class Note(AbstractModel):
    title = models.TextField(default='')
    author = models.ForeignKey('core_user.User', on_delete=models.CASCADE, null=True)
    author_name = models.CharField(max_length=255, default='')
    created = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now_add=True)
    endorsed = models.BooleanField(default=False)
    content = models.TextField(default='', blank=True, null=True)
    image = models.ImageField(upload_to='note_images', null=True, blank=True)
    module = models.ForeignKey('core_module.Module', related_name='notes', on_delete=models.CASCADE, default=None)