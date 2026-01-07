import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, Users, Mail, Phone, MoreVertical, Edit, Trash2, CheckCircle, XCircle, UserPlus, Briefcase, X } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
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
import { getStaffPositionLabel, STAFF_POSITION_OPTIONS } from '../../constants/staffPositions';

const AnimatedCounter = ({ from = 0, to, duration = 2, className = "" }) => {
  const ref = useRef()
  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState(from)

  useEffect(() => {
    if (isInView && to !== undefined) {
      animate(motionValue, to, { duration: duration })
    }
  }, [motionValue, isInView, to, duration])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </span>
  )
}

const StatCard = ({ icon: Icon, label, value, description, iconColor, iconBg }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <div className="text-3xl font-bold text-foreground">
              <AnimatedCounter to={value} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const StaffManagementPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');

  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, byPosition: {} });
  const language = i18n.language || 'en';

  const fetchStaffMembers = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('users/users/', { params: { role: 'STAFF' } });
      let staffData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);

      setStaffMembers(staffData);
      setFilteredStaff(staffData);

      const activeCount = staffData.filter(staff => staff.is_active).length;

      // Calculate position-based statistics
      const positionStats = {};
      staffData.forEach(staff => {
        const position = staff.position || 'UNKNOWN';
        positionStats[position] = (positionStats[position] || 0) + 1;
      });

      setStats({
        total: staffData.length,
        active: activeCount,
        inactive: staffData.length - activeCount,
        byPosition: positionStats
      });

    } catch (error) {
      console.error('Failed to fetch staff members:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStaffMembers();
  }, [t, fetchStaffMembers]);

  useEffect(() => {
    let filtered = staffMembers;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(staff => {
        const searchableFields = [
          staff.first_name,
          staff.last_name,
          staff.ar_first_name,
          staff.ar_last_name,
          staff.email,
          staff.phone,
          getStaffPositionLabel(t, staff.position, language)
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableFields.includes(query);
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(staff => (statusFilter === 'active' ? staff.is_active : !staff.is_active));
    }

    // Position filter
    if (positionFilter !== 'all') {
      filtered = filtered.filter(staff => staff.position === positionFilter);
    }

    setFilteredStaff(filtered);
  }, [searchQuery, statusFilter, positionFilter, staffMembers, t, language]);

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

  // Staff Card component with modern design
  const StaffCard = ({ staff, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group h-full"
    >
      <Card
        className="h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg rounded-2xl cursor-pointer"
        onClick={() => handleViewStaff(staff.id)}
      >
        <CardContent className="p-4 md:p-6 h-full flex flex-col relative">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              className="flex-shrink-0 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking avatar specifically if needed
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
                {staff.profile_picture_url ? (
                  <img src={staff.profile_picture_url} alt={staff.full_name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold text-primary">
                    {(staff.first_name?.[0] || '') + (staff.last_name?.[0] || '')}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1">
                <div className={`w-3 h-3 rounded-full border-2 border-background ${staff.is_active ? 'bg-green-500' : 'bg-muted'}`} />
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-medium text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                {getDisplayName(staff)}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Briefcase className="h-3.5 w-3.5" />
                {getStaffPositionLabel(t, staff.position, language)}
              </p>
              <div className="mt-2">
                <Badge
                  variant={staff.is_active ? "default" : "secondary"}
                  className="text-[10px] font-medium px-2 py-0 h-5"
                >
                  {staff.is_active ? t('status.active') : t('status.inactive')}
                </Badge>
              </div>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleEditStaff(staff.id)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    <span>{t('action.edit')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteStaff(staff.id)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>{t('action.delete')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-auto space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center text-muted-foreground group/item hover:text-foreground transition-colors overflow-hidden">
              <Mail className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span className="text-xs truncate">{staff.email}</span>
            </div>
            <div className="flex items-center text-muted-foreground group/item hover:text-foreground transition-colors">
              <Phone className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span className="text-xs">{staff.phone || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-muted-foreground">{t('common.joined') || 'Joined'}</span>
              <span className="font-medium text-foreground">{formatDate(staff.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );


  return (
    <div className="min-h-screen">
      <AdminPageLayout
        title={t('adminSidebar.schoolManagement.staff')}
        subtitle={t('admin.staffManagement.subtitle')}
        actions={[
          <Button key="add-staff" onClick={handleAddStaff} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('action.addStaff')}
          </Button>
        ]}
        loading={loading}
      >
        <div className="space-y-6">
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={Users}
              label={t('admin.staffManagement.stats.totalStaff')}
              value={stats.total}
              description={t('admin.staffManagement.stats.totalStaffDescription')}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-100 dark:bg-blue-500/20"
            />
            <StatCard
              icon={CheckCircle}
              label={t('admin.staffManagement.stats.activeStaff')}
              value={stats.active}
              description={t('admin.staffManagement.stats.activeStaffDescription')}
              iconColor="text-green-600 dark:text-green-400"
              iconBg="bg-green-100 dark:bg-green-500/20"
            />
            <StatCard
              icon={XCircle}
              label={t('admin.staffManagement.stats.inactiveStaff')}
              value={stats.inactive}
              description={t('admin.staffManagement.stats.inactiveStaffDescription')}
              iconColor="text-red-600 dark:text-red-400"
              iconBg="bg-red-100 dark:bg-red-500/20"
            />
          </div>

          {/* Search and Filter Section */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={t('admin.staffManagement.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-muted/50 border-0 focus-visible:ring-1"
                  />
                </div>

                {/* Filter Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span>{t('common.filters')}:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-9 w-[160px] border-border/50">
                        <SelectValue placeholder={t('common.status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                        <SelectItem value="active">{t('status.active')}</SelectItem>
                        <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Position Filter */}
                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger className="h-9 w-[200px] border-border/50">
                        <Briefcase className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <SelectValue placeholder={t('staff.filterByPosition') || 'Filter by Position'} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">{t('staff.allPositions') || 'All Positions'}</SelectItem>
                        {STAFF_POSITION_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.translationKey)}
                            {stats.byPosition[option.value] && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({stats.byPosition[option.value]})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Active Filter Badges */}
                    {(searchQuery || statusFilter !== 'all' || positionFilter !== 'all') && (
                      <>
                        {searchQuery && (
                          <Badge
                            variant="secondary"
                            className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                            onClick={() => setSearchQuery('')}
                          >
                            <Search className="h-3 w-3" />
                            {searchQuery}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        )}
                        {statusFilter !== 'all' && (
                          <Badge
                            variant="secondary"
                            className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                            onClick={() => setStatusFilter('all')}
                          >
                            {t(`status.${statusFilter}`)}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        )}
                        {positionFilter !== 'all' && (
                          <Badge
                            variant="secondary"
                            className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                            onClick={() => setPositionFilter('all')}
                          >
                            <Briefcase className="h-3 w-3" />
                            {t(`staff.positions.${positionFilter}`)}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                            setPositionFilter('all');
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          {t('common.reset')}
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {filteredStaff.length} {t('common.results') || 'results'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff Grid */}
          <div>
            {filteredStaff.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredStaff.map((staff, index) =>
                  <StaffCard key={staff.id} staff={staff} index={index} />
                )}
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Briefcase className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('admin.staffManagement.noStaffFound')}
                  </h3>
                  <p className="text-muted-foreground text-center max-w-sm mb-6">
                    {searchQuery || statusFilter !== 'all' || positionFilter !== 'all'
                      ? t('admin.staffManagement.noStaffMatchingFilters')
                      : t('admin.staffManagement.noStaffYet')
                    }
                  </p>
                  {(!searchQuery && statusFilter === 'all' && positionFilter === 'all' && staffMembers.length === 0) && (
                    <Button onClick={handleAddStaff} className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      {t('action.addFirstStaff')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AdminPageLayout>
    </div>
  );
};

export default StaffManagementPage;
