import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Users, Mail, Phone, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

const StaffManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 20
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const fetchStaffMembers = async () => {
    setLoading(true);
    try {
      // Fetch all staff members without pagination or filtering
      const params = {
        role: 'STAFF'
        // Remove pagination to get all staff members at once
      };

      const response = await apiMethods.get('users/users/', { params });

      let staffData = [];
      
      // Handle different response structures
      if (response.results && Array.isArray(response.results)) {
        // DRF paginated response - get all pages if paginated
        staffData = response.results;
        // If there are more pages, we might want to fetch all, but for now assume small dataset
      } else if (Array.isArray(response)) {
        // Direct array response
        staffData = response;
      } else if (response.data) {
        // Handle case where response is wrapped
        if (response.data.results && Array.isArray(response.data.results)) {
          staffData = response.data.results;
        } else if (Array.isArray(response.data)) {
          staffData = response.data;
        }
      }

      setStaffMembers(staffData);
      setFilteredStaff(staffData);

      // Update statistics based on all staff data
      const activeCount = staffData.filter(staff => staff.is_active).length;
      setStats({
        total: staffData.length,
        active: activeCount,
        inactive: staffData.length - activeCount
      });

      // Update pagination for display purposes
      setPagination({
        count: staffData.length,
        currentPage: 1,
        totalPages: 1,
        pageSize: staffData.length
      });

    } catch (error) {
      console.error('Failed to fetch staff members:', error);
      console.error('Error response:', error.response);
      toast.error(t('error.failedToLoadData'));
      setStaffMembers([]);
      setFilteredStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  // Client-side filtering - no API calls needed
  useEffect(() => {
    let filtered = staffMembers;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(staff =>
        staff.first_name?.toLowerCase().includes(query) ||
        staff.last_name?.toLowerCase().includes(query) ||
        staff.full_name?.toLowerCase().includes(query) ||
        staff.email?.toLowerCase().includes(query) ||
        staff.phone?.toLowerCase().includes(query) ||
        staff.position?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(staff => 
        statusFilter === 'active' ? staff.is_active : !staff.is_active
      );
    }

    setFilteredStaff(filtered);

    // Update statistics based on filtered data for display
    const activeCount = filtered.filter(staff => staff.is_active).length;
    const displayStats = {
      total: filtered.length,
      active: activeCount,
      inactive: filtered.length - activeCount
    };
    
    // Only update display stats if we have filters applied
    if (searchQuery.trim() || statusFilter !== 'all') {
      // Show filtered stats in some way if needed
      // For now, keep original stats to show total counts
    }

  }, [searchQuery, statusFilter, staffMembers]);

  const handleSearch = () => {
    // No longer needed since filtering is automatic
  };

  const handleViewStaff = (staffId) => {
    navigate(`/admin/school-management/staff/view/${staffId}`);
  };

  const handleEditStaff = (staffId) => {
    navigate(`/admin/school-management/staff/edit/${staffId}`);
  };

  const handleDeleteStaff = (staffId) => {
    toast.info(`${t('action.delete')} staff member: ${staffId}`);
  };

  const handleAddStaff = () => {
    navigate('/admin/school-management/staff/add');
  };

  // No longer needed - removed pagination

  const getStatusBadge = (isActive) => {
    return (
      <Badge 
        variant={isActive ? 'success' : 'secondary'}
        className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
      >
        {isActive ? t('status.active') : t('status.inactive')}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const actions = [
    <Button key="add-staff" onClick={handleAddStaff} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('action.addStaff')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('adminSidebar.schoolManagement.staff')}
      subtitle={t('admin.staffManagement.subtitle')}
      actions={actions}
      loading={loading}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('admin.staffManagement.stats.totalStaff')}
            </h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.staffManagement.stats.totalStaffDescription')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('admin.staffManagement.stats.activeStaff')}
            </h3>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.staffManagement.stats.activeStaffDescription')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('admin.staffManagement.stats.inactiveStaff')}
            </h3>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.staffManagement.stats.inactiveStaffDescription')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">{t('common.searchAndFilter')}</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.staffManagement.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                <SelectItem value="active">{t('status.active')}</SelectItem>
                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('admin.staffManagement.staffList')}</h3>
            <div className="text-sm text-muted-foreground">
              {t('common.showingResults', {
                start: 1,
                end: filteredStaff.length,
                total: filteredStaff.length
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {t('admin.staffManagement.noStaffFound')}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? t('admin.staffManagement.noStaffMatchingFilters')
                  : t('admin.staffManagement.noStaffYet')
                }
              </p>
              {(!searchQuery && statusFilter === 'all' && staffMembers.length === 0) && (
                <Button onClick={handleAddStaff} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('action.addFirstStaff')}
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.name')}</TableHead>
                    <TableHead>{t('common.email')}</TableHead>
                    <TableHead>{t('common.phone')}</TableHead>
                    <TableHead>{t('staff.position')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.joinedDate')}</TableHead>
                    <TableHead>{t('common.lastLogin')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              {staff.profile_picture_url ? (
                                <img
                                  src={staff.profile_picture_url}
                                  alt={staff.full_name}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-600">
                                  {(staff.first_name?.[0] || '') + (staff.last_name?.[0] || '')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {staff.full_name || `${staff.first_name || ''} ${staff.last_name || ''}`.trim()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {staff.role}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {staff.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          {staff.phone || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {staff.position || '-'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(staff.is_active)}
                      </TableCell>
                      <TableCell>
                        {formatDate(staff.created_at)}
                      </TableCell>
                      <TableCell>
                        {formatDate(staff.last_login)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewStaff(staff.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t('action.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStaff(staff.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t('action.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteStaff(staff.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('action.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination removed - showing all results with client-side filtering */}
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
};

export default StaffManagementPage;