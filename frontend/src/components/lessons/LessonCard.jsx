import { Lock, PlayCircle, Clock, CheckCircle, BarChart3, Trophy, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

export function LessonCard({ lesson, onLessonClick }) {
  const { id, title, difficulty_level, progress, is_locked } = lesson;

  // Determine status
  const status = is_locked ? 'locked' : (progress?.status || 'not_started');
  const completionPercentage = progress?.completion_percentage || 0;
  const pointsEarned = progress?.total_points_earned || 0;
  const averageScore = progress?.average_score || 0;

  // Status configuration
  const statusConfig = {
    locked: {
      icon: Lock,
      label: 'مغلق',
      bgColor: 'bg-neutral-100',
      textColor: 'text-neutral-600',
      borderColor: 'border-neutral-200',
      actionLabel: 'مغلق',
      actionDisabled: true,
      actionVariant: 'outline'
    },
    'not_started': {
      icon: PlayCircle,
      label: 'لم يبدأ',
      bgColor: 'bg-info-50',
      textColor: 'text-info-700',
      borderColor: 'border-info-200',
      actionLabel: 'ابدأ الدرس',
      actionDisabled: false,
      actionVariant: 'default'
    },
    'in_progress': {
      icon: Clock,
      label: 'قيد التقدم',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-700',
      borderColor: 'border-warning-300',
      actionLabel: 'استمر في التعلم',
      actionDisabled: false,
      actionVariant: 'default'
    },
    completed: {
      icon: CheckCircle,
      label: 'مكتمل',
      bgColor: 'bg-success-50',
      textColor: 'text-success-700',
      borderColor: 'border-success-200',
      actionLabel: 'راجع الدرس',
      actionDisabled: false,
      actionVariant: 'outline'
    }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  // Difficulty styling
  const difficultyConfig = {
    'easy': { label: 'سهل', color: 'text-success-600', bg: 'bg-success-50' },
    'medium': { label: 'متوسط', color: 'text-warning-600', bg: 'bg-warning-50' },
    'hard': { label: 'صعب', color: 'text-error-600', bg: 'bg-error-50' }
  };
  const diffStyle = difficultyConfig[difficulty_level] || { label: difficulty_level, color: 'text-neutral-600', bg: 'bg-neutral-50' };

  return (
    <Card
      className={`
        transition-all duration-300
        ${status === 'locked' ? 'opacity-70' : 'hover:shadow-xl hover:-translate-y-1'}
        ${status === 'in_progress' ? `border-2 ${config.borderColor}` : 'border'}
        ${status === 'completed' ? 'border-success-200' : ''}
      `}
    >
      <CardContent className="p-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <Badge className={`gap-2 ${config.bgColor} ${config.textColor} border-0 px-3 py-1.5`}>
            <StatusIcon className="w-4 h-4" />
            <span className="font-semibold">{config.label}</span>
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-4 leading-relaxed min-h-[3.5rem] line-clamp-2">
          {title}
        </h3>

        {/* Progress Bar (In-Progress Only) */}
        {status === 'in_progress' && (
          <div className="mb-4">
            <Progress value={completionPercentage} className="h-2.5" />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-neutral-600">التقدم</p>
              <p className="text-sm font-bold text-warning-700" dir="ltr">
                {Math.round(completionPercentage)}%
              </p>
            </div>
          </div>
        )}

        {/* Completion Stats (Completed Only) */}
        {status === 'completed' && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning-500" />
              <span className="text-sm font-bold text-neutral-900">
                +{Math.round(pointsEarned)} نقطة
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="text-sm font-bold text-neutral-900">
                {Math.round(averageScore)}%
              </span>
            </div>
          </div>
        )}

        {/* Difficulty */}
        <div className="flex items-center gap-4 text-sm mb-4 pb-4 border-b border-neutral-100">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${diffStyle.bg}`}>
            <BarChart3 className={`w-4 h-4 ${diffStyle.color}`} />
            <span className={`font-medium ${diffStyle.color}`}>
              {diffStyle.label}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onLessonClick(lesson)}
          disabled={config.actionDisabled}
          variant={config.actionVariant}
          className="w-full gap-2 py-6 text-base font-semibold"
        >
          {status === 'not_started' && <PlayCircle className="w-5 h-5" />}
          {status === 'in_progress' && <span className="text-xl">←</span>}
          {status === 'completed' && <BookOpen className="w-5 h-5" />}
          {config.actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
