import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Star,
  CheckCircle,
  Clock,
  Award,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import TeacherPageLayout from '../../../components/teacher/layout/TeacherPageLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import tasksService from '../../../services/tasks';
import { toast } from 'sonner';

const MyProgressPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  // Fetch progress
  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tasksService.getMyProgress();
      setProgress(data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      toast.error(t('error.failedToLoadProgress', 'Failed to load progress'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Render stars
  const renderStars = (rating) => {
    const avgRating = parseFloat(rating || 0);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= Math.round(avgRating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <TeacherPageLayout>
        <div className="flex items-center justify-center py-12">
          <Activity className="w-8 h-8 animate-spin text-primary" />
        </div>
      </TeacherPageLayout>
    );
  }

  if (!progress) return null;

  return (
    <TeacherPageLayout
      title={t('tasks.progress.myProgress', 'My Progress')}
      description={t('tasks.progress.trackYourPerformance', 'Track your task completion and performance')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/teacher/tasks')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.backToTasks', 'Back to Tasks')}
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Completion Rate Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {t('tasks.progress.completionRate', 'Completion Rate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - parseFloat(progress.completion_rate || 0) / 100)}`}
                      className="text-blue-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {parseFloat(progress.completion_rate || 0).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {progress.completed_tasks} {t('common.of', 'of')} {progress.total_tasks} {t('tasks.tasksCompleted', 'tasks completed')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Rating Card */}
        {progress.average_rating && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                {t('tasks.progress.averageRating', 'Average Rating')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center">
                  {renderStars(progress.average_rating)}
                  <p className="text-4xl font-bold text-gray-900 mt-4">
                    {parseFloat(progress.average_rating).toFixed(1)} / 5.0
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {t('tasks.progress.basedOnRatedTasks', 'Based on your completed tasks')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('tasks.stats.totalTasks', 'Total Tasks')}</p>
                <p className="text-3xl font-bold text-blue-600">{progress.total_tasks}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('tasks.stats.pending', 'Pending')}</p>
                <p className="text-3xl font-bold text-yellow-600">{progress.pending_tasks}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('tasks.progress.onTime', 'On-Time Rate')}</p>
                <p className="text-3xl font-bold text-purple-600">
                  {progress.on_time_completion_rate ? parseFloat(progress.on_time_completion_rate).toFixed(0) : 0}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('tasks.progress.currentStreak', 'Current Streak')}</p>
                <p className="text-3xl font-bold text-orange-600">{progress.current_streak}</p>
                <p className="text-xs text-gray-500">{t('common.days', 'days')}</p>
              </div>
              <Award className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      {progress.average_rating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('tasks.progress.ratingDistribution', 'Rating Distribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { stars: 5, count: progress.five_star_count, color: 'bg-green-500', label: t('tasks.rating.excellent', 'Excellent') },
                { stars: 4, count: progress.four_star_count, color: 'bg-blue-500', label: t('tasks.rating.good', 'Good') },
                { stars: 3, count: progress.three_star_count, color: 'bg-yellow-500', label: t('tasks.rating.average', 'Average') },
                { stars: 2, count: progress.two_star_count, color: 'bg-orange-500', label: t('tasks.rating.poor', 'Poor') },
                { stars: 1, count: progress.one_star_count, color: 'bg-red-500', label: t('tasks.rating.veryPoor', 'Very Poor') },
              ].map(({ stars, count, color, label }) => (
                <div key={stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-32">
                    <span className="text-sm font-medium w-6">{stars}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} transition-all`}
                          style={{
                            width: `${progress.total_tasks > 0 ? (count / progress.completed_tasks) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{t('tasks.progress.insights', 'Performance Insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {progress.longest_streak > 0 && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <Award className="w-6 h-6 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{t('tasks.progress.longestStreak', 'Longest Streak')}</p>
                  <p className="text-2xl font-bold text-orange-600">{progress.longest_streak} {t('common.days', 'days')}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('tasks.progress.keepItUp', 'Keep up the great work!')}
                  </p>
                </div>
              </div>
            )}

            {progress.overdue_tasks > 0 && (
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <Clock className="w-6 h-6 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{t('tasks.stats.overdue', 'Overdue Tasks')}</p>
                  <p className="text-2xl font-bold text-red-600">{progress.overdue_tasks}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('tasks.progress.needsAttention', 'These tasks need your attention')}
                  </p>
                </div>
              </div>
            )}

            {parseFloat(progress.completion_rate) >= 80 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{t('tasks.progress.excellentPerformance', 'Excellent Performance')}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('tasks.progress.highCompletionRate', 'You have a high completion rate')}
                  </p>
                </div>
              </div>
            )}

            {progress.average_rating && parseFloat(progress.average_rating) >= 4.5 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{t('tasks.progress.topQuality', 'Top Quality Work')}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('tasks.progress.consistentlyHighRated', 'Your work is consistently highly rated')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TeacherPageLayout>
  );
};

export default MyProgressPage;
