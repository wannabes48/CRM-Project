# core/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in 
    using either their username or their email address.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Some packages might pass 'email' instead of 'username' via kwargs
        login_identifier = username or kwargs.get('email')
        
        if not login_identifier:
            return None

        try:
            # Look for a user where EITHER the username OR the email matches
            user = User.objects.get(
                Q(username__iexact=login_identifier) | Q(email__iexact=login_identifier)
            )
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing 
            # difference between an existing and a non-existing user (security best practice)
            User().set_password(password)
            return None
        except User.MultipleObjectsReturned:
            # Fallback if multiple users somehow have the same email
            user = User.objects.filter(Q(username__iexact=login_identifier) | Q(email__iexact=login_identifier)).order_by('id').first()

        # If we found a user, verify the password
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
            
        return None