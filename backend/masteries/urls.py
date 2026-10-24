from django.urls import path
from . import views
from .views import ForkMasteryView
from .views_generate import GenerateView

urlpatterns = [
    path("generate/", GenerateView.as_view()),
    path("", views.MasteryViewSet.as_view()),
    path("<uuid:pk>/", views.MasteryViewSet.as_view()),
    path("<uuid:pk>/modules/", views.AddModuleView.as_view()),
    path("<uuid:pk>/reorder/", views.ReorderModulesView.as_view()),
    path("<uuid:pk>/fork/", ForkMasteryView.as_view()),
]
