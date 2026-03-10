from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import CodeSession
from .serializers import CodeSessionSerializer, CodeSessionSummarySerializer


class SessionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CodeSessionSerializer

    def get_queryset(self):
        return CodeSession.objects.filter(user=self.request.user).order_by('-created_at')



class SessionSummaryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CodeSessionSummarySerializer

    def get_queryset(self):
        return CodeSession.objects.filter(user=self.request.user).order_by('-created_at')
    
class SessionDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CodeSessionSerializer
    lookup_url_kwarg = "pk"  

    def get_queryset(self):
        return CodeSession.objects.filter(user=self.request.user)