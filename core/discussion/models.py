from django.db import models
from core.abstract.models import AbstractModel, AbstractManager

# Create your models here.

class DiscussionManager(AbstractManager): 
    pass

class Discussion(AbstractModel): 
    # CASCADE: if the user is deleted, the discussion he creates is also deleted
    creator = models.ForeignKey(to='core_user.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=50, null=True)
    rating = models.IntegerField(default=0)
    course = models.ForeignKey(to="core_course.Course", on_delete=models.CASCADE, null=True)

    objects = DiscussionManager()
    
    def __str__(self): 
        return f"Creator: {self.creator.name}, Name: {self.name}"
    
    def get_all_posts_from_discussion(self): 
        # TODO
        pass
    
    class Meta: 
        db_table = "'core.discussion'"

