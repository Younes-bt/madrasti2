import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Bus,
  Car,
  Hash,
  User,
  Users,
  Palette,
  CalendarDays,
  Droplets,
  ShieldCheck,
  Wrench,
  Save,
  ArrowLeft,
  AlertCircle,
  ClipboardList,
  Images,
  Trash2,
  Upload
} from 'lucide-react';
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
  SelectValue
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { apiMethods } from '../../services/api';
import schoolsService from '../../services/schools';
import usersService from '../../services/users';

const VEHICLE_TYPE_OPTIONS = [
  { value: 'BUS', labelKey: 'vehicles.types.bus' },
  { value: 'MINIBUS', labelKey: 'vehicles.types.minibus' },
  { value: 'VAN', labelKey: 'vehicles.types.van' },
  { value: 'CAR', labelKey: 'vehicles.types.car' },
  { value: 'OTHER', labelKey: 'vehicles.types.other' }
];

const DEFAULT_FORM_STATE = {
  name: '',
  vehicle_type: 'BUS',
  model: '',
  plate_number: '',
  driver: '',
  capacity: '',
  color: '',
  manufacture_year: '',
  last_oil_change_date: '',
  last_service_date: '',
  insurance_expiry_date: '',
  notes: '',
  is_active: true
};

const AddVehiclePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [pendingImages, setPendingImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);

  const vehicleTypeOptions = useMemo(
    () =>
      VEHICLE_TYPE_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.labelKey)
      })),
    [t]
  );

  const loadDrivers = useCallback(async () => {
    setDriversLoading(true);
    try {
      const response = await usersService.getAvailableDrivers({
        include_inactive: false
      });
      const results = response?.results ?? response;
      if (Array.isArray(results)) {
        setDrivers(
          results.map((driver) => ({
            id: driver.id,
            full_name: driver.full_name || driver.profile?.full_name || driver.email,
            email: driver.email
          }))
        );
      } else {
        setDrivers([]);
      }
    } catch (error) {
      console.error('Failed to load drivers', error);
      toast.error(t('vehicles.toast.loadDriversFailed'));
    } finally {
      setDriversLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const mapped = files.map((file) => ({
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${file.name}-${Math.random()}`,
      file,
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

  const uploadPendingImages = async (vehicle) => {
    if (!pendingImages.length) return;
    if (!vehicle?.id || !vehicle?.content_type) {
      toast.error(t('vehicles.toast.imagesUploadFailed'));
      return;
    }

    setUploadingImages(true);
    try {
      await Promise.all(
        pendingImages.map(({ file }) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('media_type', 'IMAGE');
          formData.append('title', file.name.split('.')[0]);
          formData.append('content_type_id', vehicle.content_type);
          formData.append('object_id', vehicle.id);
          formData.append('relation_type', 'VEHICLE_GALLERY');
          return apiMethods.post('media/files/upload/', formData);
        })
      );
      toast.success(t('vehicles.toast.imagesUploadSuccess', { count: pendingImages.length }));
      setPendingImages([]);
    } catch (error) {
      console.error('Failed to upload vehicle images', error);
      toast.error(t('vehicles.toast.imagesUploadFailed'));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const parseNumberOrNull = (value) => {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const isValidDate = (value) => {
    if (!value) return true;
    const parsed = Date.parse(value);
    return !Number.isNaN(parsed);
  };

  const validateForm = () => {
    const newErrors = {};
    const required = (fieldKey) =>
      t('vehicles.validation.required', { field: t(fieldKey) });

    if (!formState.model.trim()) {
      newErrors.model = required('vehicles.fields.model');
    }
    if (!formState.plate_number.trim()) {
      newErrors.plate_number = required('vehicles.fields.plateNumber');
    }
    if (!formState.vehicle_type) {
      newErrors.vehicle_type = required('vehicles.fields.type');
    }

    if (formState.capacity !== '' && parseInt(formState.capacity, 10) < 0) {
      newErrors.capacity = t('vehicles.validation.nonNegative', {
        field: t('vehicles.fields.capacity')
      });
    }

    if (
      formState.manufacture_year !== '' &&
      (parseInt(formState.manufacture_year, 10) < 1960 ||
        parseInt(formState.manufacture_year, 10) >
          new Date().getFullYear())
    ) {
      newErrors.manufacture_year = t('vehicles.validation.yearRange', {
        field: t('vehicles.fields.manufactureYear'),
        start: 1960,
        end: new Date().getFullYear()
      });
    }

    ['last_oil_change_date', 'last_service_date', 'insurance_expiry_date'].forEach(
      (dateField) => {
        if (!isValidDate(formState[dateField])) {
          newErrors[dateField] = t('vehicles.validation.invalidDate', {
            field: t(
              {
                last_oil_change_date: 'vehicles.fields.lastOilChange',
                last_service_date: 'vehicles.fields.lastService',
                insurance_expiry_date: 'vehicles.fields.insuranceExpiry'
              }[dateField]
            )
          });
        }
      }
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    const payload = {
      ...formState,
      name: formState.name.trim() || '',
      model: formState.model.trim(),
      plate_number: formState.plate_number.trim(),
      driver: formState.driver ? Number(formState.driver) : null,
      capacity: parseNumberOrNull(formState.capacity),
      manufacture_year: parseNumberOrNull(formState.manufacture_year),
      last_oil_change_date: formState.last_oil_change_date || null,
      last_service_date: formState.last_service_date || null,
      insurance_expiry_date: formState.insurance_expiry_date || null,
      notes: formState.notes.trim()
    };

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error(t('vehicles.validation.generic'));
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload();
      const createdVehicle = await schoolsService.createVehicle(payload);

      if (pendingImages.length) {
        await uploadPendingImages(createdVehicle);
      }

      toast.success(t('vehicles.toast.createSuccess'));
      navigate('/admin/school-management/vehicles');
    } catch (error) {
      console.error('Failed to create vehicle', error);
      if (error?.response?.data && typeof error.response.data === 'object') {
        const serverErrors = {};
        Object.entries(error.response.data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            serverErrors[key] = value[0];
          } else if (typeof value === 'string') {
            serverErrors[key] = value;
          }
        });
        if (Object.keys(serverErrors).length) {
          setErrors((prev) => ({ ...prev, ...serverErrors }));
        }
        toast.error(t('vehicles.validation.generic'));
      } else {
        toast.error(t('vehicles.toast.saveFailed'));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/school-management/vehicles');
  };

  return (
    <AdminPageLayout
      title={t('vehicles.page.addTitle')}
      subtitle={t('vehicles.page.addSubtitle')}
      showBackButton
      backButtonPath="/admin/school-management/vehicles"
      backButtonLabel={t('vehicles.page.backToList')}
    >
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Bus className="h-6 w-6 text-primary" />
            {t('vehicles.page.formTitle')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('vehicles.page.formSubtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  {t('vehicles.fields.name')}
                </Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(event) => handleFieldChange('name', event.target.value)}
                  placeholder={t('vehicles.placeholders.name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_type" className="flex items-center gap-2">
                  <Bus className="h-4 w-4" />
                  {t('vehicles.fields.type')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formState.vehicle_type}
                  onValueChange={(value) => handleFieldChange('vehicle_type', value)}
                >
                  <SelectTrigger className={errors.vehicle_type ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('vehicles.placeholders.type')} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicle_type && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.vehicle_type}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  {t('vehicles.fields.model')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model"
                  value={formState.model}
                  onChange={(event) => handleFieldChange('model', event.target.value)}
                  placeholder={t('vehicles.placeholders.model')}
                  className={errors.model ? 'border-red-500' : ''}
                />
                {errors.model && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.model}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="plate_number" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  {t('vehicles.fields.plateNumber')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="plate_number"
                  value={formState.plate_number}
                  onChange={(event) =>
                    handleFieldChange('plate_number', event.target.value.toUpperCase())
                  }
                  placeholder={t('vehicles.placeholders.plateNumber')}
                  className={errors.plate_number ? 'border-red-500' : ''}
                />
                {errors.plate_number && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.plate_number}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('vehicles.fields.driver')}
                </Label>
                <Select
                  value={formState.driver ? String(formState.driver) : 'NONE'}
                  onValueChange={(value) =>
                    handleFieldChange('driver', value === 'NONE' ? '' : value)
                  }
                  disabled={driversLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        driversLoading
                          ? t('common.loading')
                          : t('vehicles.placeholders.driver')
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">{t('vehicles.placeholders.noDriver')}</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={String(driver.id)}>
                        {driver.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('vehicles.fields.capacity')}
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={formState.capacity}
                  onChange={(event) => handleFieldChange('capacity', event.target.value)}
                  placeholder={t('vehicles.placeholders.capacity')}
                  className={errors.capacity ? 'border-red-500' : ''}
                />
                {errors.capacity && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.capacity}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacture_year" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {t('vehicles.fields.manufactureYear')}
                </Label>
                <Input
                  id="manufacture_year"
                  type="number"
                  min="1960"
                  max={new Date().getFullYear()}
                  value={formState.manufacture_year}
                  onChange={(event) =>
                    handleFieldChange('manufacture_year', event.target.value)
                  }
                  placeholder={t('vehicles.placeholders.manufactureYear')}
                  className={errors.manufacture_year ? 'border-red-500' : ''}
                />
                {errors.manufacture_year && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.manufacture_year}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="color" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  {t('vehicles.fields.color')}
                </Label>
                <Input
                  id="color"
                  value={formState.color}
                  onChange={(event) => handleFieldChange('color', event.target.value)}
                  placeholder={t('vehicles.placeholders.color')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_oil_change_date" className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  {t('vehicles.fields.lastOilChange')}
                </Label>
                <Input
                  id="last_oil_change_date"
                  type="date"
                  value={formState.last_oil_change_date}
                  onChange={(event) =>
                    handleFieldChange('last_oil_change_date', event.target.value)
                  }
                  className={errors.last_oil_change_date ? 'border-red-500' : ''}
                />
                {errors.last_oil_change_date && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.last_oil_change_date}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_service_date" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  {t('vehicles.fields.lastService')}
                </Label>
                <Input
                  id="last_service_date"
                  type="date"
                  value={formState.last_service_date}
                  onChange={(event) =>
                    handleFieldChange('last_service_date', event.target.value)
                  }
                  className={errors.last_service_date ? 'border-red-500' : ''}
                />
                {errors.last_service_date && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.last_service_date}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="insurance_expiry_date"
                  className="flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {t('vehicles.fields.insuranceExpiry')}
                </Label>
                <Input
                  id="insurance_expiry_date"
                  type="date"
                  value={formState.insurance_expiry_date}
                  onChange={(event) =>
                    handleFieldChange('insurance_expiry_date', event.target.value)
                  }
                  className={errors.insurance_expiry_date ? 'border-red-500' : ''}
                />
                {errors.insurance_expiry_date && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.insurance_expiry_date}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                {t('vehicles.fields.notes')}
              </Label>
              <Textarea
                id="notes"
                rows={4}
                value={formState.notes}
                onChange={(event) => handleFieldChange('notes', event.target.value)}
                placeholder={t('vehicles.placeholders.notes')}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-dashed border-border/60 p-4">
              <div>
                <p className="font-medium">{t('vehicles.fields.status')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('vehicles.placeholders.statusHint')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {formState.is_active
                    ? t('vehicles.status.active')
                    : t('vehicles.status.inactive')}
                </span>
                <Switch
                  checked={formState.is_active}
                  onCheckedChange={(checked) => handleFieldChange('is_active', checked)}
                />
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-border/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <Images className="h-4 w-4" />
                    {t('vehicles.page.imagesSectionTitle')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('vehicles.page.imagesSectionSubtitle')}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving || uploadingImages}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('vehicles.page.selectImages')}
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
                    {t('vehicles.page.imagesSelected', { count: pendingImages.length })}
                  </p>
                  <ul className="space-y-2">
                    {pendingImages.map(({ id, file }) => (
                      <li
                        key={id}
                        className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePendingImage(id)}
                          disabled={saving || uploadingImages}
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
                  {t('vehicles.page.noImagesSelected')}
                </p>
              )}

              {uploadingImages && (
                <p className="text-xs text-muted-foreground">
                  {t('vehicles.page.uploadingImages')}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving || uploadingImages}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('vehicles.page.cancel')}
              </Button>
              <Button type="submit" disabled={saving || uploadingImages}>
                <Save className="mr-2 h-4 w-4" />
                {saving
                  ? t('vehicles.page.saving')
                  : uploadingImages
                  ? t('vehicles.page.uploadingImages')
                  : t('vehicles.page.submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
};

export default AddVehiclePage;
