import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Clipboard,
  Clock,
  Activity,
  CheckCircle,
  Star,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { TaskCard } from '../../../components/tasks/TaskCard';
import { RatingModal } from '../../../components/tasks/RatingModal';
import tasksService from '../../../services/tasks';
import { apiMethods } from '../../../services/api';
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

const DailyTasksListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    done: 0,
    complete: 0,
    overdue: 0,
  });

  // Rating modal
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedTaskForRating, setSelectedTaskForRating] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users for filter
  const fetchUsers = async () => {
    try {
      const response = await apiMethods.get('users/users/?role=TEACHER,STAFF,ADMIN');
      const usersList = response.results || response;
      setUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
      };
      if (debouncedSearchQuery) params.search = debouncedSearchQuery;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (userFilter) params.assigned_to = userFilter;

      const response = await tasksService.getDailyTasks(params);

      const tasksList = response.results || response;
      setTasks(Array.isArray(tasksList) ? tasksList : []);

      if (response.count !== undefined) {
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous,
        });
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error(t('error.failedToLoadData', 'Failed to load tasks'));
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, statusFilter, priorityFilter, userFilter, t]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await tasksService.getTaskStats();
      setStats({
        total: response.total_tasks || 0,
        pending: response.pending_tasks || 0,
        in_progress: response.in_progress_tasks || 0,
        done: response.done_tasks || 0,
        complete: response.complete_tasks || 0,
        overdue: response.overdue_tasks || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchStats]);

  // Reload tasks when filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle task view/edit
  const handleViewTask = (task) => {
    navigate(`/admin/tasks/${task.id}`);
  };

  // Handle task status change
  const handleStatusChange = async (taskId, action) => {
    try {
      if (action === 'start') {
        await tasksService.startTask(taskId);
        toast.success(t('tasks.taskStarted', 'Task started successfully'));
      } else if (action === 'done') {
        await tasksService.markTaskDone(taskId);
        toast.success(t('tasks.taskMarkedDone', 'Task marked as done'));
      }
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error(t('error.failedToUpdate', 'Failed to update task'));
    }
  };

  // Handle rating submission
  const handleRatingSubmit = async ({ rating, feedback }) => {
    if (!selectedTaskForRating) return;

    setSubmittingRating(true);
    try {
      await tasksService.rateTask(selectedTaskForRating.id, rating, feedback);
      toast.success(t('tasks.taskRated', 'Task rated successfully'));
      setRatingModalOpen(false);
      setSelectedTaskForRating(null);
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Failed to rate task:', error);
      toast.error(t('error.failedToRate', 'Failed to rate task'));
    } finally {
      setSubmittingRating(false);
    }
  };

  // Open rating modal for DONE tasks
  const handleOpenRatingModal = (task) => {
    if (task.status === 'DONE') {
      setSelectedTaskForRating(task);
      setRatingModalOpen(true);
    } else {
      handleViewTask(task);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
    setUserFilter('');
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = pagination ? Math.ceil(pagination.count / 20) : 1;

  return (
    <AdminPageLayout
      title={t('tasks.dailyTasks.title', 'Daily Tasks')}
      description={t('tasks.dailyTasks.description', 'Manage and track daily tasks for your team')}
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-6">
        <StatCard
          icon={Clipboard}
          label={t('tasks.stats.totalTasks', 'Total Tasks')}
          value={stats.total}
          colorClass="text-blue-600"
        />
        <StatCard
          icon={Clock}
          label={t('tasks.stats.pending', 'Pending')}
          value={stats.pending}
          colorClass="text-yellow-600"
        />
        <StatCard
          icon={Activity}
          label={t('tasks.stats.inProgress', 'In Progress')}
          value={stats.in_progress}
          colorClass="text-blue-600"
        />
        <StatCard
          icon={CheckCircle}
          label={t('tasks.stats.done', 'Done')}
          value={stats.done}
          colorClass="text-orange-600"
        />
        <StatCard
          icon={Star}
          label={t('tasks.stats.complete', 'Complete')}
          value={stats.complete}
          colorClass="text-green-600"
        />
        <StatCard
          icon={AlertCircle}
          label={t('tasks.stats.overdue', 'Overdue')}
          value={stats.overdue}
          colorClass="text-red-600"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('tasks.searchTasks', 'Search tasks...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('tasks.allStatuses', 'All Statuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">{t('tasks.status.pending', 'Pending')}</SelectItem>
                <SelectItem value="IN_PROGRESS">{t('tasks.status.inProgress', 'In Progress')}</SelectItem>
                <SelectItem value="DONE">{t('tasks.status.done', 'Done')}</SelectItem>
                <SelectItem value="COMPLETE">{t('tasks.status.complete', 'Complete')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('tasks.allPriorities', 'All Priorities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">{t('tasks.priority.low', 'Low')}</SelectItem>
                <SelectItem value="MEDIUM">{t('tasks.priority.medium', 'Medium')}</SelectItem>
                <SelectItem value="HIGH">{t('tasks.priority.high', 'High')}</SelectItem>
                <SelectItem value="URGENT">{t('tasks.priority.urgent', 'Urgent')}</SelectItem>
              </SelectContent>
            </Select>

            {/* User Filter */}
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('tasks.allUsers', 'All Users')} />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.first_name} {user.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button variant="outline" onClick={handleResetFilters}>
              {t('common.reset', 'Reset')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600">
            {t('common.showingResults', {
              start: tasks.length > 0 ? (currentPage - 1) * 20 + 1 : 0,
              end: Math.min(currentPage * 20, pagination?.count || tasks.length),
              total: pagination?.count || tasks.length,
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/tasks/progress')}>
            <Star className="w-4 h-4 mr-2" />
            {t('tasks.viewProgress', 'View Progress')}
          </Button>
          <Button onClick={() => navigate('/admin/tasks/create')}>
            <Plus className="w-4 h-4 mr-2" />
            {t('tasks.createTask', 'Create Task')}
          </Button>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">{t('common.loading', 'Loading...')}</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clipboard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t('tasks.noTasksFound', 'No tasks found')}</p>
            <Button className="mt-4" onClick={() => navigate('/admin/tasks/create')}>
              <Plus className="w-4 h-4 mr-2" />
              {t('tasks.createFirstTask', 'Create your first task')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userRole="ADMIN"
                onView={() => handleOpenRatingModal(task)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {t('common.page_of', { currentPage, totalPages })}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={!pagination?.previous}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('common.previous', 'Previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={!pagination?.next}
                >
                  {t('common.next', 'Next')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => {
          setRatingModalOpen(false);
          setSelectedTaskForRating(null);
        }}
        task={selectedTaskForRating}
        onSubmit={handleRatingSubmit}
        loading={submittingRating}
      />
    </AdminPageLayout>
  );
};

export default DailyTasksListPage;
