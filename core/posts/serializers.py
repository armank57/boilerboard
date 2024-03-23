from rest_framework import serializers

from core.abstract.serializers import AbstractSerializer
from core.posts.models import Post, Rating
from core.user.models import User

class PostSerializer(AbstractSerializer):
    author = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='public_id')
    ratings = serializers.SerializerMethodField()
    user_has_upvoted = serializers.SerializerMethodField()
    is_author = serializers.SerializerMethodField()
    
    # TODO: Add a foreign key for course id
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'author',
            'topic',
            'created',
            'updated',
            'ratings',
            'user_has_upvoted',
            'is_author'
        ]
    
    def get_ratings(self, obj):
        # Calculate the number of upvotes
        ratings = Rating.objects.filter(post=obj, upvote=True).count()
        return ratings
    
    def get_user_has_upvoted(self, obj):
        user = self.context['request'].user
        return Rating.objects.filter(user=user, post=obj, upvote=True).exists()
    
    def get_is_author(self, obj):
        user = self.context['request'].user
        return obj.author == user