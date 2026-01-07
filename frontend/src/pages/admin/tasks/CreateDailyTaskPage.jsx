import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Save, X, User, Calendar, FileText, AlertCircle } from 'lucide-react';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import tasksService from '../../../services/tasks';
import { apiMethods } from '../../../services/api';
import { toast } from 'sonner';

const CreateDailyTaskPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    title_arabic: '',
    title_french: '',
    description: '',
    assigned_to: '',
    due_date: '',
    priority: 'MEDIUM',
    admin_notes: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch users for assignment
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
    // Clear error for this field
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
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
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

    if (!formData.assigned_to) {
      newErrors.assigned_to = t('validation.assignedToRequired', 'Please select a user to assign this task');
    }

    if (!formData.due_date) {
      newErrors.due_date = t('validation.dueDateRequired', 'Due date is required');
    } else {
      const dueDate = new Date(formData.due_date);
      const now = new Date();
      if (dueDate < now) {
        newErrors.due_date = t('validation.dueDatePast', 'Due date cannot be in the past');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('error.pleaseFixErrors', 'Please fix the errors in the form'));
      return;
    }

    setLoading(true);
    try {
      await tasksService.createDailyTask(formData);
      toast.success(t('tasks.taskCreated', 'Task created successfully'));
      navigate('/admin/tasks');
    } catch (error) {
      console.error('Failed to create task:', error);
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
      toast.error(t('error.failedToCreateTask', 'Failed to create task'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageLayout
      title={t('tasks.createTask', 'Create New Task')}
      description={t('tasks.createTaskDescription', 'Create a new daily task and assign it to a team member')}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Title Section (Multilingual) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('tasks.taskTitle', 'Task Title')}
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
                    <Label htmlFor="title">{t('tasks.titleEnglish', 'Title (English)')}</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={t('tasks.titlePlaceholder', 'Enter task title...')}
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="ar" className="space-y-4">
                  <div>
                    <Label htmlFor="title_arabic">{t('tasks.titleArabic', 'Title (Arabic)')}</Label>
                    <Input
                      id="title_arabic"
                      name="title_arabic"
                      value={formData.title_arabic}
                      onChange={handleChange}
                      placeholder="أدخل عنوان المهمة..."
                      dir="rtl"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="fr" className="space-y-4">
                  <div>
                    <Label htmlFor="title_french">{t('tasks.titleFrench', 'Title (French)')}</Label>
                    <Input
                      id="title_french"
                      name="title_french"
                      value={formData.title_french}
                      onChange={handleChange}
                      placeholder="Entrez le titre de la tâche..."
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>{t('tasks.description', 'Description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('tasks.descriptionPlaceholder', 'Provide detailed task description...')}
                rows={5}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Assignment and Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('tasks.assignmentDetails', 'Assignment Details')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assigned To */}
              <div>
                <Label htmlFor="assigned_to">
                  {t('tasks.assignTo', 'Assign To')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => handleSelectChange('assigned_to', value)}
                >
                  <SelectTrigger className={errors.assigned_to ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('tasks.selectUser', 'Select a user...')} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.first_name} {user.last_name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assigned_to && (
                  <p className="text-sm text-red-500 mt-1">{errors.assigned_to}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Due Date */}
                <div>
                  <Label htmlFor="due_date">
                    {t('tasks.dueDate', 'Due Date')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={handleChange}
                    className={errors.due_date ? 'border-red-500' : ''}
                  />
                  {errors.due_date && (
                    <p className="text-sm text-red-500 mt-1">{errors.due_date}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <Label htmlFor="priority">{t('tasks.priority', 'Priority')}</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">{t('tasks.priority.low', 'Low')}</SelectItem>
                      <SelectItem value="MEDIUM">{t('tasks.priority.medium', 'Medium')}</SelectItem>
                      <SelectItem value="HIGH">{t('tasks.priority.high', 'High')}</SelectItem>
                      <SelectItem value="URGENT">{t('tasks.priority.urgent', 'Urgent')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="admin_notes">{t('tasks.adminNotes', 'Admin Notes (Optional)')}</Label>
                <Textarea
                  id="admin_notes"
                  name="admin_notes"
                  value={formData.admin_notes}
                  onChange={handleChange}
                  placeholder={t('tasks.adminNotesPlaceholder', 'Add any internal notes...')}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/tasks')}
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
                  {t('tasks.createTask', 'Create Task')}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </AdminPageLayout>
  );
};

export default CreateDailyTaskPage;
