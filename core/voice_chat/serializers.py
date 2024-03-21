from rest_framework import serializers
from .models import VoiceChatRoom, OnlineUser
from core.user.models import User

class OnlineUserSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = OnlineUser
        fields = ['user', 'username']
        
class VoiceChatRoomSerializer(serializers.ModelSerializer):
    creator = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username', required=False)
    online_users = OnlineUserSerializer(many=True, read_only=True)

    class Meta:
        model = VoiceChatRoom
        fields = ['id', 'public_id', 'name', 'creator', 'created_at', 'updated_at', 'online_users']
