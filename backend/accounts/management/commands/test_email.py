from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = "Send a test email via Brevo to diagnose password-reset email delivery."

    def add_arguments(self, parser):
        parser.add_argument("email", help="Recipient email to send the test to")

    def handle(self, *args, **opts):
        email = opts["email"].strip()
        self.stdout.write(f"BREVO_API_KEY set: {bool(getattr(settings, 'BREVO_API_KEY', ''))}")
        self.stdout.write(f"BREVO_FROM: {getattr(settings, 'BREVO_FROM', '')}")
        from accounts.brevo_email import send_brevo_email
        ok, err = send_brevo_email(
            email,
            "Aurum Brevo test",
            "<p>This is a test email from Aurum via Brevo.</p>",
        )
        if ok:
            self.stdout.write(self.style.SUCCESS(f"SUCCESS: test email sent to {email}"))
        else:
            self.stdout.write(self.style.ERROR(f"FAILED: {err}"))
