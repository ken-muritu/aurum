from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Delete a user by email or username (cascades token/profile/masteries/progress/notes)."

    def add_arguments(self, parser):
        parser.add_argument("identifier", help="Email or username of the user to delete")
        parser.add_argument("--yes", action="store_true", help="Skip confirmation prompt")

    def handle(self, *args, **opts):
        ident = opts["identifier"].strip()
        qs = User.objects.filter(email__iexact=ident) | User.objects.filter(username__iexact=ident)
        qs = qs.distinct()
        matches = list(qs.values_list("id", "username", "email"))
        if not matches:
            self.stdout.write(self.style.WARNING(f"No user found matching '{ident}'."))
            return
        self.stdout.write("Matched:")
        for uid, uname, email in matches:
            self.stdout.write(f"  id={uid} username={uname!r} email={email!r}")
        if not opts["yes"]:
            ans = input(f"Delete {len(matches)} user(s)? [y/N] ").strip().lower()
            if ans not in ("y", "yes"):
                self.stdout.write("Aborted.")
                return
        deleted = qs.delete()
        self.stdout.write(self.style.SUCCESS(f"Deleted: {deleted}"))
