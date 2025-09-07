import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Edit, User, Mail, Phone, MapPin, Calendar, FileText, Camera, DollarSign, Briefcase, Globe,
  Building, ShieldCheck, UserCheck, Linkedin, Twitter, ArrowLeft, Sun, Moon
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

// --- Reusable Theme Toggle Component (as in previous example) ---
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
};

const ThemeToggleButton = () => {
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    )
}

// --- Enhanced Info Components for the new design ---

const DetailItem = ({ icon, label, value, children }) => (
    <div className="flex items-start py-3">
        <div className="flex-shrink-0 w-8 mt-1 text-muted-foreground">{icon}</div>
        <div className="flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
            <div className="text-base text-foreground break-words">{children || value || '—'}</div>
        </div>
    </div>
);

const ViewStaffPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { staffId } = useParams();
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      setLoading(true);
      try {
        const response = await apiMethods.get(`users/users/${staffId}/`);
        setStaffData(response.data || response);
      } catch (error) {
        console.error('Failed to fetch staff data:', error);
        toast.error(t('error.failedToLoadStaffData'));
        navigate('/admin/school-management/staff');
      } finally {
        setLoading(false);
      }
    };
    if (staffId) {
      fetchStaffData();
    }
  }, [staffId, navigate, t]);

  const handleEdit = () => navigate(`/admin/school-management/staff/edit/${staffId}`);
  
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminPageLayout title={t('staff.viewStaff')} loading={true}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminPageLayout>
    );
  }

  if (!staffData) {
    return (
      <AdminPageLayout title={t('error.staffNotFound')} showBackButton backButtonPath="/admin/school-management/staff">
        <div className="text-center py-20">
          <p>{t('error.couldNotFindStaff')}</p>
        </div>
      </AdminPageLayout>
    );
  }

  const actions = [
    <ThemeToggleButton key="theme-toggle" />,
    <Button key="edit" onClick={handleEdit} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
      <Edit className="h-4 w-4" />{t('action.editProfile')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('staff.staffProfile')}
      subtitle={`${t('staff.viewStaffDescription')} for ${staffData.first_name} ${staffData.last_name}`}
      showBackButton
      backButtonPath="/admin/school-management/staff"
      actions={actions}
    >
      <div className="max-w-7xl mx-auto">
        {/* --- Profile Hero Section --- */}
        <Card className="mb-8 overflow-hidden border-border shadow-lg">
          <div className="bg-card p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-background shadow-inner">
                  {staffData.profile_picture_url ? (
                    <img src={staffData.profile_picture_url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-2 border-card ${staffData.is_active ? 'bg-green-500' : 'bg-gray-500'}`} title={staffData.is_active ? t('status.active') : t('status.inactive')}></div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-foreground">{staffData.first_name} {staffData.last_name}</h1>
                <p className="text-lg text-primary">{staffData.position || t('roles.staff')}</p>
                {(staffData.ar_first_name || staffData.ar_last_name) && (
                  <p className="text-muted-foreground" dir="rtl">{staffData.ar_first_name} {staffData.ar_last_name}</p>
                )}
                {staffData.department && (
                  <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-muted-foreground text-sm">
                    <Building className="h-4 w-4" />
                    <span>{staffData.department}</span>
                  </div>
                )}
              </div>
              <div className="md:ml-auto flex items-center gap-2">
                {staffData.linkedin_url && (
                    <Button asChild variant="outline" size="icon">
                        <a href={staffData.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a>
                    </Button>
                )}
                {staffData.twitter_url && (
                    <Button asChild variant="outline" size="icon">
                        <a href={staffData.twitter_url} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
                    </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* --- Tabs for Detailed Information --- */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card border border-border">
            <TabsTrigger value="overview">{t('common.overview')}</TabsTrigger>
            <TabsTrigger value="contact">{t('staff.contactInformation')}</TabsTrigger>
            <TabsTrigger value="professional">{t('staff.professionalInformation')}</TabsTrigger>
            <TabsTrigger value="bio">{t('common.bio')}</TabsTrigger>
          </TabsList>

          <Card className="mt-4 border-border shadow-md">
            <CardContent className="p-6">
              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  <DetailItem icon={<ShieldCheck size={20} />} label={t('staff.accountStatus')}>
                      <Badge className={staffData.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300'}>
                          {staffData.is_active ? t('status.active') : t('status.inactive')}
                      </Badge>
                  </DetailItem>
                  <DetailItem icon={<UserCheck size={20} />} label={t('common.role')}>
                      <Badge variant="secondary">{t(`roles.${staffData.role?.toLowerCase()}`, staffData.role)}</Badge>
                  </DetailItem>
                  <DetailItem icon={<Calendar size={20} />} label={t('common.joinedDate')} value={formatDate(staffData.created_at)} />
                  <DetailItem icon={<Calendar size={20} />} label={t('common.lastLogin')} value={formatDate(staffData.last_login)} />
                  <div className="md:col-span-2 pt-4 mt-4 border-t border-border">
                    <h3 className="text-lg font-semibold mb-2">{t('staff.emergencyContact')}</h3>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                        <DetailItem icon={<User size={20} />} label={t('staff.emergencyContactName')} value={staffData.emergency_contact_name} />
                        <DetailItem icon={<Phone size={20} />} label={t('staff.emergencyContactPhone')} value={staffData.emergency_contact_phone} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact">
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 divide-y md:divide-y-0 divide-border">
                    <DetailItem icon={<Mail size={20} />} label={t('common.email')}>
                        <a href={`mailto:${staffData.email}`} className="text-primary hover:underline">{staffData.email}</a>
                    </DetailItem>
                    <DetailItem icon={<Phone size={20} />} label={t('common.phone')}>
                        <a href={`tel:${staffData.phone}`} className="text-primary hover:underline">{staffData.phone}</a>
                    </DetailItem>
                    <DetailItem icon={<MapPin size={20} />} label={t('common.address')} value={staffData.address} />
                    <DetailItem icon={<Calendar size={20} />} label={t('common.dateOfBirth')} value={formatDate(staffData.date_of_birth)} />
                </div>
              </TabsContent>
              
              <TabsContent value="professional">
                 <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                    <DetailItem icon={<Briefcase size={20} />} label={t('staff.position')} value={staffData.position} />
                    <DetailItem icon={<Building size={20} />} label={t('staff.department')} value={staffData.department} />
                    <DetailItem icon={<Calendar size={20} />} label={t('staff.hireDate')} value={formatDate(staffData.hire_date)} />
                    {staffData.salary && (
                        <DetailItem icon={<DollarSign size={20} />} label={t('staff.salary')}>
                            {`${parseFloat(staffData.salary).toLocaleString()} MAD`}
                        </DetailItem>
                    )}
                 </div>
              </TabsContent>

              <TabsContent value="bio">
                {staffData.bio ? (
                  <div className="prose dark:prose-invert max-w-none text-foreground">
                    <p>{staffData.bio}</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12" />
                    <p className="mt-4">{t('staff.noBioProvided')}</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </AdminPageLayout>
  );
};

export default ViewStaffPage;