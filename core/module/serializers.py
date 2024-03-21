from rest_framework import serializers
from core.abstract.serializers import AbstractSerializer
from core.module.models import Module
from core.section.models import Section
"""from core.section.serializers import SectionSerializer"""
class ModuleSerializer(AbstractSerializer):
    section = serializers.SlugRelatedField(queryset=Section.objects.all(), slug_field='public_id')
    
    class Meta:
        model = Module
        fields = [
            'id',
            'name',
            'section',
            'subsection',
            'created',
            'updated',
        ]
        read_only_fields = ['created', 'updated']