from rest_framework import serializers

from users.models import User
from .models import ActivityLog


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role']


class ActivityLogSerializer(serializers.ModelSerializer):
    actor = ActorSerializer(read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            'id',
            'actor',
            'actor_role',
            'action',
            'description',
            'target_app',
            'target_model',
            'target_id',
            'target_repr',
            'metadata',
            'ip_address',
            'user_agent',
            'created_at',
        ]
