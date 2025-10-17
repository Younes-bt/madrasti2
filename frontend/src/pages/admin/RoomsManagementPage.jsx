import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Building,
  MapPin,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Images,
  Home,
  Sparkles,
  X
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const AnimatedCounter = ({ from = 0, to, duration = 2, className = '' }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    if (isInView && to !== undefined) {
      animate(motionValue, to, { duration });
    }
  }, [isInView, motionValue, to, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, description, iconColor, iconBg }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`rounded-xl p-3 ${iconBg}`}>
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

const ROOM_TYPE_OPTIONS = [
  'CLASSROOM',
  'LAB',
  'COMPUTER',
  'LIBRARY',
  'GYM',
  'ART',
  'MUSIC',
  'OTHER'
];

const RoomsManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    classrooms: 0,
    labs: 0,
    totalCapacity: 0
  });

  const recalcStats = (roomsData) => {
    const classroomsCount = roomsData.filter(
      (room) => room.room_type === 'CLASSROOM'
    ).length;
    const labsCount = roomsData.filter((room) =>
      ['LAB', 'COMPUTER'].includes(room.room_type)
    ).length;
    const totalCapacity = roomsData.reduce(
      (sum, room) => sum + (room.capacity || 0),
      0
    );

    setStats({
      total: roomsData.length,
      classrooms: classroomsCount,
      labs: labsCount,
      totalCapacity
    });
  };

  useEffect(() => {
    let isMounted = true;
    const loadRooms = async () => {
      setLoading(true);
      try {
        const response = await apiMethods.get('schools/rooms/');
        const roomsData =
          response.results ||
          (Array.isArray(response)
            ? response
            : response.data?.results || response.data || []);

        if (!isMounted) return;

        setRooms(roomsData);
        setFilteredRooms(roomsData);
        recalcStats(roomsData);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        toast.error(t('error.failedToLoadData'));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRooms();
    return () => {
      isMounted = false;
    };
  }, [t]);

  useEffect(() => {
    let updated = [...rooms];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      updated = updated.filter(
        (room) =>
          room.name.toLowerCase().includes(query) ||
          room.code.toLowerCase().includes(query) ||
          room.room_type.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== 'all') {
      updated = updated.filter((room) => room.room_type === typeFilter);
    }

    setFilteredRooms(updated);
  }, [rooms, searchQuery, typeFilter]);

  const handleViewRoom = (roomId) =>
    navigate(`/admin/school-management/rooms/view/${roomId}`);

  const handleEditRoom = (roomId) =>
    navigate(`/admin/school-management/rooms/edit/${roomId}`);

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm(t('rooms.confirmDelete'))) return;
    try {
      await apiMethods.delete(`schools/rooms/${roomId}/`);
      toast.success(t('rooms.deletedSuccessfully'));
      setRooms((prev) => {
        const updated = prev.filter((room) => room.id !== roomId);
        recalcStats(updated);
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete room:', error);
      toast.error(t('error.failedToDelete'));
    }
  };

  const handleAddRoom = () => navigate('/admin/school-management/rooms/add');

  const getRoomTypeLabel = (roomType) => {
    const typeMap = {
      CLASSROOM: t('rooms.types.classroom'),
      LAB: t('rooms.types.lab'),
      LIBRARY: t('rooms.types.library'),
      GYM: t('rooms.types.gym'),
      COMPUTER: t('rooms.types.computer'),
      ART: t('rooms.types.art'),
      MUSIC: t('rooms.types.music'),
      OTHER: t('rooms.types.other')
    };
    return typeMap[roomType] || roomType;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
  };

  const RoomCard = ({ room, index }) => (
    <motion.div
      key={room.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Card className="h-full border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg">
        <CardContent className="flex h-full flex-col p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted">
              {room.featured_image?.url ? (
                <img
                  src={room.featured_image.url}
                  alt={room.featured_image.alt_text || room.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Building className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-semibold text-foreground">
                  {room.name}
                </h3>
                <Badge className="border-none bg-primary/10 text-primary-700 dark:bg-primary/20 dark:text-primary-300">
                  {getRoomTypeLabel(room.room_type)}
                </Badge>
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{room.code}</span>
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewRoom(room.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t('action.view')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditRoom(room.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('action.edit')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteRoom(room.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('action.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {t('rooms.capacity')}:&nbsp;
                <span className="font-medium text-foreground">
                  {room.capacity || 0}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              <span>
                {t('rooms.images', { defaultValue: 'Images' })}:&nbsp;
                <span className="font-medium text-foreground">
                  {room.image_count || 0}
                </span>
              </span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-xs text-muted-foreground">
              {t('rooms.roomCode')}: {room.code}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewRoom(room.id)}
              className="h-8 gap-2"
            >
              <Eye className="h-4 w-4" />
              {t('action.details')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const actions = [
    <Button key="add-room" onClick={handleAddRoom} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('rooms.addRoom')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('rooms.title')}
        subtitle={t('rooms.subtitle')}
        actions={actions}
        loading
      />
    );
  }

  return (
    <AdminPageLayout
      title={t('rooms.title')}
      subtitle={t('rooms.subtitle')}
      actions={actions}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Building}
          label={t('rooms.totalRooms')}
          value={stats.total}
          description={t('rooms.allRooms')}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/40"
        />
        <StatCard
          icon={Home}
          label={t('rooms.classrooms')}
          value={stats.classrooms}
          description={t('rooms.classroomCount')}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-900/40"
        />
        <StatCard
          icon={Sparkles}
          label={t('rooms.labs')}
          value={stats.labs}
          description={t('rooms.labCount')}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/40"
        />
        <StatCard
          icon={Users}
          label={t('rooms.totalCapacity')}
          value={stats.totalCapacity}
          description={t('rooms.totalSeats')}
          iconColor="text-orange-600 dark:text-orange-400"
          iconBg="bg-orange-100 dark:bg-orange-900/40"
        />
      </div>

      <Card className="mt-6 border-border/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('rooms.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9 w-full border-border/50 lg:w-56">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={t('rooms.filterByType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('rooms.allTypes')}</SelectItem>
                    {ROOM_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getRoomTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredRooms.length}{' '}
                {t('common.results', { defaultValue: 'results' })}
              </div>
            </div>

            {(searchQuery || typeFilter !== 'all') && (
              <div className="flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="gap-1 px-2 py-1"
                    onClick={() => setSearchQuery('')}
                  >
                    <Search className="h-3 w-3" />
                    {searchQuery}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {typeFilter !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="gap-1 px-2 py-1"
                    onClick={() => setTypeFilter('all')}
                  >
                    <Building className="h-3 w-3" />
                    {getRoomTypeLabel(typeFilter)}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={clearFilters}
                >
                  {t('common.reset')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredRooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-border/60">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="rounded-full bg-muted p-6">
                <Building className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {t('rooms.noRoomsFound')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {searchQuery || typeFilter !== 'all'
                    ? t('rooms.tryDifferentSearch')
                    : t('rooms.addFirstRoom')}
                </p>
              </div>
              {(!searchQuery && typeFilter === 'all' && rooms.length === 0) && (
                <Button onClick={handleAddRoom} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('rooms.addRoom')}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default RoomsManagementPage;
