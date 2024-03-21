import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from core.abstract.models import AbstractModel, AbstractManager


# Create your models here.

class UserManager(BaseUserManager, AbstractManager):
    def get_user_by_username(self, username):
        try: 
            instance = self.get(username=username)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            return Http404

    def create_user(self, username, email, password, **kwargs):
        
        if username is None:
            raise TypeError('Users must have a username.')
        if email is None: 
            raise TypeError('Users must have a purdue email')
        if password is None:
            raise TypeError('Users must have a password.')
        
        user = self.model(username=username, email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, username, email, password, **kwargs): 
        if username is None:
            raise TypeError('Superusers must have a username.')
        if email is None: 
            raise TypeError('Superusers must have an email')
        if password is None:
            raise TypeError('Superusers must have a password.')
        
        user = self.create_user(username=username, password=password, email=email, **kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user
    
    def create_instructor(self, username, email, password, **kwargs):
        if username is None:
            raise TypeError('Instructors must have a username.')
        if email is None: 
            raise TypeError('Instructors must have a purdue email.')
        if password is None:
            raise TypeError('Instructors must have a password.')
        
        user = self.create_user(username=username, password=password, email=email, **kwargs)
        user.is_superuser = False
        user.is_staff = True
        user.save(using=self._db)

        return user




# A user is a student, a superuser is an admin, and an instructor is an instructor
class User(AbstractModel, AbstractBaseUser, PermissionsMixin): 
    public_id = models.UUIDField(db_index=True, unique=True, default=uuid.uuid4, editable=False)
    username = models.CharField(db_index=True, max_length=255, unique=True)
    first_name = models.CharField(max_length=225)
    last_name = models.CharField(max_length=225)
    email = models.EmailField(db_index=True, unique=True)
    joined_courses = models.ManyToManyField(to="core_course.Course", related_name="students", blank=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False) # This is the same thing as admin
    is_instructor = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now_add=True)

    avatar = models.ImageField(null=True)
    rating = models.IntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def join_course(self, course):
        return self.joined_courses.add(course)
    def leave_course(self, course):
        return self.joined_courses.remove(course)
    def in_course(self, course):
        return self.joined_courses.filter(id=course.id).exists()

    def __str__(self): 
        return f"{self.email}"
    
    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

