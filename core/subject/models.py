from django.db import models
from core.abstract.models import AbstractModel

class Subject(AbstractModel):
    name = models.CharField(max_length=20, unique=True)
    code = models.CharField(max_length=8, unique=True)

    def __str__(self):
        return f"{self.name}"
    
    class Meta:
        db_table = "core.subject"