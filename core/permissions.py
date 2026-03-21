from rest_framework.permissions import BasePermission


class IsTenantMember(BasePermission):
    """Allow access only to authenticated users with a valid tenant."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, 'tenant')
            and request.user.tenant is not None
        )


class IsAdmin(BasePermission):
    """Allow access only to Admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'Admin'
        )


class IsManagerOrAbove(BasePermission):
    """Allow access to Managers and Admins."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('Admin', 'Manager')
        )


class IsSalesRep(BasePermission):
    """Check if the user is a Sales Rep (used for conditional queryset filtering)."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'Sales Rep'
        )

class HasActiveSubscription(BasePermission):
    """
    Blocks users if their workspace subscription is canceled, past due, or missing.
    """
    # This is the exact error message React will receive if they are blocked
    message = "Your workspace subscription is inactive. Please update your billing details to regain access."

    def has_permission(self, request, view):
        # 1. If they aren't logged in, let the standard IsAuthenticated class handle it
        if not request.user or not request.user.is_authenticated:
            return True 

        # 2. Grab the subscription linked to the user's tenant
        # (Using .first() because Subscription has a ForeignKey to Tenant)
        subscription = request.user.tenant.subscription_set.first()
        
        # 3. If they don't have a subscription record at all, block them
        if not subscription:
            return False
            
        # 4. Only allow access if they are paying or on a free trial
        return subscription.status in ['active', 'trialing']