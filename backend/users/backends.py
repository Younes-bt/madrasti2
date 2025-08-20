# backend/users/backends.py

from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        print("\n--- [DEBUG] AUTHENTICATION ATTEMPT STARTED ---")
        
        if not email:
            print("--- [DEBUG] FAILED: No email provided in authenticate call.")
            return None

        # Print the received email to check for hidden characters/whitespace
        print(f"--- [DEBUG] 1. Received email for authentication: {repr(email)}")

        # Try to query the database with the exact email received
        try:
            print(f"--- [DEBUG] 2. Querying database for user with email: {repr(email)}")
            user = UserModel.objects.get(email=email)
            print("--- [DEBUG] 3. SUCCESS: User found in database.")
            
            # If user is found, check password
            if user.check_password(password):
                print("--- [DEBUG] 4. SUCCESS: Password check passed.")
                print("--- [DEBUG] AUTHENTICATION SUCCEEDED ---\n")
                return user
            else:
                print("--- [DEBUG] 4. FAILED: Password check failed for this user.")
                print("--- [DEBUG] AUTHENTICATION FAILED ---\n")
                return None

        except UserModel.DoesNotExist:
            print("--- [DEBUG] 3. FAILED: UserModel.DoesNotExist was raised. User not found with that exact email.")
            
            # If the lookup fails, let's see what's actually in the database
            all_users = UserModel.objects.all()
            all_emails = [u.email for u in all_users]
            print("--- [DEBUG] 4. INFO: Here are all the emails currently in the database:")
            for db_email in all_emails:
                print(f"    - {repr(db_email)}")
            
            print("--- [DEBUG] AUTHENTICATION FAILED ---\n")
            return None

    def get_user(self, user_id):
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None