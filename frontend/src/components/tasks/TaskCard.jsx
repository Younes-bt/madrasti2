import { Clock, CheckCircle, Star, AlertCircle, PlayCircle, Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDistanceToNow, isPast, differenceInDays } from 'date-fns';

export function TaskCard({ task, onStatusChange, onView, userRole }) {
  const { t } = useTranslation();
  const {
    id,
    title,
    title_arabic,
    title_french,
    description,
    status,
    priority,
    due_date,
    assigned_to,
    rating,
    user_notes,
  } = task;

  // Get localized title
  const getLocalizedTitle = () => {
    const locale = localStorage.getItem('i18nextLng') || 'en';
    if (locale === 'ar' && title_arabic) return title_arabic;
    if (locale === 'fr' && title_french) return title_french;
    return title;
  };

  // Calculate if overdue
  const dueDate = new Date(due_date);
  const isOverdue = isPast(dueDate) && status !== 'COMPLETE' && status !== 'DONE';
  const daysUntilDue = differenceInDays(dueDate, new Date());

  // Status configuration
  const statusConfig = {
    PENDING: {
      icon: Clock,
      label: t('tasks.status.pending', 'Pending'),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      actionLabel: t('tasks.actions.startTask', 'Start Task'),
      actionIcon: PlayCircle,
      showAction: true,
      actionVariant: 'default',
    },
    IN_PROGRESS: {
      icon: PlayCircle,
      label: t('tasks.status.inProgress', 'In Progress'),
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-300',
      actionLabel: t('tasks.actions.markDone', 'Mark as Done'),
      actionIcon: CheckCircle,
      showAction: true,
      actionVariant: 'default',
    },
    DONE: {
      icon: CheckCircle,
      label: t('tasks.status.done', 'Done'),
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      actionLabel: t('tasks.status.awaitingReview', 'Awaiting Review'),
      showAction: false,
      actionVariant: 'outline',
    },
    COMPLETE: {
      icon: Star,
      label: t('tasks.status.complete', 'Complete'),
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      actionLabel: t('common.view', 'View'),
      showAction: true,
      actionVariant: 'outline',
    },
  };

  // Priority configuration
  const priorityConfig = {
    LOW: {
      label: t('tasks.priority.low', 'Low'),
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      borderColor: 'border-gray-200',
    },
    MEDIUM: {
      label: t('tasks.priority.medium', 'Medium'),
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      borderColor: 'border-blue-300',
    },
    HIGH: {
      label: t('tasks.priority.high', 'High'),
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      borderColor: 'border-orange-300',
    },
    URGENT: {
      label: t('tasks.priority.urgent', 'Urgent'),
      color: 'text-red-600',
      bg: 'bg-red-100',
      borderColor: 'border-red-300',
    },
  };

  const config = statusConfig[status];
  const priorityStyle = priorityConfig[priority];
  const StatusIcon = config?.icon || Clock;

  // Handle action button click
  const handleAction = () => {
    if (status === 'PENDING') {
      onStatusChange?.(id, 'start');
    } else if (status === 'IN_PROGRESS') {
      onStatusChange?.(id, 'done');
    } else {
      onView?.(task);
    }
  };

  // Get assignee initials
  const getInitials = (user) => {
    if (!user) return 'NA';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card
      className={`
        transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:-translate-y-1
        ${status === 'IN_PROGRESS' ? `border-2 ${config.borderColor}` : 'border'}
        ${status === 'COMPLETE' ? 'border-green-200' : ''}
        ${priority === 'URGENT' ? `border-l-4 ${priorityStyle.borderColor}` : ''}
        ${isOverdue ? 'border-red-300 bg-red-50/30' : ''}
      `}
      onClick={() => onView?.(task)}
    >
      <CardContent className="p-5">
        {/* Header: Status and Priority */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={`gap-1.5 ${config?.bgColor} ${config?.textColor} border-0 px-2.5 py-1`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="font-semibold text-xs">{config?.label}</span>
          </Badge>
          <Badge className={`gap-1.5 ${priorityStyle.bg} ${priorityStyle.color} border-0 px-2.5 py-1`}>
            <span className="font-semibold text-xs">{priorityStyle.label}</span>
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-bold text-neutral-900 mb-2 leading-snug line-clamp-2 min-h-[2.5rem]">
          {getLocalizedTitle()}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* Rating (if complete) */}
        {status === 'COMPLETE' && rating && (
          <div className="flex items-center gap-2 mb-4 p-2.5 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-green-700">
              {t('tasks.ratedByAdmin', 'Rated by Admin')}
            </span>
          </div>
        )}

        {/* Footer: Due Date and Assignee */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          {/* Due Date */}
          <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600' : 'text-neutral-600'}`}>
            {isOverdue ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            <span className="text-xs font-medium">
              {isOverdue ? (
                <span className="text-red-600 font-semibold">
                  {t('tasks.overdue', 'Overdue')}
                </span>
              ) : daysUntilDue === 0 ? (
                <span className="text-orange-600 font-semibold">
                  {t('tasks.dueToday', 'Due Today')}
                </span>
              ) : daysUntilDue === 1 ? (
                <span className="text-yellow-600 font-semibold">
                  {t('tasks.dueTomorrow', 'Due Tomorrow')}
                </span>
              ) : (
                formatDistanceToNow(dueDate, { addSuffix: true })
              )}
            </span>
          </div>

          {/* Assignee Avatar (Admin view) */}
          {userRole === 'ADMIN' && assigned_to && (
            <div className="flex items-center gap-1.5">
              <Avatar className="w-6 h-6">
                <AvatarImage src={assigned_to.profile_picture} alt={assigned_to.first_name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(assigned_to)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-neutral-600 font-medium">
                {assigned_to.first_name} {assigned_to.last_name}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {config?.showAction && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
            variant={config.actionVariant}
            className="w-full mt-4 gap-2 py-5 text-sm font-semibold"
            disabled={status === 'DONE'}
          >
            {config.actionIcon && <config.actionIcon className="w-4 h-4" />}
            {config.actionLabel}
          </Button>
        )}

        {/* Overdue Warning Banner */}
        {isOverdue && (
          <div className="mt-3 flex items-center gap-2 p-2 bg-red-100 border border-red-300 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-700">
              {t('tasks.overdueWarning', 'This task is overdue. Please complete it as soon as possible.')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
