from django.urls import path
from .views import (
    SignupView, LoginView, LogoutView, MeView,
    PasswordForgotView, PasswordResetView,
)

urlpatterns = [
    path("signup/", SignupView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", MeView.as_view()),
    path("password/forgot/", PasswordForgotView.as_view()),
    path("password/reset/", PasswordResetView.as_view()),
]
