from rest_framework.permissions import IsAuthenticated, AllowAny
from core.abstract.viewsets import AbstractViewSet
from core.discussion.models import Discussion
from core.discussion.serializers import DiscussionSerializer
from rest_framework.response import Response
from rest_framework import status

class DiscussionViewset(AbstractViewSet): 
    http_method_names = ['post', 'get']
    permission_classes = (AllowAny, )
    serializer_class = DiscussionSerializer

    def get_queryset(self):
        return Discussion.objects.all()
    
    def get_object(self): 
        obj = Discussion.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)