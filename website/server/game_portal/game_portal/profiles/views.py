from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import authentication, permissions

from rest_framework_api_key.permissions import HasAPIKey
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import ProfileSerializer, ProfileTokenObtainPairSerializer
from .models import Profile


class ProfileTokenObtainPairView(TokenObtainPairView):
    serializer_class = ProfileTokenObtainPairSerializer


class ProfileResultSetPagination(PageNumberPagination):
    page_size = 15
    max_page_size = 15
    page_size_query_param = "page_size"


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [HasAPIKey]
    http_method_names = ["get"]
    pagination_class = ProfileResultSetPagination


class ProfileServiceView(APIView):
    http_method_names = ["get"]

    def get(self, request, format=None):
        if request.user.is_anonymous:
            return Response()
        profile = Profile.objects.get(user=request.user)
        return Response(ProfileSerializer(profile, context={"request": request}).data)
