from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import SignupSerializer, UserSerializer


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from django.contrib.auth.models import User as AuthUser
        username = request.data.get("username")
        if AuthUser.objects.filter(username=username).exists():
            return Response({"detail": "username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        ser = SignupSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = User.objects.filter(username=username).first()
        if user is None or not user.check_password(password):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})


class LogoutView(APIView):
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        logout(request)
        return Response({"detail": "logged out"})


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# ---------------- Password reset (forgot / reset) ----------------
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings


def _password_reset_html(name, link):
    return (
        f'<p>Hi {name},</p>'
        f'<p>We received a request to reset your Aurum password.</p>'
        f'<p><a href="{link}" style="background:#d4a017;color:#0b0d12;'
        f'padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;'
        f'display:inline-block;">Reset password</a></p>'
        f'<p>If you did not request this, ignore this email. The link expires in 1 hour.</p>'
        f'<p style="color:#9aa3b2;font-size:12px;">Aurum — your Knowledge Operating System</p>'
    )


class PasswordForgotView(APIView):
    """Start a reset. Accepts {identifier} (email or username).
    Always returns the same generic 200 in production (no account
    enumeration, no token in the response). If Brevo is configured
    (BREVO_API_KEY + BREVO_FROM), emails a styled reset link. Only when
    DEBUG is on (local development) does the response include uid+token,
    so the flow can be tested without email."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ident = (request.data.get("identifier") or request.data.get("email")
                 or request.data.get("username") or "").strip()
        generic = {"detail": "If an account matches, a reset link has been issued."}
        if not ident:
            return Response(generic)
        user = (User.objects.filter(email__iexact=ident).first()
                or User.objects.filter(username__iexact=ident).first())
        if user is None:
            return Response(generic)
        if not user.email:
            # Account exists but has no email on file. Saying so in production
            # would reveal that the account exists, so only DEBUG explains it.
            if not settings.DEBUG:
                return Response(generic)
            return Response({
                "detail": "This account has no email address on file. Add an email via your profile, or contact support.",
                "email_sent": False,
                "email_status": "account_has_no_email",
            }, status=status.HTTP_400_BAD_REQUEST)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend = getattr(settings, "FRONTEND_URL", "").rstrip("/")
        reset_link = f"{frontend}/reset?uid={uid}&token={token}" if frontend else None

        from .brevo_email import send_brevo_email
        brevo_configured = bool(getattr(settings, "BREVO_API_KEY", ""))
        if brevo_configured and user.email:
            try:
                ok, err = send_brevo_email(
                    user.email,
                    "Reset your Aurum password",
                    _password_reset_html(user.username, reset_link or ""),
                )
                if ok:
                    return Response({**generic, "email_sent": True})
                # Brevo rejected it — log the real reason, then fall back to MVP.
                print("[aurum] Brevo send FAILED:", err)
            except Exception as e:
                print("[aurum] Brevo exception:", repr(e))
        # Never hand out a reset token over the API in production: anyone who
        # knows a username or email could take over that account.
        if not settings.DEBUG:
            if not brevo_configured:
                print("[aurum] Brevo NOT configured (BREVO_API_KEY missing) -> reset email not sent")
            return Response(generic)
        # Local development only: return the link so the flow can be tested.
        return Response({**generic, "uid": uid, "token": token,
                         "reset_link": reset_link, "email_sent": False,
                         "email_status": "brevo_configured_but_failed" if brevo_configured else "no_brevo_key"})


class PasswordResetView(APIView):
    """Complete a reset. Accepts {uid, token, new_password}."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get("uid", "")
        token = request.data.get("token", "")
        new_password = request.data.get("new_password", "")
        if len(new_password) < 4:
            return Response({"detail": "Password must be at least 4 characters."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(pk=force_str(urlsafe_base64_decode(uid)))
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"detail": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Reset link is invalid or has expired."},
                            status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        Token.objects.filter(user=user).delete()  # invalidate old sessions/tokens
        new_token, _ = Token.objects.get_or_create(user=user)
        return Response({"detail": "Password updated.", "token": new_token.key,
                         "user": UserSerializer(user).data})
