import threading

# Thread-local storage to safely keep the tenant context per request
_thread_locals = threading.local()

def get_current_tenant():
    """Retrieve the tenant from the current thread."""
    return getattr(_thread_locals, 'tenant', None)

class TenantMiddleware:
    """Middleware to attach the user's tenant to the thread-local context."""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # If the user is authenticated, store their tenant
        if hasattr(request, 'user') and request.user.is_authenticated:
            _thread_locals.tenant = request.user.tenant
        else:
            _thread_locals.tenant = None
            
        response = self.get_response(request)
        
        # Cleanup to prevent data leakage between threads
        _thread_locals.tenant = None 
        return response