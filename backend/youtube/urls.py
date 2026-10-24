from django.urls import path
from . import views

urlpatterns = [
    path("search/", views.YouTubeSearchView.as_view()),
    path("video/<str:youtube_video_id>/", views.YouTubeVideoView.as_view()),
]
