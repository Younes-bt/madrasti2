import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Wrench,
  Save,
  Hash,
  Users,
  Car,
  Upload,
  Trash2,
  Images
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import schoolsService from '../../services/schools';
import { apiMethods } from '../../services/api';

const DEFAULT_FORM_STATE = {
  service_date: '',
  service_type: '',
  service_location: '',
  mileage: '',
  cost: '',
  description: ''
};

const MAX_ATTACHMENTS = 10;

const AddVehicleMaintenanceRecordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { vehicleId } = useParams();

  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const attachmentInputRef = useRef(null);

  const loadVehicle = useCallback(async () => {
    if (!vehicleId) return;
    setVehicleLoading(true);
    try {
      const response = await schoolsService.getVehicle(vehicleId);
      setVehicle(response || null);
    } catch (error) {
      console.error('Failed to load vehicle data', error);
      toast.error(t('vehicles.toast.loadFailed'));
      navigate('/admin/school-management/vehicles');
    } finally {
      setVehicleLoading(false);
    }
  }, [vehicleId, navigate, t]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  const typeLabel = useMemo(() => {
    if (!vehicle?.vehicle_type) return null;
    const key = vehicle.vehicle_type.toLowerCase();
    return t(`vehicles.types.${key}`, { defaultValue: vehicle.vehicle_type });
  }, [vehicle, t]);

  const formatFileSize = useCallback((size) => {
    if (!size && size !== 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = size;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  }, []);

  const handleAttachmentSelection = useCallback(
    (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;

      const validFiles = [];
      let hasInvalidType = false;

      files.forEach((file) => {
        if (!file.type?.startsWith('image/')) {
          hasInvalidType = true;
        } else {
          validFiles.push(file);
        }
      });

      if (hasInvalidType) {
        toast.error(t('vehicles.maintenance.attachmentsInvalidType'));
      }

      if (!validFiles.length) {
        if (event.target) {
          event.target.value = '';
        }
        return;
      }

      if (pendingAttachments.length + validFiles.length > MAX_ATTACHMENTS) {
        toast.error(
          t('vehicles.maintenance.attachmentsTooMany', { max: MAX_ATTACHMENTS })
        );
        if (event.target) {
          event.target.value = '';
        }
        return;
      }

      const mapped = validFiles.map((file) => ({
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${file.name}-${Math.random()}`,
        file
      }));
      setPendingAttachments((prev) => [...prev, ...mapped]);

      if (event.target) {
        event.target.value = '';
      }
    },
    [pendingAttachments.length, t]
  );

  const handleRemoveAttachment = useCallback((id) => {
    setPendingAttachments((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const uploadPendingAttachments = useCallback(
    async (record) => {
      if (!pendingAttachments.length) return true;
      if (!record?.id || !record?.content_type) {
        toast.error(t('vehicles.toast.maintenanceAttachmentsUploadFailed'));
        return false;
      }

      setUploadingAttachments(true);
      try {
        await Promise.all(
          pendingAttachments.map(({ file }) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('media_type', 'IMAGE');
            formData.append('title', file.name.split('.')[0]);
            formData.append('content_type_id', record.content_type);
            formData.append('object_id', record.id);
            formData.append('relation_type', 'VEHICLE_MAINTENANCE_ATTACHMENT');
            return apiMethods.post('media/files/upload/', formData);
          })
        );

        toast.success(
          t('vehicles.toast.maintenanceAttachmentsUploadSuccess', {
            count: pendingAttachments.length
          })
        );
        setPendingAttachments([]);
        return true;
      } catch (error) {
        console.error('Failed to upload maintenance attachments', error);
        toast.error(t('vehicles.toast.maintenanceAttachmentsUploadFailed'));
        return false;
      } finally {
        setUploadingAttachments(false);
      }
    },
    [pendingAttachments, t]
  );

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = useCallback(() => {
    const validationErrors = {};

    if (!formState.service_date) {
      validationErrors.service_date = t('vehicles.validation.required', {
        field: t('vehicles.maintenance.serviceDate')
      });
    }

    if (!formState.service_type) {
      validationErrors.service_type = t('vehicles.validation.required', {
        field: t('vehicles.maintenance.serviceType')
      });
    }

    if (formState.mileage !== '') {
      const mileageNumber = Number(formState.mileage);
      if (Number.isNaN(mileageNumber) || mileageNumber < 0) {
        validationErrors.mileage = t('vehicles.validation.nonNegative', {
          field: t('vehicles.maintenance.mileage')
        });
      }
    }

    if (formState.cost !== '') {
      const costNumber = Number(formState.cost);
      if (Number.isNaN(costNumber) || costNumber < 0) {
        validationErrors.cost = t('vehicles.validation.nonNegative', {
          field: t('vehicles.maintenance.cost')
        });
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formState, t]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error(t('vehicles.validation.generic'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formState,
        mileage: formState.mileage === '' ? null : Number(formState.mileage),
        cost: formState.cost === '' ? null : Number(formState.cost)
      };

      const createdRecord = await schoolsService.createVehicleMaintenanceRecord(
        vehicleId,
        payload
      );

      if (pendingAttachments.length) {
        await uploadPendingAttachments(createdRecord);
      }

      toast.success(t('vehicles.toast.createMaintenanceSuccess'));
      navigate(`/admin/school-management/vehicles/view/${vehicleId}`);
    } catch (error) {
      console.error('Failed to create maintenance record', error);
      toast.error(t('vehicles.toast.saveMaintenanceFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/school-management/vehicles/view/${vehicleId}`);
  };

  const actions = [
    <Button
      key="back"
      variant="outline"
      onClick={handleCancel}
      className="gap-2"
      disabled={submitting || uploadingAttachments}
    >
      <ArrowLeft className="h-4 w-4" />
      {t('common.back')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('vehicles.maintenance.addRecord')}
      subtitle={
        vehicle
          ? t('vehicles.dialogs.maintenanceHint', {
              vehicle: vehicle.name || vehicle.model
            })
          : t('vehicles.dialogs.maintenanceHint', { vehicle: '' })
      }
      actions={actions}
      loading={vehicleLoading && !vehicle}
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {t('vehicles.maintenance.addRecord')}
          </CardTitle>
          {vehicle && (
            <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-semibold text-foreground">
                  {vehicle.name || vehicle.model}
                </span>
                <Badge variant="outline" className="gap-2">
                  <Hash className="h-3.5 w-3.5" />
                  {vehicle.plate_number}
                </Badge>
                {typeLabel && (
                  <Badge variant="secondary" className="gap-2">
                    <Car className="h-3.5 w-3.5" />
                    {typeLabel}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                {vehicle.driver_details
                  ? `${vehicle.driver_details.full_name} (${vehicle.driver_details.email})`
                  : t('vehicles.placeholders.noDriver')}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service_date">{t('vehicles.maintenance.serviceDate')}</Label>
                <Input
                  id="service_date"
                  type="date"
                  value={formState.service_date}
                  onChange={(event) => handleFieldChange('service_date', event.target.value)}
                  required
                />
                {errors.service_date && (
                  <p className="text-sm text-destructive">{errors.service_date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="service_type">{t('vehicles.maintenance.serviceType')}</Label>
                <Input
                  id="service_type"
                  value={formState.service_type}
                  onChange={(event) => handleFieldChange('service_type', event.target.value)}
                  placeholder={t('vehicles.maintenance.serviceTypePlaceholder')}
                  required
                />
                {errors.service_type && (
                  <p className="text-sm text-destructive">{errors.service_type}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service_location">
                  {t('vehicles.maintenance.serviceLocation')}
                </Label>
                <Input
                  id="service_location"
                  value={formState.service_location}
                  onChange={(event) =>
                    handleFieldChange('service_location', event.target.value)
                  }
                  placeholder={t('vehicles.maintenance.serviceLocationPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">{t('vehicles.maintenance.mileage')}</Label>
                <Input
                  id="mileage"
                  type="number"
                  min="0"
                  step="1"
                  value={formState.mileage}
                  onChange={(event) => handleFieldChange('mileage', event.target.value)}
                  placeholder={t('vehicles.maintenance.mileagePlaceholder')}
                />
                {errors.mileage && <p className="text-sm text-destructive">{errors.mileage}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">{t('vehicles.maintenance.cost')}</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formState.cost}
                onChange={(event) => handleFieldChange('cost', event.target.value)}
                placeholder={t('vehicles.maintenance.costPlaceholder')}
              />
              {errors.cost && <p className="text-sm text-destructive">{errors.cost}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('vehicles.maintenance.description')}</Label>
              <Textarea
                id="description"
                rows={4}
                value={formState.description}
                onChange={(event) => handleFieldChange('description', event.target.value)}
                placeholder={t('vehicles.maintenance.descriptionPlaceholder')}
              />
            </div>

            <div className="rounded-lg border border-dashed border-border/60 p-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <Images className="h-4 w-4" />
                    {t('vehicles.maintenance.attachmentsTitle')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('vehicles.maintenance.attachmentsDescription')}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => attachmentInputRef.current?.click()}
                  disabled={submitting || uploadingAttachments}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('vehicles.maintenance.attachmentsAdd')}
                </Button>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAttachmentSelection}
                  disabled={submitting || uploadingAttachments}
                />
              </div>

              {pendingAttachments.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {t('vehicles.maintenance.attachmentsSelected', {
                      count: pendingAttachments.length
                    })}
                  </p>
                  <ul className="space-y-2">
                    {pendingAttachments.map(({ id, file }) => (
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
                          onClick={() => handleRemoveAttachment(id)}
                          disabled={submitting || uploadingAttachments}
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
                  {t('vehicles.maintenance.noAttachments')}
                </p>
              )}

              {uploadingAttachments && (
                <p className="text-xs text-muted-foreground">
                  {t('vehicles.maintenance.uploadingAttachments')}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting || uploadingAttachments}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={submitting || vehicleLoading || uploadingAttachments}
              >
                <Save className="mr-2 h-4 w-4" />
                {submitting ? t('vehicles.maintenance.savingRecord') : t('common.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
};

export default AddVehicleMaintenanceRecordPage;
