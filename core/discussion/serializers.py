from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.discussion.models import Discussion
from core.user.models import User
from core.course.models import Course

class DiscussionSerializer(AbstractSerializer): 
    creator = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='public_id')
    course = serializers.SlugRelatedField(queryset=Course.objects.all(), slug_field='public_id')

    def validate_creator(self, value): 
        if self.context["request"].user != value: 
            raise ValidationError("You can't create a discussion for another user")
        return value
    
    class Meta: 
        model = Discussion
        fields = ['id', 'creator', 'course', 'name', 'description', 'rating', 'created', 'updated']

    