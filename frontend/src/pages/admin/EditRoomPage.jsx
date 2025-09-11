import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, MapPin, Users, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';
import RoomMediaManager from '../../components/media/RoomMediaManager';

const EditRoomPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    room_type: 'CLASSROOM',
    capacity: 30
  });
  const [contentTypeId, setContentTypeId] = useState(null);

  // Fetch room data
  const fetchRoomData = async () => {
    setInitialLoading(true);
    try {
      const response = await apiMethods.get(`schools/rooms/${roomId}/`);
      const roomData = response.data || response;
      
      setFormData({
        name: roomData.name || '',
        code: roomData.code || '',
        room_type: roomData.room_type || 'CLASSROOM',
        capacity: roomData.capacity || 30
      });
      setContentTypeId(roomData.content_type);
    } catch (error) {
      console.error('Failed to fetch room data:', error);
      toast.error(t('error.failedToLoadData'));
      navigate('/admin/school-management/rooms');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.required', { field: t('rooms.name') });
    }

    if (!formData.code.trim()) {
      newErrors.code = t('validation.required', { field: t('rooms.roomCode') });
    } else if (formData.code.length < 2) {
      newErrors.code = t('validation.minLength', { field: t('rooms.roomCode'), length: 2 });
    }

    if (!formData.room_type) {
      newErrors.room_type = t('validation.required', { field: t('rooms.roomType') });
    }

    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = t('validation.positiveNumber', { field: t('rooms.capacity') });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('validation.pleaseFixErrors'));
      return;
    }

    setLoading(true);
    try {
      await apiMethods.patch(`schools/rooms/${roomId}/`, formData);
      toast.success(t('rooms.updatedSuccessfully'));
      navigate('/admin/school-management/rooms');
    } catch (error) {
      console.error('Failed to update room:', error);
      if (error.response?.data) {
        // Handle server validation errors
        const serverErrors = {};
        Object.keys(error.response.data).forEach(key => {
          if (Array.isArray(error.response.data[key])) {
            serverErrors[key] = error.response.data[key][0];
          } else {
            serverErrors[key] = error.response.data[key];
          }
        });
        setErrors(serverErrors);
        toast.error(t('validation.pleaseFixErrors'));
      } else {
        toast.error(t('error.failedToUpdate'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/school-management/rooms');
  };

  const roomTypeOptions = [
    { value: 'CLASSROOM', label: t('rooms.types.classroom') },
    { value: 'LAB', label: t('rooms.types.lab') },
    { value: 'COMPUTER', label: t('rooms.types.computer') },
    { value: 'LIBRARY', label: t('rooms.types.library') },
    { value: 'GYM', label: t('rooms.types.gym') },
    { value: 'ART', label: t('rooms.types.art') },
    { value: 'MUSIC', label: t('rooms.types.music') },
    { value: 'OTHER', label: t('rooms.types.other') },
  ];

  const actions = [
    <Button key="back" onClick={handleCancel} variant="outline" className="gap-2">
      <ArrowLeft className="h-4 w-4" />{t('action.back')}
    </Button>
  ];

  if (initialLoading) {
    return (
      <AdminPageLayout
        title={t('rooms.editRoom')}
        subtitle={t('rooms.editRoomSubtitle')}
        actions={actions}
        loading={initialLoading}
      />
    );
  }

  return (
    <AdminPageLayout
      title={t('rooms.editRoom')}
      subtitle={t('rooms.editRoomSubtitle')}
      actions={actions}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {t('rooms.roomInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Room Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {t('rooms.name')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('rooms.namePlaceholder')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Room Code */}
              <div className="space-y-2">
                <Label htmlFor="code" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('rooms.roomCode')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder={t('rooms.codePlaceholder')}
                  className={errors.code ? 'border-red-500' : ''}
                />
                {errors.code && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.code}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Room Type */}
              <div className="space-y-2">
                <Label htmlFor="room_type" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {t('rooms.roomType')} <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.room_type} 
                  onValueChange={(value) => handleSelectChange('room_type', value)}
                >
                  <SelectTrigger className={errors.room_type ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('rooms.selectRoomType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.room_type && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.room_type}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('rooms.capacity')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  max="500"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder={t('rooms.capacityPlaceholder')}
                  className={errors.capacity ? 'border-red-500' : ''}
                />
                {errors.capacity && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.capacity}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? t('action.updating') : t('rooms.updateRoom')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('action.cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {contentTypeId && (
          <div className="mt-8">
            <RoomMediaManager 
              roomId={roomId} 
              roomName={formData.name} 
              contentTypeId={contentTypeId} 
            />
          </div>
        )}
      </motion.div>
    </AdminPageLayout>
  );
};

export default EditRoomPage;
