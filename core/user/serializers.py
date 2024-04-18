from rest_framework import serializers

from core.abstract.serializers import AbstractSerializer
from core.course.models import Course
from core.user.models import User

class UserSerializer(AbstractSerializer): 
    id = serializers.UUIDField(source='public_id', read_only=True, format='hex')
    joined_courses = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)
    bookmarked_posts = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        try: 
            i = 0
            for f in rep['joined_courses']:
                course = Course.objects.all().get(id=f)
                #Course.objects.get_object_by_public_id(f)
                rep['joined_courses'][i] = course.name
                i += 1
        except KeyError: 
            print("Key Error")
        #UserSerializer(creator).data
        return rep

    class Meta: 
        model = User
        fields = [
            'id', 
            'username', 
            'first_name', 
            'last_name',
            'email',
            'is_active',
            'joined_courses',
            'created',
            'updated',
            'is_superuser',
            'is_instructor',
            'avatar',
            'user_rating',
            'bookmarked_posts',
        ]

        read_only_fields = ['is_active']