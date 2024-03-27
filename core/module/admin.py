from django.contrib import admin
from core.module.models import Module

# Register your models here.
@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin): 

    list_display = ('name', 'get_section', 'get_course')
    
    def get_section(self, obj): 
        return obj.section.name
    get_section.short_description = 'Section'

    def get_course(self, obj): 
        return obj.section.course.name
    get_course.short_description = 'Course'