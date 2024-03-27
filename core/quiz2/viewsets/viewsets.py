from rest_framework.response import Response
from core.abstract.viewsets import AbstractViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from core.user.models import User
from core.quiz2.models import Quiz2, Question, Answer
from core.quiz2.serializers import Quiz2Serializer

class Quiz2ViewSet(AbstractViewSet): 
    serializer_class = Quiz2Serializer
    permission_classes = (AllowAny,)
    http_method_names = ['post', 'get']

    def get_queryset(self):
        return Quiz2.objects.all()
    
    def get_object(self):
        obj = Quiz2.objects.get_object_by_public_id(self.kwargs['pk'])
        return obj

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['author'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    
    