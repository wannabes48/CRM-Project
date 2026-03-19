from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Contact, Deal, Ticket
from .serializers import ContactSerializer, DealSerializer, TicketSerializer

class BaseTenantViewSet(viewsets.ModelViewSet):
    """Base ViewSet that automatically assigns the tenant on creation."""
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically attach the tenant from the authenticated user
        serializer.save(tenant=self.request.user.tenant)

class ContactViewSet(BaseTenantViewSet):
    queryset = Contact.objects.all() # The TenantManager automatically filters this!
    serializer_class = ContactSerializer

class DealViewSet(BaseTenantViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer

class TicketViewSet(BaseTenantViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer