from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from core.course.models import Course
from core.user.models import User
from core.abstract.serializers import AbstractSerializer

class CourseSerializer(AbstractSerializer):
    creator = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='public_id')

    def validate_creator(self, value):
        if value != self.context['request'].user:
            raise ValidationError('You can only create courses for yourself.')
        return value
    
    class Meta:
        model = Course
        fields = [
            'id',
            'name',
            'subject',
            'description',
            'creator',
            'created',
            'updated',
        ]
        
        read_only_fields = ['creator']