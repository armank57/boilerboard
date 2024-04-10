from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.voice_chat.models import VoiceChatRoom, OnlineUser
from core.voice_chat.serializers import VoiceChatRoomSerializer, OnlineUserSerializer
from core.user.models import User

class VoiceChatRoomViewSet(viewsets.ModelViewSet):
    queryset = VoiceChatRoom.objects.all()
    serializer_class = VoiceChatRoomSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_queryset(self):
        return self.queryset.all()
    
    def destroy(self, request, *args, **kwargs):
        room = self.get_object()
        if room.creator != request.user:
            return Response({'status': 'You are not authorized to delete this room'}, status=status.HTTP_403_FORBIDDEN)
        if room.online_users.count() > 0:
            return Response({'status': 'You cannot delete a room with users in it'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        room = self.get_object()
        user = request.user
        if user in room.banned_users.all():
            return Response({'status': 'You are banned from this room'}, status=status.HTTP_403_FORBIDDEN)
        online_user, created = OnlineUser.objects.get_or_create(user=user)
        room.online_users.add(online_user)
        room.save()
        return Response({'status': 'room joined'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        room = self.get_object()
        user = request.user
        online_user = OnlineUser.objects.filter(user=user).first()
        if online_user:
            room.online_users.remove(online_user)
            room.save()
        return Response({'status': 'room left'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def kick(self, request, pk=None):
        room = self.get_object()
        user_to_kick = User.objects.get(public_id=request.data['user_id'])
        if room.creator != request.user:
            return Response({'status': 'You are not authorized to kick users from this room'}, status=status.HTTP_403_FORBIDDEN)
        online_user_to_kick = OnlineUser.objects.filter(user=user_to_kick).first()
        if online_user_to_kick:
            room.online_users.remove(online_user_to_kick)
            room.banned_users.add(user_to_kick)
            room.save()
        return Response({'status': 'user kicked'}, status=status.HTTP_200_OK)