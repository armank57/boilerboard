from core.abstract.viewsets import AbstractViewSet
from core.posts.serializers import PostSerializer
from core.posts.models import Post, Rating, BadContent

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here

class PostViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    permission_classes = []
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.all()
    
    def get_object(self):
        obj = Post.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        # Only should be called if the user has not already upvoted the post
        post = self.get_object()
        user = request.user
        Rating.objects.create(user=user, post=post, upvote=True)
        data = {'message': 'Upvote added successfully.'}
        return Response(data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def remove_upvote(self, request, pk=None):
        # Only should be called if the user has already upvoted the post
        post = self.get_object()
        user = request.user
        rating = Rating.objects.get(user=user, post=post)
        rating.delete()
        data = {'message': 'Upvote removed successful.'}
        return Response(data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def report_content(self, request, pk=None):
        # Only should be called if the user has not already reported the post
        post = self.get_object()
        user = request.user
        BadContent.objects.create(user=user, post=post, reported=True, reportedContent=request.data['reportedContent'])
        data = {'message': 'Report added successfully.'}
        return Response(data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def remove_reported_content(self, request, pk=None):
        post = self.get_object()
        user = request.user
        BadContent = BadContent.objects.get(user=user, post=post)
        BadContent.delete()
        data = {'message': 'Content removed successful.'}
        return Response(data, status=status.HTTP_201_CREATED)
    
    