from rest_framework import serializers
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from core.user.models import User
from core.auth.utils import Util
import uuid

class SendUserRegistrationEmailSerializer(serializers.Serializer): 
    email = serializers.EmailField(max_length=225)
    class Meta: 
        fields = ['email']

    def validate(self, attrs): 
        email = attrs.get('email')
        print(email)
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            link = 'http://localhost:3000/login'
            body = 'Congratulations! We were able to verify your email\n Please follow this link' + link
            data = {
                'subject': 'BoilerBoard Verification Link',
                'body': body,
                "to_email": user.email
            }
            Util.send_email(data)
            return attrs
        else: 
            raise serializers.ValidationError('Could not verify email')