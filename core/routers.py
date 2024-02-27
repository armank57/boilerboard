from rest_framework import routers
from core.user.viewsets import UserViewSet
from core.course.viewsets import CourseViewSet
from core.auth.viewsets import RegisterViewSet, LoginViewSet, RefreshViewSet
from core.discussion.viewsets import DiscussionViewset

router = routers.SimpleRouter()

router.register(r'user', UserViewSet, basename='user')
router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
router.register(r'course', CourseViewSet, basename='course')
router.register(r'discussion', DiscussionViewset, basename='discussion')

urlpatterns = [
    *router.urls,
]