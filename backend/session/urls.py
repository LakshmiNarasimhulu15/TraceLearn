from django.urls import path
from .views import SessionListView, SessionSummaryListView ,SessionDetailView

urlpatterns = [
    path("history/", SessionSummaryListView.as_view()),  
    path("full-history/", SessionListView.as_view()), 
    path("full-history/<int:pk>/", SessionDetailView.as_view(), name="session-detail"),  
]