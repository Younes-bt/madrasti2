import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Users, Mail, Phone, MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';


const StatCard = ({ icon, label, value, colorClass, description }) => (
  <Card className="bg-card border-border shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const StaffManagementPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const fetchStaffMembers = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('users/users/', { params: { role: 'STAFF' } });
      let staffData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      
      setStaffMembers(staffData);
      setFilteredStaff(staffData);

      const activeCount = staffData.filter(staff => staff.is_active).length;
      setStats({
        total: staffData.length,
        active: activeCount,
        inactive: staffData.length - activeCount
      });

    } catch (error) {
      console.error('Failed to fetch staff members:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, [t]);

  useEffect(() => {
    let filtered = staffMembers;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(staff =>
        Object.values(staff).some(value => String(value).toLowerCase().includes(query))
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(staff => (statusFilter === 'active' ? staff.is_active : !staff.is_active));
    }
    setFilteredStaff(filtered);
  }, [searchQuery, statusFilter, staffMembers]);

  const handleViewStaff = (staffId) => navigate(`/admin/school-management/staff/view/${staffId}`);
  const handleEditStaff = (staffId) => navigate(`/admin/school-management/staff/edit/${staffId}`);
  const handleDeleteStaff = (staffId) => toast.info(`${t('action.delete')} staff member: ${staffId}`);
  const handleAddStaff = () => navigate('/admin/school-management/staff/add');

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to get display name based on language
  const getDisplayName = (staff) => {
    const isArabic = i18n.language === 'ar';
    if (isArabic && (staff.ar_first_name || staff.ar_last_name)) {
      return `${staff.ar_first_name || ''} ${staff.ar_last_name || ''}`.trim();
    }
    return staff.full_name || `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
  };

  // More compact Staff Card component
  const StaffCard = ({ staff }) => (
    <Card className="bg-card border-border shadow-md rounded-lg p-3 transition-transform transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {staff.profile_picture_url ? (
              <img src={staff.profile_picture_url} alt={staff.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-primary">
                {(staff.first_name?.[0] || '') + (staff.last_name?.[0] || '')}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-card-foreground leading-tight">{getDisplayName(staff)}</h3>
          <p className="text-xs text-muted-foreground">{staff.position || 'Staff'}</p>
          <Badge
            className={`mt-1.5 text-xs ${staff.is_active 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700/60' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300 border border-gray-200 dark:border-gray-600/60'
            }`}
          >
            {staff.is_active ? t('status.active') : t('status.inactive')}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-7 w-7 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewStaff(staff.id)}><Eye className="mr-2 h-4 w-4" /><span>{t('action.view')}</span></DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditStaff(staff.id)}><Edit className="mr-2 h-4 w-4" /><span>{t('action.edit')}</span></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteStaff(staff.id)} className="text-red-600 focus:text-red-500 focus:bg-red-500/10"><Trash2 className="mr-2 h-4 w-4" /><span>{t('action.delete')}</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs">
        <div className="flex items-center text-muted-foreground"><Mail className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /><span className="truncate">{staff.email}</span></div>
        <div className="flex items-center text-muted-foreground"><Phone className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /><span>{staff.phone || '—'}</span></div>
        <div className="flex items-center text-muted-foreground justify-between mt-1 pt-1 border-t border-border/50">
          <span className="font-semibold text-foreground/80">Joined:</span><span>{formatDate(staff.created_at)}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <AdminPageLayout
        title={t('adminSidebar.schoolManagement.staff')}
        subtitle={t('admin.staffManagement.subtitle')}
        actions={[
          <Button key="add-staff" onClick={handleAddStaff} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
            <Plus className="h-4 w-4" />{t('action.addStaff')}
          </Button>
        ]}
        loading={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<Users className="h-5 w-5 text-muted-foreground" />} label={t('admin.staffManagement.stats.totalStaff')} value={stats.total} colorClass="text-primary" description={t('admin.staffManagement.stats.totalStaffDescription')} />
          <StatCard icon={<CheckCircle className="h-5 w-5 text-green-500" />} label={t('admin.staffManagement.stats.activeStaff')} value={stats.active} colorClass="text-green-500" description={t('admin.staffManagement.stats.activeStaffDescription')} />
          <StatCard icon={<XCircle className="h-5 w-5 text-red-500" />} label={t('admin.staffManagement.stats.inactiveStaff')} value={stats.inactive} colorClass="text-red-500" description={t('admin.staffManagement.stats.inactiveStaffDescription')} />
        </div>

        <Card className="mb-8 p-4 bg-card border-border shadow-sm rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder={t('admin.staffManagement.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 rounded-lg bg-background md:bg-input" />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-12 rounded-lg bg-background md:bg-input"><Filter className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue placeholder={t('common.status')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                  <SelectItem value="active">{t('status.active')}</SelectItem>
                  <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {filteredStaff.length > 0 ? (
          // Adjusted grid to fit more cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {filteredStaff.map((staff) => <StaffCard key={staff.id} staff={staff} />)}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center bg-card rounded-xl border border-dashed border-border">
            <Users className="h-20 w-20 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('admin.staffManagement.noStaffFound')}</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery || statusFilter !== 'all' ? t('admin.staffManagement.noStaffMatchingFilters') : t('admin.staffManagement.noStaffYet')}
            </p>
            {(!searchQuery && statusFilter === 'all' && staffMembers.length === 0) && (
              <Button onClick={handleAddStaff} className="mt-6 gap-2 bg-primary text-primary-foreground"><UserPlus className="h-4 w-4" />{t('action.addFirstStaff')}</Button>
            )}
          </div>
        )}
      </AdminPageLayout>
    </div>
  );
};

export default StaffManagementPage;