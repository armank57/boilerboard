from django.contrib import admin
from core.course.models import Course
from core.user.models import User

class UserInline(admin.TabularInline):
    model = User.joined_courses.through
    extra = 1

# Register your models here.
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin): 
    list_display = ("name", "public_id")
    inlines = [UserInline]