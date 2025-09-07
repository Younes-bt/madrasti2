import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Mail, 
  Phone, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  UserPlus
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
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

const ParentsManagementPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const fetchParents = async () => {
    setLoading(true);
    try {
      const params = {
        role: 'PARENT'
      };

      const response = await apiMethods.get('users/users/', { params });

      let parentsData = [];
      
      // Handle different response structures
      if (response.results && Array.isArray(response.results)) {
        parentsData = response.results;
      } else if (Array.isArray(response)) {
        parentsData = response;
      } else if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          parentsData = response.data.results;
        } else if (Array.isArray(response.data)) {
          parentsData = response.data;
        }
      }

      setParents(parentsData);

      // Update statistics based on all parents data
      const activeCount = parentsData.filter(parent => parent.is_active).length;
      setStats({
        total: parentsData.length,
        active: activeCount,
        inactive: parentsData.length - activeCount
      });

    } catch (error) {
      console.error('Failed to fetch parents:', error);
      console.error('Error response:', error.response);
      toast.error(t('error.failedToLoadData'));
      setParents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  // Client-side filtering
  const filteredParents = parents.filter(parent => {
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch = 
        parent.first_name?.toLowerCase().includes(query) ||
        parent.last_name?.toLowerCase().includes(query) ||
        parent.full_name?.toLowerCase().includes(query) ||
        parent.email?.toLowerCase().includes(query) ||
        parent.phone?.toLowerCase().includes(query) ||
        parent.ar_first_name?.toLowerCase().includes(query) ||
        parent.ar_last_name?.toLowerCase().includes(query);
    }

    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = statusFilter === 'active' ? parent.is_active : !parent.is_active;
    }

    return matchesSearch && matchesStatus;
  });

  // Helper function to get display name based on language
  const getDisplayName = (parent) => {
    const isArabic = i18n.language === 'ar';
    if (isArabic && (parent.ar_first_name || parent.ar_last_name)) {
      return `${parent.ar_first_name || ''} ${parent.ar_last_name || ''}`.trim();
    }
    return parent.full_name || `${parent.first_name || ''} ${parent.last_name || ''}`.trim();
  };

  const handleViewParent = (parentId) => {
    navigate(`/admin/school-management/parents/view/${parentId}`);
  };

  const handleEditParent = (parentId) => {
    navigate(`/admin/school-management/parents/edit/${parentId}`);
  };

  const handleDeleteParent = (parentId) => {
    toast.info(`${t('action.delete')} parent: ${parentId}`);
  };

  const handleAddParent = () => {
    navigate('/admin/school-management/parents/add');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // ParentCard component for card-based layout
  const ParentCard = ({ parent }) => (
    <Card className="bg-card border-border shadow-md rounded-lg p-3 transition-transform transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {parent.profile_picture_url ? (
              <img src={parent.profile_picture_url} alt={parent.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-primary">
                {(parent.first_name?.[0] || '') + (parent.last_name?.[0] || '')}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-card-foreground leading-tight">{getDisplayName(parent)}</h3>
          <p className="text-xs text-muted-foreground">Parent</p>
          <Badge
            className={`mt-1.5 text-xs ${parent.is_active 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700/60' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300 border border-gray-200 dark:border-gray-600/60'
            }`}
          >
            {parent.is_active ? t('status.active') : t('status.inactive')}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-7 w-7 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewParent(parent.id)}><Eye className="mr-2 h-4 w-4" /><span>{t('action.view')}</span></DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditParent(parent.id)}><Edit className="mr-2 h-4 w-4" /><span>{t('action.edit')}</span></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteParent(parent.id)} className="text-red-600 focus:text-red-500 focus:bg-red-500/10"><Trash2 className="mr-2 h-4 w-4" /><span>{t('action.delete')}</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs">
        <div className="flex items-center text-muted-foreground"><Mail className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /><span className="truncate">{parent.email}</span></div>
        <div className="flex items-center text-muted-foreground"><Phone className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /><span>{parent.phone || '—'}</span></div>
        <div className="flex items-center text-muted-foreground justify-between mt-1 pt-1 border-t border-border/50">
          <span className="font-semibold text-foreground/80">Joined:</span><span>{formatDate(parent.created_at)}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <AdminPageLayout
        title={t('admin.parentsManagement.title')}
        subtitle={t('admin.parentsManagement.subtitle')}
        actions={[
          <Button key="add-parent" onClick={handleAddParent} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
            <Plus className="h-4 w-4" />{t('action.addParent')}
          </Button>
        ]}
        loading={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<Users className="h-5 w-5 text-muted-foreground" />} label={t('admin.parentsManagement.stats.totalParents')} value={stats.total} colorClass="text-primary" description={t('admin.parentsManagement.stats.totalParentsDescription')} />
          <StatCard icon={<CheckCircle className="h-5 w-5 text-green-500" />} label={t('admin.parentsManagement.stats.activeParents')} value={stats.active} colorClass="text-green-500" description={t('admin.parentsManagement.stats.activeParentsDescription')} />
          <StatCard icon={<XCircle className="h-5 w-5 text-red-500" />} label={t('admin.parentsManagement.stats.inactiveParents')} value={stats.inactive} colorClass="text-red-500" description={t('admin.parentsManagement.stats.inactiveParentsDescription')} />
        </div>

        <Card className="mb-8 p-4 bg-card border-border shadow-sm rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder={t('admin.parentsManagement.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 rounded-lg bg-background md:bg-input" />
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

        {filteredParents.length > 0 ? (
          // Adjusted grid to fit more cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {filteredParents.map((parent) => <ParentCard key={parent.id} parent={parent} />)}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center bg-card rounded-xl border border-dashed border-border">
            <Users className="h-20 w-20 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('admin.parentsManagement.noParentsFound')}</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery || statusFilter !== 'all' ? t('admin.parentsManagement.noParentsMatchingFilters') : t('admin.parentsManagement.noParentsYet')}
            </p>
            {(!searchQuery && statusFilter === 'all' && parents.length === 0) && (
              <Button onClick={handleAddParent} className="mt-6 gap-2 bg-primary text-primary-foreground"><UserPlus className="h-4 w-4" />{t('action.addFirstParent')}</Button>
            )}
          </div>
        )}
      </AdminPageLayout>
    </div>
  );
};

export default ParentsManagementPage;