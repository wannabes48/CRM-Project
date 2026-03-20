import random
from django.core.management.base import BaseCommand
from faker import Faker
from core.models import Tenant, CustomUser, Contact, Deal, Ticket

class Command(BaseCommand):
    help = 'Seeds the database step-by-step to prevent total rollbacks.'

    def handle(self, *args, **kwargs):
        fake = Faker()
        self.stdout.write('Starting database seed for ACME CORP...')

        # 1. Create or Get the Workspace
        tenant, _ = Tenant.objects.get_or_create(name="ACME CORP")
        
        # 2. Create or Get the Admin User
        admin_user, user_created = CustomUser.objects.get_or_create(
            username="dansiro",
            defaults={'email': 'dansiro@acmecorp.com', 'tenant': tenant, 'role': 'Admin', 'is_staff': True, 'is_superuser': True}
        )
        if user_created:
            admin_user.set_password('5848daniel')
            admin_user.save()

        # 3. Generate Contacts
        contacts = []
        try:
            for _ in range(30):
                c = Contact.objects.create(
                    tenant=tenant, 
                    assigned_to=admin_user, 
                    first_name=fake.first_name(), 
                    last_name=fake.last_name(), 
                    email=fake.company_email(), 
                    phone=fake.phone_number()[:20], # Truncate just in case Faker generates a long extension
                    company=fake.company()
                )
                contacts.append(c)
            self.stdout.write(self.style.SUCCESS(f'Successfully created 30 Contacts.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed during Contacts: {str(e)}'))
            return # Stop here if contacts fail, because Deals need Contacts!

        # 4. Generate Deals
        try:
            stages = ['Lead', 'Qualified', 'Proposal', 'Won', 'Lost']
            for _ in range(50):
                Deal.objects.create(
                    tenant=tenant, 
                    contact=random.choice(contacts), 
                    assigned_to=admin_user, 
                    title=f"{fake.bs().title()} Deal"[:200], # Prevent too-long titles
                    amount=round(random.uniform(1000.00, 75000.00), 2), 
                    stage=random.choice(stages), 
                    probability=random.choice([10, 25, 50, 75, 90, 100])
                )
            self.stdout.write(self.style.SUCCESS(f'Successfully created 50 Deals.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed during Deals: {str(e)}'))

        # 5. Generate Tickets
        try:
            statuses, priorities = ['Open', 'Pending', 'Resolved'], ['Low', 'Medium', 'High']
            for _ in range(15):
                Ticket.objects.create(
                    tenant=tenant, 
                    contact=random.choice(contacts), 
                    assigned_to=admin_user, 
                    subject=fake.sentence(nb_words=6)[:200], 
                    description=fake.paragraph(nb_sentences=3), 
                    status=random.choice(statuses), 
                    priority=random.choice(priorities)
                )
            self.stdout.write(self.style.SUCCESS(f'Successfully created 15 Tickets.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed during Tickets: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('Seeding Process Complete!'))