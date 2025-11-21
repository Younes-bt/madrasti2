from rest_framework import serializers
from .models import Conversation, Message, Announcement
from users.serializers import UserBasicSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    sender_profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_name', 'sender_profile_picture', 'content', 'attachment', 'is_read', 'created_at']
        read_only_fields = ['sender', 'is_read', 'created_at']

    def get_sender_profile_picture(self, obj):
        try:
            if obj.sender.profile.profile_picture:
                return obj.sender.profile.profile_picture.url
        except:
            pass
        return None

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserBasicSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'conversation_type', 'related_student', 'created_at', 'updated_at', 'last_message', 'unread_count']

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        # print(f"DEBUG: Conv {obj.id} Participants: {[p.email for p in obj.participants.all()]} Last Msg: {last_msg.content if last_msg else 'None'}")
        if last_msg:
            return MessageSerializer(last_msg).data
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0

class AnnouncementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'target_role', 'target_grade', 'is_published', 'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['created_by', 'created_at']
