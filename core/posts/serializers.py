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
    user_has_reported = serializers.SerializerMethodField()
    badContentList = BadContentSerializer(many=True)
    
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'author',
            'created',
            'updated',
            'ratings',
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
    
    def get_reports(self, obj):
        # Calculate the number of upvotes
        reports = BadContent.objects.filter(post=obj, reported=True).count()
        return reports
    
    def get_user_has_reported(self, obj):
        user = self.context['request'].user
        return BadContent.objects.filter(user=user, post=obj, reported=True).exists()