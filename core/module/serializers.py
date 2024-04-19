from rest_framework import serializers
from core.abstract.serializers import AbstractSerializer
from core.module.models import Module
from core.section.models import Section
from core.quiz2.serializers import Quiz2Serializer
from core.course.models import Course
from core.note.serializers import NoteSerializer
"""from core.section.serializers import SectionSerializer"""
class ModuleSerializer(AbstractSerializer):
    section = serializers.SlugRelatedField(queryset=Section.objects.all(), slug_field='public_id')
    quizzes = Quiz2Serializer(many=True, read_only=True)
    course_id = serializers.SlugRelatedField(queryset=Course.objects.all(), slug_field='public_id')

    
    notes = NoteSerializer(many=True, read_only=True)
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        try: 
                course = Course.objects.all().get(public_id=rep['course_id'])
                rep['course_id']= str(course.public_id).replace("-", "")
        except KeyError: 
            print("Key Error")
        #UserSerializer(creator).data
        return rep

    class Meta:
        model = Module
        fields = [
            'id',
            'name',
            'course_id',
            'section',
            'subsection',
            'quizzes',
            'notes',
            'created',
            'updated',
        ]
        read_only_fields = ['created', 'updated']