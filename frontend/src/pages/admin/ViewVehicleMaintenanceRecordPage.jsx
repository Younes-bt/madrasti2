import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Droplets,
  Hash,
  MapPin,
  StickyNote,
  Users,
  Wrench,
  Images,
  Gauge,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import schoolsService from '../../services/schools';
import { formatDate } from '../../lib/utils';

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-muted-foreground">{icon}</div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-base text-foreground break-words">{value ?? '-'}</p>
    </div>
  </div>
);

const ViewVehicleMaintenanceRecordPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { vehicleId, recordId } = useParams();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [vehicle, setVehicle] = useState(null);

  const fetchData = useCallback(async () => {
    if (!vehicleId || !recordId) return;
    setLoading(true);
    try {
      const [recordResponse, vehicleResponse] = await Promise.all([
        schoolsService.getVehicleMaintenanceRecord(vehicleId, recordId),
        schoolsService.getVehicle(vehicleId)
      ]);
      setRecord(recordResponse);
      setVehicle(vehicleResponse);
    } catch (error) {
      console.error('Failed to load maintenance record', error);
      toast.error(t('vehicles.toast.loadMaintenanceFailed'));
      navigate(`/admin/school-management/vehicles/view/${vehicleId}`);
    } finally {
      setLoading(false);
    }
  }, [vehicleId, recordId, navigate, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formattedServiceDate = useMemo(() => {
    if (!record?.service_date) return '-';
    return formatDate(record.service_date, i18n.language);
  }, [record, i18n.language]);

  const formattedMileage = useMemo(() => {
    if (record?.mileage === null || record?.mileage === undefined) return '-';
    const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : undefined;
    return Number(record.mileage).toLocaleString(locale);
  }, [record, i18n.language]);

  const formattedCost = useMemo(() => {
    if (record?.cost === null || record?.cost === undefined) return '-';
    const baseLanguage = i18n.language?.split('-')[0] || 'en';
    const locale =
      baseLanguage === 'fr'
        ? 'fr-MA'
        : baseLanguage === 'ar'
        ? 'ar-MA'
        : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'MAD'
    }).format(Number(record.cost));
  }, [record, i18n.language]);

  const handleBackToVehicle = () => {
    navigate(`/admin/school-management/vehicles/view/${vehicleId}`);
  };

  const actions = [
    <Button key="back" variant="outline" onClick={handleBackToVehicle} className="gap-2">
      <ArrowLeft className="h-4 w-4" />
      {t('vehicles.maintenance.backToVehicle')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('vehicles.maintenance.detailTitle')}
      subtitle={
        vehicle
          ? t('vehicles.maintenance.detailSubtitle', {
              vehicle: vehicle.name || vehicle.model || `#${vehicleId}`
            })
          : t('vehicles.maintenance.detailSubtitleFallback')
      }
      actions={actions}
      loading={loading}
    >
      {!loading && record && (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {record.service_type || t('vehicles.maintenance.serviceType')}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formattedServiceDate}
                  </p>
                </div>
              </div>
              {vehicle && (
                <Badge variant="secondary" className="w-fit gap-2">
                  <Hash className="h-3.5 w-3.5" />
                  {vehicle.plate_number}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label={t('vehicles.maintenance.serviceDate')}
                  value={formattedServiceDate}
                />
                <DetailRow
                  icon={<MapPin className="h-4 w-4" />}
                  label={t('vehicles.maintenance.serviceLocation')}
                  value={record.service_location || '-'}
                />
                <DetailRow
                  icon={<Gauge className="h-4 w-4" />}
                  label={t('vehicles.maintenance.mileage')}
                  value={formattedMileage}
                />
              </div>
              <div className="space-y-4">
                <DetailRow
                  icon={<Wallet className="h-4 w-4" />}
                  label={t('vehicles.maintenance.cost')}
                  value={formattedCost}
                />
                <DetailRow
                  icon={<Droplets className="h-4 w-4" />}
                  label={t('vehicles.sections.maintenance')}
                  value={record.service_type || '-'}
                />
                <DetailRow
                  icon={<Users className="h-4 w-4" />}
                  label={t('vehicles.fields.driver')}
                  value={
                    vehicle?.driver_details
                      ? `${vehicle.driver_details.full_name} (${vehicle.driver_details.email})`
                      : t('vehicles.placeholders.noDriver')
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                {t('vehicles.maintenance.description')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {record.description?.trim() ? record.description : t('vehicles.maintenance.noDescription')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Images className="h-5 w-5" />
                {t('vehicles.maintenance.attachmentsTitle')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('vehicles.maintenance.attachmentsDescription')}
              </p>
            </CardHeader>
            <CardContent>
              {Array.isArray(record.attachments) && record.attachments.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {record.attachments.map((attachment) => {
                    const imageUrl =
                      attachment.media_file?.secure_url || attachment.media_file?.url || '';
                    return (
                      <div
                        key={attachment.id}
                        className="overflow-hidden rounded-lg border border-border/60"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={attachment.media_file?.title || record.service_type}
                            loading="lazy"
                            className="h-48 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-48 w-full items-center justify-center bg-muted text-muted-foreground">
                            <Images className="h-8 w-8" />
                          </div>
                        )}
                        {(attachment.caption || attachment.media_file?.title) && (
                          <div className="border-t border-border/60 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                            {attachment.caption || attachment.media_file?.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                  {t('vehicles.maintenance.noAttachments')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default ViewVehicleMaintenanceRecordPage;

