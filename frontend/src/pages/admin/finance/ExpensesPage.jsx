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
    Calendar, DollarSign, CheckCircle2, XCircle,
    Upload, Download, Layers, AlertTriangle, Eye
} from 'lucide-react';
import financeService from '@/services/finance';
import schoolsService from '@/services/schools';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';

const ExpensesPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [currentYear, setCurrentYear] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    // Form State
    const [formData, setFormData] = useState({
        budget_category: '',
        category: '',
        title: '',
        description: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        vendor_name: '',
        academic_year: '',
        attachment: null,
    });

    const EXPENSE_CATEGORIES = [
        { id: 'SALARY', name: 'Salaries & Wages' },
        { id: 'FUEL', name: 'Fuel & Gasoil' },
        { id: 'UTILITIES', name: 'Utilities' },
        { id: 'SUPPLIES', name: 'Office Supplies' },
        { id: 'MAINTENANCE', name: 'Maintenance' },
        { id: 'TRANSPORTATION', name: 'Transportation' },
        { id: 'RENT', name: 'Rent' },
        { id: 'EQUIPMENT', name: 'Equipment' },
        { id: 'OTHER_EXPENSE', name: 'Other' },
    ];

    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'CASH',
        reference_number: '',
        notes: ''
    });
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
        fetchCurrentYear();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCurrentYear = async () => {
        try {
            const year = await schoolsService.getCurrentAcademicYear();
            if (year) {
                setCurrentYear(year);
                setFormData(prev => ({ ...prev, academic_year: year.id }));
            }
        } catch {
            console.error('Failed to fetch current academic year');
        }
    };

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter !== 'ALL') params.status = statusFilter;
            if (categoryFilter !== 'ALL') params.category = categoryFilter;
            if (searchQuery) params.search = searchQuery;

            const data = await financeService.getExpenses(params);
            setExpenses(data.results || data);
        } catch {
            toast.error(t('finance.expenses.failedToLoad', 'Failed to load expenses'));
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await financeService.getBudgetCategories();
            setCategories(data.results || data);
        } catch {
            console.error('Failed to fetch categories');
        }
    };

    const handleOpenDialog = (expense = null) => {
        if (expense) {
            setIsEditing(true);
            setSelectedExpense(expense);
            setFormData({
                budget_category: expense.budget_category || '',
                category: expense.category || '',
                title: expense.title,
                description: expense.description || '',
                amount: expense.amount,
                expense_date: expense.expense_date,
                vendor_name: expense.vendor_name || '',
                academic_year: expense.academic_year?.id || expense.academic_year,
                attachment: null,
            });
        } else {
            setIsEditing(false);
            setSelectedExpense(null);
            setFormData({
                budget_category: '',
                category: '',
                title: '',
                description: '',
                amount: '',
                expense_date: new Date().toISOString().split('T')[0],
                vendor_name: '',
                academic_year: currentYear?.id || '',
                attachment: null,
            });
        }
        setIsDialogOpen(true);
    };

    const handleOpenPaymentDialog = (expense) => {
        setSelectedExpense(expense);
        setPaymentForm({
            amount: expense.remaining_amount || expense.amount,
            payment_date: new Date().toISOString().split('T')[0],
            payment_method: 'CASH',
            reference_number: '',
            notes: ''
        });
        setIsPaymentDialogOpen(true);
    };

    const handleViewDetails = (expense) => {
        setSelectedExpense(expense);
        setIsViewDetailsOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });

            if (isEditing) {
                await financeService.updateExpense(selectedExpense.id, submitData);
                toast.success(t('finance.expenses.updated', 'Expense updated successfully'));
            } else {
                await financeService.createExpense(submitData);
                toast.success(t('finance.expenses.created', 'Expense created successfully'));
            }
            setIsDialogOpen(false);
            fetchExpenses();
        } catch (error) {
            toast.error(error.message || t('finance.expenses.failedToSave', 'Failed to save expense'));
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await financeService.approveExpense(id);
            toast.success(t('finance.expenses.approved', 'Expense approved'));
            fetchExpenses();
        } catch {
            toast.error(t('finance.expenses.failedToApprove', 'Failed to approve expense'));
        }
    };

    const handleReject = async (id) => {
        try {
            await financeService.rejectExpense(id);
            toast.success(t('finance.expenses.rejected', 'Expense rejected'));
            fetchExpenses();
        } catch {
            toast.error(t('finance.expenses.failedToReject', 'Failed to reject expense'));
        }
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        try {
            await financeService.recordExpensePayment(selectedExpense.id, paymentForm);
            toast.success(t('finance.expenses.paymentRecorded', 'Payment recorded successfully'));
            setIsPaymentDialogOpen(false);
            fetchExpenses();
        } catch {
            toast.error(t('finance.expenses.failedToRecordPayment', 'Failed to record payment'));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 uppercase text-[10px]">Draft</Badge>;
            case 'SUBMITTED': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 uppercase text-[10px]">Submitted</Badge>;
            case 'PENDING': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 uppercase text-[10px]">Pending</Badge>;
            case 'APPROVED': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none uppercase text-[10px]">Approved</Badge>;
            case 'REJECTED': return <Badge variant="destructive" className="uppercase text-[10px]">Rejected</Badge>;
            case 'PAID': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none uppercase text-[10px]">Paid</Badge>;
            case 'COMPLETED': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none uppercase text-[10px]">Completed</Badge>;
            default: return <Badge variant="outline" className="uppercase text-[10px]">{status}</Badge>;
        }
    };

    return (
        <AdminPageLayout
            title={t('finance.expenses.title', 'Expense Management')}
            subtitle={t('finance.expenses.subtitle', 'Track and approve operational expenses')}
        >
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-primary/5 border-none shadow-none">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs text-primary font-bold uppercase tracking-wider">{t('finance.expenses.totalThisMonth', 'This Month')}</p>
                                <DollarSign className="h-4 w-4 text-primary opacity-50" />
                            </div>
                            <p className="text-2xl font-bold text-primary">
                                {expenses.reduce((acc, exp) => acc + (new Date(exp.expense_date).getMonth() === new Date().getMonth() ? parseFloat(exp.amount) : 0), 0).toFixed(2)} MAD
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-amber-50 border-none shadow-none">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">{t('finance.expenses.pendingQty', 'Pending Approval')}</p>
                                <AlertTriangle className="h-4 w-4 text-amber-500 opacity-50" />
                            </div>
                            <p className="text-2xl font-bold text-amber-600">
                                {expenses.filter(e => e.status === 'PENDING').length}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-1 gap-2 w-full md:w-auto">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('common.search', 'Search expenses...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('finance.expenses.add', 'Record Expense')}
                    </Button>
                </div>

                {/* Table */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>{t('finance.expenses.details', 'Expense Details')}</TableHead>
                                <TableHead>{t('finance.expenses.category', 'Category')}</TableHead>
                                <TableHead>{t('common.date', 'Date')}</TableHead>
                                <TableHead>{t('finance.expenses.amount', 'Amount')}</TableHead>
                                <TableHead>{t('common.status', 'Status')}</TableHead>
                                <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell>
                                </TableRow>
                            ) : expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">No expenses found.</TableCell>
                                </TableRow>
                            ) : (
                                expenses.map((expense) => (
                                    <TableRow
                                        key={expense.id}
                                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => handleViewDetails(expense)}
                                    >
                                        <TableCell>
                                            <div className="font-medium text-sm">{expense.title}</div>
                                            <div className="text-xs text-muted-foreground">{expense.vendor_name || 'No vendor'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal text-[10px] uppercase tracking-wider">
                                                {expense.budget_category_name || expense.category_display || 'General'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {expense.expense_date}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold">{expense.amount} MAD</div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(expense.status)}</TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem onClick={() => handleViewDetails(expense)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        {t('common.viewDetails', 'View Details')}
                                                    </DropdownMenuItem>
                                                    {expense.attachment && (
                                                        <DropdownMenuItem onClick={() => window.open(expense.attachment, '_blank')}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            {t('finance.expenses.viewReceipt', 'View Receipt')}
                                                        </DropdownMenuItem>
                                                    )}
                                                    {expense.status === 'PENDING' && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleApprove(expense.id)} className="text-emerald-600">
                                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                                {t('common.approve', 'Approve')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleReject(expense.id)} className="text-red-500">
                                                                <XCircle className="h-4 w-4 mr-2" />
                                                                {t('common.reject', 'Reject')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleOpenDialog(expense)}>
                                                                {t('common.edit', 'Edit')}
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {expense.status === 'APPROVED' && (
                                                        <DropdownMenuItem onClick={() => handleOpenPaymentDialog(expense)}>
                                                            <DollarSign className="h-4 w-4 mr-2" />
                                                            {t('finance.expenses.recordPayment', 'Record Payment')}
                                                        </DropdownMenuItem>
                                                    )}
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
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? t('finance.expenses.edit', 'Edit Expense') : t('finance.expenses.new', 'Record New Expense')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="title">{t('common.title', 'Title')}</Label>
                                    <Input
                                        id="title" value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Office Supplies" required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="budget_category">{t('finance.expenses.category', 'Category')}</Label>
                                    <Select
                                        value={formData.budget_category ? `budget:${formData.budget_category}` : (formData.category ? `enum:${formData.category}` : '')}
                                        onValueChange={(val) => {
                                            if (val.startsWith('budget:')) {
                                                const id = val.split(':')[1];
                                                const categoryObj = categories.find(c => c.id.toString() === id);
                                                setFormData({
                                                    ...formData,
                                                    budget_category: id,
                                                    category: categoryObj?.expense_category || 'OTHER_EXPENSE'
                                                });
                                            } else {
                                                const id = val.split(':')[1];
                                                setFormData({
                                                    ...formData,
                                                    budget_category: '',
                                                    category: id
                                                });
                                            }
                                        }}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.length > 0 ? (
                                                categories.map(cat => (
                                                    <SelectItem key={cat.id} value={`budget:${cat.id}`}>{cat.name}</SelectItem>
                                                ))
                                            ) : (
                                                EXPENSE_CATEGORIES.map(cat => (
                                                    <SelectItem key={cat.id} value={`enum:${cat.id}`}>{cat.name}</SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">{t('finance.expenses.amount', 'Amount (MAD)')}</Label>
                                    <Input
                                        id="amount" type="number" step="0.01" value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expense_date">{t('common.date', 'Expense Date')}</Label>
                                    <Input
                                        id="expense_date" type="date" value={formData.expense_date}
                                        onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vendor_name">{t('finance.expenses.vendor', 'Vendor / Payee')}</Label>
                                    <Input
                                        id="vendor_name" value={formData.vendor_name}
                                        onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="description">{t('common.description', 'Description')}</Label>
                                    <Input
                                        id="description" value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Provide more details about this expense"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="attachment">{t('finance.expenses.receipt', 'Receipt/Attachment')}</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 cursor-pointer transition-colors relative">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">Click or drag to upload receipt</p>
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setFormData({ ...formData, attachment: e.target.files[0] })}
                                        />
                                        {formData.attachment && (
                                            <Badge variant="secondary" className="mt-2">
                                                <FileText className="h-3 w-3 mr-1" />
                                                {formData.attachment.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>{t('common.cancel', 'Cancel')}</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    {t('common.save', 'Save Expense')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Payment Dialog */}
                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('finance.expenses.recordPayment', 'Record Expense Payment')}</DialogTitle>
                            <DialogDescription>Mark this expense as paid and record the transaction details.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRecordPayment} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="p_amount">Payment Amount (MAD)</Label>
                                <Input
                                    id="p_amount" type="number" step="0.01"
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                    required
                                />
                                {selectedExpense && (
                                    <p className="text-[10px] text-muted-foreground uppercase">
                                        Remaining Balance: <span className="font-bold text-primary">{selectedExpense.remaining_amount} MAD</span>
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="p_date">Payment Date</Label>
                                <Input
                                    id="p_date" type="date" value={paymentForm.payment_date}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="p_method">Payment Method</Label>
                                <Select
                                    value={paymentForm.payment_method}
                                    onValueChange={(val) => setPaymentForm({ ...paymentForm, payment_method: val })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">Cash</SelectItem>
                                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                        <SelectItem value="CHECK">Check</SelectItem>
                                        <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="t_id">Transaction ID / Reference</Label>
                                <Input
                                    id="t_id" value={paymentForm.reference_number}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, reference_number: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>{t('common.cancel', 'Cancel')}</Button>
                                <Button type="submit">Record Payment</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                {/* View Details Dialog */}
                <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Expense Details</DialogTitle>
                            <DialogDescription>Full information about this expense record.</DialogDescription>
                        </DialogHeader>
                        {selectedExpense && (
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">{t('common.title', 'Title')}</Label>
                                        <p className="font-semibold text-lg">{selectedExpense.title}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">{t('common.description', 'Description')}</Label>
                                        <p className="text-sm">{selectedExpense.description || '-'}</p>
                                    </div>
                                    <div className="flex gap-8">
                                        <div>
                                            <Label className="text-xs text-muted-foreground uppercase">{t('common.date', 'Date')}</Label>
                                            <p className="text-sm flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {selectedExpense.expense_date}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground uppercase">{t('finance.expenses.amount', 'Amount')}</Label>
                                            <p className="text-sm font-bold text-primary">{selectedExpense.amount} MAD</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">{t('common.status', 'Status')}</Label>
                                        <div className="mt-1">{getStatusBadge(selectedExpense.status)}</div>
                                    </div>
                                </div>
                                <div className="space-y-4 border-l pl-6">
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">{t('finance.expenses.vendor', 'Vendor')}</Label>
                                        <p className="text-sm font-medium">{selectedExpense.vendor_name || '-'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">{t('finance.expenses.category', 'Category')}</Label>
                                        <p className="text-sm">{selectedExpense.budget_category_name || selectedExpense.category_display}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">Academic Year</Label>
                                        <p className="text-sm">{selectedExpense.academic_year_display || '-'}</p>
                                    </div>
                                    {selectedExpense.attachment && (
                                        <div>
                                            <Label className="text-xs text-muted-foreground uppercase">Attachment / Receipt</Label>
                                            <div className="mt-2 space-y-2">
                                                {selectedExpense.attachment.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                                                    <div className="rounded-lg overflow-hidden border bg-muted group relative">
                                                        <img
                                                            src={selectedExpense.attachment}
                                                            alt="Receipt"
                                                            className="w-full h-auto max-h-48 object-contain transition-transform group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Button variant="secondary" size="sm" onClick={() => window.open(selectedExpense.attachment, '_blank')}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Full Size
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => window.open(selectedExpense.attachment, '_blank')}>
                                                        <FileText className="h-5 w-5 mr-3 text-primary" />
                                                        <div className="text-left">
                                                            <p className="text-sm font-medium">Document Attachment</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase">Click to open or download</p>
                                                        </div>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <DialogFooter className="mt-6 flex flex-wrap gap-2 sm:justify-between">
                            <div className="flex gap-2">
                                {(selectedExpense?.status === 'SUBMITTED' || selectedExpense?.status === 'DRAFT') && (
                                    <>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { handleApprove(selectedExpense.id); setIsViewDetailsOpen(false); }}>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button variant="destructive" onClick={() => { handleReject(selectedExpense.id); setIsViewDetailsOpen(false); }}>
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                        </Button>
                                    </>
                                )}
                                {selectedExpense?.status === 'APPROVED' && (
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setIsViewDetailsOpen(false); handleOpenPaymentDialog(selectedExpense); }}>
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Record Payment
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>{t('common.close', 'Close')}</Button>
                                {(selectedExpense?.status === 'SUBMITTED' || selectedExpense?.status === 'DRAFT') && (
                                    <Button variant="secondary" onClick={() => { setIsViewDetailsOpen(false); handleOpenDialog(selectedExpense); }}>
                                        {t('common.edit', 'Edit')}
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
};

export default ExpensesPage;
