import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, Building, MapPin, Users, MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle, Home, TrendingUp, Sparkles, Images } from 'lucide-react';
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

const RoomsManagementPage = () => {
  const { t, i18n } = useTranslation();
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

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('schools/rooms/');
      let roomsData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      
      setRooms(roomsData);
      setFilteredRooms(roomsData);

      // Calculate statistics
      const classroomsCount = roomsData.filter(room => room.room_type === 'CLASSROOM').length;
      const labsCount = roomsData.filter(room => ['LAB', 'COMPUTER'].includes(room.room_type)).length;
      const totalCapacity = roomsData.reduce((sum, room) => sum + (room.capacity || 0), 0);

      setStats({
        total: roomsData.length,
        classrooms: classroomsCount,
        labs: labsCount,
        totalCapacity: totalCapacity
      });

    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [t]);

  useEffect(() => {
    let filtered = rooms;
    
    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(query) ||
        room.code.toLowerCase().includes(query) ||
        room.room_type.toLowerCase().includes(query)
      );
    }
    
    // Type filtering
    if (typeFilter !== 'all') {
      filtered = filtered.filter(room => room.room_type === typeFilter);
    }
    
    setFilteredRooms(filtered);
  }, [searchQuery, typeFilter, rooms]);

  const handleViewRoom = (roomId) => navigate(`/admin/school-management/rooms/view/${roomId}`);
  const handleEditRoom = (roomId) => navigate(`/admin/school-management/rooms/edit/${roomId}`);
  const handleDeleteRoom = async (roomId) => {
    if (window.confirm(t('rooms.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/rooms/${roomId}/`);
        toast.success(t('rooms.deletedSuccessfully'));
        fetchRooms(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete room:', error);
        toast.error(t('error.failedToDelete'));
      }
    }
  };
  const handleAddRoom = () => navigate('/admin/school-management/rooms/add');

  // Get room type display name
  const getRoomTypeLabel = (roomType) => {
    const typeMap = {
      'CLASSROOM': t('rooms.types.classroom'),
      'LAB': t('rooms.types.lab'),
      'LIBRARY': t('rooms.types.library'),
      'GYM': t('rooms.types.gym'),
      'COMPUTER': t('rooms.types.computer'),
      'ART': t('rooms.types.art'),
      'MUSIC': t('rooms.types.music'),
      'OTHER': t('rooms.types.other'),
    };
    return typeMap[roomType] || roomType;
  };

  // Get room type color
  const getRoomTypeColor = (roomType) => {
    const colorMap = {
      'CLASSROOM': 'bg-blue-100 text-blue-800',
      'LAB': 'bg-green-100 text-green-800',
      'LIBRARY': 'bg-purple-100 text-purple-800',
      'GYM': 'bg-red-100 text-red-800',
      'COMPUTER': 'bg-yellow-100 text-yellow-800',
      'ART': 'bg-pink-100 text-pink-800',
      'MUSIC': 'bg-indigo-100 text-indigo-800',
      'OTHER': 'bg-gray-100 text-gray-800',
    };
    return colorMap[roomType] || 'bg-gray-100 text-gray-800';
  };

  // Room Card component with animations
  const RoomCard = ({ room, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <GlowingCard glowColor="cyan" className="h-full">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-start space-x-3 mb-4">
            <motion.div 
              className="flex-shrink-0 relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {room.featured_image ? (
                <div className="h-12 w-12 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={room.featured_image.url}
                    alt={room.featured_image.alt_text || room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
              )}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {room.name}
                </h3>
                <Badge variant="secondary" className={`text-xs ${getRoomTypeColor(room.room_type)}`}>
                  {getRoomTypeLabel(room.room_type)}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{room.code}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{t('rooms.capacity')}: {room.capacity}</span>
                </div>
                {room.image_count > 0 && (
                  <div className="flex items-center space-x-1">
                    <Images className="h-4 w-4" />
                    <span>{room.image_count}</span>
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-muted"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleViewRoom(room.id)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t('action.view')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleEditRoom(room.id)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t('action.edit')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleDeleteRoom(room.id)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('action.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-auto pt-4 border-t border-muted">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {t('rooms.roomCode')}: {room.code}
              </span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewRoom(room.id)}
                  className="text-xs px-2 py-1 h-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {t('action.details')}
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </GlowingCard>
    </motion.div>
  );

  const actions = [
    <Button key="add-room" onClick={handleAddRoom} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
      <Plus className="h-4 w-4" />{t('rooms.addRoom')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('rooms.title')}
        subtitle={t('rooms.subtitle')}
        actions={actions}
        loading={loading}
      />
    );
  }

  return (
    <AdminPageLayout
      title={t('rooms.title')}
      subtitle={t('rooms.subtitle')}
      actions={actions}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard
          icon={Building}
          label={t('rooms.totalRooms')}
          value={stats.total}
          colorClass="text-blue-600"
          description={t('rooms.allRooms')}
          glowColor="blue"
        />
        <StatCard
          icon={Home}
          label={t('rooms.classrooms')}
          value={stats.classrooms}
          colorClass="text-green-600"
          description={t('rooms.classroomCount')}
          glowColor="green"
        />
        <StatCard
          icon={Sparkles}
          label={t('rooms.labs')}
          value={stats.labs}
          colorClass="text-purple-600"
          description={t('rooms.labCount')}
          glowColor="purple"
        />
        <StatCard
          icon={Users}
          label={t('rooms.totalCapacity')}
          value={stats.totalCapacity}
          colorClass="text-orange-600"
          description={t('rooms.totalSeats')}
          glowColor="orange"
        />
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('rooms.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder={t('rooms.filterByType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('rooms.allTypes')}</SelectItem>
            <SelectItem value="CLASSROOM">{t('rooms.types.classroom')}</SelectItem>
            <SelectItem value="LAB">{t('rooms.types.lab')}</SelectItem>
            <SelectItem value="COMPUTER">{t('rooms.types.computer')}</SelectItem>
            <SelectItem value="LIBRARY">{t('rooms.types.library')}</SelectItem>
            <SelectItem value="GYM">{t('rooms.types.gym')}</SelectItem>
            <SelectItem value="ART">{t('rooms.types.art')}</SelectItem>
            <SelectItem value="MUSIC">{t('rooms.types.music')}</SelectItem>
            <SelectItem value="OTHER">{t('rooms.types.other')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery || typeFilter !== 'all' ? t('rooms.noRoomsFound') : t('rooms.noRoomsYet')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || typeFilter !== 'all' 
              ? t('rooms.tryDifferentSearch')
              : t('rooms.addFirstRoom')
            }
          </p>
          {!searchQuery && typeFilter === 'all' && (
            <Button onClick={handleAddRoom} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('rooms.addRoom')}
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredRooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} />
          ))}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default RoomsManagementPage;