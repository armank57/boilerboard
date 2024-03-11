from  rest_framework import serializers

from core.abstract.serializers import AbstractSerializer

class PostSerializer(AbstractSerializer):
    class Meta:
        model = 'Post'
        fields = [
            'id',
            'title',
            'content',
            'author',
            'created',
            'updated',
        ]
        read_only_fields = ['author']