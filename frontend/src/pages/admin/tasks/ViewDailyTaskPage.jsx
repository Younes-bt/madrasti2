import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  FileText,
  Activity,
} from 'lucide-react';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Separator } from '../../../components/ui/separator';
import { RatingModal } from '../../../components/tasks/RatingModal';
import tasksService from '../../../services/tasks';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';

const ViewDailyTaskPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const isRTL = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Status configuration
  const statusConfig = {
    PENDING: {
      label: t('tasks.status.pending', 'Pending'),
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: Clock,
    },
    IN_PROGRESS: {
      label: t('tasks.status.inProgress', 'In Progress'),
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      icon: Activity,
    },
    DONE: {
      label: t('tasks.status.done', 'Done'),
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      icon: CheckCircle,
    },
    COMPLETE: {
      label: t('tasks.status.complete', 'Complete'),
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: Star,
    },
  };

  // Priority configuration
  const priorityConfig = {
    LOW: { label: t('tasks.priority.low', 'Low'), color: 'text-gray-600' },
    MEDIUM: { label: t('tasks.priority.medium', 'Medium'), color: 'text-blue-600' },
    HIGH: { label: t('tasks.priority.high', 'High'), color: 'text-orange-600' },
    URGENT: { label: t('tasks.priority.urgent', 'Urgent'), color: 'text-red-600' },
  };

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const data = await tasksService.getDailyTaskById(taskId);
        setTask(data);
      } catch (error) {
        console.error('Failed to fetch task:', error);
        toast.error(t('error.failedToLoadTask', 'Failed to load task'));
        navigate('/admin/tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, navigate, t]);

  // Handle rating submission
  const handleRatingSubmit = async ({ rating, feedback }) => {
    setSubmittingRating(true);
    try {
      await tasksService.rateTask(taskId, rating, feedback);
      toast.success(t('tasks.taskRated', 'Task rated successfully'));
      setRatingModalOpen(false);
      // Refresh task data
      const data = await tasksService.getDailyTaskById(taskId);
      setTask(data);
    } catch (error) {
      console.error('Failed to rate task:', error);
      toast.error(t('error.failedToRate', 'Failed to rate task'));
    } finally {
      setSubmittingRating(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm(t('tasks.confirmDelete', 'Are you sure you want to delete this task?'))) {
      return;
    }

    setDeleting(true);
    try {
      await tasksService.deleteDailyTask(taskId);
      toast.success(t('tasks.taskDeleted', 'Task deleted successfully'));
      navigate('/admin/tasks');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error(t('error.failedToDelete', 'Failed to delete task'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center py-12">
          <Activity className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminPageLayout>
    );
  }

  if (!task) {
    return null;
  }

  const StatusIcon = statusConfig[task.status]?.icon || Clock;
  const statusStyle = statusConfig[task.status];
  const priorityStyle = priorityConfig[task.priority];

  // Get localized title
  const getLocalizedTitle = () => {
    if (isRTL && task.title_arabic) return task.title_arabic;
    if (i18n.language === 'fr' && task.title_french) return task.title_french;
    return task.title;
  };

  return (
    <AdminPageLayout
      title={getLocalizedTitle()}
      description={t('tasks.taskDetails', 'Task Details')}
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/tasks')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.backToList', 'Back to List')}
        </Button>
        <div className="flex gap-2">
          {task.status === 'DONE' && (
            <Button onClick={() => setRatingModalOpen(true)}>
              <Star className="w-4 h-4 mr-2" />
              {t('tasks.rateTask', 'Rate Task')}
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate(`/admin/tasks/${taskId}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            {t('common.edit', 'Edit')}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="w-4 h-4 mr-2" />
            {t('common.delete', 'Delete')}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('tasks.overview', 'Overview')}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={`${statusStyle.bgColor} ${statusStyle.textColor} border-0`}>
                    <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                    {statusStyle.label}
                  </Badge>
                  <Badge className={`${priorityStyle.color} bg-gray-100`}>
                    {priorityStyle.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {t('tasks.description', 'Description')}
                </h3>
                <p className="text-gray-900">{task.description}</p>
              </div>

              {task.admin_notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      {t('tasks.adminNotes', 'Admin Notes')}
                    </h3>
                    <p className="text-gray-700">{task.admin_notes}</p>
                  </div>
                </>
              )}

              {task.user_notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      {t('tasks.userNotes', 'User Notes')}
                    </h3>
                    <p className="text-gray-700">{task.user_notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Rating Section (if complete) */}
          {task.status === 'COMPLETE' && task.rating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  {t('tasks.rating', 'Rating')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= task.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {task.rating}/5
                  </span>
                </div>

                {task.rating_feedback && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        {t('tasks.feedback', 'Feedback')}
                      </h3>
                      <p className="text-gray-700">{task.rating_feedback}</p>
                    </div>
                  </>
                )}

                {task.rated_by && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>
                      {t('tasks.ratedBy', 'Rated by')}{' '}
                      <span className="font-medium">
                        {task.rated_by.first_name} {task.rated_by.last_name}
                      </span>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('tasks.assignmentInfo', 'Assignment')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assigned To */}
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('tasks.assignedTo', 'Assigned To')}</p>
                {task.assigned_to && (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={task.assigned_to.profile_picture} />
                      <AvatarFallback>
                        {task.assigned_to.first_name?.charAt(0)}
                        {task.assigned_to.last_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {task.assigned_to.first_name} {task.assigned_to.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{task.assigned_to.role}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Assigned By */}
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('tasks.assignedBy', 'Assigned By')}</p>
                {task.assigned_by && (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={task.assigned_by.profile_picture} />
                      <AvatarFallback>
                        {task.assigned_by.first_name?.charAt(0)}
                        {task.assigned_by.last_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {task.assigned_by.first_name} {task.assigned_by.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{task.assigned_by.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('tasks.timeline', 'Timeline')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('tasks.created', 'Created')}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(task.created_at), 'PPpp')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('tasks.dueDate', 'Due Date')}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(task.due_date), 'PPpp')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {task.started_at && (
                <div className="flex items-start gap-3">
                  <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('tasks.started', 'Started')}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(task.started_at), 'PPpp')}
                    </p>
                  </div>
                </div>
              )}

              {task.completed_at && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('tasks.completed', 'Completed')}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(task.completed_at), 'PPpp')}
                    </p>
                  </div>
                </div>
              )}

              {task.reviewed_at && (
                <div className="flex items-start gap-3">
                  <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('tasks.reviewed', 'Reviewed')}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(task.reviewed_at), 'PPpp')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        task={task}
        onSubmit={handleRatingSubmit}
        loading={submittingRating}
      />
    </AdminPageLayout>
  );
};

export default ViewDailyTaskPage;
