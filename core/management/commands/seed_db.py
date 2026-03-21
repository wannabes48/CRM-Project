import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import transaction

from core.models import (
    Tenant, Subscription, Role, Contact, Pipeline, 
    Deal, Ticket, Activity, TicketNote, Event
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with sample CRM data and backfills missing subscriptions.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write("Starting database seeding process...")

        tenants = Tenant.objects.all()
        if not tenants.exists():
            self.stdout.write(self.style.ERROR("No workspaces (Tenants) found. Please register an account via the UI first!"))
            return

        # Sample data pools for realistic generation
        first_names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Quinn"]
        last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]
        companies = ["Acme Corp", "Globex", "Initech", "Soylent", "Massive Dynamic", "Stark Ind."]
        deal_titles = ["Q3 Software License", "Enterprise SLA Upgrade", "Consulting Retainer", "Hardware Bulk Order"]
        ticket_subjects = ["Cannot login to portal", "Billing issue on last invoice", "Feature request: Dark Mode", "API rate limit exceeded"]

        for tenant in tenants:
            self.stdout.write(f"\n--- Processing Workspace: {tenant.name} ---")

            # 1. Backfill Subscription
            sub, created = Subscription.objects.get_or_create(
                tenant=tenant,
                defaults={
                    'status': 'trialing',
                    'plan_tier': 'Free',
                    'current_period_end': timezone.now() + timedelta(days=14)
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"✔ Created Free Trial Subscription for {tenant.name}"))

            # 2. Create standard Roles
            admin_role, _ = Role.objects.get_or_create(tenant=tenant, name="Admin", defaults={'description': "Full system access"})
            sales_role, _ = Role.objects.get_or_create(tenant=tenant, name="Sales Rep", defaults={'description': "Can manage deals and contacts"})
            
            # Ensure the first user is assigned the Admin role
            first_user = User.objects.filter(tenant=tenant).first()
            if first_user and not first_user.role:
                first_user.role = admin_role
                first_user.save()
                self.stdout.write(self.style.SUCCESS(f"✔ Assigned Admin role to user {first_user.email}"))

            if not first_user:
                self.stdout.write(self.style.WARNING(f"⚠ No users found in {tenant.name}. Skipping data generation for this workspace."))
                continue

            # 3. Create a Sales Pipeline
            pipeline, _ = Pipeline.objects.get_or_create(
                tenant=tenant, 
                name="Standard Sales Pipeline",
                defaults={'description': "Default 4-stage sales process"}
            )

            # 4. Generate Contacts & Related Data
            self.stdout.write("Generating Contacts, Deals, Tickets, and Activities...")
            
            for i in range(5): # Generate 5 sample contacts per tenant
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

                # Add 1-3 Activities to the timeline
                for _ in range(random.randint(1, 3)):
                    Activity.objects.create(
                        tenant=tenant,
                        contact=contact,
                        author=first_user,
                        activity_type=random.choice(['call', 'email', 'meeting', 'note']),
                        description=f"Discussed requirements for the upcoming {random.choice(['quarter', 'project', 'migration'])}."
                    )

                # Add a Deal 70% of the time
                if random.random() > 0.3:
                    Deal.objects.create(
                        tenant=tenant,
                        pipeline=pipeline,
                        contact=contact,
                        assigned_to=first_user,
                        title=f"{contact.company} - {random.choice(deal_titles)}",
                        amount=random.randint(1000, 50000),
                        stage=random.choice(['Lead', 'Qualified', 'Proposal', 'Won']),
                        probability=random.choice([10, 25, 50, 75, 90])
                    )

                # Add a Ticket 50% of the time
                if random.random() > 0.5:
                    ticket = Ticket.objects.create(
                        tenant=tenant,
                        contact=contact,
                        assigned_to=first_user,
                        subject=random.choice(ticket_subjects),
                        description="Customer reported this issue earlier today. Needs urgent review.",
                        status=random.choice(['Open', 'Pending', 'Resolved']),
                        priority=random.choice(['Low', 'Medium', 'High'])
                    )
                    # Add a note to the ticket
                    TicketNote.objects.create(
                        tenant=tenant,
                        ticket=ticket,
                        author=first_user,
                        body="I have reached out to the engineering team for an ETA.",
                        is_internal=True
                    )

            # 5. Create some Calendar Events
            Event.objects.create(
                tenant=tenant,
                assigned_to=first_user,
                title="Q3 Strategy Planning",
                start_time=timezone.now() + timedelta(days=1),
                end_time=timezone.now() + timedelta(days=1, hours=2),
                category="Meeting"
            )

            self.stdout.write(self.style.SUCCESS(f"✔ Successfully populated data for {tenant.name}"))

        self.stdout.write(self.style.SUCCESS("\n🎉 Database seeding complete!"))