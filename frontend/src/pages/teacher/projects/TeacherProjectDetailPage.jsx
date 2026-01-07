import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  ListTodo,
  Activity,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import TeacherPageLayout from '../../../components/teacher/layout/TeacherPageLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { ProjectTaskList } from '../../../components/projects/ProjectTaskList';
import tasksService from '../../../services/tasks';
import { toast } from 'sonner';
import { format } from 'date-fns';

const TeacherProjectDetailPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const isRTL = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);

  // Status config
  const statusConfig = {
    PLANNING: { label: t('projects.status.planning', 'Planning'), color: 'bg-gray-100 text-gray-700' },
    IN_PROGRESS: { label: t('projects.status.inProgress', 'In Progress'), color: 'bg-blue-100 text-blue-700' },
    ON_HOLD: { label: t('projects.status.onHold', 'On Hold'), color: 'bg-yellow-100 text-yellow-700' },
    COMPLETED: { label: t('projects.status.completed', 'Completed'), color: 'bg-green-100 text-green-700' },
    CANCELLED: { label: t('projects.status.cancelled', 'Cancelled'), color: 'bg-red-100 text-red-700' },
  };

  // Fetch project and tasks
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectData, tasksData] = await Promise.all([
          tasksService.getProjectById(projectId),
          tasksService.getProjectTasks(projectId),
        ]);

        setProject(projectData);
        const tasksList = tasksData.results || tasksData;
        setTasks(Array.isArray(tasksList) ? tasksList : []);

        // Filter my tasks
        const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
        setMyTasks(tasksList.filter((t) => t.assigned_to?.id === currentUserId));
      } catch (error) {
        console.error('Failed to fetch project data:', error);
        toast.error(t('error.failedToLoadProject', 'Failed to load project'));
        navigate('/teacher/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, navigate, t]);

  // Get localized title
  const getLocalizedTitle = () => {
    if (!project) return '';
    if (isRTL && project.title_arabic) return project.title_arabic;
    if (i18n.language === 'fr' && project.title_french) return project.title_french;
    return project.title;
  };

  // Handle task status update (for my tasks only)
  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await tasksService.updateProjectTaskStatus(projectId, taskId, updates.status);
      toast.success(t('projects.taskUpdated', 'Task updated successfully'));
      // Refresh tasks
      const tasksData = await tasksService.getProjectTasks(projectId);
      const tasksList = tasksData.results || tasksData;
      setTasks(Array.isArray(tasksList) ? tasksList : []);
      const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
      setMyTasks(tasksList.filter((t) => t.assigned_to?.id === currentUserId));
      // Refresh project
      const projectData = await tasksService.getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error(t('error.failedToUpdateTask', 'Failed to update task'));
    }
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

  if (!project) return null;

  const statusStyle = statusConfig[project.status];

  return (
    <TeacherPageLayout
      title={getLocalizedTitle()}
      description={t('projects.projectDetails', 'Project Details')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/teacher/projects')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.backToList', 'Back to List')}
        </Button>
      </div>

      {/* Project Overview */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={`${statusStyle.color} border-0`}>
                  {statusStyle.label}
                </Badge>
                {project.due_date && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{t('projects.due', 'Due')}: {format(new Date(project.due_date), 'PPP')}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-4">{project.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{t('projects.progress', 'Progress')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {project.completed_tasks} / {project.total_tasks} {t('projects.tasks', 'tasks')}
                </span>
                <span className="text-lg font-bold">{parseFloat(project.progress_percentage).toFixed(0)}%</span>
              </div>
            </div>
            <Progress value={parseFloat(project.progress_percentage)} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="my-tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-tasks" className="flex items-center gap-2">
            <ListTodo className="w-4 h-4" />
            {t('projects.myTasks', 'My Tasks')} ({myTasks.length})
          </TabsTrigger>
          <TabsTrigger value="all-tasks" className="flex items-center gap-2">
            <ListTodo className="w-4 h-4" />
            {t('projects.allTasks', 'All Tasks')} ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t('projects.team', 'Team')} ({project.team_members_details?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* My Tasks Tab */}
        <TabsContent value="my-tasks">
          <Card>
            <CardHeader>
              <CardTitle>{t('projects.myTasks', 'My Tasks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectTaskList
                tasks={myTasks}
                canEdit={true}
                onTaskUpdate={handleTaskUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Tasks Tab */}
        <TabsContent value="all-tasks">
          <Card>
            <CardHeader>
              <CardTitle>{t('projects.allTasks', 'All Project Tasks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectTaskList
                tasks={tasks}
                canEdit={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>{t('projects.teamMembers', 'Team Members')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {project.team_members_details?.map((member) => {
                  const memberTasks = tasks.filter((t) => t.assigned_to?.id === member.id);
                  const completedTasks = memberTasks.filter((t) => t.status === 'COMPLETED');

                  return (
                    <div key={member.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.profile_picture} />
                        <AvatarFallback>
                          {member.first_name?.charAt(0)}{member.last_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.first_name} {member.last_name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {completedTasks.length}/{memberTasks.length} {t('projects.tasksCompleted', 'tasks completed')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TeacherPageLayout>
  );
};

export default TeacherProjectDetailPage;
