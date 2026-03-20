from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactViewSet, ActivityViewSet, DealViewSet, TicketViewSet, TicketNoteViewSet
from .auth_views import RegisterView, LoginView, LogoutView, MeView, CSRFTokenView

router = DefaultRouter()
router.register(r'contacts', ContactViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'deals', DealViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'ticket-notes', TicketNoteViewSet)

urlpatterns = [
    # Auth endpoints
    path('auth/csrf/', CSRFTokenView.as_view(), name='csrf-token'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),

    # API router
    path('', include(router.urls)),
]
