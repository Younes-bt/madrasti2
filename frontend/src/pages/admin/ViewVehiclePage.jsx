import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bus,
  Car,
  Droplets,
  Info,
  ShieldCheck,
  User,
  Users,
  Wrench,
  Hash,
  Palette,
  CalendarDays,
  Plus,
  ClipboardList,
  Fuel,
  Receipt,
  MapPin
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table';
import VehicleMediaManager from '../../components/media/VehicleMediaManager';
import schoolsService from '../../services/schools';
import { toast } from 'sonner';
import { formatDate } from '../../lib/utils';

const MotionDiv = motion.div;

const DetailItem = ({ icon, label, value, fallback = '-' }) => (
  <div className="flex items-start space-x-3 py-3">
    <div className="mt-1 text-muted-foreground">{icon}</div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-base text-foreground break-all">{value || fallback}</p>
    </div>
  </div>
);

const ViewVehiclePage = () => {
  const { t, i18n } = useTranslation();
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [maintenanceLoading, setMaintenanceLoading] = useState(true);
  const [gasoilRecords, setGasoilRecords] = useState([]);
  const [gasoilLoading, setGasoilLoading] = useState(true);

  const fetchVehicle = useCallback(async () => {
    if (!vehicleId) return;
    setLoading(true);
    try {
      const response = await schoolsService.getVehicle(vehicleId);
      setVehicle(response);
    } catch (error) {
      console.error('Failed to load vehicle data', error);
      toast.error(t('vehicles.toast.loadFailed'));
      navigate('/admin/school-management/vehicles');
    } finally {
      setLoading(false);
    }
  }, [vehicleId, navigate, t]);

  const fetchMaintenanceRecords = useCallback(async () => {
    if (!vehicleId) return;
    setMaintenanceLoading(true);
    try {
      const response = await schoolsService.getVehicleMaintenanceRecords(vehicleId);
      const records = response?.results ?? response;
      setMaintenanceRecords(Array.isArray(records) ? records : []);
    } catch (error) {
      console.error('Failed to load maintenance records', error);
      toast.error(t('vehicles.toast.loadMaintenanceFailed'));
    } finally {
      setMaintenanceLoading(false);
    }
  }, [vehicleId, t]);

  const fetchGasoilRecords = useCallback(async () => {
    if (!vehicleId) return;
    setGasoilLoading(true);
    try {
      const response = await schoolsService.getVehicleGasoilRecords(vehicleId);
      setGasoilRecords(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to load gasoil records', error);
      toast.error(t('vehicles.toast.loadGasoilFailed'));
    } finally {
      setGasoilLoading(false);
    }
  }, [vehicleId, t]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  useEffect(() => {
    fetchMaintenanceRecords();
  }, [fetchMaintenanceRecords]);

  useEffect(() => {
    fetchGasoilRecords();
  }, [fetchGasoilRecords]);

  const formattedLastOilChange = useMemo(() => {
    if (!vehicle?.last_oil_change_date) return null;
    return formatDate(vehicle.last_oil_change_date, i18n.language);
  }, [vehicle, i18n.language]);

  const formattedLastService = useMemo(() => {
    if (!vehicle?.last_service_date) return null;
    return formatDate(vehicle.last_service_date, i18n.language);
  }, [vehicle, i18n.language]);

  const formattedInsuranceExpiry = useMemo(() => {
    if (!vehicle?.insurance_expiry_date) return null;
    return formatDate(vehicle.insurance_expiry_date, i18n.language);
  }, [vehicle, i18n.language]);

  const typeBadge = useMemo(() => {
    const iconMap = {
      BUS: <Bus className="h-3.5 w-3.5" />,
      MINIBUS: <Bus className="h-3.5 w-3.5" />,
      VAN: <Car className="h-3.5 w-3.5" />,
      CAR: <Car className="h-3.5 w-3.5" />,
      OTHER: <Info className="h-3.5 w-3.5" />
    };
    const label = t(`vehicles.types.${vehicle?.vehicle_type?.toLowerCase() || 'other'}`);
    return (
      <Badge variant="secondary" className="gap-2">
        {iconMap[vehicle?.vehicle_type] || iconMap.OTHER}
        {label}
      </Badge>
    );
  }, [vehicle, t]);

  const formatMileage = useCallback((value) => {
    if (value === null || value === undefined || value === '') return '-';
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return value;
    return numericValue.toLocaleString(i18n.language?.startsWith('fr') ? 'fr-FR' : undefined);
  }, [i18n.language]);

  const formatCost = useCallback(
    (value) => {
      if (value === null || value === undefined || value === '') return '-';
      const numericValue = Number(value);
      if (Number.isNaN(numericValue)) return value;
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
      }).format(numericValue);
    },
    [i18n.language]
  );

  const formatLiters = useCallback(
    (value) => {
      if (value === null || value === undefined || value === '') return '-';
      const numeric = Number(value);
      if (Number.isNaN(numeric)) return value;
      const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : undefined;
      return numeric.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    },
    [i18n.language]
  );

  const handleBack = () => {
    navigate('/admin/school-management/vehicles');
  };

  const handleAddMaintenanceRecord = () => {
    navigate(`/admin/school-management/vehicles/${vehicleId}/maintenance/add`);
  };

  const handleAddGasoilRecord = () => {
    navigate(`/admin/school-management/vehicles/${vehicleId}/gasoil/add`);
  };

  const handleViewMaintenanceRecord = (recordId) => {
    navigate(
      `/admin/school-management/vehicles/${vehicleId}/maintenance/${recordId}`
    );
  };

  const actions = [
    <Button key="add-gasoil" onClick={handleAddGasoilRecord} className="gap-2">
      <Fuel className="h-4 w-4" />
      {t('vehicles.gasoil.addRecord')}
    </Button>,
    <Button key="add-maintenance" onClick={handleAddMaintenanceRecord} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('vehicles.maintenance.addRecord')}
    </Button>,
    <Button key="back" variant="outline" onClick={handleBack} className="gap-2">
      <ArrowLeft className="h-4 w-4" />
      {t('vehicles.page.backToList')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('vehicles.page.viewTitle')}
        subtitle={t('vehicles.page.viewSubtitle')}
        actions={actions}
        loading
      />
    );
  }

  if (!vehicle) {
    return (
      <AdminPageLayout
        title={t('vehicles.page.viewTitle')}
        subtitle={t('vehicles.page.viewSubtitle')}
        actions={actions}
      >
        <div className="text-center py-16">
          <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">{t('vehicles.messages.notFound')}</h3>
          <p className="text-muted-foreground mt-2">
            {t('vehicles.messages.notFoundDescription')}
          </p>
          <Button onClick={handleBack} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('vehicles.page.backToList')}
          </Button>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={vehicle.name || vehicle.model}
      subtitle={t('vehicles.page.viewSubtitle')}
      actions={actions}
    >
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold">
                    {vehicle.name || vehicle.model}
                  </CardTitle>
                  <div className="flex items-center flex-wrap gap-3 mt-2">
                    {typeBadge}
                    <Badge variant="outline" className="gap-2">
                      <Hash className="h-3.5 w-3.5" />
                      {vehicle.plate_number}
                    </Badge>
                    <Badge variant={vehicle.is_active ? 'success' : 'secondary'}>
                      {vehicle.is_active
                        ? t('vehicles.status.active')
                        : t('vehicles.status.inactive')}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  {t('vehicles.fields.capacity')}
                </p>
                <p className="text-3xl font-bold text-primary">
                  {vehicle.capacity ?? '-'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Info className="h-4 w-4" />
                {t('vehicles.sections.generalInfo')}
              </h3>
              <DetailItem
                icon={<Car className="h-4 w-4" />}
                label={t('vehicles.fields.model')}
                value={vehicle.model}
              />
              <DetailItem
                icon={<Users className="h-4 w-4" />}
                label={t('vehicles.fields.capacity')}
                value={vehicle.capacity}
              />
              <DetailItem
                icon={<Palette className="h-4 w-4" />}
                label={t('vehicles.fields.color')}
                value={vehicle.color}
              />
              <DetailItem
                icon={<CalendarDays className="h-4 w-4" />}
                label={t('vehicles.fields.manufactureYear')}
                value={vehicle.manufacture_year}
              />
              <DetailItem
                icon={<User className="h-4 w-4" />}
                label={t('vehicles.fields.driver')}
                value={
                  vehicle.driver_details
                    ? `${vehicle.driver_details.full_name} (${vehicle.driver_details.email})`
                    : t('vehicles.placeholders.noDriver')
                }
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Wrench className="h-4 w-4" />
                {t('vehicles.sections.maintenance')}
              </h3>
              <DetailItem
                icon={<Droplets className="h-4 w-4" />}
                label={t('vehicles.fields.lastOilChange')}
                value={formattedLastOilChange}
              />
              <DetailItem
                icon={<Wrench className="h-4 w-4" />}
                label={t('vehicles.fields.lastService')}
                value={formattedLastService}
              />
              <DetailItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label={t('vehicles.fields.insuranceExpiry')}
                value={formattedInsuranceExpiry}
              />
              <DetailItem
                icon={<Info className="h-4 w-4" />}
                label={t('vehicles.fields.notes')}
                value={vehicle.notes}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5" />
                  {t('vehicles.gasoil.sectionTitle')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t('vehicles.gasoil.sectionDescription')}
                </p>
              </div>
              <Badge variant="secondary" className="w-fit">
                {gasoilRecords.length} {t('vehicles.gasoil.records')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {gasoilLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
                <Fuel className="h-10 w-10 animate-spin text-muted-foreground/70" />
                <p>{t('vehicles.gasoil.loadingRecords')}</p>
              </div>
            ) : gasoilRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
                <ClipboardList className="h-10 w-10 text-muted-foreground/70" />
                <p className="font-medium text-foreground">
                  {t('vehicles.gasoil.noRecords')}
                </p>
                <Button variant="outline" className="gap-2" onClick={handleAddGasoilRecord}>
                  <Plus className="h-4 w-4" />
                  {t('vehicles.gasoil.addRecord')}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('vehicles.gasoil.refuelDate')}</TableHead>
                      <TableHead>{t('vehicles.gasoil.liters')}</TableHead>
                      <TableHead>{t('vehicles.gasoil.amount')}</TableHead>
                      <TableHead>{t('vehicles.gasoil.station')}</TableHead>
                      <TableHead>{t('vehicles.gasoil.receiptNumber')}</TableHead>
                      <TableHead>{t('vehicles.gasoil.notes')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gasoilRecords.map((record) => (
                      <TableRow
                        key={record.id}
                        className="cursor-pointer hover:bg-muted/40"
                        onClick={() =>
                          navigate(
                            `/admin/school-management/vehicles/${vehicleId}/gasoil/${record.id}`
                          )
                        }
                      >
                        <TableCell>
                          {record.refuel_date
                            ? formatDate(record.refuel_date, i18n.language)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {formatLiters(record.liters)}
                        </TableCell>
                        <TableCell>{formatCost(record.amount)}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{record.fuel_station || '-'}</span>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                          <span>{record.receipt_number || '-'}</span>
                        </TableCell>
                        <TableCell className="max-w-xs whitespace-pre-wrap text-muted-foreground">
                          {record.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {vehicle.content_type && (
          <VehicleMediaManager
            vehicleId={vehicleId}
            vehicleName={vehicle.name || vehicle.model}
            contentTypeId={vehicle.content_type}
            className="mt-6"
          />
        )}

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  {t('vehicles.maintenance.historyTitle')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t('vehicles.dialogs.maintenanceHint', {
                    vehicle: vehicle.name || vehicle.model
                  })}
                </p>
              </div>
              <Badge variant="secondary" className="w-fit">
                {maintenanceRecords.length} {t('vehicles.maintenance.records')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {maintenanceLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
                <Wrench className="h-10 w-10 animate-spin text-muted-foreground/70" />
                <p>{t('vehicles.maintenance.loadingRecords')}</p>
              </div>
            ) : maintenanceRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
                <ClipboardList className="h-10 w-10 text-muted-foreground/70" />
                <p className="font-medium text-foreground">
                  {t('vehicles.maintenance.noRecords')}
                </p>
                <Button variant="outline" className="gap-2" onClick={handleAddMaintenanceRecord}>
                  <Plus className="h-4 w-4" />
                  {t('vehicles.maintenance.addRecord')}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('vehicles.maintenance.serviceDate')}</TableHead>
                      <TableHead>{t('vehicles.maintenance.serviceType')}</TableHead>
                      <TableHead>{t('vehicles.maintenance.serviceLocation')}</TableHead>
                      <TableHead>{t('vehicles.maintenance.mileage')}</TableHead>
                      <TableHead>{t('vehicles.maintenance.cost')}</TableHead>
                      <TableHead>{t('vehicles.maintenance.description')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceRecords.map((record) => (
                      <TableRow
                        key={record.id}
                        className="cursor-pointer hover:bg-muted/40"
                        onClick={() => handleViewMaintenanceRecord(record.id)}
                      >
                        <TableCell>
                          {record.service_date
                            ? formatDate(record.service_date, i18n.language)
                            : '-'}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {record.service_type || '-'}
                        </TableCell>
                        <TableCell>{record.service_location || '-'}</TableCell>
                        <TableCell>{formatMileage(record.mileage)}</TableCell>
                        <TableCell>{formatCost(record.cost)}</TableCell>
                        <TableCell className="max-w-xs whitespace-pre-wrap text-muted-foreground">
                          {record.description || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </MotionDiv>
    </AdminPageLayout>
  );
};

export default ViewVehiclePage;
