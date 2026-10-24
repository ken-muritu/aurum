from django.contrib.auth.models import User
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

FORGOT = "/api/auth/password/forgot/"


@override_settings(BREVO_API_KEY="")
class PasswordForgotTests(TestCase):
    """The forgot-password endpoint must never leak a reset token in production."""

    def setUp(self):
        self.client = APIClient()
        User.objects.create_user("amina", email="amina@example.com", password="x-secret-123")
        User.objects.create_user("noemail", email="", password="x-secret-123")

    @override_settings(DEBUG=False)
    def test_production_never_returns_token(self):
        for ident in ("amina", "amina@example.com"):
            r = self.client.post(FORGOT, {"identifier": ident}, format="json")
            self.assertEqual(r.status_code, 200)
            self.assertNotIn("token", r.json())
            self.assertNotIn("reset_link", r.json())

    @override_settings(DEBUG=False)
    def test_production_responses_do_not_reveal_accounts(self):
        known = self.client.post(FORGOT, {"identifier": "amina"}, format="json")
        unknown = self.client.post(FORGOT, {"identifier": "nobody"}, format="json")
        no_email = self.client.post(FORGOT, {"identifier": "noemail"}, format="json")
        self.assertEqual(known.json(), unknown.json())
        self.assertEqual(no_email.status_code, 200)
        self.assertEqual(no_email.json(), unknown.json())

    @override_settings(DEBUG=True)
    def test_debug_returns_link_for_local_testing(self):
        r = self.client.post(FORGOT, {"identifier": "amina"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertIn("token", r.json())
