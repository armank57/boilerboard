from django.contrib import admin
from core.quiz2.models import Quiz2

# Register your models here.
@admin.register(Quiz2)
class Quiz2Admin(admin.ModelAdmin): 
    list_display = ('title', 'get_author', 'created')

    def get_author(self, obj): 
        return obj.author.username
    get_author.short_description = 'Author'