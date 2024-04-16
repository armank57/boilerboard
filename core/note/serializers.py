from rest_framework import serializers

from core.note.models import Note
from core.module.models import Module

class NoteSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True, format='hex')
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)   
    module = serializers.SlugRelatedField(queryset=Module.objects.all(), slug_field='public_id')

    class Meta:
        model = Note
        fields = [
            'id',
            'title',
            'author',
            'module',
            'created',
            'updated',
            'endorsed',
            'content',
            'image',
        ]