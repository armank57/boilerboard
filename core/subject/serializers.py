from rest_framework import serializers
from core.subject.models import Subject
from core.abstract.serializers import AbstractSerializer
from core.course.serializers import CourseSerializer
class SubjectSerializer(AbstractSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    class Meta:
        model = Subject
        fields = [
            'id',
            'name',
            'code',
            'courses',
            'created',
            'updated',
        ]
        
        read_only_fields = ['creator']