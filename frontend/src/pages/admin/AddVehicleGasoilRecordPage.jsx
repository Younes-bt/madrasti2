import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Fuel,
  Save,
  Hash,
  Users,
  Car,
  Upload,
  Trash2,
  Images,
  MapPin,
  Receipt,
  StickyNote,
  Droplets
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
  refuel_date: '',
  liters: '',
  amount: '',
  fuel_station: '',
  receipt_number: '',
  notes: ''
};

const MAX_ATTACHMENTS = 10;

const AddVehicleGasoilRecordPage = () => {
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

  const vehicleTypeLabel = useMemo(() => {
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

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAttachmentSelection = useCallback(
    (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;

      const validFiles = [];
      let invalidType = false;

      files.forEach((file) => {
        if (!file.type?.startsWith('image/')) {
          invalidType = true;
        } else {
          validFiles.push(file);
        }
      });

      if (invalidType) {
        toast.error(t('vehicles.gasoil.attachmentsInvalidType'));
      }

      if (!validFiles.length) {
        if (event.target) event.target.value = '';
        return;
      }

      if (pendingAttachments.length + validFiles.length > MAX_ATTACHMENTS) {
        toast.error(t('vehicles.gasoil.attachmentsTooMany', { max: MAX_ATTACHMENTS }));
        if (event.target) event.target.value = '';
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
        toast.error(t('vehicles.toast.gasoilAttachmentsUploadFailed'));
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
            formData.append('relation_type', 'VEHICLE_GASOIL_ATTACHMENT');
            return apiMethods.post('media/files/upload/', formData);
          })
        );
        toast.success(
          t('vehicles.toast.gasoilAttachmentsUploadSuccess', {
            count: pendingAttachments.length
          })
        );
        setPendingAttachments([]);
        return true;
      } catch (error) {
        console.error('Failed to upload gasoil attachments', error);
        toast.error(t('vehicles.toast.gasoilAttachmentsUploadFailed'));
        return false;
      } finally {
        setUploadingAttachments(false);
      }
    },
    [pendingAttachments, t]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    const required = (fieldKey) =>
      t('vehicles.validation.required', { field: t(fieldKey) });

    if (!formState.refuel_date) {
      newErrors.refuel_date = required('vehicles.gasoil.refuelDate');
    }
    if (!formState.liters) {
      newErrors.liters = required('vehicles.gasoil.liters');
    } else if (Number(formState.liters) <= 0) {
      newErrors.liters = t('vehicles.validation.nonNegative', {
        field: t('vehicles.gasoil.liters')
      });
    }
    if (!formState.amount) {
      newErrors.amount = required('vehicles.gasoil.amount');
    } else if (Number(formState.amount) <= 0) {
      newErrors.amount = t('vehicles.validation.nonNegative', {
        field: t('vehicles.gasoil.amount')
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        refuel_date: formState.refuel_date,
        liters: formState.liters === '' ? null : Number(formState.liters),
        amount: formState.amount === '' ? null : Number(formState.amount),
        fuel_station: formState.fuel_station || '',
        receipt_number: formState.receipt_number || '',
        notes: formState.notes || ''
      };

      const createdRecord = await schoolsService.createVehicleGasoilRecord(vehicleId, payload);

      if (pendingAttachments.length) {
        await uploadPendingAttachments(createdRecord);
      }

      toast.success(t('vehicles.toast.createGasoilSuccess'));
      navigate(`/admin/school-management/vehicles/view/${vehicleId}`);
    } catch (error) {
      console.error('Failed to create gasoil record', error);
      toast.error(t('vehicles.toast.saveGasoilFailed'));
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
      title={t('vehicles.gasoil.addRecord')}
      subtitle={
        vehicle
          ? t('vehicles.gasoil.detailSubtitle', {
              vehicle: vehicle.name || vehicle.model
            })
          : t('vehicles.gasoil.detailSubtitleFallback')
      }
      actions={actions}
      loading={vehicleLoading && !vehicle}
    >
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            {t('vehicles.gasoil.addRecord')}
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
                {vehicleTypeLabel && (
                  <Badge variant="secondary" className="gap-2">
                    <Car className="h-3.5 w-3.5" />
                    {vehicleTypeLabel}
                  </Badge>
                )}
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <Label htmlFor="refuel_date">{t('vehicles.gasoil.refuelDate')}</Label>
                <Input
                  id="refuel_date"
                  type="date"
                  value={formState.refuel_date}
                  onChange={(event) => handleFieldChange('refuel_date', event.target.value)}
                  required
                />
                {errors.refuel_date && (
                  <p className="text-sm text-destructive">{errors.refuel_date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="liters">{t('vehicles.gasoil.liters')}</Label>
                <Input
                  id="liters"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.liters}
                  onChange={(event) => handleFieldChange('liters', event.target.value)}
                  placeholder={t('vehicles.gasoil.litersPlaceholder')}
                  required
                />
                {errors.liters && <p className="text-sm text-destructive">{errors.liters}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">{t('vehicles.gasoil.amount')}</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.amount}
                  onChange={(event) => handleFieldChange('amount', event.target.value)}
                  placeholder={t('vehicles.gasoil.amountPlaceholder')}
                  required
                />
                {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuel_station">{t('vehicles.gasoil.station')}</Label>
                <Input
                  id="fuel_station"
                  value={formState.fuel_station}
                  onChange={(event) => handleFieldChange('fuel_station', event.target.value)}
                  placeholder={t('vehicles.gasoil.stationPlaceholder')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt_number">{t('vehicles.gasoil.receiptNumber')}</Label>
              <Input
                id="receipt_number"
                value={formState.receipt_number}
                onChange={(event) => handleFieldChange('receipt_number', event.target.value)}
                placeholder={t('vehicles.gasoil.receiptNumberPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('vehicles.gasoil.notes')}</Label>
              <Textarea
                id="notes"
                rows={4}
                value={formState.notes}
                onChange={(event) => handleFieldChange('notes', event.target.value)}
                placeholder={t('vehicles.gasoil.notesPlaceholder')}
              />
            </div>

            <div className="space-y-4 rounded-lg border border-dashed border-border/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    <Images className="h-4 w-4" />
                    {t('vehicles.gasoil.attachmentsTitle')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('vehicles.gasoil.attachmentsDescription')}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => attachmentInputRef.current?.click()}
                  disabled={submitting || uploadingAttachments}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t('vehicles.gasoil.attachmentsAdd')}
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
                    {t('vehicles.gasoil.attachmentsSelected', {
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
                  {t('vehicles.gasoil.noAttachments')}
                </p>
              )}

              {uploadingAttachments && (
                <p className="text-xs text-muted-foreground">
                  {t('vehicles.gasoil.uploadingAttachments')}
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
                {submitting ? t('vehicles.gasoil.savingRecord') : t('common.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
};

export default AddVehicleGasoilRecordPage;

