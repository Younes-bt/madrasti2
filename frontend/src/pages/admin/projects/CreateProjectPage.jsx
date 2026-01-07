import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Save, X, Users, Calendar, FileText } from 'lucide-react';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Checkbox } from '../../../components/ui/checkbox';
import tasksService from '../../../services/tasks';
import { apiMethods } from '../../../services/api';
import { toast } from 'sonner';

const CreateProjectPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    title_arabic: '',
    title_french: '',
    description: '',
    start_date: '',
    due_date: '',
    status: 'PLANNING',
  });

  const [errors, setErrors] = useState({});

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiMethods.get('users/users/?role=TEACHER,STAFF,ADMIN');
        const usersList = response.results || response;
        setUsers(Array.isArray(usersList) ? usersList : []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error(t('error.failedToLoadUsers', 'Failed to load users'));
      }
    };

    fetchUsers();
  }, [t]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle team member selection
  const handleMemberToggle = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t('validation.titleRequired', 'Title is required');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('validation.descriptionRequired', 'Description is required');
    }

    if (selectedMembers.length === 0) {
      newErrors.team_members = t('validation.teamMembersRequired', 'Please select at least one team member');
    }

    if (formData.start_date && formData.due_date) {
      const start = new Date(formData.start_date);
      const due = new Date(formData.due_date);
      if (due < start) {
        newErrors.due_date = t('validation.dueDateAfterStart', 'Due date must be after start date');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('error.pleaseFixErrors', 'Please fix the errors in the form'));
      return;
    }

    setLoading(true);
    try {
      const projectData = {
        ...formData,
        team_members: selectedMembers,
      };

      const newProject = await tasksService.createProject(projectData);
      toast.success(t('projects.projectCreated', 'Project created successfully'));
      navigate(`/admin/projects/${newProject.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const formattedErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(apiErrors[key])
            ? apiErrors[key][0]
            : apiErrors[key];
        });
        setErrors(formattedErrors);
      }
      toast.error(t('error.failedToCreateProject', 'Failed to create project'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageLayout
      title={t('projects.createProject', 'Create New Project')}
      description={t('projects.createProjectDescription', 'Create a new project and assign team members')}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Title Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('projects.projectTitle', 'Project Title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                  <TabsTrigger value="fr">Français</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label htmlFor="title">{t('projects.titleEnglish', 'Title (English)')}</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={t('projects.titlePlaceholder', 'Enter project title...')}
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="ar" className="space-y-4">
                  <div>
                    <Label htmlFor="title_arabic">{t('projects.titleArabic', 'Title (Arabic)')}</Label>
                    <Input
                      id="title_arabic"
                      name="title_arabic"
                      value={formData.title_arabic}
                      onChange={handleChange}
                      placeholder="أدخل عنوان المشروع..."
                      dir="rtl"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="fr" className="space-y-4">
                  <div>
                    <Label htmlFor="title_french">{t('projects.titleFrench', 'Title (French)')}</Label>
                    <Input
                      id="title_french"
                      name="title_french"
                      value={formData.title_french}
                      onChange={handleChange}
                      placeholder="Entrez le titre du projet..."
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>{t('projects.description', 'Description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('projects.descriptionPlaceholder', 'Provide detailed project description...')}
                rows={5}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('projects.projectDetails', 'Project Details')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Start Date */}
                <div>
                  <Label htmlFor="start_date">{t('projects.startDate', 'Start Date')}</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>

                {/* Due Date */}
                <div>
                  <Label htmlFor="due_date">{t('projects.dueDate', 'Due Date')}</Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className={errors.due_date ? 'border-red-500' : ''}
                  />
                  {errors.due_date && (
                    <p className="text-sm text-red-500 mt-1">{errors.due_date}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <Label htmlFor="status">{t('projects.status', 'Status')}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLANNING">{t('projects.status.planning', 'Planning')}</SelectItem>
                      <SelectItem value="IN_PROGRESS">{t('projects.status.inProgress', 'In Progress')}</SelectItem>
                      <SelectItem value="ON_HOLD">{t('projects.status.onHold', 'On Hold')}</SelectItem>
                      <SelectItem value="COMPLETED">{t('projects.status.completed', 'Completed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('projects.teamMembers', 'Team Members')} <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedMembers.includes(user.id)}
                      onCheckedChange={() => handleMemberToggle(user.id)}
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.email} • {user.role}
                      </p>
                    </label>
                  </div>
                ))}
              </div>
              {errors.team_members && (
                <p className="text-sm text-red-500 mt-2">{errors.team_members}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {selectedMembers.length} {t('projects.membersSelected', 'members selected')}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/projects')}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('common.creating', 'Creating...')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('projects.createProject', 'Create Project')}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </AdminPageLayout>
  );
};

export default CreateProjectPage;
