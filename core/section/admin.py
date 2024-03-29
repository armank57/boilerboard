from django.contrib import admin
from core.section.models import Section

# Register your models here.
@admin.register(Section)
class SectionAdmin(admin.ModelAdmin): 
    list_display = ('name', 'get_course')

    def get_course(self, obj): 
        return obj.course.description
    get_course.short_description = 'Course'