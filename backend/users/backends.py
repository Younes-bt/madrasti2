# backend/users/backends.py

from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        
        if not email:
            return None
        try:
            user = UserModel.objects.get(email=email)
            if user.check_password(password):
                return user
            else:
                return None
        except UserModel.DoesNotExist:
            all_users = UserModel.objects.all()
            all_emails = [u.email for u in all_users]
            for db_email in all_emails:
                print(f"    - {repr(db_email)}")
            return None

    def get_user(self, user_id):
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None