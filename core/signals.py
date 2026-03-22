from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Deal, Ticket, Notification
from .emails import send_notification_email

@receiver(post_save, sender=Deal)
def deal_assigned_notification(sender, instance, created, **kwargs):
    # Notify only when a new deal is created with an assignee
    if created and instance.assigned_to:
        title = "New Deal Assigned"
        message = f"You have been assigned to the deal: {instance.title}"
        link = "/pipeline"
        
        # Create in-app notification
        Notification.objects.create(
            tenant=instance.tenant,
            user=instance.assigned_to,
            title=title,
            message=message,
            link=link
        )
        
        # Send email alert
        send_notification_email(instance.assigned_to, title, message, link)

@receiver(post_save, sender=Ticket)
def ticket_notification(sender, instance, created, **kwargs):
    # Notify assignee when a ticket is created or updated
    if instance.assigned_to:
        if created:
            title = "New Ticket Assigned"
            message = f"You have been assigned to the ticket: {instance.subject}"
        else:
            title = "Ticket Updated"
            message = f"The ticket '{instance.subject}' has been updated to status: {instance.status}"
        
        link = "/tickets"
        
        # Create in-app notification
        Notification.objects.create(
            tenant=instance.tenant,
            user=instance.assigned_to,
            title=title,
            message=message,
            link=link
        )
        
        # Send email alert
        send_notification_email(instance.assigned_to, title, message, link)
