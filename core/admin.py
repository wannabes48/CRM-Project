from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Tenant, CustomUser, Contact, Activity, Deal, Ticket, TicketNote


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'plan_name', 'subscription_status', 'created_at')
    search_fields = ('name',)
    list_filter = ('subscription_status', 'plan_name')


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'tenant', 'is_active')
    list_filter = ('role', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('CRM', {'fields': ('role', 'tenant')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('CRM', {'fields': ('role', 'tenant')}),
    )


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'company', 'assigned_to', 'tenant')
    search_fields = ('first_name', 'last_name', 'email', 'company')
    list_filter = ('tenant',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('activity_type', 'contact', 'author', 'created_at')
    list_filter = ('activity_type',)


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('title', 'stage', 'amount', 'probability', 'assigned_to', 'tenant')
    list_filter = ('stage', 'tenant')
    search_fields = ('title',)


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('subject', 'status', 'priority', 'assigned_to', 'tenant')
    list_filter = ('status', 'priority', 'tenant')
    search_fields = ('subject',)


@admin.register(TicketNote)
class TicketNoteAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'author', 'is_internal', 'created_at')
    list_filter = ('is_internal',)
