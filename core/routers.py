from rest_framework import routers
from core.user.viewsets import UserViewSet
from core.course.viewsets import CourseViewSet
from core.auth.viewsets import RegisterViewSet, LoginViewSet, RefreshViewSet
from core.discussion.viewsets import DiscussionViewset
from core.auth.viewsets.resetPassword import UserResetPasswordViewset, SendUserPasswordEmailViewset
from core.course.viewsets import CourseViewSet
from core.module.viewsets import ModuleViewSet
from core.section.viewsets import SectionViewSet
from core.posts.viewsets import PostViewSet
from core.quiz2.viewsets import Quiz2ViewSet
from core.subject.viewsets import SubjectViewSet
from core.voice_chat.viewsets import VoiceChatRoomViewSet
from core.auth.viewsets.registrationEmail import SendUserRegistrationEmailViewset

router = routers.SimpleRouter()

router.register(r'user', UserViewSet, basename='user')
router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
router.register(r'course', CourseViewSet, basename='course')
router.register(r'discussion', DiscussionViewset, basename='discussion')
router.register(r'auth/send-user-email', SendUserPasswordEmailViewset, basename='auth-send-user-email')
router.register(r'auth/reset-password/(?P<public_id>[^/.]+)/(?P<token>[^/.]+)', UserResetPasswordViewset, basename='auth-user-reset-password')
router.register(r'course', CourseViewSet, basename='course')
router.register(r'module', ModuleViewSet, basename='module')
router.register(r'section', SectionViewSet, basename='section')
router.register(r'post', PostViewSet, basename='post')
router.register(r'quiz', Quiz2ViewSet, basename='quiz')
router.register(r'voice_chat', VoiceChatRoomViewSet, basename='voice-chat')
#router.register(r'auth/send-registration-email/', SendUserPasswordEmailViewset, basename='auth-send-registration-email')
router.register(r'subject', SubjectViewSet, basename='subject')

urlpatterns = [
    *router.urls,
]