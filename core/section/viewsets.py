from core.abstract.viewsets import AbstractViewSet
from rest_framework.permissions import AllowAny
from core.section.serializers import SectionSerializer
from core.section.models import Section
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

class SectionViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    permission_classes = (AllowAny, )
    serializer_class = SectionSerializer

    def get_queryset(self):
        return Section.objects.all()
    
    def get_object(self):
        obj = Section.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)