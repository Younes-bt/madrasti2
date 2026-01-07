import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  Star,
  Search,
  Filter,
  ArrowLeft,
  Users,
  Award,
} from 'lucide-react';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ProgressCard } from '../../../components/tasks/ProgressCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import tasksService from '../../../services/tasks';
import { toast } from 'sonner';

const UserProgressDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [allProgress, setAllProgress] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const data = await tasksService.getLeaderboard();
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      toast.error(t('error.failedToLoadLeaderboard', 'Failed to load leaderboard'));
    }
  }, [t]);

  // Fetch all user progress
  const fetchAllProgress = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;

      const response = await tasksService.getUserProgress(params);
      const progressList = response.results || response;
      setAllProgress(Array.isArray(progressList) ? progressList : []);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      toast.error(t('error.failedToLoadProgress', 'Failed to load user progress'));
      setAllProgress([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, t]);

  // Initial load
  useEffect(() => {
    fetchLeaderboard();
    fetchAllProgress();
  }, [fetchLeaderboard, fetchAllProgress]);

  // Get user initials
  const getInitials = (user) => {
    if (!user) return 'NA';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Render stars
  const renderStars = (rating) => {
    const avgRating = parseFloat(rating || 0);
    return (
      <div className="flex items-center gap-0.5">
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

  return (
    <AdminPageLayout
      title={t('tasks.progress.userProgressDashboard', 'User Progress Dashboard')}
      description={t('tasks.progress.dashboardDescription', 'Track team performance and task completion')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/tasks')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.backToTasks', 'Back to Tasks')}
        </Button>
      </div>

      {/* Leaderboard Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {t('tasks.progress.topPerformers', 'Top Performers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('tasks.progress.noDataYet', 'No progress data yet')}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leaderboard.slice(0, 10).map((progress, index) => (
                <ProgressCard
                  key={progress.id}
                  userProgress={progress}
                  showRank={true}
                  rank={index + 1}
                  onClick={() => setSelectedUser(progress)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Users Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('tasks.progress.allUsers', 'All Users')}
            </CardTitle>
            <div className="flex gap-2">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('tasks.searchUsers', 'Search users...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('common.allRoles', 'All Roles')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEACHER">{t('common.teacher', 'Teacher')}</SelectItem>
                  <SelectItem value="STAFF">{t('common.staff', 'Staff')}</SelectItem>
                  <SelectItem value="ADMIN">{t('common.admin', 'Admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Award className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600">{t('common.loading', 'Loading...')}</p>
              </div>
            </div>
          ) : allProgress.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('tasks.progress.noUsersFound', 'No users found')}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>{t('common.user', 'User')}</TableHead>
                    <TableHead>{t('common.role', 'Role')}</TableHead>
                    <TableHead className="text-center">{t('tasks.progress.totalTasks', 'Total Tasks')}</TableHead>
                    <TableHead className="text-center">{t('tasks.progress.completed', 'Completed')}</TableHead>
                    <TableHead className="text-center">{t('tasks.progress.completionRate', 'Completion %')}</TableHead>
                    <TableHead className="text-center">{t('tasks.progress.averageRating', 'Avg Rating')}</TableHead>
                    <TableHead className="text-center">{t('tasks.progress.onTime', 'On-Time %')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProgress.map((progress) => (
                    <TableRow
                      key={progress.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedUser(progress)}
                    >
                      {/* User */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={progress.user?.profile_picture} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {getInitials(progress.user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {progress.user?.first_name} {progress.user?.last_name}
                            </p>
                            <p className="text-xs text-gray-500">{progress.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {progress.user?.role}
                        </Badge>
                      </TableCell>

                      {/* Total Tasks */}
                      <TableCell className="text-center">
                        <span className="font-semibold">{progress.total_tasks}</span>
                      </TableCell>

                      {/* Completed */}
                      <TableCell className="text-center">
                        <span className="font-semibold text-green-600">{progress.completed_tasks}</span>
                      </TableCell>

                      {/* Completion Rate */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-semibold">
                            {parseFloat(progress.completion_rate).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>

                      {/* Average Rating */}
                      <TableCell className="text-center">
                        {progress.average_rating ? (
                          <div className="flex items-center justify-center gap-2">
                            {renderStars(progress.average_rating)}
                            <span className="text-sm font-semibold">
                              {parseFloat(progress.average_rating).toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>

                      {/* On-Time Rate */}
                      <TableCell className="text-center">
                        {progress.on_time_completion_rate !== null ? (
                          <span className="font-semibold">
                            {parseFloat(progress.on_time_completion_rate).toFixed(0)}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Modal - Show selected user's full progress card */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <ProgressCard userProgress={selectedUser} />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                {t('common.close', 'Close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default UserProgressDashboardPage;
