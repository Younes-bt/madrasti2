import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import {
    Plus, Search, Loader2, MoreVertical, FileText,
    Calendar, DollarSign, User as UserIcon, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import financeService from '@/services/finance';
import usersService from '@/services/users';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';

const ContractsPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Form State
    const [formData, setFormData] = useState({
        employee: '',
        contract_type: 'FULL_TIME_MONTHLY',
        contract_number: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        base_amount: '',
        currency: 'MAD',
        hours_per_week: '',
        lessons_per_week: '',
        transportation_allowance: '0',
        housing_allowance: '0',
        other_allowances: '0',
        social_security_rate: '0',
        tax_exemption_amount: '0',
        is_active: true,
        notes: ''
    });

    const contractTypes = [
        { value: 'FULL_TIME_MONTHLY', label: t('finance.payroll.fullTime', 'Full-Time (Monthly)') },
        { value: 'PART_TIME_MONTHLY', label: t('finance.payroll.partTime', 'Part-Time (Monthly)') },
        { value: 'HOURLY', label: t('finance.payroll.hourly', 'Hourly') },
        { value: 'PER_LESSON', label: t('finance.payroll.perLesson', 'Per Lesson') },
        { value: 'FIXED_TERM', label: t('finance.payroll.fixedTerm', 'Fixed Term') },
        { value: 'INTERNSHIP', label: t('finance.payroll.internship', 'Internship') },
    ];

    useEffect(() => {
        fetchContracts();
        fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter !== 'ALL') params.is_active = statusFilter === 'ACTIVE';
            if (searchQuery) params.search = searchQuery;

            const data = await financeService.getContracts(params);
            setContracts(data.results || data);
        } catch {
            toast.error(t('finance.payroll.failedToLoadContracts', 'Failed to load contracts'));
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const data = await usersService.getUsers({
                role: 'TEACHER,STAFF,DRIVER',
                is_active: true,
                page_size: 100
            });
            setEmployees(data.results || data);
        } catch {
            console.error('Failed to fetch employees');
        }
    };

    const handleViewContract = (contract) => {
        setSelectedContract(contract);
        setIsViewDialogOpen(true);
    };
    const handleOpenDialog = (contract = null) => {
        if (contract) {
            setIsEditing(true);
            setSelectedContract(contract);
            setFormData({
                employee: contract.employee?.id || contract.employee,
                contract_type: contract.contract_type,
                contract_number: contract.contract_number,
                start_date: contract.start_date,
                end_date: contract.end_date || '',
                base_amount: contract.base_amount,
                currency: contract.currency || 'MAD',
                hours_per_week: contract.hours_per_week || '',
                lessons_per_week: contract.lessons_per_week || '',
                transportation_allowance: contract.transportation_allowance,
                housing_allowance: contract.housing_allowance,
                other_allowances: contract.other_allowances,
                social_security_rate: contract.social_security_rate,
                tax_exemption_amount: contract.tax_exemption_amount,
                is_active: contract.is_active,
                notes: contract.notes || ''
            });
        } else {
            setIsEditing(false);
            setSelectedContract(null);
            setFormData({
                employee: '',
                contract_type: 'FULL_TIME_MONTHLY',
                contract_number: `CNT-${Date.now()}`,
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                base_amount: '',
                currency: 'MAD',
                hours_per_week: '',
                lessons_per_week: '',
                transportation_allowance: '0',
                housing_allowance: '0',
                other_allowances: '0',
                social_security_rate: '0',
                tax_exemption_amount: '0',
                is_active: true,
                notes: ''
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await financeService.updateContract(selectedContract.id, formData);
                toast.success(t('finance.payroll.contractUpdated', 'Contract updated successfully'));
            } else {
                await financeService.createContract(formData);
                toast.success(t('finance.payroll.contractCreated', 'Contract created successfully'));
            }
            setIsDialogOpen(false);
            fetchContracts();
        } catch (error) {
            toast.error(error.message || t('finance.payroll.failedToSaveContract', 'Failed to save contract'));
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (contract) => {
        try {
            await financeService.updateContract(contract.id, { is_active: !contract.is_active });
            toast.success(t('finance.payroll.statusUpdated', 'Status updated successfully'));
            fetchContracts();
        } catch {
            toast.error(t('finance.payroll.failedToUpdateStatus', 'Failed to update status'));
        }
    };

    return (
        <AdminPageLayout
            title={t('finance.payroll.contractsTitle', 'Employment Contracts')}
            subtitle={t('finance.payroll.contractsSubtitle', 'Manage staff and teacher contracts and compensation')}
        >
            <div className="space-y-6">
                {/* Actions & Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex flex-1 gap-4 w-full md:w-auto">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('common.search', 'Search...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('common.status', 'Status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">{t('common.allStatus', 'All Status')}</SelectItem>
                                <SelectItem value="ACTIVE">{t('common.active', 'Active')}</SelectItem>
                                <SelectItem value="INACTIVE">{t('common.inactive', 'Inactive')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={fetchContracts}>
                            {t('common.filter', 'Filter')}
                        </Button>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('finance.payroll.addContract', 'New Contract')}
                    </Button>
                </div>

                {/* Contracts Table */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>{t('finance.payroll.employee', 'Employee')}</TableHead>
                                <TableHead>{t('finance.payroll.contractType', 'Type')}</TableHead>
                                <TableHead>{t('finance.payroll.startDate', 'Start Date')}</TableHead>
                                <TableHead>{t('finance.payroll.baseSalary', 'Base Salary')}</TableHead>
                                <TableHead>{t('common.status', 'Status')}</TableHead>
                                <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && contracts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        {t('common.loading', 'Loading...')}
                                    </TableCell>
                                </TableRow>
                            ) : contracts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        {t('finance.payroll.noContracts', 'No contracts found')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contracts.map((contract) => (
                                    <TableRow
                                        key={contract.id}
                                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => handleViewContract(contract)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                    {contract.employee_name?.[0] || <UserIcon className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{contract.employee_name || t('common.unknown', 'Unknown')}</div>
                                                    <div className="text-xs text-muted-foreground">{contract.contract_number}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">
                                                {contract.contract_type_display || contract.contract_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                {contract.start_date}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {contract.base_amount} MAD
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {contract.is_active ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    {t('common.active', 'Active')}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    {t('common.inactive', 'Inactive')}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewContract(contract); }}>
                                                        {t('common.view', 'View Details')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenDialog(contract); }}>
                                                        {t('common.edit', 'Edit')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleToggleStatus(contract); }}>
                                                        {contract.is_active ? t('common.deactivate', 'Deactivate') : t('common.activate', 'Activate')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Create/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? t('finance.payroll.editContract', 'Edit Contract') : t('finance.payroll.newContract', 'Create Contract')}</DialogTitle>
                            <DialogDescription>
                                {t('finance.payroll.contractDialogDesc', 'Set up employment terms, compensation, and allowances.')}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="employee">{t('finance.payroll.employee', 'Employee')}</Label>
                                        <Select
                                            value={formData.employee?.toString()}
                                            onValueChange={(val) => setFormData({ ...formData, employee: val })}
                                            disabled={isEditing}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('finance.payroll.selectEmployee', 'Select Employee')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map(emp => (
                                                    <SelectItem key={emp.id} value={emp.id.toString()}>
                                                        {emp.first_name} {emp.last_name} ({emp.role})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contract_type">{t('finance.payroll.contractType', 'Contract Type')}</Label>
                                        <Select
                                            value={formData.contract_type}
                                            onValueChange={(val) => setFormData({ ...formData, contract_type: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {contractTypes.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contract_number">{t('finance.payroll.contractNumber', 'Contract Number')}</Label>
                                        <Input
                                            id="contract_number"
                                            value={formData.contract_number}
                                            onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">{t('finance.payroll.startDate', 'Start Date')}</Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">{t('finance.payroll.endDate', 'End Date (Optional)')}</Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2 pt-8">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor="is_active" className="cursor-pointer">{t('common.active', 'Active')}</Label>
                                    </div>
                                </div>

                                {/* Compensation */}
                                <div className="col-span-full border-t pt-4 mt-2">
                                    <h4 className="font-medium mb-4 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        {t('finance.payroll.compensation', 'Compensation & Benefits')}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="base_amount">{t('finance.payroll.baseSalary', 'Base Salary / Rate')}</Label>
                                            <div className="relative">
                                                <Input
                                                    id="base_amount"
                                                    type="number"
                                                    value={formData.base_amount}
                                                    onChange={(e) => setFormData({ ...formData, base_amount: e.target.value })}
                                                    required
                                                    className="pr-12"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">MAD</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="transportation">{t('finance.payroll.transportation', 'Transportation')}</Label>
                                            <Input
                                                id="transportation"
                                                type="number"
                                                value={formData.transportation_allowance}
                                                onChange={(e) => setFormData({ ...formData, transportation_allowance: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="housing">{t('finance.payroll.housing', 'Housing Allowance')}</Label>
                                            <Input
                                                id="housing"
                                                type="number"
                                                value={formData.housing_allowance}
                                                onChange={(e) => setFormData({ ...formData, housing_allowance: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Variable Terms (Conditional) */}
                                {(formData.contract_type === 'HOURLY' || formData.contract_type === 'PER_LESSON') && (
                                    <div className="col-span-full border-t pt-4 mt-2 bg-muted/30 p-4 rounded-lg">
                                        <h4 className="font-medium mb-4 flex items-center gap-2 text-primary">
                                            <Calendar className="h-4 w-4" />
                                            {t('finance.payroll.variableTerms', 'Work Load & Schedule')}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {formData.contract_type === 'HOURLY' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="hours_per_week">{t('finance.payroll.hoursPerWeek', 'Expected Hours Per Week')}</Label>
                                                    <Input
                                                        id="hours_per_week"
                                                        type="number"
                                                        step="0.5"
                                                        value={formData.hours_per_week}
                                                        onChange={(e) => setFormData({ ...formData, hours_per_week: e.target.value })}
                                                        required
                                                    />
                                                    <p className="text-xs text-muted-foreground">{t('finance.payroll.hoursHint', 'Used to estimate monthly salary (Avg 4.33 weeks/month)')}</p>
                                                </div>
                                            )}
                                            {formData.contract_type === 'PER_LESSON' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="lessons_per_week">{t('finance.payroll.lessonsPerWeek', 'Expected Lessons Per Week')}</Label>
                                                    <Input
                                                        id="lessons_per_week"
                                                        type="number"
                                                        value={formData.lessons_per_week}
                                                        onChange={(e) => setFormData({ ...formData, lessons_per_week: e.target.value })}
                                                        required
                                                    />
                                                    <p className="text-xs text-muted-foreground">{t('finance.payroll.lessonsHint', 'Used to estimate monthly salary (Avg 4.33 weeks/month)')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Deductions/Taxes */}
                                <div className="col-span-full border-t pt-4 mt-2">
                                    <h4 className="font-medium mb-4 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-orange-500" />
                                        {t('finance.payroll.deductionsTaxes', 'Deductions & Tax Exemption')}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="social_security">{t('finance.payroll.socialSecurity', 'Social Security Rate (%)')}</Label>
                                            <Input
                                                id="social_security"
                                                type="number"
                                                step="0.01"
                                                value={formData.social_security_rate}
                                                onChange={(e) => setFormData({ ...formData, social_security_rate: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tax_exemption">{t('finance.payroll.taxExemption', 'Tax Exemption Amount')}</Label>
                                            <Input
                                                id="tax_exemption"
                                                type="number"
                                                value={formData.tax_exemption_amount}
                                                onChange={(e) => setFormData({ ...formData, tax_exemption_amount: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-full space-y-2 border-t pt-4">
                                    <Label htmlFor="notes">{t('common.notes', 'Notes')}</Label>
                                    <Input
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder={t('finance.payroll.notesPlaceholder', 'Additional contract details...')}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="sticky bottom-0 bg-background pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    {isEditing ? t('common.save', 'Save Changes') : t('common.create', 'Create Contract')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* View Details Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{t('finance.payroll.contractDetails', 'Contract Details')}</DialogTitle>
                        </DialogHeader>
                        {selectedContract && (
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-4 border-b pb-6">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                        {selectedContract.employee_name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedContract.employee_name}</h3>
                                        <p className="text-muted-foreground">{selectedContract.contract_number}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="outline">{selectedContract.contract_type_display || selectedContract.contract_type}</Badge>
                                            <Badge className={selectedContract.is_active ? "bg-emerald-500/10 text-emerald-600 border-none" : "bg-slate-100 text-slate-500 border-none"}>
                                                {selectedContract.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{t('finance.payroll.startDate', 'Start Date')}</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                {selectedContract.start_date}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{t('finance.payroll.endDate', 'End Date')}</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                {selectedContract.end_date || t('common.ongoing', 'Ongoing')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{t('finance.payroll.baseSalary', 'Base Salary')}</p>
                                            <p className="text-lg font-bold text-primary">{parseFloat(selectedContract.base_amount).toLocaleString()} MAD</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{t('finance.payroll.socialSecurity', 'Social Security Rate')}</p>
                                            <p className="font-medium">{selectedContract.social_security_rate}%</p>
                                        </div>
                                        {selectedContract.contract_type === 'HOURLY' && selectedContract.hours_per_week && (
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{t('finance.payroll.hoursPerWeek', 'Expected Hours')}</p>
                                                <p className="font-medium">{selectedContract.hours_per_week}h / week</p>
                                            </div>
                                        )}
                                        {selectedContract.contract_type === 'PER_LESSON' && selectedContract.lessons_per_week && (
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{t('finance.payroll.lessonsPerWeek', 'Expected Lessons')}</p>
                                                <p className="font-medium">{selectedContract.lessons_per_week} lessons / week</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-3">{t('finance.payroll.compensation', 'Monthly Allowances')}</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground mb-1">{t('finance.payroll.transportation', 'Transportation')}</p>
                                            <p className="font-bold">{parseFloat(selectedContract.transportation_allowance || 0).toLocaleString()} MAD</p>
                                        </div>
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground mb-1">{t('finance.payroll.housing', 'Housing')}</p>
                                            <p className="font-bold">{parseFloat(selectedContract.housing_allowance || 0).toLocaleString()} MAD</p>
                                        </div>
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground mb-1">{t('finance.payroll.others', 'Others')}</p>
                                            <p className="font-bold">{parseFloat(selectedContract.other_allowances || 0).toLocaleString()} MAD</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedContract.notes && (
                                    <div className="border-t pt-6 text-sm italic text-muted-foreground">
                                        <p className="text-xs non-italic text-muted-foreground uppercase font-bold tracking-wider mb-2">{t('common.notes', 'Notes')}</p>
                                        "{selectedContract.notes}"
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter className="pt-6">
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>{t('common.close', 'Close')}</Button>
                            <Button onClick={() => { setIsViewDialogOpen(false); handleOpenDialog(selectedContract); }}>{t('common.edit', 'Edit Contract')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
};

export default ContractsPage;
