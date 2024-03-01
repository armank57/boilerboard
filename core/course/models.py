from django.db import models

# Create your models here.
import uuid
from django.db import models
from core.abstract.models import AbstractModel, AbstractManager
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404

class CourseManager(models.Manager):
    def get_object_by_course_id(self, course_id):
        try: 
            instance = self.get(course_id=course_id)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            return Http404

    def create_course(self, name, subject, description, creator, **kwargs):
        if name is None:
            raise TypeError('Courses must have a name.')
        if subject is None:
            raise TypeError('Courses must have a subject.')
        if description is None:
            raise TypeError('Courses must have a description.')

        course = self.model(name=name, subject=subject, description=description, creator=creator, **kwargs)
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

    def update_course(self, course, name, subject, description, **kwargs):
        if name is None:
            raise TypeError('Courses must have a name.')
        if subject is None:
            raise TypeError('Courses must have a subject.')
        if description is None:
            raise TypeError('Courses must have a description.')

        course.name = name
        course.subject = subject
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
    name = models.CharField(max_length=10, unique=True)
    course_subject = models.CharField(max_length=10)
    description = models.CharField(max_length=255)
    creator = models.ForeignKey(to="core_user.User", on_delete=models.CASCADE)

    objects = CourseManager()

    def __str__(self):
        return f"{self.name}"
    
    def subject(self):
        return f"{self.subject}"
    
    class Meta:
        db_table = "core.course"