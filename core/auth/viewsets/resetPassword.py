from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from core.auth.serializers.resetPassword import UserChangePasswordSerializer, SendPasswordResetEmailSerializer

class UserResetPasswordViewset(ViewSet): 
    serializer_class = UserChangePasswordSerializer
    permission_classes = (AllowAny, )
    http_method_names = ['post']

    def create(self, request, public_id, token, *args,  **kwargs): 
        serializer = self.serializer_class(data=request.data, context={'public_id': public_id, 'token': token})
        serializer.is_valid(raise_exception=True)
        
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
    # def post(self, request, public_id, token, *args, **kwargs): 
    #     serializer = self.serializer_class(data=request.data, context={'public_id': public_id, 'token': token })

    #     serializer.is_valid(raise_exception=True)
    #     return Response(serializer.validated_data, status=status.HTTP_200_OK)



class SendUserPasswordEmailViewset(ViewSet): 
    serializer_class = SendPasswordResetEmailSerializer
    permission_classes = (AllowAny, )
    http_method_names = ['post']

    # print("hello")

    def create(self, request, *args, **kwargs): 
        # print("hello")
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs): 
        serializer = self.serializer_class(data=request.data)
        verify=False
        serializer.is_valid(raise_exception=True)
        
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
