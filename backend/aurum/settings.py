"""Aurum backend settings — Phase 1 (dev: SQLite, Token+Session auth, CORS)."""
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

import os

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-insecure-key-change-in-prod-aurum-0001")
DEBUG = os.environ.get("DEBUG", "True").lower() in ("1","true","yes")

# Accept Render-assigned host + any custom domain (e.g. aurum.io). "*" is
# Render's documented allow-all for PaaS dynamic hostnames.
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "accounts",
    "masteries",
    "progress",
    "youtube",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "aurum.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {"context_processors": [
            "django.template.context_processors.debug",
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
        ]},
    },
]

WSGI_APPLICATION = "aurum.wsgi.application"

import dj_database_url  # provided by requirements.txt
DATABASES = {"default": dj_database_url.config(
    default=os.environ.get("DATABASE_URL", f"sqlite:///{BASE_DIR / 'db.sqlite3'}"),
    conn_max_age=600,
)}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS: allow the Vercel frontend (and any custom domain). Driven by env so
# you set AURUM_CORS=https://aurum.vercel.app,https://aurum.io in Render.
CORS_ALLOW_ALL_ORIGINS = os.environ.get("CORS_ALLOW_ALL", "True").lower() == "true"
CORS_ALLOW_CREDENTIALS = True
_CORS_ENV = os.environ.get("AURUM_CORS", "https://aurumio.vercel.app,http://localhost:3000,http://127.0.0.1:3000")
CORS_ALLOWED_ORIGINS = [o.strip() for o in _CORS_ENV.split(",") if o.strip()]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 50,
}


# ---- Password reset / email (Brevo, Caspahub/Solera pattern) ----
# FRONTEND_URL is used to build the reset link (e.g. https://aurumio.vercel.app).
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://aurumio.vercel.app")

# Brevo transactional email via REST API (https://api.brevo.com/v3/smtp/email).
# No SMTP library needed — accounts/brevo_email.py calls the API with `api-key`.
# Sender format: "Aurum <you@yourdomain.com>" (must be a sender verified in Brevo).
BREVO_API_KEY = os.environ.get("BREVO_API_KEY", "")
BREVO_FROM = os.environ.get("BREVO_FROM", "")
BREVO_SENDER_EMAIL = os.environ.get("BREVO_SENDER_EMAIL", "")
DEFAULT_FROM_EMAIL = BREVO_FROM or "Aurum <no-reply@aurum.app>"
# Keep Django's console backend as the no-op default (Brevo is used directly).
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# YouTube Data API v3 key (read-only, server-side). Set in Render env.
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")

# Optional: Phase 2 AI summary enrichment (graceful no-op if unset).
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
