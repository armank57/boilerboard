from django.contrib import admin
from core.voice_chat.models import VoiceChatRoom

# Register your models here.
@admin.register(VoiceChatRoom)
class VoiceChatRoomAdmin(admin.ModelAdmin): 
    pass