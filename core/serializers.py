from rest_framework import serializers
from .models import Contact, Activity, Deal, Ticket, TicketNote, CustomUser, Event, Tenant, LoginActivity, Notification, Invitation


class ActivitySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Activity
        fields = (
            'id', 'contact', 'author', 'author_name',
            'activity_type', 'description', 'created_at',
        )
        read_only_fields = ('id', 'tenant', 'author', 'created_at')

class DealSerializer(serializers.ModelSerializer):
    contact_name = serializers.SerializerMethodField()

    class Meta:
        model = Deal
        fields = ('__all__')
        read_only_fields = ('tenant', 'created_at')

    def get_contact_name(self, obj):
        if obj.contact:
            return f"{obj.contact.first_name} {obj.contact.last_name}"
        return "Unknown"

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at')


class ContactSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    activities = ActivitySerializer(many=True, read_only=True)
    deals = DealSerializer(many=True, read_only=True)
    tickets = TicketSerializer(many=True, read_only=True)
    assigned_to_name = serializers.CharField(
        source='assigned_to.username', read_only=True, default=None
    )

    class Meta:
        model = Contact
        fields = (
            'id', 'first_name', 'last_name', 'full_name', 'email',
            'phone', 'company', 'tags', 'assigned_to', 'assigned_to_name',
            'activities', 'deals', 'tickets', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'tenant', 'created_at', 'updated_at')


class ContactListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views (no nested activities)."""
    full_name = serializers.ReadOnlyField()
    assigned_to_name = serializers.CharField(
        source='assigned_to.username', read_only=True, default=None
    )

    class Meta:
        model = Contact
        fields = (
            'id', 'first_name', 'last_name', 'full_name', 'email',
            'phone', 'company', 'tags', 'assigned_to', 'assigned_to_name',
            'created_at',
        )
        read_only_fields = ('id', 'tenant', 'created_at')


class TicketNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = TicketNote
        fields = '__all__'
        read_only_fields = ('id', 'tenant', 'author', 'created_at')
    
    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}"


class TicketListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views (no nested notes)."""
    contact_name = serializers.CharField(
        source='contact.full_name', read_only=True
    )
    assigned_to_name = serializers.CharField(
        source='assigned_to.username', read_only=True, default=None
    )

    class Meta:
        model = Ticket
        fields = (
            'id', 'contact', 'contact_name', 'assigned_to', 'assigned_to_name',
            'subject', 'status', 'priority', 'created_at',
        )
        read_only_fields = ('id', 'tenant', 'created_at')

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('tenant', 'assigned_to', 'created_at')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'role', 'status']
        read_only_fields = ['email', 'role', 'status'] # Users can't change their own role/status/email

class MemberSerializer(serializers.ModelSerializer):
    """Full detail for the team management table."""
    last_active = serializers.DateTimeField(source='last_login', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'role', 'status', 'last_active']
        read_only_fields = ['id', 'email', 'last_active']

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'email', 'role', 'token', 'accepted', 'created_at']
        read_only_fields = ['id', 'token', 'accepted', 'created_at']

class TenantSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'domain', 'subdomain','industry', 'timezone', 'currency', 'brand_color', 'logo_url']

class LoginActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginActivity
        fields = ['id', 'ip_address', 'user_agent', 'status', 'created_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'title', 'message', 'link', 'is_read', 'created_at')
        read_only_fields = ('id', 'created_at')