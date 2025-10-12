import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, Users, Mail, Phone, MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle, UserPlus, Briefcase, TrendingUp, Sparkles } from 'lucide-react';
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
import { getStaffPositionLabel } from '../../constants/staffPositions';

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

const GlowingCard = ({ children, className = "", glowColor = "blue" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`relative group ${className}`}
  >
    <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glowColor}-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
    <div className="relative bg-card border rounded-xl backdrop-blur-sm">
      {children}
    </div>
  </motion.div>
)

const StatCard = ({ icon: Icon, label, value, colorClass, description, glowColor }) => (
  <GlowingCard glowColor={glowColor}>
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <motion.div 
          className={`p-2 sm:p-3 rounded-full bg-gradient-to-br from-${glowColor}-500 to-${glowColor}-600 text-white shadow-lg flex-shrink-0`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>
        <div className="flex-1 space-y-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
          <div className={`text-lg sm:text-3xl font-bold ${colorClass}`}>
            <AnimatedCounter to={value} />
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
        </div>
      </div>
    </CardContent>
  </GlowingCard>
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
  const language = i18n.language || 'en';

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

  // Staff Card component with animations
  const StaffCard = ({ staff, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <GlowingCard glowColor="orange" className="h-full">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-start space-x-3 mb-4">
            <motion.div 
              className="flex-shrink-0 relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden shadow-lg">
                {staff.profile_picture_url ? (
                  <img src={staff.profile_picture_url} alt={staff.full_name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {(staff.first_name?.[0] || '') + (staff.last_name?.[0] || '')}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1">
                <motion.div
                  className={`w-4 h-4 rounded-full border-2 border-white ${staff.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <motion.h3 
                className="font-bold text-base text-card-foreground leading-tight truncate group-hover:text-orange-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {getDisplayName(staff)}
              </motion.h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {getStaffPositionLabel(t, staff.position, language)}
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Badge
                  className={`mt-2 text-xs transition-colors ${staff.is_active 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {staff.is_active ? t('status.active') : t('status.inactive')}
                </Badge>
              </motion.div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleViewStaff(staff.id)} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" /><span>{t('action.view')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditStaff(staff.id)} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" /><span>{t('action.edit')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleDeleteStaff(staff.id)} 
                  className="text-red-600 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" /><span>{t('action.delete')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-auto space-y-3 pt-3 border-t border-border/50">
            <motion.div 
              className="flex items-center text-muted-foreground hover:text-orange-600 transition-colors cursor-pointer"
              whileHover={{ x: 5 }}
            >
              <Mail className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span className="text-xs truncate">{staff.email}</span>
            </motion.div>
            <motion.div 
              className="flex items-center text-muted-foreground hover:text-orange-600 transition-colors cursor-pointer"
              whileHover={{ x: 5 }}
            >
              <Phone className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span className="text-xs">{staff.phone || '—'}</span>
            </motion.div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/30">
              <span className="text-muted-foreground">Joined:</span>
              <span className="font-medium text-foreground">{formatDate(staff.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </GlowingCard>
    </motion.div>
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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Statistics Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <StatCard 
              icon={Users} 
              label={t('admin.staffManagement.stats.totalStaff')} 
              value={stats.total} 
              colorClass="text-orange-600" 
              description={t('admin.staffManagement.stats.totalStaffDescription')}
              glowColor="orange"
            />
            <StatCard 
              icon={CheckCircle} 
              label={t('admin.staffManagement.stats.activeStaff')} 
              value={stats.active} 
              colorClass="text-green-600" 
              description={t('admin.staffManagement.stats.activeStaffDescription')}
              glowColor="green"
            />
            <StatCard 
              icon={XCircle} 
              label={t('admin.staffManagement.stats.inactiveStaff')} 
              value={stats.inactive} 
              colorClass="text-red-600" 
              description={t('admin.staffManagement.stats.inactiveStaffDescription')}
              glowColor="red"
            />
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlowingCard glowColor="orange" className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Input 
                      placeholder={t('admin.staffManagement.searchPlaceholder')} 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="pl-10 h-12 rounded-lg border-0 bg-gray-50 focus:bg-white transition-colors shadow-inner" 
                    />
                  </motion.div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-[180px] h-12 rounded-lg border-0 bg-gray-50 shadow-inner">
                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder={t('common.status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                        <SelectItem value="active">{t('status.active')}</SelectItem>
                        <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
              </div>
            </GlowingCard>
          </motion.div>

          {/* Staff Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {filteredStaff.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredStaff.map((staff, index) => 
                  <StaffCard key={staff.id} staff={staff} index={index} />
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center py-20 flex flex-col items-center"
              >
                <GlowingCard glowColor="gray" className="p-12">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4,
                      ease: "easeInOut"
                    }}
                  >
                    <Briefcase className="h-20 w-20 text-muted-foreground/50 mb-4 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('admin.staffManagement.noStaffFound')}
                  </h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    {searchQuery || statusFilter !== 'all' 
                      ? t('admin.staffManagement.noStaffMatchingFilters') 
                      : t('admin.staffManagement.noStaffYet')
                    }
                  </p>
                  {(!searchQuery && statusFilter === 'all' && staffMembers.length === 0) && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={handleAddStaff} 
                        className="mt-6 gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg"
                      >
                        <UserPlus className="h-4 w-4" />
                        {t('action.addFirstStaff')}
                      </Button>
                    </motion.div>
                  )}
                </GlowingCard>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </AdminPageLayout>
    </div>
  );
};

export default StaffManagementPage;
