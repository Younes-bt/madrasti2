import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Progress } from "@/components/ui/progress";
import {
    Plus, Search, Loader2, MoreVertical, FileText,
    Calendar, DollarSign, User as UserIcon, CheckCircle2,
    Clock, CreditCard, ChevronRight, ArrowLeft, Send, Check
} from 'lucide-react';
import financeService from '@/services/finance';
import schoolsService from '@/services/schools';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';

const PayrollPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [periods, setPeriods] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [view, setView] = useState('list'); // 'list' or 'detail'
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [periodEntries, setPeriodEntries] = useState([]);

    // Dialogs
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    // Form states
    const [periodForm, setPeriodForm] = useState({
        academic_year: '',
        period_start: '',
        period_end: '',
        payment_date: '',
        notes: ''
    });

    const [entryForm, setEntryForm] = useState({
        bonus: '0',
        overtime_pay: '0',
        social_security: '0',
        income_tax: '0',
        advance_payment: '0',
        other_deductions: '0',
        notes: ''
    });

    // History state
    const [historySearch, setHistorySearch] = useState('');
    const [historyEntries, setHistoryEntries] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Initial load for history or when search changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchHistoryEntries();
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [historySearch]);

    const fetchHistoryEntries = async () => {
        setHistoryLoading(true);
        try {
            const data = await financeService.getPayrollEntries({ search: historySearch });
            setHistoryEntries(data.results || data);
        } catch {
            console.error('Failed to load history');
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriods();
        fetchAcademicYears();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchPeriods = async () => {
        setLoading(true);
        try {
            const data = await financeService.getPayrollPeriods();
            setPeriods(data.results || data);
        } catch {
            toast.error(t('finance.payroll.failedToLoadPeriods', 'Failed to load payroll periods'));
        } finally {
            setLoading(false);
        }
    };

    const fetchAcademicYears = async () => {
        try {
            const data = await schoolsService.getAcademicYears();
            setAcademicYears(data.results || data);
            if (data.results?.length > 0 || data.length > 0) {
                const current = (data.results || data).find(y => y.is_current);
                if (current) setPeriodForm(prev => ({ ...prev, academic_year: current.id.toString() }));
            }
        } catch {
            console.error('Failed to fetch academic years');
        }
    };

    const fetchPeriodDetail = async (period) => {
        setLoading(true);
        try {
            const data = await financeService.getPayrollPeriod(period.id);
            setSelectedPeriod(data);
            setPeriodEntries(data.payroll_entries || []);
            setView('detail');
        } catch {
            toast.error(t('finance.payroll.failedToLoadPeriodDetail', 'Failed to load period details'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePeriod = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await financeService.createPayrollPeriod(periodForm);
            toast.success(t('finance.payroll.periodCreated', 'Payroll period created successfully'));
            setIsCreateDialogOpen(false);
            fetchPeriods();
        } catch {
            toast.error(t('finance.payroll.failedToCreatePeriod', 'Failed to create period'));
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateEntries = async () => {
        if (!selectedPeriod) return;
        setLoading(true);
        try {
            await financeService.generatePayrollEntries(selectedPeriod.id);
            toast.success(t('finance.payroll.entriesGenerated', 'Payroll entries generated successfully'));
            fetchPeriodDetail(selectedPeriod);
        } catch {
            toast.error(t('finance.payroll.failedToGenerateEntries', 'Failed to generate entries'));
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePeriod = async () => {
        if (!selectedPeriod) return;
        setLoading(true);
        try {
            await financeService.approvePayrollPeriod(selectedPeriod.id);
            toast.success(t('finance.payroll.periodApproved', 'Payroll period approved'));
            fetchPeriodDetail(selectedPeriod);
        } catch {
            toast.error(t('finance.payroll.failedToApprove', 'Failed to approve period'));
        } finally {
            setLoading(false);
        }
    };

    const handleProcessPayments = async () => {
        if (!selectedPeriod) return;
        setLoading(true);
        try {
            await financeService.processPayrollPayments(selectedPeriod.id);
            toast.success(t('finance.payroll.paymentsProcessed', 'Payroll payments processed successfully'));
            fetchPeriodDetail(selectedPeriod);
        } catch {
            toast.error(t('finance.payroll.failedToProcessPayments', 'Failed to process payments'));
        } finally {
            setLoading(false);
        }
    };

    const handleEditEntry = (entry) => {
        setSelectedEntry(entry);
        setEntryForm({
            bonus: entry.bonus,
            overtime_pay: entry.overtime_pay,
            social_security: entry.social_security,
            income_tax: entry.income_tax,
            advance_payment: entry.advance_payment,
            other_deductions: entry.other_deductions,
            notes: entry.notes || ''
        });
        setIsEntryDialogOpen(true);
    };

    const handleSaveEntry = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await financeService.updatePayrollEntry(selectedEntry.id, entryForm);
            toast.success(t('finance.payroll.entryUpdated', 'Entry updated successfully'));
            setIsEntryDialogOpen(false);
            fetchPeriodDetail(selectedPeriod);
        } catch {
            toast.error(t('finance.payroll.failedToUpdateEntry', 'Failed to update entry'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">Draft</Badge>;
            case 'PROCESSING': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Processing</Badge>;
            case 'APPROVED': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Approved</Badge>;
            case 'PAID': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Paid</Badge>;
            case 'CLOSED': return <Badge variant="secondary">Closed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AdminPageLayout
            title={t('finance.payroll.payrollTitle', 'Payroll Management')}
            subtitle={t('finance.payroll.payrollSubtitle', 'Process salaries, bonuses, and deductions')}
        >
            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{t('finance.payroll.periods', 'Payroll Periods')}</h3>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('finance.payroll.newPeriod', 'New Period')}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loading && periods.length === 0 ? (
                                <div className="col-span-full py-12 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                </div>
                            ) : periods.length === 0 ? (
                                <Card className="col-span-full py-12 text-center text-muted-foreground border-dashed">
                                    <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p>{t('finance.payroll.noPeriods', 'No payroll periods found.')}</p>
                                    <Button variant="link" onClick={() => setIsCreateDialogOpen(true)}>
                                        {t('finance.payroll.clickToCreate', 'Click here to create your first period')}
                                    </Button>
                                </Card>
                            ) : (
                                periods.map((period) => (
                                    <Card key={period.id} className="hover:shadow-md transition-all cursor-pointer group" onClick={() => fetchPeriodDetail(period)}>
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                                    <Calendar className="h-5 w-5" />
                                                </div>
                                                {getStatusBadge(period.status)}
                                            </div>
                                            <CardTitle className="text-base mt-2">
                                                {new Date(period.period_start).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                            </CardTitle>
                                            <CardDescription>
                                                {period.period_start} to {period.period_end}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>{t('finance.payroll.totalNet', 'Total Net')}:</span>
                                                    <span className="font-semibold text-foreground">{period.total_net} MAD</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>{t('finance.payroll.employeeCount', 'Employees')}:</span>
                                                    <span className="font-medium text-foreground">{period.employee_count}</span>
                                                </div>
                                                <div className="pt-2 flex items-center justify-between">
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {t('finance.payroll.paymentDate', 'Payment')}: {period.payment_date}
                                                    </span>
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Payroll History Report Section */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{t('finance.payroll.historyTitle', 'Payroll History')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('finance.payroll.historyDesc', 'Search and view all historical payroll entries.')}
                                    </p>
                                </div>
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={t('finance.payroll.searchEmployee', 'Search by employee name...')}
                                        className="pl-9"
                                        value={historySearch}
                                        onChange={(e) => setHistorySearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Card className="border-none shadow-sm overflow-hidden bg-background">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>{t('finance.payroll.employee', 'Employee')}</TableHead>
                                            <TableHead>{t('common.period', 'Period')}</TableHead>
                                            <TableHead>{t('finance.payroll.gross', 'Gross')}</TableHead>
                                            <TableHead>{t('finance.payroll.net', 'Net Pay')}</TableHead>
                                            <TableHead>{t('common.status', 'Status')}</TableHead>
                                            <TableHead>{t('finance.payroll.paymentDate', 'Payment Date')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {historyLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center">
                                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                                </TableCell>
                                            </TableRow>
                                        ) : historyEntries.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                                    {historySearch
                                                        ? t('common.noResults', 'No results found matching your search.')
                                                        : t('finance.payroll.noHistory', 'No payroll history found.')}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            historyEntries.map((entry) => (
                                                <TableRow key={entry.id} className="hover:bg-muted/50 transition-colors">
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold">
                                                                {entry.employee_name?.[0] || 'E'}
                                                            </div>
                                                            <span className="font-medium text-sm">{entry.employee_name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {entry.payroll_period_start ? new Date(entry.payroll_period_start).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : entry.payroll_period}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {entry.gross_salary} MAD
                                                    </TableCell>
                                                    <TableCell className="text-sm font-semibold">
                                                        {entry.net_salary} MAD
                                                    </TableCell>
                                                    <TableCell>
                                                        {entry.is_paid ? (
                                                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100">
                                                                Paid
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-amber-600 border-amber-200">
                                                                Pending
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {entry.payment_date || '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Detail Header */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={() => setView('list')}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-bold">
                                            {t('finance.payroll.payrollFor', 'Payroll for')} {new Date(selectedPeriod.period_start).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </h3>
                                        {getStatusBadge(selectedPeriod.status)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedPeriod.period_start} — {selectedPeriod.period_end} • {t('finance.payroll.paymentDate', 'Payment')}: {selectedPeriod.payment_date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
                                {selectedPeriod.status === 'DRAFT' && (
                                    <Button variant="outline" onClick={handleGenerateEntries} disabled={loading}>
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                        {t('finance.payroll.generateEntries', 'Generate Entries')}
                                    </Button>
                                )}
                                {selectedPeriod.status === 'DRAFT' && periodEntries.length > 0 && (
                                    <Button variant="outline" onClick={() => financeService.updatePayrollPeriod(selectedPeriod.id, { status: 'PROCESSING' }).then(() => fetchPeriodDetail(selectedPeriod))}>
                                        <Clock className="h-4 w-4 mr-2" />
                                        {t('finance.payroll.startProcessing', 'Start Processing')}
                                    </Button>
                                )}
                                {selectedPeriod.status === 'PROCESSING' && (
                                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={handleApprovePeriod} disabled={loading}>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        {t('finance.payroll.approvePayroll', 'Approve Payroll')}
                                    </Button>
                                )}
                                {selectedPeriod.status === 'APPROVED' && (
                                    <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleProcessPayments} disabled={loading}>
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        {t('finance.payroll.processPayments', 'Mark All as Paid')}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="bg-emerald-50/50 border-emerald-100">
                                <CardContent className="p-4">
                                    <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">{t('finance.payroll.totalGross', 'Total Gross')}</p>
                                    <p className="text-xl font-bold mt-1 text-emerald-700">{selectedPeriod.total_gross} MAD</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-red-50/50 border-red-100">
                                <CardContent className="p-4">
                                    <p className="text-xs text-red-600 font-medium uppercase tracking-wider">{t('finance.payroll.totalDeductions', 'Total Deductions')}</p>
                                    <p className="text-xl font-bold mt-1 text-red-700">{selectedPeriod.total_deductions} MAD</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-primary/5 border-primary/10">
                                <CardContent className="p-4">
                                    <p className="text-xs text-primary font-medium uppercase tracking-wider">{t('finance.payroll.totalNet', 'Total Net Payable')}</p>
                                    <p className="text-xl font-bold mt-1 text-primary">{selectedPeriod.total_net} MAD</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-50 border-slate-100">
                                <CardContent className="p-4">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('finance.payroll.employees', 'Employees')}</p>
                                    <p className="text-xl font-bold mt-1 text-slate-700">{selectedPeriod.employee_count}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Entries Table */}
                        <Card className="border-none shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>{t('finance.payroll.employee', 'Employee')}</TableHead>
                                        <TableHead>{t('finance.payroll.baseAmount', 'Base Amount')}</TableHead>
                                        <TableHead>{t('finance.payroll.allowances', 'Allowances')}</TableHead>
                                        <TableHead>{t('finance.payroll.deductions', 'Deductions')}</TableHead>
                                        <TableHead>{t('finance.payroll.netSalary', 'Net')}</TableHead>
                                        <TableHead>{t('common.status', 'Status')}</TableHead>
                                        <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {periodEntries.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                                {t('finance.payroll.noEntriesFound', 'No entries generated for this period.')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        periodEntries.map((entry) => (
                                            <TableRow key={entry.id} className="group transition-colors outline-none focus:bg-muted/30">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold">
                                                            {entry.employee_name?.[0] || 'E'}
                                                        </div>
                                                        <div className="font-medium text-sm">{entry.employee_name}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm">{entry.base_salary} MAD</TableCell>
                                                <TableCell className="text-sm text-emerald-600 font-medium">
                                                    +{(parseFloat(entry.transportation_allowance) + parseFloat(entry.housing_allowance) + parseFloat(entry.other_allowances) + parseFloat(entry.bonus) + parseFloat(entry.overtime_pay)).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-sm text-red-500 font-medium">
                                                    -{(parseFloat(entry.total_deductions)).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="font-bold text-sm text-foreground">{entry.net_salary} MAD</TableCell>
                                                <TableCell>
                                                    {entry.is_paid ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none transition-all">
                                                            <Check className="h-3 w-3 mr-1" />
                                                            Paid
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-slate-400 font-normal">Pending</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditEntry(entry)} disabled={selectedPeriod.status === 'PAID'}>
                                                            {t('common.edit', 'Edit')}
                                                        </Button>
                                                        {!entry.is_paid && selectedPeriod.status === 'APPROVED' && (
                                                            <Button variant="ghost" size="sm" className="text-emerald-600" onClick={() => financeService.markPayrollEntryPaid(entry.id).then(() => fetchPeriodDetail(selectedPeriod))}>
                                                                {t('finance.payroll.pay', 'Pay')}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Period Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('finance.payroll.newPayrollPeriod', 'New Payroll Period')}</DialogTitle>
                        <DialogDescription>{t('finance.payroll.newPeriodDesc', 'Create a new monthly payroll processing cycle.')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreatePeriod} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="academic_year">{t('common.academicYear', 'Academic Year')}</Label>
                            <Select
                                value={periodForm.academic_year}
                                onValueChange={(val) => setPeriodForm({ ...periodForm, academic_year: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map(year => (
                                        <SelectItem key={year.id} value={year.id.toString()}>{year.display_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="period_start">{t('common.startDate', 'Start Date')}</Label>
                                <Input
                                    id="period_start"
                                    type="date"
                                    value={periodForm.period_start}
                                    onChange={(e) => setPeriodForm({ ...periodForm, period_start: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="period_end">{t('common.endDate', 'End Date')}</Label>
                                <Input
                                    id="period_end"
                                    type="date"
                                    value={periodForm.period_end}
                                    onChange={(e) => setPeriodForm({ ...periodForm, period_end: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_date">{t('finance.payroll.scheduledPayment', 'Scheduled Payment Date')}</Label>
                            <Input
                                id="payment_date"
                                type="date"
                                value={periodForm.payment_date}
                                onChange={(e) => setPeriodForm({ ...periodForm, payment_date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">{t('common.notes', 'Notes')}</Label>
                            <Input
                                id="notes"
                                value={periodForm.notes}
                                onChange={(e) => setPeriodForm({ ...periodForm, notes: e.target.value })}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                {t('common.cancel', 'Cancel')}
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {t('common.create', 'Create Period')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Entry Dialog */}
            <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t('finance.payroll.adjustSalary', 'Adjust Salary Postings')}</DialogTitle>
                        <DialogDescription>
                            {t('finance.payroll.adjustDesc', 'Manually add bonuses or deductions for this specific month.')}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEntry && (
                        <div className="mb-4 p-3 bg-primary/5 rounded-lg flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 font-medium">
                                <UserIcon className="h-4 w-4" />
                                {selectedEntry.employee_name}
                            </div>
                            <div className="font-semibold">{selectedEntry.base_salary} MAD (Base)</div>
                        </div>
                    )}
                    <form onSubmit={handleSaveEntry} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t('finance.payroll.earnings', 'Extra Earnings')}</h4>
                                <div className="space-y-2">
                                    <Label htmlFor="bonus">{t('finance.payroll.bonus', 'Performance Bonus')}</Label>
                                    <Input
                                        id="bonus" type="number" step="0.01"
                                        value={entryForm.bonus}
                                        onChange={(e) => setEntryForm({ ...entryForm, bonus: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="overtime">{t('finance.payroll.overtime', 'Overtime Pay')}</Label>
                                    <Input
                                        id="overtime" type="number" step="0.01"
                                        value={entryForm.overtime_pay}
                                        onChange={(e) => setEntryForm({ ...entryForm, overtime_pay: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest">{t('finance.payroll.deductions', 'Deductions')}</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="social_security">{t('finance.payroll.socSec', 'Soc. Sec')}</Label>
                                        <Input
                                            id="social_security" type="number" step="0.01"
                                            value={entryForm.social_security}
                                            onChange={(e) => setEntryForm({ ...entryForm, social_security: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tax">{t('finance.payroll.incomeTax', 'Income Tax')}</Label>
                                        <Input
                                            id="tax" type="number" step="0.01"
                                            value={entryForm.income_tax}
                                            onChange={(e) => setEntryForm({ ...entryForm, income_tax: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="advance">{t('finance.payroll.salaryAdvance', 'Salary Advance')}</Label>
                                    <Input
                                        id="advance" type="number" step="0.01"
                                        value={entryForm.advance_payment}
                                        onChange={(e) => setEntryForm({ ...entryForm, advance_payment: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="other_deductions">{t('finance.payroll.otherDeductions', 'Other Deductions')}</Label>
                                    <Input
                                        id="other_deductions" type="number" step="0.01"
                                        value={entryForm.other_deductions}
                                        onChange={(e) => setEntryForm({ ...entryForm, other_deductions: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entry_notes">{t('common.notes', 'Internal Notes')}</Label>
                            <Input
                                id="entry_notes"
                                value={entryForm.notes}
                                onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })}
                                placeholder="Note for the employee (e.g. 'Exceptional work on project X')"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEntryDialogOpen(false)}>
                                {t('common.cancel', 'Cancel')}
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {t('common.save', 'Update Posting')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminPageLayout>
    );
};

export default PayrollPage;
