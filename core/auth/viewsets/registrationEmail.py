from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from core.auth.serializers.registrationEmail import SendUserRegistrationEmailSerializer

class SendUserRegistrationEmailViewset(ViewSet): 
    serializer_class = SendUserRegistrationEmailSerializer
    permission_classes = (AllowAny, )
    http_method_names = ['post']

    def create(self, request, *args, **kwargs): 
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs): 
        serializer = self.serializer_class(data = request.data)
        verify = False
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
