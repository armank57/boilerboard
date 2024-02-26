from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from core.course.serializers import CourseSerializer
from core.course.models import Course
from core.abstract.viewsets import AbstractViewSet

# Create your views here.

class CourseViewSet(AbstractViewSet):
    http_method_names = ('post', 'get')
    permission_classes = (IsAuthenticated, )
    serializer_class = CourseSerializer

    def get_queryset(self):
        return Course.objects.all()
    
    def get_object(self):
        obj = Course.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)