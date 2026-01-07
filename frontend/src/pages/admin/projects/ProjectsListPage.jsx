import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Briefcase,
  Activity,
  CheckCircle,
  AlertCircle,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ProjectCard } from '../../../components/projects/ProjectCard';
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

const ProjectsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    planning: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
      };
      if (debouncedSearchQuery) params.search = debouncedSearchQuery;
      if (statusFilter) params.status = statusFilter;

      const response = await tasksService.getProjects(params);

      const projectsList = response.results || response;
      setProjects(Array.isArray(projectsList) ? projectsList : []);

      if (response.count !== undefined) {
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous,
        });
      }

      // Calculate stats from current data
      const totalProjects = projectsList.length;
      setStats({
        total: response.count || totalProjects,
        planning: projectsList.filter((p) => p.status === 'PLANNING').length,
        in_progress: projectsList.filter((p) => p.status === 'IN_PROGRESS').length,
        completed: projectsList.filter((p) => p.status === 'COMPLETED').length,
        overdue: projectsList.filter((p) => {
          if (!p.due_date || p.status === 'COMPLETED') return false;
          return new Date(p.due_date) < new Date();
        }).length,
      });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error(t('error.failedToLoadProjects', 'Failed to load projects'));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, statusFilter, t]);

  // Initial load and reload on filter changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle project click
  const handleProjectClick = (project) => {
    navigate(`/admin/projects/${project.id}`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = pagination ? Math.ceil(pagination.count / 20) : 1;

  return (
    <AdminPageLayout
      title={t('projects.title', 'Projects')}
      description={t('projects.description', 'Manage and track your team projects')}
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <StatCard
          icon={Briefcase}
          label={t('projects.stats.totalProjects', 'Total Projects')}
          value={stats.total}
          colorClass="text-blue-600"
        />
        <StatCard
          icon={Activity}
          label={t('projects.stats.planning', 'Planning')}
          value={stats.planning}
          colorClass="text-gray-600"
        />
        <StatCard
          icon={Activity}
          label={t('projects.stats.inProgress', 'In Progress')}
          value={stats.in_progress}
          colorClass="text-blue-600"
        />
        <StatCard
          icon={CheckCircle}
          label={t('projects.stats.completed', 'Completed')}
          value={stats.completed}
          colorClass="text-green-600"
        />
        <StatCard
          icon={AlertCircle}
          label={t('projects.stats.overdue', 'Overdue')}
          value={stats.overdue}
          colorClass="text-red-600"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('projects.searchProjects', 'Search projects...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('projects.allStatuses', 'All Statuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLANNING">{t('projects.status.planning', 'Planning')}</SelectItem>
                <SelectItem value="IN_PROGRESS">{t('projects.status.inProgress', 'In Progress')}</SelectItem>
                <SelectItem value="ON_HOLD">{t('projects.status.onHold', 'On Hold')}</SelectItem>
                <SelectItem value="COMPLETED">{t('projects.status.completed', 'Completed')}</SelectItem>
                <SelectItem value="CANCELLED">{t('projects.status.cancelled', 'Cancelled')}</SelectItem>
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
              start: projects.length > 0 ? (currentPage - 1) * 20 + 1 : 0,
              end: Math.min(currentPage * 20, pagination?.count || projects.length),
              total: pagination?.count || projects.length,
            })}
          </p>
        </div>
        <div className="flex gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={() => navigate('/admin/projects/create')}>
            <Plus className="w-4 h-4 mr-2" />
            {t('projects.createProject', 'Create Project')}
          </Button>
        </div>
      </div>

      {/* Projects View */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">{t('common.loading', 'Loading...')}</p>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t('projects.noProjectsFound', 'No projects found')}</p>
            <Button className="mt-4" onClick={() => navigate('/admin/projects/create')}>
              <Plus className="w-4 h-4 mr-2" />
              {t('projects.createFirstProject', 'Create your first project')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleProjectClick}
                />
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('projects.projectName', 'Project Name')}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('projects.status', 'Status')}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('projects.progress', 'Progress')}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('projects.teamSize', 'Team Size')}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('projects.dueDate', 'Due Date')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr
                          key={project.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleProjectClick(project)}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{project.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {project.description || t('projects.noDescription', 'No description')}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold">
                                {parseFloat(project.progress_percentage).toFixed(0)}%
                              </span>
                              <span className="text-sm text-gray-500">
                                ({project.completed_tasks}/{project.total_tasks})
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-medium">{project.team_members?.length || 0}</span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-500">
                            {project.due_date ? new Date(project.due_date).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

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
    </AdminPageLayout>
  );
};

export default ProjectsListPage;
