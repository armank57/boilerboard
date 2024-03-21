from rest_framework import routers
from core.user.viewsets import UserViewSet
from core.auth.viewsets import RegisterViewSet, LoginViewSet, RefreshViewSet
from core.course.viewsets import CourseViewSet
from core.module.viewsets import ModuleViewSet
from core.section.viewsets import SectionViewSet

router = routers.SimpleRouter()

router.register(r'user', UserViewSet, basename='user')
router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
router.register(r'course', CourseViewSet, basename='course')
router.register(r'module', ModuleViewSet, basename='module')
router.register(r'section', SectionViewSet, basename='section')

urlpatterns = [
    *router.urls,
]