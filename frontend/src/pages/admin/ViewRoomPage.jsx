import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit, Building, MapPin, Users, ArrowLeft, Calendar, Badge as BadgeIcon, Package, Plus, ArrowRight, Loader2
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import RoomMediaManager from '../../components/media/RoomMediaManager';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const DetailItem = ({ icon, label, value, children }) => (
  <div className="flex items-start py-3">
    <div className="flex-shrink-0 w-8 mt-1 text-muted-foreground">{icon}</div>
    <div className="flex-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="text-base text-foreground break-words">{children || value || '—'}</div>
    </div>
  </div>
);

const ViewRoomPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentItems, setEquipmentItems] = useState([]);

  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      try {
        const response = await apiMethods.get(`schools/rooms/${roomId}/`);
        setRoomData(response.data || response);
      } catch (error) {
        console.error('Failed to fetch room data:', error);
        toast.error(t('error.failedToLoadData'));
        navigate('/admin/school-management/rooms');
      } finally {
        setLoading(false);
      }
    };

    const fetchEquipmentData = async () => {
      setEquipmentLoading(true);
      try {
        const response = await apiMethods.get('schools/equipment/', {
          params: { room: roomId }
        });
        const equipmentList = Array.isArray(response)
          ? response
          : Array.isArray(response?.results)
            ? response.results
            : [];
        setEquipmentItems(equipmentList);
      } catch (error) {
        console.error('Failed to fetch equipment for room:', error);
        toast.error(t('equipment.messages.loadError'));
      } finally {
        setEquipmentLoading(false);
      }
    };

    if (roomId) {
      fetchRoomData();
      fetchEquipmentData();
    }
  }, [roomId, navigate, t]);

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
      'CLASSROOM': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'LAB': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'LIBRARY': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'GYM': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'COMPUTER': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'ART': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'MUSIC': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'OTHER': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colorMap[roomType] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const handleEdit = () => {
    navigate(`/admin/school-management/rooms/edit/${roomId}`);
  };

  const handleBack = () => {
    navigate('/admin/school-management/rooms');
  };

  const handleViewEquipment = (equipmentId) => {
    navigate(`/admin/school-management/equipment/view/${equipmentId}`);
  };

  const handleGoToEquipmentManagement = () => {
    navigate('/admin/school-management/equipment');
  };

  const actions = [
    <Button key="edit" onClick={handleEdit} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
      <Edit className="h-4 w-4" />{t('action.edit')}
    </Button>,
    <Button key="back" onClick={handleBack} variant="outline" className="gap-2">
      <ArrowLeft className="h-4 w-4" />{t('action.back')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('rooms.roomDetails')}
        subtitle={t('rooms.viewRoomSubtitle')}
        actions={actions}
        loading={loading}
      />
    );
  }

  if (!roomData) {
    return (
      <AdminPageLayout
        title={t('rooms.roomDetails')}
        subtitle={t('rooms.viewRoomSubtitle')}
        actions={actions}
      >
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t('rooms.roomNotFound')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t('rooms.roomNotFoundDescription')}
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('action.back')}
          </Button>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={roomData.name}
      subtitle={t('rooms.roomDetails')}
      actions={actions}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Card with Room Overview */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{roomData.name}</CardTitle>
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge className={`${getRoomTypeColor(roomData.room_type)}`}>
                      {getRoomTypeLabel(roomData.room_type)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {t('rooms.roomCode')}: {roomData.code}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {roomData.capacity}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('rooms.capacity')}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Room Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {t('rooms.roomInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BadgeIcon className="h-4 w-4" />
                  {t('rooms.basicInformation')}
                </h3>
                
                <DetailItem
                  icon={<Building className="h-4 w-4" />}
                  label={t('rooms.name')}
                  value={roomData.name}
                />
                
                <DetailItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={t('rooms.roomCode')}
                  value={roomData.code}
                />
                
                <DetailItem
                  icon={<BadgeIcon className="h-4 w-4" />}
                  label={t('rooms.roomType')}
                >
                  <Badge className={`${getRoomTypeColor(roomData.room_type)}`}>
                    {getRoomTypeLabel(roomData.room_type)}
                  </Badge>
                </DetailItem>
                
                <DetailItem
                  icon={<Users className="h-4 w-4" />}
                  label={t('rooms.capacity')}
                >
                  <span className="font-semibold text-lg text-primary">
                    {roomData.capacity} {t('rooms.persons')}
                  </span>
                </DetailItem>
              </div>

              {/* Room Statistics */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('rooms.utilizationInfo')}
                </h3>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {roomData.capacity}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t('rooms.maxCapacity')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {roomData.room_type === 'CLASSROOM' ? '✓' : '—'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t('rooms.isClassroom')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>{t('rooms.note')}:</strong> {t('rooms.roomNote')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Equipment Card */}
        <Card className="mt-6">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('rooms.equipmentSection.title')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('rooms.equipmentSection.subtitle')}
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleGoToEquipmentManagement}
            >
              <Plus className="h-4 w-4" />
              {t('rooms.equipmentSection.manage')}
            </Button>
          </CardHeader>
          <CardContent>
            {equipmentLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('rooms.equipmentSection.loading')}
              </div>
            ) : equipmentItems.length > 0 ? (
              <div className="space-y-3">
                {equipmentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">
                          {t('equipment.form.quantity')}: {item.quantity}
                        </Badge>
                        <Badge variant={item.is_active ? 'default' : 'secondary'}>
                          {item.is_active ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleViewEquipment(item.id)}
                      >
                        <ArrowRight className="h-4 w-4" />
                        {t('rooms.equipmentSection.view')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
                <Package className="h-10 w-10 opacity-40" />
                <p>{t('rooms.equipmentSection.empty')}</p>
                <Button variant="outline" onClick={handleGoToEquipmentManagement} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('rooms.equipmentSection.manage')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Room Media Management */}
        {roomData.content_type && (
          <RoomMediaManager
            roomId={roomId}
            roomName={roomData.name}
            contentTypeId={roomData.content_type}
            className="mt-6"
          />
        )}
      </motion.div>
    </AdminPageLayout>
  );
};

export default ViewRoomPage;
