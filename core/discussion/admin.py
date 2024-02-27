from django.contrib import admin
from core.discussion.models import Discussion

# Register your models here.
@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin): 
    pass