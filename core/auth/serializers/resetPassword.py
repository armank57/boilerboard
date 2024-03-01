from rest_framework import serializers
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from core.user.models import User
from core.auth.utils import Util
import uuid

class UserChangePasswordSerializer(serializers.Serializer): 
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    
    class Meta: 
        fields = ['password']

    def validate(self, attrs): 
        try: 
            password = attrs['password']
            print(password)
            public_id = self.context.get('public_id')
            print(f"public_id: {public_id}")
            token = self.context.get('token')
            # id = smart_str(urlsafe_base64_decode(public_id))
            user = User.objects.get(public_id=public_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('Token is not Valid or Expired')
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            user = User.objects.get(public_id=public_id)
            PasswordResetTokenGenerator().check_token(user, token)
            raise serializers.ValidationError('Token is not Valid or Expired')
        
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=225)
    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            public_id = str(user.public_id)
            token = PasswordResetTokenGenerator().make_token(user)
            link = 'http://localhost:3000/reset-password-confirm/?public_id='+public_id+'&token='+token+'/'
            body = 'Click Following Link to Reset Your Password '+link
            data = {
                'subject':'Reset Your Password',
                'body':body,
                'to_email':user.email
            }
            Util.send_email(data)
            return attrs
        else: 
            raise serializers.ValidationError('You are not a Registered User')
