"""Aurum root URL configuration (Phase 1 API surface — Part 8)."""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/masteries/", include("masteries.urls")),
    path("api/modules/", include("masteries.urls_modules")),
    path("api/lessons/", include("progress.urls")),
    path("api/discover/", include("masteries.urls_discover")),
    path("api/youtube/", include("youtube.urls")),
    path("api/dashboard/", include("progress.urls_dashboard")),
]
