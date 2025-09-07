import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Users, UserCheck, UserX } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const ParentsManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Statistics state
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  // Fetch parents data
  const fetchParents = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('users/users/', {
        params: { role: 'PARENT' }
      });
      
      let data = response.data?.results || response.data || response || [];
      if (!Array.isArray(data)) {
        console.warn('API returned non-array data:', data);
        data = [];
      }

      setParents(data);
      setFilteredParents(data);
      
      // Calculate statistics
      const stats = {
        total: data.length,
        active: data.filter(parent => parent.is_active).length,
        inactive: data.filter(parent => !parent.is_active).length
      };
      setStatistics(stats);
      
    } catch (error) {
      console.error('Failed to fetch parents:', error);
      toast.error(t('error.failedToLoadData'));
      setParents([]);
      setFilteredParents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  // Client-side filtering
  useEffect(() => {
    let filtered = parents;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(parent =>
        `${parent.first_name} ${parent.last_name}`.toLowerCase().includes(search) ||
        parent.email?.toLowerCase().includes(search) ||
        parent.phone?.includes(search) ||
        parent.children_names?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(parent => parent.is_active === isActive);
    }

    setFilteredParents(filtered);
  }, [parents, searchTerm, statusFilter]);

  // Action handlers
  const handleAddParent = () => {
    navigate('/admin/school-management/parents/add');
  };

  const handleViewParent = (parentId) => {
    navigate(`/admin/school-management/parents/view/${parentId}`);
  };

  const handleEditParent = (parentId) => {
    navigate(`/admin/school-management/parents/edit/${parentId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge 
        variant={isActive ? 'default' : 'secondary'}
        className={isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}
      >
        {isActive ? t('status.active') : t('status.inactive')}
      </Badge>
    );
  };

  // Statistics cards data
  const statsCards = [
    {
      title: t('admin.parentsManagement.stats.totalParents'),
      value: statistics.total,
      description: t('admin.parentsManagement.stats.totalParentsDescription'),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: t('admin.parentsManagement.stats.activeParents'),
      value: statistics.active,
      description: t('admin.parentsManagement.stats.activeParentsDescription'),
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      title: t('admin.parentsManagement.stats.inactiveParents'),
      value: statistics.inactive,
      description: t('admin.parentsManagement.stats.inactiveParentsDescription'),
      icon: UserX,
      color: 'text-red-600'
    }
  ];

  const actions = [
    <Button
      key="add-parent"
      onClick={handleAddParent}
      disabled={loading}
      className="gap-2"
    >
      <UserPlus className="h-4 w-4" />
      {parents.length === 0 ? t('action.addFirstParent') : t('action.addParent')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('admin.parentsManagement.title')}
        subtitle={t('admin.parentsManagement.subtitle')}
        actions={actions}
        loading={true}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loadingData')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('admin.parentsManagement.title')}
      subtitle={t('admin.parentsManagement.subtitle')}
      actions={actions}
    >
      <div className="space-y-6">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('common.searchAndFilter')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('common.search')}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('admin.parentsManagement.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('common.status')}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.allStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                    <SelectItem value="active">{t('status.active')}</SelectItem>
                    <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Summary */}
            {(searchTerm || statusFilter !== 'all') && (
              <div className="text-sm text-muted-foreground">
                {t('common.showingResults', {
                  start: 1,
                  end: filteredParents.length,
                  total: filteredParents.length
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parents Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.parentsManagement.parentsList')}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredParents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {parents.length === 0 
                    ? t('admin.parentsManagement.noParentsYet')
                    : (searchTerm || statusFilter !== 'all')
                      ? t('admin.parentsManagement.noParentsMatchingFilters')
                      : t('admin.parentsManagement.noParentsFound')
                  }
                </h3>
                {parents.length === 0 && (
                  <p className="text-muted-foreground mb-4">
                    {t('action.addFirstParent')}
                  </p>
                )}
                <Button onClick={handleAddParent} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  {t('action.addNewParent')}
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.name')}</TableHead>
                      <TableHead>{t('common.email')}</TableHead>
                      <TableHead>{t('common.phone')}</TableHead>
                      <TableHead>{t('parent.children')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead>{t('common.joinedDate')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParents.map((parent) => (
                      <TableRow key={parent.id}>
                        <TableCell>
                          <div className="font-medium">
                            {parent.first_name} {parent.last_name}
                          </div>
                          {(parent.ar_first_name || parent.ar_last_name) && (
                            <div className="text-sm text-muted-foreground" dir="rtl">
                              {parent.ar_first_name} {parent.ar_last_name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{parent.email || '-'}</TableCell>
                        <TableCell>{parent.phone || '-'}</TableCell>
                        <TableCell>{parent.children_names || '-'}</TableCell>
                        <TableCell>{getStatusBadge(parent.is_active)}</TableCell>
                        <TableCell>{formatDate(parent.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewParent(parent.id)}
                            >
                              {t('action.view')}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditParent(parent.id)}
                            >
                              {t('action.edit')}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default ParentsManagementPage;