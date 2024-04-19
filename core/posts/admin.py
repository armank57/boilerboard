from django.contrib import admin
from core.posts.models import Post, Reply

# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'topic', 'get_author')

    def get_author(self, obj): 
        return obj.author.username
    get_author.short_description = "Author"

@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ('post', 'get_author', 'instructor_reply')

    def get_author(self, obj): 
        return obj.author.username
    get_author.short_description = "Author"