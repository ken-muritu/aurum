from django.urls import path
from . import views

urlpatterns = [
    path("<uuid:pk>/", views.DeleteModuleView.as_view()),
    path("<uuid:pk>/lessons/", views.AddLessonView.as_view()),
    path("<uuid:pk>/reorder/", views.ReorderLessonsView.as_view()),
]
