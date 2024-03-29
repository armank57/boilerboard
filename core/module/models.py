from django.db import models
from core.abstract.models import AbstractModel, AbstractManager
# Create your models here.

class ModuleManager(AbstractManager):
    def create_module(self, name, course, **kwargs):
        if name is None:
            raise TypeError('Modules must have a name.')
        if course is None:
            raise TypeError('Modules must have a course.')
        
        module = self.model(name=name, course=course, **kwargs)
        module.save(using=self._db)

        return module
    
    def add_quiz(self, module, quiz):
        if module is None:
            raise TypeError('Modules must have a name.')
        if quiz is None:
            raise TypeError('Modules must have a course.')
        
        module.quizzes.add(quiz)
        module.save(using=self._db)

        return module
    
    def remove_quiz(self, module, quiz):
        if module is None:
            raise TypeError('Modules must have a name.')
        if quiz is None:
            raise TypeError('Modules must have a course.')
        
        module.quizzes.remove(quiz)
        module.save(using=self._db)

        return module
    
    def update_module(self, module, name, course, **kwargs):
        if name is None:
            raise TypeError('Modules must have a name.')
        if course is None:
            raise TypeError('Modules must have a course.')
        
        module.name = name
        module.course = course
        module.save(using=self._db)

        return module
    
    def delete_module(self, module):
        if module is None:
            raise TypeError('Modules must have a name.')
        
        module.delete()

        return module
    
class Module(AbstractModel):
    name = models.CharField(max_length=255)
    course = models.ForeignKey('core_course.Course', related_name='modules', on_delete=models.CASCADE)
    
    objects = ModuleManager()

    def in_course(self, course):
        return self.course == course
    
    def __str__(self):
        return self.name