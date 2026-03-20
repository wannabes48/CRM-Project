from django.db.models import Sum, Count, Q
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db import transaction

from .models import Tenant, CustomUser, Contact, Deal, Ticket
from .serializers import ContactSerializer, DealSerializer, TicketSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# --- Explicit, Secure ViewSets ---
class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(tenant=self.request.user.tenant).order_by('-created_at')

class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Deal.objects.filter(tenant=self.request.user.tenant).order_by('-created_at')

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(tenant=self.request.user.tenant).order_by('-created_at')

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