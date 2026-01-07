import { Calendar, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDistanceToNow, isPast, format } from 'date-fns';

export function ProjectCard({ project, onClick }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const {
    id,
    title,
    title_arabic,
    title_french,
    description,
    status,
    progress_percentage,
    total_tasks,
    completed_tasks,
    team_members_details,
    due_date,
    start_date,
  } = project;

  // Get localized title
  const getLocalizedTitle = () => {
    if (isRTL && title_arabic) return title_arabic;
    if (i18n.language === 'fr' && title_french) return title_french;
    return title;
  };

  // Status configuration
  const statusConfig = {
    PLANNING: {
      label: t('projects.status.planning', 'Planning'),
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
    },
    IN_PROGRESS: {
      label: t('projects.status.inProgress', 'In Progress'),
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300',
    },
    ON_HOLD: {
      label: t('projects.status.onHold', 'On Hold'),
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-300',
    },
    COMPLETED: {
      label: t('projects.status.completed', 'Completed'),
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
    },
    CANCELLED: {
      label: t('projects.status.cancelled', 'Cancelled'),
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
    },
  };

  const statusStyle = statusConfig[status] || statusConfig.PLANNING;

  // Get progress bar color based on completion percentage
  const getProgressColor = () => {
    const progress = parseFloat(progress_percentage);
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Check if project is overdue
  const dueDate = due_date ? new Date(due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && status !== 'COMPLETED' && status !== 'CANCELLED';

  // Get user initials
  const getInitials = (user) => {
    if (!user) return 'NA';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Render team avatars (max 5 visible)
  const renderTeamAvatars = () => {
    if (!team_members_details || team_members_details.length === 0) return null;

    const visibleMembers = team_members_details.slice(0, 5);
    const remainingCount = team_members_details.length - 5;

    return (
      <div className="flex items-center -space-x-2">
        {visibleMembers.map((member, index) => (
          <Avatar
            key={member.id}
            className="w-8 h-8 border-2 border-white dark:border-gray-800"
            style={{ zIndex: visibleMembers.length - index }}
          >
            <AvatarImage src={member.profile_picture} alt={member.first_name} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
              {getInitials(member)}
            </AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && (
          <div
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center"
            style={{ zIndex: 0 }}
          >
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card
      className={`
        transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:-translate-y-1
        ${status === 'IN_PROGRESS' ? `border-2 ${statusStyle.borderColor}` : 'border'}
        ${status === 'COMPLETED' ? 'border-green-200 bg-green-50/30' : ''}
        ${isOverdue ? 'border-red-300 bg-red-50/30' : ''}
      `}
      onClick={() => onClick?.(project)}
    >
      <CardHeader className="pb-3">
        {/* Status and Due Date */}
        <div className="flex items-center justify-between mb-2">
          <Badge className={`${statusStyle.bgColor} ${statusStyle.textColor} border-0 px-2.5 py-1`}>
            <span className="font-semibold text-xs">{statusStyle.label}</span>
          </Badge>

          {due_date && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {isOverdue ? (
                  <span className="text-red-600 font-semibold">
                    {t('projects.overdue', 'Overdue')}
                  </span>
                ) : (
                  formatDistanceToNow(dueDate, { addSuffix: true })
                )}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[3rem]">
          {getLocalizedTitle()}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {description || t('projects.noDescription', 'No description provided')}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {t('projects.progress', 'Progress')}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {parseFloat(progress_percentage).toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress
              value={parseFloat(progress_percentage)}
              className="h-2.5"
            />
            <div
              className={`absolute top-0 left-0 h-2.5 rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${parseFloat(progress_percentage)}%` }}
            />
          </div>
        </div>

        {/* Tasks Summary */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {t('projects.tasks', 'Tasks')}
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {completed_tasks} / {total_tasks}
          </span>
        </div>

        {/* Footer: Team Members */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {team_members_details?.length || 0} {t('projects.members', 'members')}
            </span>
          </div>
          {renderTeamAvatars()}
        </div>

        {/* Overdue Warning */}
        {isOverdue && (
          <div className="flex items-center gap-2 p-2 bg-red-100 border border-red-300 rounded-lg">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-700">
              {t('projects.overdueWarning', 'This project is past its due date')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
