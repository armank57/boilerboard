from django.db import models
from core.abstract.models import AbstractModel, AbstractManager

class SectionManager(AbstractManager):
    pass

class Section(AbstractModel):
    name = models.CharField(max_length=255)
    course = models.ForeignKey('core_course.Course', related_name="sections", on_delete=models.CASCADE)
    
    objects = SectionManager()
    
    def __str__(self):
        return self.name