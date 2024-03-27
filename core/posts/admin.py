from django.contrib import admin
from core.posts.models import Post

# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'topic', 'get_author')

    def get_author(self, obj): 
        return obj.author.username
    get_author.short_description = "Author"