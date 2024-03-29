import uuid
from django.db import models
from core.abstract.models import AbstractModel, AbstractManager
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404

class CourseManager(AbstractManager):
    def create_course(self, name, course_subject, description, creator, **kwargs):
        if name is None:
            raise TypeError('Courses must have a name.')
        if course_subject is None:
            raise TypeError('Courses must have a subject.')
        if description is None:
            raise TypeError('Courses must have a description.')

        course = self.model(name=name, course_subject=course_subject, description=description, creator=creator, **kwargs)
        course.save(using=self._db)

        return course

    def add_module(self, course, module):
        if course is None:
            raise TypeError('Courses must have a name.')
        if module is None:
            raise TypeError('Courses must have a subject.')


        course.modules.add(module)
        course.save(using=self._db)

        return course

    def remove_module(self, course, module):
        if course is None:
            raise TypeError('Courses must have a name.')
        if module is None:
            raise TypeError('Courses must have a subject.')


        course.modules.remove(module)
        course.save(using=self._db)

        return course

    def update_course(self, course, name, course_subject, description, **kwargs):
        if name is None:
            raise TypeError('Courses must have a name.')
        if course_subject is None:
            raise TypeError('Courses must have a subject.')
        if description is None:
            raise TypeError('Courses must have a description.')

        course.name = name
        course.course_subject = course_subject
        course.description = description
        course.save(using=self._db)

        return course

    def delete_course(self, course):
        if course is None:
            raise TypeError('Courses must have a name.')

        course.delete()

        return course

# Create your models here.
class Course(AbstractModel):
    #name = models.CharField(max_length=10)
    course_subject = models.ForeignKey(to="core_subject.Subject", related_name="courses", on_delete=models.CASCADE)
    code = models.IntegerField(default=0)
    description = models.CharField(max_length=255)
    creator = models.ForeignKey(to="core_user.User", on_delete=models.CASCADE)
    

    objects = CourseManager()

    def __str__(self):
        return f"{self.description}"
    
    def subject(self):
        return f"{self.course_subject}"
    
    class Meta:
        db_table = "core.course"
        constraints = [
            models.UniqueConstraint(fields=['course_subject', 'code'], name='unique_course_code')
        ]

