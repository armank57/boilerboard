from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from core.course.serializers import CourseSerializer
from core.course.models import Course
from core.abstract.viewsets import AbstractViewSet
from rest_framework.permissions import BasePermission, SAFE_METHODS, AllowAny
from rest_framework.decorators import action

# Create your views here.
class UserPermission:
    def has_permission(self, request, view):
        if view.basename in ['course']:
            if request.user.is_anonymous:
                return request.method in SAFE_METHODS
            return bool(request.user and request.user.is_authenticated)
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_anonymous:
            return request.method in SAFE_METHODS
        if view.basename in ['course']:
            return bool(request.user and request.user.is_authenticated)
        return False
    
class CourseViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    permission_classes = (UserPermission, )
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
    
    @action(methods=['get'], detail=True)
    def is_in_course(self, request, *args, **kwargs):
        course = self.get_object()
        user = self.request.user
        isInCourse = user.in_course(course)
        return Response(isInCourse, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True)
    def join_course(self, request, *args, **kwargs):
        course = self.get_object()
        user = self.request.user
        user.join_course(course)
        serializer = self.serializer_class(course)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(methods=['post'], detail=True)
    def leave_course(self, request, *args, **kwargs):
        course = self.get_object()
        user = self.request.user
        user.leave_course(course)
        serializer = self.serializer_class(course)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True)
    def add_module(self, request, *args, **kwargs):
        course = self.get_object()
        module = self.request.data.get('module')
        module.in_course(module)
        serializer = self.serializer_class(course)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(methods=['post'], detail=True)
    def remove_module(self, request, *args, **kwargs):
        course = self.get_object()
        module = self.get_object()
        course.remove_module(module)
        serializer = self.serializer_class(course)
        return Response(serializer.data, status=status.HTTP_200_OK)

