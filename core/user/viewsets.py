from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from core.abstract.viewsets import AbstractViewSet
from core.user.serializers import UserSerializer
from core.user.models import User
from core.posts.models import Post
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from core.posts.serializers import PostSerializer2

# Create your views here.

class UserViewSet(AbstractViewSet): 
    http_method_names = ('patch', 'get', 'post')
    permission_classes = (AllowAny, )
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user.is_superuser: 
            return User.objects.all()
        return User.objects.exclude(is_superuser=True)
    
    def get_object(self):
        obj = User.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    @action(detail=True, methods=['post'])
    def bookmark_post(self, request, pk=None):
        user = self.get_object()
        post = Post.objects.get_object_by_public_id(request.data['post_id'])
        user.bookmarked_posts.add(post)
        user.save()
        return Response({'status': 'Post bookmarked'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def get_bookmarked_posts(self, request, pk=None):
        user = self.get_object()
        posts = user.bookmarked_posts.all()
        serializer = PostSerializer2(posts, many=True)
        return Response({'bookmarked_posts': serializer.data}, status=status.HTTP_200_OK)