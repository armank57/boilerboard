from rest_framework import serializers
from core.abstract.serializers import AbstractSerializer
from core.module.models import Module
from core.section.models import Section
from core.quiz2.serializers import Quiz2Serializer
from core.note.serializers import NoteSerializer
"""from core.section.serializers import SectionSerializer"""
class ModuleSerializer(AbstractSerializer):
    section = serializers.SlugRelatedField(queryset=Section.objects.all(), slug_field='public_id')
    quizzes = Quiz2Serializer(many=True, read_only=True)
    notes = NoteSerializer(many=True, read_only=True)    
    class Meta:
        model = Module
        fields = [
            'id',
            'name',
            'section',
            'subsection',
            'quizzes',
            'notes',
            'created',
            'updated',
        ]
        read_only_fields = ['created', 'updated']