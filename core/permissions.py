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
