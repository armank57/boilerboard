from rest_framework import serializers
from .models import VoiceChatRoom, OnlineUser
from core.user.models import User

class OnlineUserSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    public_id = serializers.ReadOnlyField(source='user.public_id')
    
    class Meta:
        model = OnlineUser
        fields = ['user', 'username', 'public_id']

class VCUserSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField()
    public_id = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'username', 'public_id']
       
class VoiceChatRoomSerializer(serializers.ModelSerializer):
    creator = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username', required=False)
    online_users = OnlineUserSerializer(many=True, read_only=True)
    banned_users = VCUserSerializer(many=True, read_only=True)
    waiting_users = VCUserSerializer(many=True, read_only=True)
    accepted_users = VCUserSerializer(many=True, read_only=True)
    
    
    class Meta:
        model = VoiceChatRoom
        fields = ['id', 'public_id', 'name', 'creator', 'created_at', 'updated_at', 'is_private', 
                  'online_users', 'banned_users', 'waiting_users', 'accepted_users']