from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_welcome_email(user, tenant):
    subject = 'Welcome to Xentrix CRM! 🚀'
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'hello@xentrix.com')
    to_email = [user.email]

    # 1. Prepare the dynamic data for the template
    context = {
        'username': user.username,
        'tenant_name': tenant.name,
        'login_url': 'http://localhost:5173/login', # Swap to your production URL later
    }

    # 2. Render the HTML template with the context data
    html_content = render_to_string('emails/welcome.html', context)
    
    # 3. Create a plain-text version automatically by stripping HTML tags
    text_content = strip_tags(html_content)

    # 4. Construct the email
    msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
    msg.attach_alternative(html_content, "text/html")
    
    # 5. Send it!
    try:
        msg.send()
        return True
    except Exception as e:
        print(f"Error sending welcome email to {user.email}: {e}")
        return False

def send_password_reset_email(user, reset_token):
    subject = 'Reset Your Xentrix Password'
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'security@xentrix.com')
    to_email = [user.email]

    # Create the secure link that points back to your React frontend
    # Example: http://localhost:5173/reset-password/abc123token
    reset_url = f"http://localhost:5173/reset-password/{reset_token}"

    context = {
        'username': user.username,
        'reset_url': reset_url,
    }

    html_content = render_to_string('emails/password_reset.html', context)
    text_content = strip_tags(html_content)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
    msg.attach_alternative(html_content, "text/html")
    
    try:
        msg.send()
        return True
    except Exception as e:
        print(f"Error sending password reset to {user.email}: {e}")
        return False