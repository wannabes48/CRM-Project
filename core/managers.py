from django.db import models
from .middleware import get_current_tenant

class TenantManager(models.Manager):
    def get_queryset(self):
        queryset = super().get_queryset()
        tenant = get_current_tenant()
        
        # Automatically filter by tenant if one exists in the thread
        if tenant:
            return queryset.filter(tenant=tenant)
        
        # Security fallback: If no tenant is found (e.g., unauthenticated), 
        # return an empty queryset to prevent accidental data exposure.
        return queryset.none()