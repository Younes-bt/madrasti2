import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building, Edit, ArrowLeft, Trash2, Users, Target, Layers,
  BookOpen, GraduationCap, Star, TrendingUp, CalendarDays,
  Award, Loader2, AlertCircle
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const ViewClassPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [error, setError] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

  useEffect(() => {
    fetchClass();
    fetchEnrollments();
  }, [id]);

  const fetchClass = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiMethods.get(`schools/classes/${id}/`);
      setClassData(response.data || response);
    } catch (error) {
      console.error('Failed to fetch class:', error);
      setError(t('classes.fetchError'));
      toast.error(t('classes.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    setEnrollmentsLoading(true);
    try {
      // Fetch all enrollments for this class
      const response = await apiMethods.get(`users/enrollments/?school_class=${id}&page_size=100`);
      setEnrollments(response.results || []);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      toast.error(t('classes.enrollmentsFetchError'));
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('classes.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/classes/${id}/`);
        toast.success(t('classes.deleteSuccess'));
        navigate('/admin/academic-management/classes');
      } catch (error) {
        console.error('Failed to delete class:', error);
        toast.error(t('classes.deleteError'));
      }
    }
  };

  const getDisplayName = (student) => {
    const isArabic = i18n.language === 'ar';
    if (isArabic && (student.ar_first_name || student.ar_last_name)) {
      return `${student.ar_first_name || ''} ${student.ar_last_name || ''}`.trim();
    }
    return student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const ActionButtons = () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => navigate('/admin/academic-management/classes')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </Button>
      {classData && (
        <>
          <Button
            onClick={() => navigate(`/admin/academic-management/classes/${id}/edit`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('common.delete')}
          </Button>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <AdminPageLayout
        title={t('classes.viewClass')}
        subtitle={t('classes.viewClassSubtitle')}
        ActionComponent={ActionButtons}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </AdminPageLayout>
    );
  }

  if (error || !classData) {
    return (
      <AdminPageLayout
        title={t('classes.viewClass')}
        subtitle={t('classes.viewClassSubtitle')}
        ActionComponent={ActionButtons}
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || t('classes.notFound')}
          </AlertDescription>
        </Alert>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={classData.name}
      subtitle={t('classes.viewClassSubtitle')}
      ActionComponent={ActionButtons}
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                {t('classes.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('classes.className')}</h4>
                    <span className="font-medium text-lg">{classData.name}</span>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('classes.section')}</h4>
                    <Badge variant="outline">{classData.section}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('classes.grade')}</h4>
                    <span className="font-medium">{classData.grade_name}</span>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('classes.academicYear')}</h4>
                    <span className="font-medium">{classData.academic_year_name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enrollments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  {t('classes.enrollment')}
                  <Badge variant="secondary" className="ml-2">
                    {enrollments.length}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enrollmentsLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : enrollments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('common.student')}</TableHead>
                        <TableHead>{t('common.studentId')}</TableHead>
                        <TableHead>{t('common.status')}</TableHead>
                        <TableHead>{t('common.enrolledOn')}</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map(({ id: enrollmentId, student, student_number, is_active, enrollment_date }) => (
                        <TableRow
                          key={enrollmentId}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate(`/admin/school-management/students/view/${student.id}`)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.profile_picture_url} alt={getDisplayName(student)} />
                                <AvatarFallback>
                                  {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{getDisplayName(student)}</div>
                                <div className="text-xs text-muted-foreground">{student.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student_number || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={is_active ? 'default' : 'secondary'} className={is_active ? 'bg-green-100 text-green-800' : ''}>
                              {is_active ? t('status.active') : t('status.inactive')}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(enrollment_date)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <ArrowLeft className="h-4 w-4 rotate-180" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>{t('classes.noStudentsEnrolled')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminPageLayout>
  );
};

export default ViewClassPage;
