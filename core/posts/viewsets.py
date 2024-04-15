from core.abstract.viewsets import AbstractViewSet
from core.posts.serializers import PostSerializer, ReplySerializer
from core.posts.models import Post, Rating, BadContent, Reply, ReplyRating

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# Create your views here

class ReplyViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    permission_classes = []
    serializer_class = ReplySerializer

    def get_queryset(self):
        print("GETTING REPLIES")
        return Reply.objects.all()
    
    def get_object(self):
        obj = get_object_or_404(Reply, public_id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def update(self, request, *args, **kwargs):
        reply = self.get_object()
        user = request.user

        # Check if the user is the author of the reply
        if reply.author != user:
            return Response({'message': 'You do not have permission to edit this reply.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(reply, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        reply = self.get_object()
        user = request.user

        # Check if the user is not the author of the reply and user is not an instructor
        if reply.author != user and not user:
            return Response({'message': 'You do not have permission to delete this reply.'}, status=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(reply)

        return Response({'message': 'Reply deleted.'}, status=status.HTTP_204_NO_CONTENT)
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        # Only should be called if the user has not already upvoted the reply
        reply = self.get_object()
        user = request.user
        # author = reply.author
        ReplyRating.objects.create(user=user, reply=reply, upvote=True)
        data = {'message': 'Upvote added successfully.'}
        return Response(data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def remove_upvote(self, request, pk=None):
        # Only should be called if the user has already upvoted the reply
        reply = self.get_object()
        user = request.user
        rating = ReplyRating.objects.get(user=user, reply=reply)
        rating.delete()
        data = {'message': 'Upvote removed successful.'}
        return Response(data, status=status.HTTP_201_CREATED)

class PostViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    permission_classes = []
    serializer_class = PostSerializer

    def get_queryset(self):
        print("GETTING POSTS")
        return Post.objects.all()
    
    def get_object(self):
        obj = get_object_or_404(Post, public_id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def update(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user

        # Check if the user is the author of the post
        if post.author != user:
            return Response({'message': 'You do not have permission to edit this post.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(post, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user

        # Check if the user is not the author of the post and user is not an instructor
        if post.author != user and not user:
            return Response({'message': 'You do not have permission to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(post)

        return Response({'message': 'Post deleted.'}, status=status.HTTP_204_NO_CONTENT)
    
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
        # author = post.author
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
    def dismiss_report(self, request, pk=None):
        post = self.get_object()
        if request.user.is_instructor: 
            bad_content = BadContent.objects.get(post=post)
            bad_content.delete()
        else: 
            return Response({'status': 'Unauthorized: Need Instructor permissions to dismiss reports'}, status=status.HTTP_403_FORBIDDEN)
        data = {'message': 'Report dismissed successful.'}
        return Response(data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def remove_reported_content(self, request, pk=None):
        post = self.get_object()
        user = request.user
        # BadContent = BadContent.objects.get(user=user, post=post)
        # BadContent.delete()
        if request.user.is_instructor: 
            post.delete()
        else: 
            return Response({'status': 'Unauthorized: Need Instructor permissions to remove post'}, status=status.HTTP_403_FORBIDDEN)
        data = {'message': 'Content removed successful.'}
        return Response(data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def endorse(self, request, pk=None):
        post = self.get_object()
        if request.user.is_instructor: 
            post.endorsed = True
            post.save()
        else: 
            return Response({'status': 'Unauthorized: Need Instructor permissions to endorse post'}, status=status.HTTP_403_FORBIDDEN)
        data = {'message': 'Post endorsed successful.'}
        return Response(data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def unendorse(self, request, pk=None):
        post = self.get_object()
        if request.user.is_instructor: 
            post.endorsed = False
            post.save()
        else: 
            return Response({'status': 'Unauthorized: Need Instructor permissions to unendorse post'}, status=status.HTTP_403_FORBIDDEN)
        data = {'message': 'Post unendorsed successful.'}
        return Response(data, status=status.HTTP_201_CREATED)
    