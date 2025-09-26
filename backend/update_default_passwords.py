import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
default_password = 'defaultStrongPassword25'

# Find users with default password and update them
users_updated = 0
for user in User.objects.all():
    if user.check_password(default_password):
        user.force_password_change = True
        user.save()
        users_updated += 1
        print(f"Updated user: {user.email}")

print(f"Total users updated: {users_updated}")