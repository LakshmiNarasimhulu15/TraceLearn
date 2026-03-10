from django.urls import path
from .views import ExecuteCodeView, GetExplanationView

urlpatterns = [
    path("run/", ExecuteCodeView.as_view(), name="execute-code"),
    path("explanation/<int:session_id>/", GetExplanationView.as_view(), name="get-explanation"),
]