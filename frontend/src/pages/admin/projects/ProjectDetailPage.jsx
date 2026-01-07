import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Users,
  ListTodo,
  MessageSquare,
  Activity,
  Calendar,
  TrendingUp,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ProjectTaskList } from '../../../components/projects/ProjectTaskList';
import tasksService from '../../../services/tasks';
import { apiMethods } from '../../../services/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ProjectDetailPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const isRTL = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [deleting, setDeleting] = useState(false);

  // Modals
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Task form
  const [taskForm, setTaskForm] = useState({
    title: '',
    title_arabic: '',
    title_french: '',
    description: '',
    assigned_to: '',
    priority: 'MEDIUM',
    due_date: '',
  });

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
        const [projectData, tasksData, usersData] = await Promise.all([
          tasksService.getProjectById(projectId),
          tasksService.getProjectTasks(projectId),
          apiMethods.get('users/users/?role=TEACHER,STAFF,ADMIN'),
        ]);

        setProject(projectData);
        const tasksList = tasksData.results || tasksData;
        setTasks(Array.isArray(tasksList) ? tasksList : []);
        const usersList = usersData.results || usersData;
        setAllUsers(Array.isArray(usersList) ? usersList : []);
      } catch (error) {
        console.error('Failed to fetch project data:', error);
        toast.error(t('error.failedToLoadProject', 'Failed to load project'));
        navigate('/admin/projects');
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

  // Handle delete project
  const handleDelete = async () => {
    if (!confirm(t('projects.confirmDelete', 'Are you sure you want to delete this project?'))) {
      return;
    }

    setDeleting(true);
    try {
      await tasksService.deleteProject(projectId);
      toast.success(t('projects.projectDeleted', 'Project deleted successfully'));
      navigate('/admin/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error(t('error.failedToDelete', 'Failed to delete project'));
    } finally {
      setDeleting(false);
    }
  };

  // Handle add task
  const handleAddTask = async () => {
    try {
      await tasksService.createProjectTask(projectId, taskForm);
      toast.success(t('projects.taskAdded', 'Task added successfully'));
      setAddTaskModalOpen(false);
      setTaskForm({ title: '', title_arabic: '', title_french: '', description: '', assigned_to: '', priority: 'MEDIUM', due_date: '' });
      // Refresh tasks
      const tasksData = await tasksService.getProjectTasks(projectId);
      const tasksList = tasksData.results || tasksData;
      setTasks(Array.isArray(tasksList) ? tasksList : []);
    } catch (error) {
      console.error('Failed to add task:', error);
      toast.error(t('error.failedToAddTask', 'Failed to add task'));
    }
  };

  // Handle task update
  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await tasksService.updateProjectTaskStatus(projectId, taskId, updates.status);
      toast.success(t('projects.taskUpdated', 'Task updated successfully'));
      // Refresh tasks
      const tasksData = await tasksService.getProjectTasks(projectId);
      const tasksList = tasksData.results || tasksData;
      setTasks(Array.isArray(tasksList) ? tasksList : []);
      // Refresh project to update progress
      const projectData = await tasksService.getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error(t('error.failedToUpdateTask', 'Failed to update task'));
    }
  };

  // Handle task delete
  const handleTaskDelete = async (taskId) => {
    if (!confirm(t('projects.confirmDeleteTask', 'Are you sure you want to delete this task?'))) {
      return;
    }

    try {
      await tasksService.deleteProjectTask(projectId, taskId);
      toast.success(t('projects.taskDeleted', 'Task deleted successfully'));
      // Refresh tasks
      const tasksData = await tasksService.getProjectTasks(projectId);
      const tasksList = tasksData.results || tasksData;
      setTasks(Array.isArray(tasksList) ? tasksList : []);
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error(t('error.failedToDeleteTask', 'Failed to delete task'));
    }
  };

  // Handle add member
  const handleAddMember = async () => {
    if (!selectedUserId) return;

    try {
      await tasksService.addProjectMember(projectId, parseInt(selectedUserId));
      toast.success(t('projects.memberAdded', 'Member added successfully'));
      setAddMemberModalOpen(false);
      setSelectedUserId('');
      // Refresh project
      const projectData = await tasksService.getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error(t('error.failedToAddMember', 'Failed to add member'));
    }
  };

  // Handle remove member
  const handleRemoveMember = async (userId) => {
    if (!confirm(t('projects.confirmRemoveMember', 'Remove this member from the project?'))) {
      return;
    }

    try {
      await tasksService.removeProjectMember(projectId, userId);
      toast.success(t('projects.memberRemoved', 'Member removed successfully'));
      // Refresh project
      const projectData = await tasksService.getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error(t('error.failedToRemoveMember', 'Failed to remove member'));
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

  if (!project) return null;

  const statusStyle = statusConfig[project.status];
  const availableUsers = allUsers.filter(
    (user) => !project.team_members_details?.some((member) => member.id === user.id)
  );

  return (
    <AdminPageLayout
      title={getLocalizedTitle()}
      description={t('projects.projectDetails', 'Project Details')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/projects')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.backToList', 'Back to List')}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/projects/${projectId}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            {t('common.edit', 'Edit')}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="w-4 h-4 mr-2" />
            {t('common.delete', 'Delete')}
          </Button>
        </div>
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
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="w-4 h-4" />
            {t('projects.tasks', 'Tasks')} ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t('projects.team', 'Team')} ({project.team_members_details?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('projects.projectTasks', 'Project Tasks')}</CardTitle>
                <Button onClick={() => setAddTaskModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('projects.addTask', 'Add Task')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProjectTaskList
                tasks={tasks}
                canEdit={true}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={(task) => {
                  setSelectedTask(task);
                  setEditTaskModalOpen(true);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('projects.teamMembers', 'Team Members')}</CardTitle>
                <Button onClick={() => setAddMemberModalOpen(true)} disabled={availableUsers.length === 0}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('projects.addMember', 'Add Member')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {project.team_members_details?.map((member) => {
                  const memberTasks = tasks.filter((t) => t.assigned_to?.id === member.id);
                  const completedTasks = memberTasks.filter((t) => t.status === 'COMPLETED');

                  return (
                    <div key={member.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Task Modal */}
      <Dialog open={addTaskModalOpen} onOpenChange={setAddTaskModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('projects.addTask', 'Add Task')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('projectTasks.title', 'Title')}</Label>
              <Input
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder={t('projectTasks.titlePlaceholder', 'Enter task title...')}
              />
            </div>
            <div>
              <Label>{t('projectTasks.description', 'Description')}</Label>
              <Textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>{t('projectTasks.assignTo', 'Assign To')}</Label>
                <Select
                  value={taskForm.assigned_to}
                  onValueChange={(value) => setTaskForm({ ...taskForm, assigned_to: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('projectTasks.selectMember', 'Select member...')} />
                  </SelectTrigger>
                  <SelectContent>
                    {project.team_members_details?.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.first_name} {member.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('projectTasks.priority', 'Priority')}</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">{t('projectTasks.priority.low', 'Low')}</SelectItem>
                    <SelectItem value="MEDIUM">{t('projectTasks.priority.medium', 'Medium')}</SelectItem>
                    <SelectItem value="HIGH">{t('projectTasks.priority.high', 'High')}</SelectItem>
                    <SelectItem value="CRITICAL">{t('projectTasks.priority.critical', 'Critical')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{t('projectTasks.dueDate', 'Due Date')}</Label>
              <Input
                type="datetime-local"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTaskModalOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleAddTask}>
              {t('projects.addTask', 'Add Task')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Modal */}
      <Dialog open={addMemberModalOpen} onOpenChange={setAddMemberModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('projects.addMember', 'Add Team Member')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('projects.selectUser', 'Select User')}</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('projects.selectUserPlaceholder', 'Choose a user...')} />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.first_name} {user.last_name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberModalOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleAddMember} disabled={!selectedUserId}>
              {t('projects.addMember', 'Add Member')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

export default ProjectDetailPage;
