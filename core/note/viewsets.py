from rest_framework.response import Response
from core.abstract.viewsets import AbstractViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from core.user.models import User
from core.note.models import Note
from core.note.serializers import NoteSerializer
from rest_framework.decorators import action

class NoteViewSet(AbstractViewSet):
    serializer_class = NoteSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post', 'get']

    def get_queryset(self):
        return Note.objects.all()
    
    def get_object(self):
        obj = Note.objects.get_object_by_public_id(self.kwargs['pk'])
        return obj

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['author'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def endorse(self, request, pk=None):
        note = self.get_object()
        note.endorsed = True
        note.save()
        data = {'message': 'Note endorsed successfully.'}
        return Response(data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def unendorse(self, request, pk=None):
        note = self.get_object()
        note.endorsed = False
        note.save()
        data = {'message': 'Note unendorsed successfully.'}
        return Response(data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def add_image(self, request, pk=None):
        note = self.get_object()
        image = request.data['image']
        note.image = image
        note.save()
        data = {'message': 'Image added successfully.'}
        return Response(data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def remove_image(self, request, pk=None):
        note = self.get_object()
        note.image = None
        note.save()
        data = {'message': 'Image removed successfully.'}
        return Response(data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def add_content(self, request, pk=None):
        note = self.get_object()
        content = request.data['content']
        note.content = content
        note.save()
        data = {'message': 'Content added successfully.'}
        return Response(data, status=status.HTTP_200_OK)