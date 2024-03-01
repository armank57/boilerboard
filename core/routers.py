from rest_framework import routers
from core.user.viewsets import UserViewSet
from core.course.viewsets import CourseViewSet
from core.auth.viewsets import RegisterViewSet, LoginViewSet, RefreshViewSet
from core.discussion.viewsets import DiscussionViewset
from core.auth.viewsets.resetPassword import UserResetPasswordViewset, SendUserPasswordEmailViewset

router = routers.SimpleRouter()

router.register(r'user', UserViewSet, basename='user')
router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
router.register(r'course', CourseViewSet, basename='course')
router.register(r'discussion', DiscussionViewset, basename='discussion')
router.register(r'auth/send-user-email', SendUserPasswordEmailViewset, basename='auth-send-user-email')
router.register(r'auth/reset-password/(?P<public_id>[^/.]+)/(?P<token>[^/.]+)', UserResetPasswordViewset, basename='auth-user-reset-password')

urlpatterns = [
    *router.urls,
]