import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Fuel,
  Hash,
  CalendarDays,
  Droplets,
  MapPin,
  Receipt,
  StickyNote,
  Users,
  Images,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import schoolsService from '../../services/schools';
import { formatDate } from '../../lib/utils';

const DetailItem = ({ icon, label, value }) => (
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

const ViewVehicleGasoilRecordPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { vehicleId, refuelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [vehicle, setVehicle] = useState(null);

  const fetchData = useCallback(async () => {
    if (!vehicleId || !refuelId) return;
    setLoading(true);
    try {
      const [recordResponse, vehicleResponse] = await Promise.all([
        schoolsService.getVehicleGasoilRecord(vehicleId, refuelId),
        schoolsService.getVehicle(vehicleId)
      ]);
      setRecord(recordResponse);
      setVehicle(vehicleResponse);
    } catch (error) {
      console.error('Failed to load gasoil record', error);
      toast.error(t('vehicles.toast.loadGasoilFailed'));
      navigate(`/admin/school-management/vehicles/view/${vehicleId}`);
    } finally {
      setLoading(false);
    }
  }, [vehicleId, refuelId, navigate, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formattedDate = useMemo(() => {
    if (!record?.refuel_date) return '-';
    return formatDate(record.refuel_date, i18n.language);
  }, [record, i18n.language]);

  const formattedLiters = useMemo(() => {
    if (record?.liters === null || record?.liters === undefined) return '-';
    const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : undefined;
    return Number(record.liters).toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }, [record, i18n.language]);

  const formattedAmount = useMemo(() => {
    if (record?.amount === null || record?.amount === undefined) return '-';
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
    }).format(Number(record.amount));
  }, [record, i18n.language]);

  const handleBack = () => {
    navigate(`/admin/school-management/vehicles/view/${vehicleId}`);
  };

  const actions = [
    <Button key="back" variant="outline" onClick={handleBack} className="gap-2">
      <ArrowLeft className="h-4 w-4" />
      {t('vehicles.maintenance.backToVehicle')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('vehicles.gasoil.addRecord')}
      subtitle={
        vehicle
          ? t('vehicles.gasoil.detailSubtitle', {
              vehicle: vehicle.name || vehicle.model || `#${vehicleId}`
            })
          : t('vehicles.gasoil.detailSubtitleFallback')
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
                  <Fuel className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {formattedLiters} L
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{formattedDate}</p>
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
                <DetailItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label={t('vehicles.gasoil.refuelDate')}
                  value={formattedDate}
                />
                <DetailItem
                  icon={<Droplets className="h-4 w-4" />}
                  label={t('vehicles.gasoil.liters')}
                  value={`${formattedLiters} L`}
                />
                <DetailItem
                  icon={<Wallet className="h-4 w-4" />}
                  label={t('vehicles.gasoil.amount')}
                  value={formattedAmount}
                />
              </div>
              <div className="space-y-4">
                <DetailItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={t('vehicles.gasoil.station')}
                  value={record.fuel_station || '-'}
                />
                <DetailItem
                  icon={<Receipt className="h-4 w-4" />}
                  label={t('vehicles.gasoil.receiptNumber')}
                  value={record.receipt_number || '-'}
                />
                <DetailItem
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
                {t('vehicles.gasoil.notes')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {record.notes?.trim() ? record.notes : t('vehicles.maintenance.noDescription')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Images className="h-5 w-5" />
                {t('vehicles.gasoil.attachmentsTitle')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('vehicles.gasoil.attachmentsDescription')}
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
                            alt={attachment.media_file?.title || formattedDate}
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
                  {t('vehicles.gasoil.noAttachments')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default ViewVehicleGasoilRecordPage;
