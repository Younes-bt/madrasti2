import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Package,
  Boxes,
  Archive,
  Loader2,
  Edit,
  Trash2,
  Images,
  Upload
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { apiMethods } from '../../services/api';
import schoolsService from '../../services/schools.js';
import { toast } from 'sonner';

const defaultFormState = {
  name: '',
  description: '',
  room: '',
  quantity: 1,
  is_active: true
};

const StatCard = ({ icon: Icon, label, value, description, accent = 'bg-blue-500/10 text-blue-500' }) => (
  <Card className="border-border/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {label}
      </CardTitle>
      <div className={`rounded-full p-2 ${accent}`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const EquipmentManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState(defaultFormState);
  const [pendingImages, setPendingImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);
  const MAX_PENDING_IMAGES = 5;

  const stats = useMemo(() => {
    const totalItems = equipment.length;
    const activeItems = equipment.filter((item) => item.is_active).length;
    const totalQuantity = equipment.reduce(
      (total, item) => total + (Number(item.quantity) || 0),
      0
    );
    return { totalItems, activeItems, totalQuantity };
  }, [equipment]);

  const filteredEquipment = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return equipment
      .filter((item) => {
        if (query) {
          const haystack = [
            item.name,
            item.description,
            item.room_name
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(query)) {
            return false;
          }
        }
        if (roomFilter !== 'all' && String(item.room) !== roomFilter) {
          return false;
        }
        if (statusFilter === 'active' && !item.is_active) {
          return false;
        }
        if (statusFilter === 'inactive' && item.is_active) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const roomComparison = (a.room_name || '').localeCompare(b.room_name || '');
        if (roomComparison !== 0) {
          return roomComparison;
        }
        return a.name.localeCompare(b.name);
      });
  }, [equipment, searchQuery, roomFilter, statusFilter]);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const [equipmentData, roomsDataRaw] = await Promise.all([
        schoolsService.getEquipment(),
        schoolsService.getRooms()
      ]);
      const equipmentList = Array.isArray(equipmentData)
        ? equipmentData
        : Array.isArray(equipmentData?.results)
          ? equipmentData.results
          : [];
      const roomsList = Array.isArray(roomsDataRaw)
        ? roomsDataRaw
        : Array.isArray(roomsDataRaw?.results)
          ? roomsDataRaw.results
          : [];

      setEquipment(equipmentList);
      setRooms(roomsList);
    } catch (error) {
      console.error('Equipment load failed:', error);
      toast.error(t('equipment.messages.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const resetForm = () => {
    setFormData(defaultFormState);
    setEditingEquipment(null);
    setPendingImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDialogChange = (open) => {
    if (!open) {
      setShowForm(false);
      resetForm();
    } else {
      setShowForm(true);
    }
  };

  const handleAddEquipment = () => {
    resetForm();
    setShowForm(true);
  };

  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const availableSlots = MAX_PENDING_IMAGES - pendingImages.length;
    if (availableSlots <= 0) {
      toast.error(t('equipment.messages.imagesLimitReached', { max: MAX_PENDING_IMAGES }));
      return;
    }

    const limitedFiles = files.slice(0, availableSlots);
    if (limitedFiles.length < files.length) {
      toast.info(t('equipment.messages.imagesLimited', { max: MAX_PENDING_IMAGES }));
    }

    const mapped = limitedFiles.map((file) => ({
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${file.name}-${Math.random()}`,
      file
    }));

    setPendingImages((prev) => [...prev, ...mapped]);

    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemovePendingImage = (id) => {
    setPendingImages((prev) => prev.filter((item) => item.id !== id));
  };

  const formatFileSize = (size) => {
    if (!size) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;
    let value = size;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  };

  const uploadPendingImages = async (equipmentData) => {
    if (!pendingImages.length) return;
    if (!equipmentData?.id || !equipmentData?.content_type) {
      toast.error(t('equipment.messages.imagesUploadFailed'));
      return;
    }

    const existingCount =
      equipmentData.image_count ??
      editingEquipment?.image_count ??
      0;

    setUploadingImages(true);
    try {
      await Promise.all(
        pendingImages.map(({ file }, index) => {
          const formDataUpload = new FormData();
          formDataUpload.append('file', file);
          formDataUpload.append('media_type', 'IMAGE');
          formDataUpload.append('title', file.name.split('.')[0]);
          formDataUpload.append('content_type_id', equipmentData.content_type);
          formDataUpload.append('object_id', equipmentData.id);
          formDataUpload.append('relation_type', 'EQUIPMENT_GALLERY');
          if (existingCount === 0 && index === 0) {
            formDataUpload.append('is_featured', 'true');
          }
          return apiMethods.post('media/files/upload/', formDataUpload);
        })
      );
      toast.success(
        t('equipment.messages.imagesUploadSuccess', { count: pendingImages.length })
      );
      setPendingImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload equipment images', error);
      toast.error(t('equipment.messages.imagesUploadFailed'));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleEditEquipment = (item) => {
    setEditingEquipment(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      room: String(item.room || ''),
      quantity: item.quantity ?? 1,
      is_active: !!item.is_active
    });
    setPendingImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowForm(true);
  };

  const handleDeleteEquipment = async (item) => {
    const confirmed = window.confirm(
      t('equipment.messages.deleteConfirmDescription', { name: item.name })
    );
    if (!confirmed) {
      return;
    }

    try {
      await schoolsService.deleteEquipment(item.id);
      toast.success(t('equipment.messages.deleted'));
      loadEquipment();
    } catch (error) {
      console.error('Delete equipment failed:', error);
      toast.error(t('common.error'));
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = formData.name.trim();

    if (!trimmedName || !formData.room) {
      toast.error(t('equipment.messages.formError'));
      return;
    }

    const payload = {
      name: trimmedName,
      description: formData.description?.trim() || '',
      room: Number(formData.room),
      quantity: Math.max(0, Number(formData.quantity) || 0),
      is_active: !!formData.is_active
    };

    setSubmitting(true);
    try {
      let equipmentResponse;
      if (editingEquipment) {
        equipmentResponse = await schoolsService.updateEquipment(editingEquipment.id, payload);
        toast.success(t('equipment.messages.updated'));
      } else {
        equipmentResponse = await schoolsService.createEquipment(payload);
        toast.success(t('equipment.messages.created'));
      }

      if (pendingImages.length) {
        await uploadPendingImages(equipmentResponse);
      }

      handleDialogChange(false);
      loadEquipment();
    } catch (error) {
      console.error('Save equipment failed:', error);
      toast.error(t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const actions = [
    <Button key="add-equipment" onClick={handleAddEquipment} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('equipment.actions.add')}
    </Button>
  ];

  const handleViewEquipment = (equipmentId) => {
    navigate(`/admin/school-management/equipment/view/${equipmentId}`);
  };

  if (loading) {
    return (
      <AdminPageLayout
        title={t('equipment.title')}
        subtitle={t('equipment.subtitle')}
        actions={actions}
        loading
      />
    );
  }

  return (
    <AdminPageLayout
      title={t('equipment.title')}
      subtitle={t('equipment.subtitle')}
      actions={actions}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Boxes}
          label={t('equipment.stats.totalItems')}
          value={stats.totalItems}
          description={t('common.results')}
        />
        <StatCard
          icon={Package}
          label={t('equipment.stats.activeItems')}
          value={stats.activeItems}
          description={t('common.active')}
          accent="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          icon={Archive}
          label={t('equipment.stats.totalQuantity')}
          value={stats.totalQuantity}
          description={t('equipment.table.quantity')}
          accent="bg-blue-500/10 text-blue-500"
        />
      </div>

      <Card className="mt-6 border-border/50">
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-1 items-center gap-2">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('equipment.filters.searchPlaceholder')}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="hidden h-4 w-4 text-muted-foreground md:block" />
              <Select value={roomFilter} onValueChange={setRoomFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('equipment.filters.allRooms')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('equipment.filters.allRooms')}</SelectItem>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={String(room.id)}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder={t('equipment.filters.allStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('equipment.filters.allStatus')}</SelectItem>
                <SelectItem value="active">{t('equipment.filters.active')}</SelectItem>
                <SelectItem value="inactive">{t('equipment.filters.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 border-border/50">
        <CardHeader>
          <CardTitle>{t('equipment.title')}</CardTitle>
          <CardDescription>
            {t('equipment.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEquipment.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('equipment.table.room')}</TableHead>
                  <TableHead className="w-32 text-center">{t('equipment.table.quantity')}</TableHead>
                  <TableHead className="w-32 text-center">{t('common.status')}</TableHead>
                  <TableHead className="hidden w-48 sm:table-cell">{t('equipment.table.updated')}</TableHead>
                  <TableHead className="w-32 text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewEquipment(item.id)}
                          className="text-left font-semibold text-primary hover:underline"
                        >
                          {item.name}
                        </button>
                        {item.description && (
                          <span className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {item.room_name || t('equipment.table.room')}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {item.quantity ?? 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {item.updated_at ? new Date(item.updated_at).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleViewEquipment(item.id)}
                          className="gap-1"
                        >
                          {t('common.view')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEquipment(item)}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive-foreground hover:bg-destructive/10"
                          onClick={() => handleDeleteEquipment(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t('common.delete')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="rounded-full bg-muted p-6">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2 px-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {t('equipment.empty.title')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {searchQuery || roomFilter !== 'all' || statusFilter !== 'all'
                    ? t('equipment.empty.description')
                    : t('equipment.empty.action')}
                </p>
              </div>
              {(!searchQuery && roomFilter === 'all' && statusFilter === 'all') && (
                <Button onClick={handleAddEquipment} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('equipment.actions.add')}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEquipment ? t('equipment.actions.edit') : t('equipment.actions.add')}
            </DialogTitle>
            <DialogDescription>
              {editingEquipment
                ? t('equipment.form.updateDescription', { defaultValue: t('equipment.subtitle') })
                : t('equipment.form.createDescription', { defaultValue: t('equipment.subtitle') })}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipment-name">{t('equipment.form.name')}</Label>
              <Input
                id="equipment-name"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                placeholder={t('equipment.form.name')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment-room">{t('equipment.form.room')}</Label>
              <Select
                value={formData.room}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, room: value }))}
              >
                <SelectTrigger id="equipment-room">
                  <SelectValue placeholder={t('equipment.filters.allRooms')} />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={String(room.id)}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment-quantity">{t('equipment.form.quantity')}</Label>
              <Input
                id="equipment-quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, quantity: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment-description">{t('equipment.form.description')}</Label>
              <Textarea
                id="equipment-description"
                rows={3}
                value={formData.description}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder={t('equipment.form.description')}
              />
            </div>
            <div className="space-y-4 rounded-lg border border-dashed border-border/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <Images className="h-4 w-4" />
                    {t('equipment.form.images')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('equipment.form.imagesHelper', { max: MAX_PENDING_IMAGES })}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting || uploadingImages}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('equipment.form.selectImages')}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelection}
                />
              </div>
              {pendingImages.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {t('equipment.form.imagesSelected', { count: pendingImages.length })}
                  </p>
                  <ul className="space-y-2">
                    {pendingImages.map(({ id, file }) => (
                      <li
                        key={id}
                        className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePendingImage(id)}
                          disabled={submitting || uploadingImages}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t('common.delete')}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t('equipment.form.imagesEmpty')}
                </p>
              )}
              {uploadingImages && (
                <p className="text-xs text-muted-foreground">
                  {t('equipment.form.uploading')}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t('equipment.form.status')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.is_active ? t('common.active') : t('common.inactive')}
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={submitting || uploadingImages}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={submitting || uploadingImages}
                className="gap-2"
              >
                {(submitting || uploadingImages) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {submitting
                  ? t('common.saving')
                  : uploadingImages
                  ? t('equipment.form.uploading')
                  : editingEquipment
                  ? t('common.update')
                  : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

export default EquipmentManagementPage;
