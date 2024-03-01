from core.abstract.viewsets import AbstractViewSet
from rest_framework.permissions import AllowAny
from core.module.serializers import ModuleSerializer
from core.module.models import Module
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

class ModuleViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    permission_classes = (AllowAny, )
    serializer_class = ModuleSerializer

    def get_queryset(self):
        return Module.objects.all()
    
    def get_object(self):
        obj = Module.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(methods=['post'], detail=True)
    def add_quiz(self, request, *args, **kwargs):
        module = self.get_object()
        quiz = self.get_object()
        module.add_quiz(quiz)
        serializer = self.serializer_class(module)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(methods=['post'], detail=True)
    def remove_quiz(self, request, *args, **kwargs):
        module = self.get_object()
        quiz = self.get_object()
        module.remove_quiz(quiz)
        serializer = self.serializer_class(module)
        return Response(serializer.data, status=status.HTTP_200_OK)