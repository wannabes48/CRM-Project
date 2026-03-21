import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from rest_framework.response import Response

from django.db.models import Sum, Count, Q
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from .emails import send_welcome_email

from .models import Tenant, CustomUser, Contact, Deal, Ticket
from .serializers import ContactSerializer, DealSerializer, TicketSerializer, EventSerializer, TicketNoteSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework import generics
from django.contrib.auth import update_session_auth_hash
from .serializers import UserProfileSerializer, TenantSettingsSerializer

stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', 'sk_test_your_key_here')

# --- Explicit, Secure ViewSets ---
class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['tenant_name'] = user.tenant.name if user.tenant else None
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# --- Registration & Dashboard Views ---
@api_view(['POST'])
@permission_classes([AllowAny])
def register_tenant(request):
    data = request.data
    tenant_name, username, email, password = data.get('tenantName'), data.get('username'), data.get('email'), data.get('password')

    if not all([tenant_name, username, email, password]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(username=username).exists():
        return Response({'error': 'Username is already taken'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            tenant = Tenant.objects.create(name=tenant_name)
            user = CustomUser.objects.create_user(
                username=username, email=email, password=password, tenant=tenant, role='Admin'
            )

            send_welcome_email(user, tenant)

        return Response({'message': 'Workspace created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    query = request.query_params.get('q', '').strip()
    
    # If the search is empty, return empty lists to save database power
    if not query:
        return Response({'contacts': [], 'deals': [], 'tickets': []})

    tenant = request.user.tenant

    # 1. Search Contacts (by name, email, or company)
    contacts = Contact.objects.filter(
        Q(tenant=tenant) & (
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query) |
            Q(company__icontains=query)
        )
    )[:5] # Limit to top 5 results to keep the UI clean

    # 2. Search Deals (by title)
    deals = Deal.objects.filter(
        Q(tenant=tenant) & Q(title__icontains=query)
    )[:5]

    # 3. Search Tickets (by subject)
    tickets = Ticket.objects.filter(
        Q(tenant=tenant) & Q(subject__icontains=query)
    )[:5]

    # Format the response so the frontend can easily display it
    return Response({
        'contacts': [{'id': str(c.id), 'name': f"{c.first_name} {c.last_name}", 'desc': c.email} for c in contacts],
        'deals': [{'id': str(d.id), 'name': d.title, 'desc': f"${d.amount} • {d.stage}"} for d in deals],
        'tickets': [{'id': str(t.id), 'name': t.subject, 'desc': f"{t.status} • {t.priority}"} for t in tickets],
    })

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
    permission_classes = [IsAuthenticated]

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
    tenant = request.user.tenant
    
    # In a real app, you get these Price IDs from your Stripe Dashboard
    price_id = 'price_1TD78FF640qNaOCiXDlN4KUk' # Replace with your actual Stripe Price ID
    
    try:
        checkout_session = stripe.checkout.Session.create(
            client_reference_id=str(tenant.id), # Crucial: Tells the webhook WHICH tenant paid
            customer_email=request.user.email,
            payment_method_types=['card'],
            line_items=[
                {'price': price_id, 'quantity': 1},
            ],
            mode='subscription',
            success_url='http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:5173/pricing',
        )
        return Response({'url': checkout_session.url})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# 2. HANDLE STRIPE WEBHOOKS
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    webhook_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', 'whsec_your_secret_here')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except ValueError:
        return HttpResponse(status=400) # Invalid payload
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400) # Invalid signature

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # 1. Get the tenant ID we passed in earlier
        tenant_id = session.get('client_reference_id')
        
        # 2. Update the database to unlock the software
        if tenant_id:
            tenant = Tenant.objects.get(id=tenant_id)
            tenant.stripe_customer_id = session.get('customer')
            tenant.stripe_subscription_id = session.get('subscription')
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