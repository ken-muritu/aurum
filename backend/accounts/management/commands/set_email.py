from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Backfill a user's email (for accounts created before email was required)."

    def add_arguments(self, parser):
        parser.add_argument("username", help="Username to update")
        parser.add_argument("email", help="Email to set")

    def handle(self, *args, **opts):
        try:
            u = User.objects.get(username=opts["username"])
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"User '{opts['username']}' not found"))
            return
        u.email = opts["email"]
        u.save()
        self.stdout.write(self.style.SUCCESS(f"Set email for {u.username} -> {u.email}"))
