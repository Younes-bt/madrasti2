import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Car,
  Bus,
  Search,
  Filter,
  Wrench,
  Droplets,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ClipboardList,
  User,
  CalendarDays,
  AlertTriangle,
  Eye
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
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
import schoolsService from '../../services/schools';
import usersService from '../../services/users';
import { formatDate } from '../../lib/utils';

const VEHICLE_TYPE_OPTIONS = [
  { value: 'BUS', icon: Bus, labelKey: 'vehicles.types.bus' },
  { value: 'MINIBUS', icon: Bus, labelKey: 'vehicles.types.minibus' },
  { value: 'VAN', icon: Car, labelKey: 'vehicles.types.van' },
  { value: 'CAR', icon: Car, labelKey: 'vehicles.types.car' },
  { value: 'OTHER', icon: Car, labelKey: 'vehicles.types.other' }
];

const DEFAULT_VEHICLE_FORM = {
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

const DEFAULT_MAINTENANCE_FORM = {
  service_date: '',
  service_type: '',
  service_location: '',
  mileage: '',
  cost: '',
  description: ''
};

const DAYS_UNTIL_OIL_ALERT = 90;
const DAYS_UNTIL_SERVICE_ALERT = 180;

const calculateDaysSince = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  const diff = Date.now() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const isOilChangeDue = (vehicle) => {
  const days = calculateDaysSince(vehicle.last_oil_change_date);
  return days === null || days > DAYS_UNTIL_OIL_ALERT;
};

const isServiceDue = (vehicle) => {
  const days = calculateDaysSince(vehicle.last_service_date);
  return days === null || days > DAYS_UNTIL_SERVICE_ALERT;
};

const VehicleTypeBadge = ({ type, t }) => {
  const option = VEHICLE_TYPE_OPTIONS.find((item) => item.value === type);
  const Icon = option?.icon || Car;
  return (
    <Badge variant="outline" className="gap-2">
      <Icon className="h-3.5 w-3.5" />
      {t(option?.labelKey || 'vehicles.types.other')}
    </Badge>
  );
};

const StatusBadge = ({ active, t }) => {
  return active ? (
    <Badge variant="success">{t('vehicles.status.active')}</Badge>
  ) : (
    <Badge variant="destructive">{t('vehicles.status.inactive')}</Badge>
  );
};

const VehicleFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  loading,
  vehicle,
  drivers,
  t
}) => {
  const [formState, setFormState] = useState(DEFAULT_VEHICLE_FORM);

  useEffect(() => {
    if (vehicle) {
      setFormState({
        name: vehicle.name || '',
        vehicle_type: vehicle.vehicle_type || 'BUS',
        model: vehicle.model || '',
        plate_number: vehicle.plate_number || '',
        driver: vehicle.driver ? String(vehicle.driver) : '',
        capacity: vehicle.capacity ?? '',
        color: vehicle.color || '',
        manufacture_year: vehicle.manufacture_year ?? '',
        last_oil_change_date: vehicle.last_oil_change_date || '',
        last_service_date: vehicle.last_service_date || '',
        insurance_expiry_date: vehicle.insurance_expiry_date || '',
        notes: vehicle.notes || '',
        is_active: vehicle.is_active ?? true
      });
    } else {
      setFormState(DEFAULT_VEHICLE_FORM);
    }
  }, [vehicle, open]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...formState,
      driver: formState.driver ? Number(formState.driver) : null,
      capacity: formState.capacity === '' ? null : Number(formState.capacity),
      manufacture_year:
        formState.manufacture_year === '' ? null : Number(formState.manufacture_year)
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? t('vehicles.dialogs.editVehicle') : t('vehicles.dialogs.addVehicle')}
          </DialogTitle>
          <DialogDescription>
            {vehicle
              ? t('vehicles.dialogs.editVehicleHint')
              : t('vehicles.dialogs.addVehicleHint')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicle_name">{t('vehicles.fields.name')}</Label>
              <Input
                id="vehicle_name"
                value={formState.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder={t('vehicles.placeholders.name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_model">{t('vehicles.fields.model')}</Label>
              <Input
                id="vehicle_model"
                value={formState.model}
                onChange={(event) => handleChange('model', event.target.value)}
                placeholder={t('vehicles.placeholders.model')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('vehicles.fields.type')}</Label>
              <Select
                value={formState.vehicle_type}
                onValueChange={(value) => handleChange('vehicle_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('vehicles.placeholders.type')} />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plate_number">{t('vehicles.fields.plateNumber')}</Label>
              <Input
                id="plate_number"
                value={formState.plate_number}
                onChange={(event) => handleChange('plate_number', event.target.value)}
                placeholder={t('vehicles.placeholders.plateNumber')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('vehicles.fields.driver')}</Label>
              <Select
                value={formState.driver}
                onValueChange={(value) => handleChange('driver', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('vehicles.placeholders.driver')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('vehicles.placeholders.noDriver')}</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={String(driver.id)}>
                      {driver.full_name || driver.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">{t('vehicles.fields.capacity')}</Label>
              <Input
                id="capacity"
                type="number"
                min="0"
                value={formState.capacity}
                onChange={(event) => handleChange('capacity', event.target.value)}
                placeholder={t('vehicles.placeholders.capacity')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacture_year">{t('vehicles.fields.manufactureYear')}</Label>
              <Input
                id="manufacture_year"
                type="number"
                min="1960"
                max={new Date().getFullYear()}
                value={formState.manufacture_year}
                onChange={(event) => handleChange('manufacture_year', event.target.value)}
                placeholder={t('vehicles.placeholders.manufactureYear')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">{t('vehicles.fields.color')}</Label>
              <Input
                id="color"
                value={formState.color}
                onChange={(event) => handleChange('color', event.target.value)}
                placeholder={t('vehicles.placeholders.color')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_oil_change_date">{t('vehicles.fields.lastOilChange')}</Label>
              <Input
                id="last_oil_change_date"
                type="date"
                value={formState.last_oil_change_date}
                onChange={(event) => handleChange('last_oil_change_date', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_service_date">{t('vehicles.fields.lastService')}</Label>
              <Input
                id="last_service_date"
                type="date"
                value={formState.last_service_date}
                onChange={(event) => handleChange('last_service_date', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance_expiry_date">
                {t('vehicles.fields.insuranceExpiry')}
              </Label>
              <Input
                id="insurance_expiry_date"
                type="date"
                value={formState.insurance_expiry_date}
                onChange={(event) => handleChange('insurance_expiry_date', event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('vehicles.fields.notes')}</Label>
            <Textarea
              id="notes"
              rows={3}
              value={formState.notes}
              onChange={(event) => handleChange('notes', event.target.value)}
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
                {formState.is_active ? t('vehicles.status.active') : t('vehicles.status.inactive')}
              </span>
              <Switch
                checked={formState.is_active}
                onCheckedChange={(checked) => handleChange('is_active', checked)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.saving') : vehicle ? t('common.update') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const MaintenanceDialog = ({
  open,
  onOpenChange,
  vehicle,
  records,
  onSubmit,
  onEditRecord,
  onDeleteRecord,
  loading,
  submitLoading,
  editingRecord,
  t
}) => {
  const [formState, setFormState] = useState(DEFAULT_MAINTENANCE_FORM);

  useEffect(() => {
    if (editingRecord) {
      setFormState({
        service_date: editingRecord.service_date || '',
        service_type: editingRecord.service_type || '',
        service_location: editingRecord.service_location || '',
        mileage: editingRecord.mileage ?? '',
        cost: editingRecord.cost ?? '',
        description: editingRecord.description || ''
      });
    } else {
      setFormState(DEFAULT_MAINTENANCE_FORM);
    }
  }, [editingRecord, open]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...formState,
      mileage: formState.mileage === '' ? null : Number(formState.mileage),
      cost: formState.cost === '' ? null : Number(formState.cost)
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {t('vehicles.dialogs.maintenanceTitle', { vehicle: vehicle?.name || vehicle?.model })}
          </DialogTitle>
          <DialogDescription>{t('vehicles.dialogs.maintenanceHint')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border/60 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service_date">{t('vehicles.maintenance.serviceDate')}</Label>
                <Input
                  id="service_date"
                  type="date"
                  value={formState.service_date}
                  onChange={(event) => handleChange('service_date', event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service_type">{t('vehicles.maintenance.serviceType')}</Label>
                <Input
                  id="service_type"
                  value={formState.service_type}
                  onChange={(event) => handleChange('service_type', event.target.value)}
                  placeholder={t('vehicles.maintenance.serviceTypePlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service_location">
                  {t('vehicles.maintenance.serviceLocation')}
                </Label>
                <Input
                  id="service_location"
                  value={formState.service_location}
                  onChange={(event) => handleChange('service_location', event.target.value)}
                  placeholder={t('vehicles.maintenance.serviceLocationPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">{t('vehicles.maintenance.mileage')}</Label>
                <Input
                  id="mileage"
                  type="number"
                  min="0"
                  value={formState.mileage}
                  onChange={(event) => handleChange('mileage', event.target.value)}
                  placeholder={t('vehicles.maintenance.mileagePlaceholder')}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cost">{t('vehicles.maintenance.cost')}</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.cost}
                  onChange={(event) => handleChange('cost', event.target.value)}
                  placeholder={t('vehicles.maintenance.costPlaceholder')}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('vehicles.maintenance.description')}</Label>
              <Textarea
                id="description"
                rows={3}
                value={formState.description}
                onChange={(event) => handleChange('description', event.target.value)}
                placeholder={t('vehicles.maintenance.descriptionPlaceholder')}
              />
            </div>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading
                  ? t('vehicles.maintenance.savingRecord')
                  : editingRecord
                  ? t('vehicles.maintenance.updateRecord')
                  : t('vehicles.maintenance.addRecord')}
              </Button>
            </DialogFooter>
          </form>

          <div className="rounded-lg border border-border/60">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <h3 className="font-semibold text-lg">{t('vehicles.maintenance.historyTitle')}</h3>
              <Badge variant="outline">
                {records.length} {t('vehicles.maintenance.records')}
              </Badge>
            </div>
            <div className="max-h-60 overflow-auto">
              {loading ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  {t('vehicles.maintenance.loadingRecords')}
                </div>
              ) : records.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                  <ClipboardList className="h-8 w-8 text-muted-foreground/70" />
                  <p>{t('vehicles.maintenance.noRecords')}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('vehicles.maintenance.serviceDate')}</TableHead>
                      <TableHead>{t('vehicles.maintenance.serviceType')}</TableHead>
                      <TableHead>{t('vehicles.maintenance.serviceLocation')}</TableHead>
                      <TableHead>{t('vehicles.maintenance.mileage')}</TableHead>
                      <TableHead>{t('vehicles.maintenance.cost')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {record.service_date ? formatDate(record.service_date) : '—'}
                        </TableCell>
                        <TableCell>{record.service_type || '—'}</TableCell>
                        <TableCell>{record.service_location || '—'}</TableCell>
                        <TableCell>
                          {typeof record.mileage === 'number' ? record.mileage.toLocaleString() : '—'}
                        </TableCell>
                        <TableCell>
                          {record.cost !== null && record.cost !== undefined
                            ? `${record.cost} MAD`
                            : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => onEditRecord(record)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">{t('common.edit')}</span>
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => onDeleteRecord(record)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">{t('common.delete')}</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const VehiclesManagementPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleFormLoading, setVehicleFormLoading] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceSubmitLoading, setMaintenanceSubmitLoading] = useState(false);
  const [editingMaintenanceRecord, setEditingMaintenanceRecord] = useState(null);

  const locale = i18n.language || 'en';

  const loadDrivers = useCallback(async () => {
    try {
      const response = await usersService.getAvailableDrivers({
        include_inactive: false
      });
      const items = response.results || response || [];
      setDrivers(
        Array.isArray(items)
          ? items.map((item) => ({
              id: item.id,
              full_name: item.full_name || item.profile?.full_name,
              email: item.email
            }))
          : []
      );
    } catch (error) {
      console.error('Failed to load drivers', error);
      toast.error(t('vehicles.toast.loadDriversFailed'));
    }
  }, [t]);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await schoolsService.getVehicles();
      setVehicles(Array.isArray(response) ? response : response.results || []);
    } catch (error) {
      console.error('Failed to load vehicles', error);
      toast.error(t('vehicles.toast.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadDrivers(), loadVehicles()]);
    };
    init();
  }, [loadDrivers, loadVehicles]);

  const refreshData = useCallback(() => {
    loadVehicles();
    loadDrivers();
  }, [loadDrivers, loadVehicles]);

  const goToAddVehiclePage = useCallback(() => {
    navigate('/admin/school-management/vehicles/add');
  }, [navigate]);

  const handleViewVehicle = useCallback(
    (vehicle) => {
      navigate(`/admin/school-management/vehicles/view/${vehicle.id}`);
    },
    [navigate]
  );

  const openEditVehicleDialog = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleDialogOpen(true);
  };

  const handleVehicleSubmit = async (formData) => {
    setVehicleFormLoading(true);
    try {
      if (selectedVehicle) {
        await schoolsService.updateVehicle(selectedVehicle.id, formData);
        toast.success(t('vehicles.toast.updateSuccess'));
      } else {
        await schoolsService.createVehicle(formData);
        toast.success(t('vehicles.toast.createSuccess'));
      }
      setVehicleDialogOpen(false);
      await loadVehicles();
    } catch (error) {
      console.error('Failed to save vehicle', error);
      toast.error(t('vehicles.toast.saveFailed'));
    } finally {
      setVehicleFormLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicle) => {
    const confirmed = window.confirm(
      t('vehicles.confirm.deleteVehicle', { vehicle: vehicle.name || vehicle.model })
    );
    if (!confirmed) return;

    try {
      await schoolsService.deleteVehicle(vehicle.id);
      toast.success(t('vehicles.toast.deleteSuccess'));
      await loadVehicles();
    } catch (error) {
      console.error('Failed to delete vehicle', error);
      toast.error(t('vehicles.toast.deleteFailed'));
    }
  };

  const openMaintenanceDialog = async (vehicle) => {
    setSelectedVehicle(vehicle);
    setMaintenanceDialogOpen(true);
    setEditingMaintenanceRecord(null);
    setMaintenanceLoading(true);
    try {
      const response = await schoolsService.getVehicleMaintenanceRecords(vehicle.id);
      setMaintenanceRecords(Array.isArray(response) ? response : response.results || []);
    } catch (error) {
      console.error('Failed to load maintenance records', error);
      toast.error(t('vehicles.toast.loadMaintenanceFailed'));
      setMaintenanceRecords([]);
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleMaintenanceSubmit = async (formData) => {
    if (!selectedVehicle) return;
    setMaintenanceSubmitLoading(true);
    try {
      if (editingMaintenanceRecord) {
        await schoolsService.updateVehicleMaintenanceRecord(
          selectedVehicle.id,
          editingMaintenanceRecord.id,
          formData
        );
        toast.success(t('vehicles.toast.updateMaintenanceSuccess'));
      } else {
        await schoolsService.createVehicleMaintenanceRecord(selectedVehicle.id, formData);
        toast.success(t('vehicles.toast.createMaintenanceSuccess'));
      }
      const updatedRecords = await schoolsService.getVehicleMaintenanceRecords(selectedVehicle.id);
      setMaintenanceRecords(
        Array.isArray(updatedRecords) ? updatedRecords : updatedRecords.results || []
      );
      setEditingMaintenanceRecord(null);
      await loadVehicles();
    } catch (error) {
      console.error('Failed to save maintenance record', error);
      toast.error(t('vehicles.toast.saveMaintenanceFailed'));
    } finally {
      setMaintenanceSubmitLoading(false);
    }
  };

  const handleEditMaintenanceRecord = (record) => {
    setEditingMaintenanceRecord(record);
  };

  const handleDeleteMaintenanceRecord = async (record) => {
    if (!selectedVehicle) return;
    const confirmed = window.confirm(
      t('vehicles.confirm.deleteMaintenance', { date: record.service_date })
    );
    if (!confirmed) return;
    try {
      await schoolsService.deleteVehicleMaintenanceRecord(selectedVehicle.id, record.id);
      toast.success(t('vehicles.toast.deleteMaintenanceSuccess'));
      const response = await schoolsService.getVehicleMaintenanceRecords(selectedVehicle.id);
      setMaintenanceRecords(Array.isArray(response) ? response : response.results || []);
      await loadVehicles();
    } catch (error) {
      console.error('Failed to delete maintenance record', error);
      toast.error(t('vehicles.toast.deleteMaintenanceFailed'));
    }
  };

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesQuery =
        query.length === 0 ||
        [vehicle.name, vehicle.model, vehicle.plate_number, vehicle.vehicle_type]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query)) ||
        (vehicle.driver_details?.full_name &&
          vehicle.driver_details.full_name.toLowerCase().includes(query));

      const matchesType = typeFilter === 'all' || vehicle.vehicle_type === typeFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && vehicle.is_active) ||
        (statusFilter === 'inactive' && !vehicle.is_active);

      return matchesQuery && matchesType && matchesStatus;
    });
  }, [vehicles, searchQuery, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = vehicles.length;
    const active = vehicles.filter((vehicle) => vehicle.is_active).length;
    const assigned = vehicles.filter((vehicle) => Boolean(vehicle.driver)).length;
    const dueMaintenance = vehicles.filter(
      (vehicle) => isOilChangeDue(vehicle) || isServiceDue(vehicle)
    ).length;

    return { total, active, assigned, dueMaintenance };
  }, [vehicles]);

  const actions = [
    <Button key="add-vehicle" onClick={goToAddVehiclePage} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('vehicles.actions.addVehicle')}
    </Button>
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="rounded-full bg-muted p-6">
        <Bus className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          {t('vehicles.emptyState.title')}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {t('vehicles.emptyState.subtitle')}
        </p>
      </div>
      <Button onClick={goToAddVehiclePage} className="gap-2">
        <Plus className="h-4 w-4" />
        {t('vehicles.actions.addVehicle')}
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title={t('vehicles.title')}
      subtitle={t('vehicles.subtitle')}
      actions={actions}
      onRefresh={refreshData}
      showRefreshButton
      loading={loading}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              {t('vehicles.stats.totalVehicles')}
            </CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('vehicles.stats.totalHint')}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              {t('vehicles.stats.activeVehicles')}
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {t('vehicles.stats.activeHint', { count: stats.total || 1 })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              {t('vehicles.stats.assignedDrivers')}
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.assigned}</div>
            <p className="text-xs text-muted-foreground">{t('vehicles.stats.assignedHint')}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              {t('vehicles.stats.maintenanceDue')}
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.dueMaintenance}</div>
            <p className="text-xs text-muted-foreground">
              {t('vehicles.stats.maintenanceHint')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/60">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('vehicles.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-10 w-full border-border/60 lg:w-56">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t('vehicles.filters.byType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('vehicles.filters.allTypes')}</SelectItem>
                  {VEHICLE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 w-full border-border/60 lg:w-56">
                  <SelectValue placeholder={t('vehicles.filters.byStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('vehicles.filters.allStatuses')}</SelectItem>
                  <SelectItem value="active">{t('vehicles.status.active')}</SelectItem>
                  <SelectItem value="inactive">{t('vehicles.status.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredVehicles.length} {t('common.results')}
            </div>
          </div>

          {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="gap-1 px-2 py-1"
                  onClick={() => setSearchQuery('')}
                >
                  <Search className="h-3 w-3" />
                  {searchQuery}
                </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge
                  variant="secondary"
                  className="gap-1 px-2 py-1"
                  onClick={() => setTypeFilter('all')}
                >
                  <Filter className="h-3 w-3" />
                  {t(
                    VEHICLE_TYPE_OPTIONS.find((item) => item.value === typeFilter)?.labelKey ||
                      'vehicles.filters.byType'
                  )}
                </Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge
                  variant="secondary"
                  className="gap-1 px-2 py-1"
                  onClick={() => setStatusFilter('all')}
                >
                  <AlertTriangle className="h-3 w-3" />
                  {statusFilter === 'active'
                    ? t('vehicles.status.active')
                    : t('vehicles.status.inactive')}
                </Badge>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mt-6 border-border/60">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              {t('common.loading')}
            </div>
          ) : filteredVehicles.length === 0 ? (
            emptyState
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">{t('vehicles.table.vehicle')}</TableHead>
                    <TableHead>{t('vehicles.table.driver')}</TableHead>
                    <TableHead>{t('vehicles.table.type')}</TableHead>
                    <TableHead>{t('vehicles.table.lastOil')}</TableHead>
                    <TableHead>{t('vehicles.table.lastService')}</TableHead>
                    <TableHead>{t('vehicles.table.status')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => {
                    const oilDue = isOilChangeDue(vehicle);
                    const serviceDue = isServiceDue(vehicle);
                    return (
                      <TableRow key={vehicle.id} className="align-top">
                        <TableCell>
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted flex items-center justify-center">
                              {vehicle.featured_image ? (
                                <img
                                  src={vehicle.featured_image.secure_url || vehicle.featured_image.url}
                                  alt={vehicle.featured_image.alt_text || vehicle.name || vehicle.model || 'Vehicle'}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Car className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {vehicle.name || vehicle.model || '—'}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {vehicle.model || '—'}
                              </span>
                              <span className="text-xs text-muted-foreground mt-1">
                                {t('vehicles.table.plateNumber', {
                                  plate: vehicle.plate_number || '-'
                                })}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {vehicle.driver_details ? (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">
                                {vehicle.driver_details.full_name || vehicle.driver_details.email}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {vehicle.driver_details.email}
                              </span>
                            </div>
                          ) : (
                            <Badge variant="outline">{t('vehicles.table.unassigned')}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <VehicleTypeBadge type={vehicle.vehicle_type} t={t} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Droplets className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {vehicle.last_oil_change_date
                                  ? formatDate(vehicle.last_oil_change_date, locale)
                                  : t('vehicles.table.notRecorded')}
                              </span>
                            </div>
                            {oilDue && (
                              <Badge variant="warning" className="w-fit">
                                {t('vehicles.table.oilDue')}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {vehicle.last_service_date
                                  ? formatDate(vehicle.last_service_date, locale)
                                  : t('vehicles.table.notRecorded')}
                              </span>
                            </div>
                            {serviceDue && (
                              <Badge variant="warning" className="w-fit">
                                {t('vehicles.table.serviceDue')}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge active={vehicle.is_active} t={t} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t('common.actions')}</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => openEditVehicleDialog(vehicle)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                {t('vehicles.actions.editVehicle')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => openMaintenanceDialog(vehicle)}>
                                <Wrench className="mr-2 h-4 w-4" />
                                {t('vehicles.actions.manageMaintenance')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleViewVehicle(vehicle)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t('vehicles.actions.viewVehicle')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={() => handleDeleteVehicle(vehicle)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('vehicles.actions.deleteVehicle')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <VehicleFormDialog
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        vehicle={selectedVehicle}
        drivers={drivers}
        loading={vehicleFormLoading}
        onSubmit={handleVehicleSubmit}
        t={t}
      />

      <MaintenanceDialog
        open={maintenanceDialogOpen}
        onOpenChange={(open) => {
          setMaintenanceDialogOpen(open);
          if (!open) {
            setEditingMaintenanceRecord(null);
          }
        }}
        vehicle={selectedVehicle}
        records={maintenanceRecords}
        loading={maintenanceLoading}
        submitLoading={maintenanceSubmitLoading}
        onSubmit={handleMaintenanceSubmit}
        onEditRecord={handleEditMaintenanceRecord}
        onDeleteRecord={handleDeleteMaintenanceRecord}
        editingRecord={editingMaintenanceRecord}
        t={t}
      />
    </AdminPageLayout>
  );
};

export default VehiclesManagementPage;
