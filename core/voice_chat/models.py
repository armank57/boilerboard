from django.db import models
from core.abstract.models import AbstractModel
from core.abstract.models import AbstractManager
from core.user.models import User

class VoiceChatRoomManager(AbstractManager):
    def create_room(self, name):
        if name is None:
            raise TypeError('Rooms must have a name.')
        
        room = self.model(name=name)
        room.save(using=self._db)

        return room
    
    def update_room(self, room, name):
        if name is None:
            raise TypeError('Rooms must have a name.')
        
        room.name = name
        room.save(using=self._db)

        return room
    
    def delete_room(self, room):
        if room is None:
            raise TypeError('Rooms must have a name.')
        
        room.delete()

        return room

from django.utils import timezone

class OnlineUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

class VoiceChatRoom(AbstractModel):
    name = models.CharField(max_length=255, unique=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    online_users = models.ManyToManyField(OnlineUser, blank=True)

    def __str__(self):
        return self.name