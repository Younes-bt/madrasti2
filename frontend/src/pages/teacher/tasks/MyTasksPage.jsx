import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Activity,
  Star,
  AlertCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import TeacherPageLayout from '../../../components/teacher/layout/TeacherPageLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Textarea } from '../../../components/ui/textarea';
import { TaskCard } from '../../../components/tasks/TaskCard';
import tasksService from '../../../services/tasks';
import { toast } from 'sonner';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
    </CardContent>
  </Card>
);

const MyTasksPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Notes dialog
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [notes, setNotes] = useState('');
  const [submittingNotes, setSubmittingNotes] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
    average_rating: 0,
    current_streak: 0,
  });

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === 'all' ? null : activeTab.toUpperCase();
      const response = await tasksService.getMyTasks(statusParam);
      const tasksList = response.results || response;
      setTasks(Array.isArray(tasksList) ? tasksList : []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error(t('error.failedToLoadTasks', 'Failed to load tasks'));
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, t]);

  // Fetch progress stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await tasksService.getMyProgress();
      setStats({
        total: response.total_tasks || 0,
        pending: response.pending_tasks || 0,
        in_progress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        completed: response.completed_tasks || 0,
        overdue: response.overdue_tasks || 0,
        average_rating: parseFloat(response.average_rating || 0),
        current_streak: response.current_streak || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [tasks]);

  // Initial load
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle start task
  const handleStartTask = async (taskId) => {
    try {
      await tasksService.startTask(taskId);
      toast.success(t('tasks.taskStarted', 'Task started successfully'));
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Failed to start task:', error);
      toast.error(t('error.failedToStart', 'Failed to start task'));
    }
  };

  // Handle mark as done - open notes dialog
  const handleMarkDone = (taskId) => {
    setSelectedTaskId(taskId);
    setNotes('');
    setNotesDialogOpen(true);
  };

  // Submit mark as done with notes
  const handleSubmitDone = async () => {
    if (!selectedTaskId) return;

    setSubmittingNotes(true);
    try {
      await tasksService.markTaskDone(selectedTaskId, notes);
      toast.success(t('tasks.taskMarkedDone', 'Task marked as done'));
      setNotesDialogOpen(false);
      setSelectedTaskId(null);
      setNotes('');
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Failed to mark task as done:', error);
      toast.error(t('error.failedToMarkDone', 'Failed to mark task as done'));
    } finally {
      setSubmittingNotes(false);
    }
  };

  // Handle task status change
  const handleStatusChange = (taskId, action) => {
    if (action === 'start') {
      handleStartTask(taskId);
    } else if (action === 'done') {
      handleMarkDone(taskId);
    }
  };

  // Handle view task
  const handleViewTask = (task) => {
    navigate(`/teacher/tasks/${task.id}`);
  };

  // Filter tasks by tab
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return task.status === 'PENDING';
    if (activeTab === 'in_progress') return task.status === 'IN_PROGRESS';
    if (activeTab === 'done') return task.status === 'DONE' || task.status === 'COMPLETE';
    return true;
  });

  return (
    <TeacherPageLayout
      title={t('tasks.myTasks', 'My Tasks')}
      description={t('tasks.myTasksDescription', 'View and manage your assigned tasks')}
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          icon={CheckCircle}
          label={t('tasks.stats.totalTasks', 'Total Tasks')}
          value={stats.total}
          colorClass="text-blue-600"
        />
        <StatCard
          icon={Activity}
          label={t('tasks.stats.inProgress', 'In Progress')}
          value={stats.in_progress}
          colorClass="text-yellow-600"
        />
        <StatCard
          icon={Star}
          label={t('tasks.stats.averageRating', 'Avg Rating')}
          value={stats.average_rating.toFixed(1)}
          colorClass="text-green-600"
        />
        <StatCard
          icon={TrendingUp}
          label={t('tasks.stats.currentStreak', 'Current Streak')}
          value={`${stats.current_streak} ${t('common.days', 'days')}`}
          colorClass="text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600">
            {filteredTasks.length} {t('tasks.tasksFound', 'tasks found')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/teacher/my-progress')}>
            <Star className="w-4 h-4 mr-2" />
            {t('tasks.viewMyProgress', 'View My Progress')}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">{t('tasks.tabs.allTasks', 'All Tasks')}</TabsTrigger>
          <TabsTrigger value="pending">
            {t('tasks.tabs.pending', 'Pending')} ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            {t('tasks.tabs.inProgress', 'In Progress')} ({stats.in_progress})
          </TabsTrigger>
          <TabsTrigger value="done">
            {t('tasks.tabs.completed', 'Completed')} ({stats.completed})
          </TabsTrigger>
        </TabsList>

        {/* All Tabs Content */}
        {['all', 'pending', 'in_progress', 'done'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Activity className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t('tasks.noTasksInCategory', 'No tasks in this category')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    userRole="TEACHER"
                    onView={handleViewTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tasks.markTaskDone', 'Mark Task as Done')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              {t('tasks.addNotesOptional', 'Add any notes or comments about this task (optional)')}
            </p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('tasks.notesPlaceholder', 'Enter your notes here...')}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNotesDialogOpen(false)}
              disabled={submittingNotes}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleSubmitDone} disabled={submittingNotes}>
              {submittingNotes ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('common.submitting', 'Submitting...')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('tasks.markDone', 'Mark as Done')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherPageLayout>
  );
};

export default MyTasksPage;
