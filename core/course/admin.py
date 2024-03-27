from django.contrib import admin
from core.course.models import Course

# Register your models here.
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin): 
    list_display = ("name", "public_id")