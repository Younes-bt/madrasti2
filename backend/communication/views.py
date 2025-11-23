from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message, Announcement, Notification
from .serializers import ConversationSerializer, MessageSerializer, AnnouncementSerializer, NotificationSerializer
from users.models import User

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.conversations.all().order_by('-updated_at')

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        conversation = self.get_object()
        # Mark all messages in this conversation as read for this user
        # Logic: Mark messages NOT sent by me as read
        conversation.messages.exclude(sender=request.user).update(is_read=True)
        return Response({'status': 'messages marked as read'})

    @action(detail=False, methods=['post'])
    def start_direct(self, request):
        """Start or get existing direct conversation with a user"""
        other_user_id = request.data.get('user_id')
        if not other_user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.id == other_user.id:
            return Response({'error': 'Cannot start conversation with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if conversation already exists
        # This is a bit complex with M2M, simplified for now
        # We look for a DIRECT conversation where both are participants
        conversations = Conversation.objects.filter(
            conversation_type='DIRECT',
            participants=request.user
        ).filter(participants=other_user)

        if conversations.exists():
            return Response(ConversationSerializer(conversations.first(), context={'request': request}).data)
        
        # Create new
        conversation = Conversation.objects.create(conversation_type='DIRECT')
        conversation.participants.add(request.user, other_user)
        return Response(ConversationSerializer(conversation, context={'request': request}).data)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show messages from conversations the user is part of
        queryset = Message.objects.filter(conversation__participants=self.request.user)
        
        # Filter by specific conversation if provided
        conversation_id = self.request.query_params.get('conversation')
        if conversation_id:
            queryset = queryset.filter(conversation_id=conversation_id)
            
        return queryset

    def perform_create(self, serializer):
        conversation = serializer.validated_data['conversation']
        if self.request.user not in conversation.participants.all():
            raise permissions.PermissionDenied("You are not a participant in this conversation")
        
        serializer.save(sender=self.request.user)
        # Update conversation timestamp
        conversation.save()

class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Announcement.objects.all().order_by('-created_at')
        
        # Filter for other roles
        # 1. Target Role matches OR Target Role is ALL
        # 2. AND (Target Grade matches OR Target Grade is None)
        # Note: Grade filtering needs student/teacher grade context. Simplified for now.
        
        q = Q(target_role='ALL') | Q(target_role=user.role + 'S') # e.g., PARENTS
        return Announcement.objects.filter(q, is_published=True).order_by('-created_at')

    def perform_create(self, serializer):
        if self.request.user.role != 'ADMIN':
            raise permissions.PermissionDenied("Only admins can create announcements")
        serializer.save(created_by=self.request.user)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'count': count})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'status': 'all marked as read'})
