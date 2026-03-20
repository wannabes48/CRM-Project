from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core.views import (
    register_tenant, dashboard_summary, CustomTokenObtainPairView,
    ContactViewSet, DealViewSet, TicketViewSet, global_search
)

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'deals', DealViewSet, basename='deal')
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # --- Authentication & Registration APIs ---
    path('api/register/', register_tenant, name='register_tenant'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # This handles Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/dashboard/', dashboard_summary, name='dashboard_summary'),
    path('api/search/', global_search, name='global_search'),
    path('api/', include(router.urls)),
]