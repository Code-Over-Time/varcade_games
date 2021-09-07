from rest_framework import viewsets, generics, permissions, mixins
from rest_framework.pagination import PageNumberPagination
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, RegistrationSerializer

from game_portal.profiles.serializers import ProfileTokenObtainPairSerializer


class UserResultSetPagination(PageNumberPagination):
    page_size = 15
    max_page_size = 15
    page_size_query_param = "page_size"


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [HasAPIKey]
    http_method_names = ["get"]
    pagination_class = UserResultSetPagination


class RegistrationView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = ProfileTokenObtainPairSerializer.get_token(user)

        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )
