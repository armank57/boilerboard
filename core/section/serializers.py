from rest_framework import serializers
from core.abstract.serializers import AbstractSerializer
from core.section.models import Section
from core.course.models import Course
from core.module.serializers import ModuleSerializer
class SectionSerializer(AbstractSerializer):
    course = serializers.SlugRelatedField(queryset=Course.objects.all(), slug_field='public_id')
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Section
        fields = [
            'id',
            'name',
            'course',
            'modules',
            'created',
            'updated',
        ]
        read_only_fields = ['created', 'updated']