from rest_framework import serializers

from core.abstract.serializers import AbstractSerializer
from core.posts.models import Post, Rating, BadContent
from core.user.models import User

class BadContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BadContent
        fields = [
            'reportedContent'
        ]

class PostSerializer(AbstractSerializer):
    author = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='public_id')
    ratings = serializers.SerializerMethodField()
    reports = serializers.SerializerMethodField()
    user_has_upvoted = serializers.SerializerMethodField()
    is_author = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    user_has_reported = serializers.SerializerMethodField()
    badContentList = BadContentSerializer(many=True)
    
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
            'is_author',
            'author_name',
            'reports',
            'badContentList',
            'user_has_upvoted',
            'user_has_reported'
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
    
    def get_author_name(self, obj):
        return obj.author.username
    
    
    def get_reports(self, obj):
        # Calculate the number of upvotes
        reports = BadContent.objects.filter(post=obj, reported=True).count()
        return reports
    
    def get_user_has_reported(self, obj):
        user = self.context['request'].user
        return BadContent.objects.filter(user=user, post=obj, reported=True).exists()