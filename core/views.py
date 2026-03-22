import stripe
import csv
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from rest_framework.response import Response

from django.db.models import Sum, Count, Q, Avg
from django.db.models.functions import TruncMonth
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from .emails import send_welcome_email

from .models import Tenant, CustomUser, Contact, Deal, Ticket, Subscription, LoginActivity, Notification
from .serializers import (
    ContactSerializer, DealSerializer, TicketSerializer, 
    EventSerializer, TicketNoteSerializer, LoginActivitySerializer,
    NotificationSerializer
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework import generics
from django.contrib.auth import update_session_auth_hash, get_user_model
from .serializers import UserProfileSerializer, TenantSettingsSerializer
from .permissions import HasActiveSubscription

stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY')
User = get_user_model()

# --- Explicit, Secure ViewSets ---
class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated, HasActiveSubscription]

    def get_queryset(self):
        user = self.request.user
        tenant = user.tenant
        qs = Contact.objects.filter(tenant=tenant).count()

        return Contact.objects.filter(tenant=self.request.user.tenant).order_by('-created_at')
        
        # --- THE DETECTIVE WORK ---
        print(f"🕵️ WHO IS ASKING? User: {user.username} | Workspace: {tenant.name} | Contacts Found: {count}")
    
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, assigned_to=self.request.user)

class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated, HasActiveSubscription]

    def get_queryset(self):
        user = self.request.user
        qs = Deal.objects.filter(tenant=user.tenant)
        # RBAC: Sales Reps only see their own deals
        if user.role == 'Sales Rep':
            qs = qs.filter(assigned_to=user)
        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, assigned_to=self.request.user)

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Ticket.objects.filter(tenant=user.tenant)
        # RBAC: Sales Reps only see their own tickets
        if user.role == 'Sales Rep':
            qs = qs.filter(assigned_to=user)
        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, assigned_to=self.request.user)

class TicketNoteViewSet(viewsets.ModelViewSet):
    serializer_class = TicketNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TicketNote.objects.filter(tenant=user.tenant).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, author=self.request.user)

# --- Custom Auth & JWT Views ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        # Let SimpleJWT generate the default token
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email

        # THE FIX: Extract the string value from the ForeignKey objects!
        if hasattr(user, 'role') and user.role:
            token['role'] = user.role.name
        else:
            token['role'] = 'No Role'
        
        # Add the tenant details for frontend use
        if hasattr(user, 'tenant') and user.tenant:
            token['tenant_id'] = str(user.tenant.id)
            token['tenant_name'] = user.tenant.name
        else:
            token['tenant_id'] = None
            token['tenant_name'] = None
            
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # If we reach this line, authentication was successful! Let's log it.
        request = self.context.get('request')
        if request and self.user:
            # Get the real IP address (handles reverse proxies like Nginx)
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            
            # Get the device/browser info
            user_agent = request.META.get('HTTP_USER_AGENT', '')[:255]

            # Save the log
            LoginActivity.objects.create(
                user=self.user,
                ip_address=ip,
                user_agent=user_agent,
                status='Success'
            )
            
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LoginActivityListView(generics.ListAPIView):
    serializer_class = LoginActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return the 20 most recent logs for the currently logged-in user
        return LoginActivity.objects.filter(user=self.request.user)[:20]

