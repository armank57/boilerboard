from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from core.course.models import Course
from core.user.models import User
from core.abstract.serializers import AbstractSerializer
from core.user.serializers import UserSerializer
from core.section.serializers import SectionSerializer

class CourseSerializer(AbstractSerializer):
    creator = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='public_id')
    students = UserSerializer(many=True, read_only=True)
    sections = SectionSerializer(many=True, read_only=True)

    def validate_creator(self, value):
        if value != self.context['request'].user:
            raise ValidationError('You can only create courses for yourself.')
        return value
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        """creator = User.objects.get_object_by_public_id(rep['creator'])
        rep['creator'] = creator.username"""
        i = 0
        for student in rep['students']:
            rep['students'][i] = student['id']
            i += 1
        #UserSerializer(creator).data
        return rep
    
    class Meta:
        model = Course
        fields = [
            'id',
            'name',
            'course_subject',
            'description',
            'creator',
            'sections',
            'students',
            'created',
            'updated',
        ]
        
        read_only_fields = ['creator']