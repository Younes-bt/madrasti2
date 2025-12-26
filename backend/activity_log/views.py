from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateTimeFilter

from .models import ActivityLog
from .serializers import ActivityLogSerializer


class IsAdminOrStaff(permissions.BasePermission):
    """
    Restrict activity logs to admins and staff roles.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['ADMIN', 'STAFF']


class ActivityLogFilter(FilterSet):
    start = DateTimeFilter(field_name='created_at', lookup_expr='gte')
    end = DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = ActivityLog
        fields = ['action', 'actor', 'actor_role', 'target_app', 'target_model']


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all().order_by('-created_at')
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAdminOrStaff]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ActivityLogFilter
    search_fields = ['description', 'target_repr', 'actor__full_name', 'actor__email']
    ordering_fields = ['created_at', 'actor_role', 'action']
    ordering = ['-created_at']