# --- Registration & Dashboard Views ---
@api_view(['POST'])
@permission_classes([AllowAny])
def register_tenant(request):
    data = request.data

    try:
        tenant = Tenant.objects.create(name=data['tenantName'])
        
        # 2. Create the User and assign the tenant immediately 
        # (If we don't pass tenant=tenant here, the new TenantAwareModel will crash!)
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            tenant=tenant 
        )

        # 3. Initialize their Subscription state
        # We start them as 'trialing' on the Free tier so they can access the dashboard
        Subscription.objects.create(
            tenant=tenant,
            status='trialing',
            plan_tier='Free'
        )

        # 4. Fire off the welcome email
        send_welcome_email(user, tenant)
        
        return Response({'message': 'Workspace created successfully.'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("🚨 REGISTRATION CRASHED:", str(e))
        return Response({'error': 'Internal Server Error. Check terminal.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    tenant = request.user.tenant

    won_deals = Deal.objects.filter(tenant=tenant, stage='Won')
    net_revenue = won_deals.aggregate(total=Sum('amount'))['total'] or 0
    new_orders = won_deals.count()
    arr = float(net_revenue) * 1.2 

    stage_aggregates = Deal.objects.filter(tenant=tenant).values('stage').annotate(total=Sum('amount'))
    color_map = {
        'Won': '#B2FF4D', 'Proposal': '#FFFFFF', 'Qualified': '#8A8A8E', 'Lead': '#3f3f46', 'Lost': '#ef4444'
    }
    
    sales_data = [{'name': s['stage'], 'value': float(s['total']), 'color': color_map.get(s['stage'], '#FFFFFF')} for s in stage_aggregates if s['total']]

    top_contacts = Contact.objects.filter(tenant=tenant).annotate(
        deals_count=Count('deals'),
        total_value=Sum('deals__amount', filter=Q(deals__stage='Won'))
    ).order_by('-total_value')[:5]

    avatar_colors = ['bg-purple-500', 'bg-orange-400', 'bg-green-500', 'bg-blue-500', 'bg-pink-500']
    customers_data = [{
        'id': str(c.id), 'name': f"{c.first_name} {c.last_name}", 'email': c.email,
        'deals': c.deals_count, 'value': float(c.total_value or 0), 'color': avatar_colors[i % len(avatar_colors)]
    } for i, c in enumerate(top_contacts)]

    return Response({
        'kpis': {'net_revenue': float(net_revenue), 'arr': float(arr), 'new_orders': new_orders},
        'sales_overview': sales_data,
        'customers': customers_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def global_search(request):
    query = request.GET.get('q', '').strip()
    if len(query) < 2:
        return Response([]) # Don't search for single letters

    tenant = request.user.tenant
    results = []

    # 1. Search Contacts (by name, email, or company)
    contacts = Contact.objects.filter(
        Q(tenant=tenant) & (
            Q(first_name__icontains=query) | 
            Q(last_name__icontains=query) | 
            Q(email__icontains=query) |
            Q(company__icontains=query)
        )
    )[:5] # Limit to top 5 matches per category for speed

    for c in contacts:
        results.append({
            'id': str(c.id),
            'type': 'Contact',
            'title': f"{c.first_name} {c.last_name}",
            'subtitle': c.company or c.email,
            'url': f"/contacts/{c.id}"
        })

    # 2. Search Deals (by title)
    deals = Deal.objects.filter(tenant=tenant, title__icontains=query)[:5]
    for d in deals:
        results.append({
            'id': str(d.id),
            'type': 'Deal',
            'title': d.title,
            'subtitle': f"${d.amount} - {d.stage}",
            'url': f"/deals/{d.id}" # Or wherever your deal modal lives
        })

    # 3. Search Tickets (by subject)
    tickets = Ticket.objects.filter(tenant=tenant, subject__icontains=query)[:5]
    for t in tickets:
        results.append({
            'id': str(t.id),
            'type': 'Ticket',
            'title': t.subject,
            'subtitle': f"Status: {t.status}",
            'url': f"/tickets/{t.id}"
        })

    return Response(results)

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, assigned_to=self.request.user)

# --- User & Workspace Settings Endpoints ---
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user # Always return the currently logged-in user

class TenantSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = TenantSettingsSerializer
    permission_classes = [IsAuthenticated, HasActiveSubscription]

    def get_object(self):
        return self.request.user.tenant # Always return the user's specific workspace

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not user.check_password(old_password):
        return Response({'error': 'Incorrect current password.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user) # Prevents the user from being logged out after password change
    
    return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)

# 1. CREATE CHECKOUT SESSION
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    try :
        tenant = request.user.tenant
    
         # In a real app, you get these Price IDs from your Stripe Dashboard
        price_id = 'price_1TD78FF640qNaOCiXDlN4KUk' # Replace with your actual Stripe Price ID
    
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {'price': price_id, 'quantity': 1},
            ],
            mode='subscription',
            success_url='http://localhost:5173/dashboard?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:5173/pricing',
            client_reference_id=str(tenant.id),
            customer_email=request.user.email,
        )
        return Response({'url': checkout_session.url})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# 2. HANDLE STRIPE WEBHOOKS
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except ValueError:
        return HttpResponse(status=400) # Invalid payload
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400) # Invalid signature

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # 1. Get the tenant ID we passed in earlier
        tenant_id = session.get('client_reference_id')
        stripe_customer_id = session.get('customer')
        stripe_subscription_id = session.get('subscription')
        
        # 2. Update the database to unlock the software
        if tenant_id:
            tenant, created = Tenant.objects.get_or_create(id=tenant_id)
            tenant.stripe_customer_id = stripe_customer_id
            tenant.stripe_subscription_id = stripe_subscription_id
            tenant.subscription_status = 'active'
            tenant.plan_tier = 'Professional'
            tenant.save()

    # Handle failed payments or cancellations
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        try:
            tenant = Tenant.objects.get(stripe_subscription_id=subscription.id)
            tenant.subscription_status = 'canceled'
            tenant.save()
        except Tenant.DoesNotExist:
            pass

    return HttpResponse(status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_customer_portal_session(request):
    tenant = request.user.tenant
    
    # If they haven't bought anything yet, they don't have a portal
    if not tenant.stripe_customer_id:
        return Response({'error': 'No active billing account found.'}, status=400)

    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=tenant.stripe_customer_id,
            return_url='http://localhost:5173/settings', # Sends them back to your app when they click "Return"
        )
        return Response({'url': portal_session.url})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_subscription_status(request):
    try:
        tenant = request.user.tenant
        
        # Determine if they have access to premium features
        is_active = tenant.subscription_status in ['active', 'trialing']

        return Response({
            'plan_tier': tenant.plan_tier,               # e.g., 'Free', 'Professional', 'Enterprise'
            'subscription_status': tenant.subscription_status, # e.g., 'active', 'canceled', 'past_due'
            'is_active': is_active,                      # A helpful boolean for your React frontend
        })
    except Exception as e:
        return Response({'error': 'Could not fetch subscription details.'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # Add your HasActiveSubscription here if desired!
def analytics_dashboard(request):
    tenant = request.user.tenant
    
    # 1. Calculate Active Contacts
    contacts_count = Contact.objects.filter(tenant=tenant).count()
    
    # 2. Calculate Deal Metrics
    deals = Deal.objects.filter(tenant=tenant)
    total_deals = deals.count()
    
    # We only count revenue from deals marked as 'Won'
    won_deals = deals.filter(stage='Won')
    won_count = won_deals.count()
    
    avg_deal_size = deals.aggregate(Avg('amount'))['amount__avg'] or 0
    win_ratio = int((won_count / total_deals * 100)) if total_deals > 0 else 0
    
    # 3. Calculate Monthly Revenue for the Bar Chart
    monthly_revenue = (
        won_deals.annotate(month_trunc=TruncMonth('created_at'))
        .values('month_trunc')
        .annotate(revenue=Sum('amount'))
        .order_by('month_trunc')
    )
    
    chart_data = [
        {
            "month": item['month_trunc'].strftime('%b'), # Formats date to 'Jan', 'Feb', etc.
            "revenue": float(item['revenue'])
        } 
        for item in monthly_revenue
    ]

    # Fallback if they have no won deals yet
    if not chart_data:
        chart_data = [{"month": "No Data", "revenue": 0}]
    
    return Response({
        "kpis": {
            "avg_deal_size": f"${avg_deal_size:,.0f}",
            "win_ratio": f"{win_ratio}%",
            "active_contacts": f"{contacts_count:,}",
            "total_won": won_count
        },
        "chart_data": chart_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # Add HasActiveSubscription if you want to gate this feature!
def export_contacts_csv(request):
    # 1. Set up the HTTP response to tell the browser "This is a downloadable file"
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="contacts_export.csv"'

    # 2. Create a CSV writer attached to the response
    writer = csv.writer(response)
    
    # 3. Write the Header Row
    writer.writerow(['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Tags', 'Date Added'])

    # 4. Fetch the data for this specific tenant
    contacts = Contact.objects.filter(tenant=request.user.tenant).order_by('-created_at')

    # 5. Loop through and write each row
    for contact in contacts:
        # Join the JSON array of tags into a single comma-separated string
        tags_string = ", ".join(contact.tags) if isinstance(contact.tags, list) else ""
        
        writer.writerow([
            contact.first_name,
            contact.last_name,
            contact.email or "",
            contact.phone or "",
            contact.company or "",
            tags_string,
            contact.created_at.strftime('%Y-%m-%d %H:%M') # Format the date nicely
        ])

    return response

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-is_read', '-created_at')

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'notifications marked as read'})