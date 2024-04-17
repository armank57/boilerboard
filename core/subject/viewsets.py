from rest_framework.permissions import AllowAny
from core.abstract.viewsets import AbstractViewSet
from core.subject.models import Subject
from core.subject.serializers import SubjectSerializer

class SubjectViewSet(AbstractViewSet):
    http_method_names = ('get', 'post', 'put', 'delete')
    permission_classes = (AllowAny, )
    serializer_class = SubjectSerializer

    def get_queryset(self):
        return Subject.objects.all()
    
    def get_object(self):
        obj = Subject.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj