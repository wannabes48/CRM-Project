import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
import pytz

class Tenant(models.Model):
    """The core organization/workspace table."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=100, default='Technology')

    subdomain = models.CharField(max_length=100, unique=True, blank=True, null=True)
    custom_domain = models.CharField(max_length=255, unique=True, blank=True, null=True)
    
    # Settings
    timezone = models.CharField(max_length=50, default='UTC', choices=[(tz, tz) for tz in pytz.all_timezones])
    currency = models.CharField(max_length=3, default='USD') # e.g., USD, EUR, GBP
    
    # Branding
    brand_color = models.CharField(max_length=7, default='#B2FF4D') # Defaults to your saas-neon
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TenantAwareModel(models.Model):
    """Abstract base class that injects tenant_id into EVERY table."""
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Subscription(TenantAwareModel):
    """Billing and subscription state for the tenant."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default='trialing') # active, canceled, past_due
    plan_tier = models.CharField(max_length=50, default='Free')
    current_period_end = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.tenant.name} - {self.plan_tier} ({self.status})"


# ==========================================
# 2. USERS & ROLES
# ==========================================

class Role(TenantAwareModel):
    """Custom roles assigned per tenant (e.g., Admin, Sales Manager)."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    permissions = models.JSONField(default=dict, blank=True) # Granular JSON permissions

    def __str__(self):
        return self.name


class CustomUser(AbstractUser, TenantAwareModel):
    """User account, tied to a specific tenant and role."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Replaced choice field with Foreign Key to the new Role table
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)

    # Avoid clashes with Django's default auth system
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True
    )

    def __str__(self):
        role_name = self.role.name if self.role else "No Role"
        return f"{self.username} ({role_name})"


# ==========================================
# 3. CRM CORE (Contacts, Pipelines, Deals)
# ==========================================

class Contact(TenantAwareModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assigned_to = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='contacts'
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Pipeline(TenantAwareModel):
    """Sales pipelines (e.g., 'Enterprise Sales', 'Partner Onboarding')."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Deal(TenantAwareModel):
    STAGE_CHOICES = (
        ('Lead', 'Lead'),
        ('Qualified', 'Qualified'),
        ('Proposal', 'Proposal'),
        ('Won', 'Won'),
        ('Lost', 'Lost'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Linked to Pipeline table
    pipeline = models.ForeignKey(Pipeline, on_delete=models.CASCADE, related_name='deals', null=True, blank=True)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='deals')
    assigned_to = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='deals'
    )
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='Lead')
    probability = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} — {self.stage}"


# ==========================================
# 4. SUPPORT (Tickets)
# ==========================================

class Ticket(TenantAwareModel):
    STATUS_CHOICES = (
        ('Open', 'Open'),
        ('Pending', 'Pending'),
        ('Resolved', 'Resolved'),
    )
    PRIORITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Urgent', 'Urgent'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='tickets')
    assigned_to = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='tickets'
    )
    subject = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Open')
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, default='Medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.status}] {self.subject}"


# ==========================================
# 5. SUPPLEMENTARY MODELS (Events, Notes)
# ==========================================

class Activity(TenantAwareModel):
    """Activity timeline entry linked to a Contact."""
    TYPE_CHOICES = (
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note', 'Note'),
        ('task', 'Task'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='activities')
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    activity_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='note')
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'activities'

    def __str__(self):
        return f"{self.activity_type}: {self.description[:50]}"


class TicketNote(TenantAwareModel):
    """Note on a ticket — can be internal or customer-facing."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='notes')
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    body = models.TextField()
    is_internal = models.BooleanField(default=True)
    is_customer_facing = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        tag = "Internal" if self.is_internal else "Reply"
        return f"[{tag}] {self.body[:50]}"


class Event(TenantAwareModel): # Swapped explicit models.Model for TenantAwareModel
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    category = models.CharField(max_length=50, default='Meeting') 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): # Fixed typo: __cl__ -> __str__
        return self.title

class LoginActivity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Note: Linked directly to the User, not the Tenant, as this is personal security data
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='login_logs')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, default='Success') # 'Success' or 'Failed'
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at'] # Newest logs first

    def __str__(self):
        return f"{self.user.username} - {self.ip_address} - {self.status}"

class Notification(TenantAwareModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=500, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.title}"