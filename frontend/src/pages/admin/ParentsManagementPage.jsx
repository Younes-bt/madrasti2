import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  FileWarning
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const getLanguageCode = (language) => (language || 'en').split('-')[0];

const getLocalizedName = (user, language) => {
  if (!user) return '';
  const lang = getLanguageCode(language);
  const profile = user.profile || {};

  const fallback =
    user.full_name ||
    profile.full_name ||
    `${user.first_name || profile.first_name || ''} ${user.last_name || profile.last_name || ''}`.trim() ||
    user.username ||
    '';

  const resolveByPrefix = (prefix) => {
    const first = user[`${prefix}_first_name`] ?? profile[`${prefix}_first_name`];
    const last = user[`${prefix}_last_name`] ?? profile[`${prefix}_last_name`];
    const full = profile[`${prefix}_full_name`];
    const combined = `${first || ''} ${last || ''}`.trim();
    return (combined || full || '').trim();
  };

  if (lang === 'ar') {
    const arabicName = resolveByPrefix('ar');
    if (arabicName) return arabicName;
  }

  if (lang === 'fr') {
    const frenchName = resolveByPrefix('fr');
    if (frenchName) return frenchName;
  }

  return fallback.trim();
};

const StatCard = ({ icon: Icon, label, value, colorClass, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className={`h-4 w-4 text-muted-foreground ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const ParentsManagementPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const fetchParents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('role', 'PARENT');
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (currentPage) params.append('page', currentPage);

      const response = await apiMethods.get(`users/users/?${params.toString()}`);

      if (response.results && Array.isArray(response.results)) {
        // Fetch children count for each parent
        const parentsWithChildren = await Promise.all(
          response.results.map(async (parent) => {
            try {
              const childrenResponse = await apiMethods.get(`users/users/${parent.id}/children/`);
              const children = Array.isArray(childrenResponse.children) ? childrenResponse.children : [];

              return {
                ...parent,
                children,
                children_count: childrenResponse.total_children ?? children.length
              };
            } catch (error) {
              // If fetching children fails, just set count to 0
              return {
                ...parent,
                children: [],
                children_count: 0
              };
            }
          })
        );

        setParents(parentsWithChildren);
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous
        });
      } else {
        setParents([]);
        setPagination(null);
      }

    } catch (error) {
      console.error('Failed to fetch parents:', error);
      toast.error(t('error.failedToLoadData'));
      setParents([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, currentPage, t]);

  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('role', 'PARENT');
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);

      const activeParams = new URLSearchParams(params);
      activeParams.append('is_active', 'true');

      const inactiveParams = new URLSearchParams(params);
      inactiveParams.append('is_active', 'false');

      const [totalResponse, activeResponse, inactiveResponse] = await Promise.all([
        apiMethods.get(`users/users/?${params.toString()}&page=1`),
        apiMethods.get(`users/users/?${activeParams.toString()}&page=1`),
        apiMethods.get(`users/users/?${inactiveParams.toString()}&page=1`)
      ]);

      setStats({
        total: totalResponse.count || 0,
        active: activeResponse.count || 0,
        inactive: inactiveResponse.count || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({ total: 0, active: 0, inactive: 0 });
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const getDisplayName = (parent) => getLocalizedName(parent, i18n.language);

  const handleViewParent = (parentId) => navigate(`/admin/school-management/parents/view/${parentId}`);
  const handleEditParent = (parentId) => navigate(`/admin/school-management/parents/edit/${parentId}`);
  const handleDeleteParent = (parentId) => toast.info(`${t('action.delete')} parent: ${parentId}`);
  const handleAddParent = () => navigate('/admin/school-management/parents/add');

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const PaginationControls = () => {
    if (!pagination || pagination.count <= 20) return null;

    const totalPages = Math.ceil(pagination.count / 20);

    return (
      <div className="flex items-center justify-between px-2 mt-4">
        <div className="text-sm text-muted-foreground">
          {t('common.total_rows', { count: pagination.count })}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t('common.page')}</p>
            <Select
              value={currentPage.toString()}
              onValueChange={(value) => setCurrentPage(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t('common.of')} {totalPages}
            </p>
          </div>
          <div className="flex items-center justify-center text-sm font-medium">
            {t('common.page_of', { currentPage, totalPages })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!pagination?.previous}
            >
              <span className="sr-only">{t('common.previous')}</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination?.next}
            >
              <span className="sr-only">{t('common.next')}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminPageLayout
      title={t('admin.parentsManagement.title')}
      subtitle={t('admin.parentsManagement.subtitle')}
      actions={[
        <Button key="add-parent" onClick={handleAddParent} className="gap-2">
          <Plus className="h-4 w-4" />{t('action.addParent')}
        </Button>
      ]}
      loading={loading}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Statistics Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Users}
            label={t('admin.parentsManagement.stats.totalParents')}
            value={stats.total}
            colorClass="text-blue-500"
            description={t('admin.parentsManagement.stats.totalParentsDescription')}
          />
          <StatCard
            icon={CheckCircle}
            label={t('admin.parentsManagement.stats.activeParents')}
            value={stats.active}
            colorClass="text-green-500"
            description={t('admin.parentsManagement.stats.activeParentsDescription')}
          />
          <StatCard
            icon={XCircle}
            label={t('admin.parentsManagement.stats.inactiveParents')}
            value={stats.inactive}
            colorClass="text-red-500"
            description={t('admin.parentsManagement.stats.inactiveParentsDescription')}
          />
        </div>

        {/* Search and Table Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.parentsManagement.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.name')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('common.phone')}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t('parent.childrenNames')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead className="hidden xl:table-cell">{t('common.joinedDate')}</TableHead>
                    <TableHead><span className="sr-only">{t('common.actions')}</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {t('common.loading')}
                      </TableCell>
                    </TableRow>
                  ) : parents.length > 0 ? (
                    parents.map((parent) => (
                      <TableRow
                        key={parent.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleViewParent(parent.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={parent.profile_picture_url} alt={getDisplayName(parent)} />
                              <AvatarFallback>
                                {(parent.first_name?.[0] || '') + (parent.last_name?.[0] || '')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{getDisplayName(parent)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{parent.phone || '-'}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {parent.children?.length ? (
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>
                                {parent.children
                                  .map((child) => getLocalizedName(child, i18n.language))
                                  .filter(Boolean)
                                  .join(', ') || '-'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={parent.is_active ? 'default' : 'outline'} className={parent.is_active ? 'bg-green-100 text-green-800' : ''}>
                            {parent.is_active ? t('status.active') : t('status.inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">{formatDate(parent.created_at)}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t('action.openMenu')}</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditParent(parent.id); }}>
                                <Edit className="mr-2 h-4 w-4" /><span>{t('action.edit')}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteParent(parent.id); }} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /><span>{t('action.delete')}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <FileWarning className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">{t('admin.parentsManagement.noParentsFound')}</h3>
                          <p className="text-sm text-muted-foreground">
                            {searchQuery
                              ? t('admin.parentsManagement.noParentsMatchingFilters')
                              : t('admin.parentsManagement.noParentsYet')
                            }
                          </p>
                          <Button size="sm" onClick={handleAddParent}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            {t('action.addParent')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <PaginationControls />
      </motion.div>
    </AdminPageLayout>
  );
};

export default ParentsManagementPage;
