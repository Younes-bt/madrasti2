from typing import Any, Optional

from django.apps import apps
from django.http import HttpRequest

from .models import ActivityLog


def _get_client_ip(request: HttpRequest) -> Optional[str]:
    if not request:
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def log_activity(
    actor=None,
    action: str = ActivityLog.Action.OTHER,
    target: Any = None,
    description: str = '',
    metadata: Optional[dict] = None,
    request: Optional[HttpRequest] = None,
    target_repr: Optional[str] = None,
) -> ActivityLog:
    """
    Convenience helper to persist an ActivityLog entry.
    - actor: User instance
    - action: ActivityLog.Action value
    - target: any Django model instance to capture app/model/id automatically
    - description: human-readable description
    - metadata: optional JSON-serializable dict for extra context
    - request: optional request to capture IP/user-agent
    """
    target_app = target_model = target_id = None

    if target is not None:
        meta = getattr(target, '_meta', None)
        if meta:
            target_app = meta.app_label
            target_model = meta.model_name
            target_id = getattr(target, 'pk', None)
        target_repr = target_repr or str(target)

    return ActivityLog.objects.create(
        actor=actor,
        action=action,
        description=description or '',
        target_app=target_app or '',
        target_model=target_model or '',
        target_id=str(target_id) if target_id is not None else None,
        target_repr=target_repr or '',
        metadata=metadata or {},
        ip_address=_get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', '') if request else '',
    )
