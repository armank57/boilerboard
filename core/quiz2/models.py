from django.db import models
from core.abstract.models import AbstractModel
from core.abstract.models import AbstractManager
import uuid
from django.db import models



# Create your models here.

class Quiz2Manager(AbstractManager):
    pass

class Quiz2(AbstractModel):
    title = models.TextField(default='')
    author = models.ForeignKey('core_user.User', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now_add=True)

class Question(AbstractModel): 
    text = models.TextField()
    quiz2 = models.ForeignKey('Quiz2', related_name='questionList', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now_add=True)

class Answer(AbstractModel):
    text = models.TextField()
    is_correct = models.BooleanField()
    question = models.ForeignKey('Question', related_name='answerList', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now_add=True)


class QuestionManager(AbstractManager):
    pass