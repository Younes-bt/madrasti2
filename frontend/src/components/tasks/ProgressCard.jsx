import { Star, TrendingUp, CheckCircle, Clock, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

export function ProgressCard({ userProgress, onClick, showRank = false, rank = null }) {
  const { t } = useTranslation();

  const {
    user,
    total_tasks,
    completed_tasks,
    completion_rate,
    average_rating,
    five_star_count,
    four_star_count,
    three_star_count,
    two_star_count,
    one_star_count,
    on_time_completion_rate,
    current_streak,
    longest_streak,
  } = userProgress;

  // Get user initials
  const getInitials = () => {
    if (!user) return 'NA';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get completion rate color
  const getCompletionColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-blue-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get rating color
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Render stars for average rating
  const renderStars = () => {
    const avgRating = parseFloat(average_rating || 0);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(avgRating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Get rank badge
  const getRankBadge = () => {
    if (!showRank || !rank) return null;

    const badgeConfig = {
      1: { icon: '🥇', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      2: { icon: '🥈', color: 'bg-gray-100 text-gray-700 border-gray-300' },
      3: { icon: '🥉', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    };

    const config = badgeConfig[rank] || {
      icon: `#${rank}`,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
    };

    return (
      <Badge className={`${config.color} border px-2.5 py-1`}>
        <span className="font-bold text-sm">{config.icon}</span>
      </Badge>
    );
  };

  return (
    <Card
      className={`transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profile_picture} alt={user?.first_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Rank Badge */}
          {getRankBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Completion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('tasks.progress.completionRate', 'Completion Rate')}
            </span>
            <span className={`text-lg font-bold ${getCompletionColor(parseFloat(completion_rate))}`}>
              {parseFloat(completion_rate).toFixed(1)}%
            </span>
          </div>
          <Progress
            value={parseFloat(completion_rate)}
            className="h-2.5"
          />
        </div>

        {/* Average Rating */}
        {average_rating && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('tasks.progress.averageRating', 'Average Rating')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {renderStars()}
              <span className={`text-base font-bold ${getRatingColor(parseFloat(average_rating))}`}>
                {parseFloat(average_rating).toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Tasks */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('tasks.progress.totalTasks', 'Total')}
              </p>
              <p className="text-lg font-bold text-blue-600">{total_tasks}</p>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('tasks.progress.completed', 'Completed')}
              </p>
              <p className="text-lg font-bold text-green-600">{completed_tasks}</p>
            </div>
          </div>

          {/* On-Time Rate */}
          {on_time_completion_rate !== null && (
            <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('tasks.progress.onTime', 'On-Time')}
                </p>
                <p className="text-lg font-bold text-purple-600">
                  {parseFloat(on_time_completion_rate).toFixed(0)}%
                </p>
              </div>
            </div>
          )}

          {/* Current Streak */}
          {current_streak > 0 && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <Award className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('tasks.progress.streak', 'Streak')}
                </p>
                <p className="text-lg font-bold text-orange-600">
                  {current_streak} {t('common.days', 'days')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Star Distribution (optional, shown on hover or click) */}
        {average_rating && (five_star_count > 0 || four_star_count > 0 || three_star_count > 0) && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t('tasks.progress.ratingDistribution', 'Rating Distribution')}
            </p>
            <div className="space-y-1">
              {[
                { stars: 5, count: five_star_count, color: 'bg-green-500' },
                { stars: 4, count: four_star_count, color: 'bg-blue-500' },
                { stars: 3, count: three_star_count, color: 'bg-yellow-500' },
                { stars: 2, count: two_star_count, color: 'bg-orange-500' },
                { stars: 1, count: one_star_count, color: 'bg-red-500' },
              ].map(
                ({ stars, count, color }) =>
                  count > 0 && (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-xs w-4 text-gray-600">{stars}★</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} transition-all`}
                          style={{
                            width: `${(count / total_tasks) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-6 text-right">{count}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
