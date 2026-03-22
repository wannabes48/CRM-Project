import random
import uuid
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import transaction

# Import ALL models from your core app
from core.models import (
    Tenant, Subscription, Role, Contact, Pipeline, 
    Deal, Ticket, Activity, TicketNote, Event,
    LoginActivity, Notification, Invitation
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with comprehensive sample CRM data across all tables.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write("Starting database seeding process...")

        # 1. Ensure at least one Tenant and User exists to attach data to
        if not Tenant.objects.exists():
            self.stdout.write("No Tenants found. Creating a default Workspace and Admin User...")
            tenant = Tenant.objects.create(
                name="Acme Corporation",
                domain="acmecorp.com",
                subdomain="acme",
                industry="Technology",
                timezone="UTC",
                currency="USD"
            )
            User.objects.create_user(
                username="admin_acme",
                email="admin@acmecorp.com",
                password="password123!",
                first_name="Alice",
                last_name="Admin",
                tenant=tenant,
                role="ADMIN",
                status="ACTIVE"
            )

        tenants = Tenant.objects.all()

        # Realistic Sample Data Pools
        first_names = ["Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Alex", "Quinn"]
        last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]
        companies = ["Globex", "Initech", "Soylent", "Massive Dynamic", "Stark Ind", "Wayne Ent"]
        deal_titles = ["Q3 Software License", "Enterprise SLA Upgrade", "Consulting Retainer", "Hardware Bulk Order"]
        ticket_subjects = ["Cannot login to portal", "Billing issue on last invoice", "Feature request: Dark Mode", "API rate limit exceeded"]
        user_agents = [
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
        ]

        for tenant in tenants:
            self.stdout.write(f"\n--- Processing Workspace: {tenant.name} ---")

            # Get the first available user in this tenant to assign things to
            first_user = User.objects.filter(tenant=tenant).first()
            if not first_user:
                self.stdout.write(self.style.WARNING(f"⚠ No users found in {tenant.name}. Skipping..."))
                continue

            # 2. Subscriptions
            Subscription.objects.get_or_create(
                tenant=tenant,
                defaults={
                    'status': 'trialing',
                    'plan_tier': 'Professional',
                    'current_period_end': timezone.now() + timedelta(days=14)
                }
            )

            # 3. Custom Roles (Dynamic JSON Permissions)
            Role.objects.get_or_create(
                tenant=tenant, name="Data Entry Clerk",
                defaults={
                    'description': "Limited access to create contacts only.",
                    'permissions': {"can_view_deals": False, "can_create_contacts": True}
                }
            )

            # 4. Pipeline
            pipeline, _ = Pipeline.objects.get_or_create(
                tenant=tenant, name="Standard Sales Pipeline",
                defaults={'description': "Default 4-stage sales process"}
            )

            self.stdout.write("Generating Contacts, Deals, Tickets, and Activities...")
            
            # 5. Contacts & Related Records
            for _ in range(3): # Create 3 contacts per tenant
                fname = random.choice(first_names)
                lname = random.choice(last_names)
                
                contact = Contact.objects.create(
                    tenant=tenant,
                    assigned_to=first_user,
                    first_name=fname,
                    last_name=lname,
                    email=f"{fname.lower()}.{lname.lower()}@example.com",
                    phone=f"555-01{random.randint(10, 99)}",
                    company=random.choice(companies),
                    tags=["Enterprise", "Q4 Prospect", "Hot Lead"][:random.randint(1, 3)]
                )

                # 6. Activities (Timeline)
                for _ in range(2):
                    Activity.objects.create(
                        tenant=tenant, contact=contact, author=first_user,
                        activity_type=random.choice(['call', 'email', 'meeting', 'note']),
                        description=f"Discussed requirements for the upcoming {random.choice(['quarter', 'project', 'migration'])}."
                    )

                # 7. Deals
                Deal.objects.create(
                    tenant=tenant, pipeline=pipeline, contact=contact, assigned_to=first_user,
                    title=f"{contact.company} - {random.choice(deal_titles)}",
                    amount=random.randint(1000, 50000),
                    stage=random.choice(['Lead', 'Qualified', 'Proposal', 'Won']),
                    probability=random.choice([10, 25, 50, 75, 90])
                )

                # 8. Tickets & Ticket Notes
                ticket = Ticket.objects.create(
                    tenant=tenant, contact=contact, assigned_to=first_user,
                    subject=random.choice(ticket_subjects),
                    description="Customer reported this issue earlier today. Needs urgent review.",
                    status=random.choice(['Open', 'Pending', 'Resolved']),
                    priority=random.choice(['Low', 'Medium', 'High', 'Urgent'])
                )
                
                TicketNote.objects.create(
                    tenant=tenant, ticket=ticket, author=first_user,
                    body="Investigating the logs now. I will update the client shortly.",
                    is_internal=True
                )

            # 9. Calendar Events
            Event.objects.create(
                tenant=tenant, assigned_to=first_user,
                title="Q3 Strategy Planning", category="Meeting",
                start_time=timezone.now() + timedelta(days=1),
                end_time=timezone.now() + timedelta(days=1, hours=2)
            )

            # 10. Login Activity Logs (Security)
            LoginActivity.objects.create(
                user=first_user,
                ip_address=f"192.168.1.{random.randint(1, 255)}",
                user_agent=random.choice(user_agents),
                status="Success"
            )
            LoginActivity.objects.create(
                user=first_user,
                ip_address=f"203.0.113.{random.randint(1, 255)}",
                user_agent="Unknown Script/1.0",
                status="Failed"
            )

            # 11. In-App Notifications
            Notification.objects.create(
                tenant=tenant, user=first_user,
                title="New Deal Assigned",
                message="You have been assigned to the 'Globex SLA' deal.",
                link="/deals",
                is_read=False
            )

            # 12. Outstanding Invitations
            Invitation.objects.create(
                tenant=tenant,
                email=f"new.hire.{random.randint(1,99)}@example.com",
                role="SALES",
                accepted=False
            )

            self.stdout.write(self.style.SUCCESS(f"✔ Successfully populated data for {tenant.name}"))

        self.stdout.write(self.style.SUCCESS("\n🎉 Database seeding complete! You can now log in and test everything."))