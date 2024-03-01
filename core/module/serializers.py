from rest_framework import serializers
from core.abstract.serializers import AbstractSerializer
from core.module.models import Module
from core.course.models import Course
from core.course.serializers import CourseSerializer
class ModuleSerializer(AbstractSerializer):
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = Module
        fields = [
            'id',
            'name',
            'course',
            'quizzes',
            'created',
            'updated',
        ]
        read_only_fields = ['created', 'updated']