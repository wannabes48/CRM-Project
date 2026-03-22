from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core.views import (
    register_tenant, dashboard_summary, CustomTokenObtainPairView, LoginActivityListView,
    ContactViewSet, DealViewSet, TicketViewSet, global_search, EventViewSet,
    UserProfileView, TenantSettingsView, change_password, TicketNoteViewSet, analytics_dashboard,
    create_checkout_session, stripe_webhook, create_customer_portal_session, get_subscription_status, 
    TenantSettingsView, export_contacts_csv, NotificationViewSet, logout_view
)

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'deals', DealViewSet, basename='deal')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'events', EventViewSet, basename='event')
router.register(r'ticket-notes', TicketNoteViewSet, basename='ticket-note')
router.register(r'notifications', NotificationViewSet, basename='notification')


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # --- Authentication & Registration APIs ---
    path('api/register/', register_tenant, name='register_tenant'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # This handles Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/dashboard/', dashboard_summary, name='dashboard_summary'),
    path('api/search/', global_search, name='global_search'),
    path('api/contacts/export/', export_contacts_csv, name='export_contacts_csv'),
    path('api/', include(router.urls)),
    path('api/users/me/', UserProfileView.as_view(), name='user_profile'),
    path('api/tenant/', TenantSettingsView.as_view(), name='tenant_settings'),
    path('api/users/change-password/', change_password, name='change_password'),
    path('api/create-checkout-session/', create_checkout_session),
    path('api/webhook/stripe/', stripe_webhook, name='stripe_webhook'),
    path('api/create-portal-session/', create_customer_portal_session, name='billing_portal'),
    path('api/subscription-status/', get_subscription_status, name='subscription_status'),
    path('api/login-activity/', LoginActivityListView.as_view(), name='login_activity'),
    path('api/analytics/', analytics_dashboard, name='analytics_dashboard'),
    path('api/logout/', logout_view, name='logout'),
    path('api/tenant/settings/', TenantSettingsView.as_view(), name='tenant_settings'),
    
]