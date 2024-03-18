from rest_framework import serializers

from core.abstract.serializers import AbstractSerializer
from core.posts.models import Post
from core.user.models import User

class PostSerializer(AbstractSerializer):
    author = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='public_id')
    
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'author',
            'created',
            'updated'
        ]