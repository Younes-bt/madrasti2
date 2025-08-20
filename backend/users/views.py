# backend/users/views.py

from rest_framework import generics, status # Add status import
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response # Add Response import
from rest_framework.views import APIView # Add APIView import
from django.contrib.auth import authenticate # Add authenticate import

from .models import User
from .serializers import UserRegisterSerializer, UserProfileSerializer, MyTokenObtainPairSerializer

# The RegisterView and ProfileView remain the same
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


# Add this NEW LoginView
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Please provide both email and password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use Django's built-in authentication
        user = authenticate(request, email=email, password=password)

        if user:
            # If authentication is successful, use our serializer to get tokens
            serializer = MyTokenObtainPairSerializer.get_token(user)
            refresh = str(serializer)
            access = str(serializer.access_token)

            return Response(
                {
                    "refresh": refresh,
                    "access": access,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Invalid Credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )