import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Layers, Search, Loader2, Eye, DollarSign, MoreVertical } from 'lucide-react';
import financeService from '@/services/finance';
import schoolsService from '@/services/schools';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';

const InvoicesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [grades, setGrades] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    // Bulk Generate Dialog
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
    const [bulkForm, setBulkForm] = useState({
        grade_id: '',
        month: new Date().toISOString().slice(0, 7) + '-01',
        due_date: '',
        academic_year_id: ''
    });

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [monthFilter, setMonthFilter] = useState('');

    // Payment Dialog
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        method: 'CASH',
        transaction_id: '',
        notes: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchInvoices(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, statusFilter, monthFilter]);

    useEffect(() => {
        fetchInvoices(currentPage);
    }, [currentPage]);

    const fetchInvoices = async (page = currentPage) => {
        setLoading(true);
        try {
            const params = {
                page: page,
                page_size: pageSize
            };
            if (searchQuery) params.search = searchQuery;
            if (statusFilter !== 'ALL') params.status = statusFilter;
            if (monthFilter) params.month = monthFilter;

            const invData = await financeService.getInvoices(params);
            setInvoices(invData.results || []);
            setTotalPages(Math.ceil((invData.count || 0) / pageSize));
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error(t('Failed to load invoices'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [gradesData, yearsData] = await Promise.all([
                schoolsService.getGrades(),
                schoolsService.getAcademicYears()
            ]);
            setGrades(gradesData.results || gradesData || []);
            setAcademicYears(yearsData.results || yearsData || []);

            const currentYear = (yearsData.results || yearsData || []).find(y => y.is_current);
            if (currentYear) {
                setBulkForm(prev => ({ ...prev, academic_year_id: currentYear.id }));
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    const handleBulkGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await financeService.generateBulkInvoices(bulkForm);
            toast.success(response.message || t('Invoices generated successfully'));
            setIsBulkDialogOpen(false);
            fetchInvoices(1);
        } catch (error) {
            console.error(error);
            toast.error(t('Failed to generate invoices'));
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (invoiceId) => {
        navigate(`/admin/finance/invoices/${invoiceId}`);
    };

    const handleRecordPayment = (invoice) => {
        setSelectedInvoice(invoice);
        setPaymentForm({
            amount: (parseFloat(invoice.total_amount) - parseFloat(invoice.paid_amount)).toFixed(2),
            method: 'CASH',
            transaction_id: '',
            notes: ''
        });
        setIsPaymentDialogOpen(true);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!selectedInvoice) return;

        setLoading(true);
        try {
            await financeService.createPayment({
                invoice: selectedInvoice.id,
                ...paymentForm
            });
            toast.success(t('Payment recorded successfully'));
            setIsPaymentDialogOpen(false);
            setSelectedInvoice(null);
            setPaymentForm({ amount: '', method: 'CASH', transaction_id: '', notes: '' });
            fetchInvoices(currentPage);
        } catch (error) {
            console.error(error);
            toast.error(t('Failed to record payment'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PAID': return <Badge className="bg-green-500">{t('Paid')}</Badge>;
            case 'PARTIALLY_PAID': return <Badge className="bg-yellow-500">{t('Partial')}</Badge>;
            case 'OVERDUE': return <Badge className="bg-red-500">{t('Overdue')}</Badge>;
            case 'ISSUED': return <Badge className="bg-blue-500">{t('Issued')}</Badge>;
            default: return <Badge variant="outline">{t('Draft')}</Badge>;
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={currentPage === i}
                            onClick={() => setCurrentPage(i)}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink isActive={currentPage === 1} onClick={() => setCurrentPage(1)}>1</PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 3) {
                items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)}>{i}</PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
            }

            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink isActive={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    };

    return (
        <AdminPageLayout
            title={t('Invoices')}
            subtitle={t('Manage and track student invoices')}
            actions={[
                <Button key="bulk" variant="outline" onClick={() => setIsBulkDialogOpen(true)}>
                    <Layers className="mr-2 h-4 w-4" /> {t('Bulk Generate')}
                </Button>,
                <Button key="new">
                    <Plus className="mr-2 h-4 w-4" /> {t('New Invoice')}
                </Button>
            ]}
            loading={loading && invoices.length === 0}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <CardTitle>{t('Recent Invoices')}</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={t('Search by name or invoice #')}
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder={t('Status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">{t('All Statuses')}</SelectItem>
                                        <SelectItem value="ISSUED">{t('Issued')}</SelectItem>
                                        <SelectItem value="PAID">{t('Paid')}</SelectItem>
                                        <SelectItem value="PARTIALLY_PAID">{t('Partial')}</SelectItem>
                                        <SelectItem value="OVERDUE">{t('Overdue')}</SelectItem>
                                        <SelectItem value="DRAFT">{t('Draft')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="month"
                                    className="w-full sm:w-[160px]"
                                    value={monthFilter}
                                    onChange={(e) => setMonthFilter(e.target.value)}
                                />
                                {(searchQuery || statusFilter !== 'ALL' || monthFilter) && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('ALL');
                                            setMonthFilter('');
                                        }}
                                        className="px-2 lg:px-3"
                                    >
                                        {t('Reset')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Invoice #')}</TableHead>
                                    <TableHead>{t('Student')}</TableHead>
                                    <TableHead>{t('Month')}</TableHead>
                                    <TableHead>{t('Amount')}</TableHead>
                                    <TableHead>{t('Paid')}</TableHead>
                                    <TableHead>{t('Status')}</TableHead>
                                    <TableHead>{t('Due Date')}</TableHead>
                                    <TableHead className="text-right">{t('Actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell className="font-mono">INV-{inv.id}</TableCell>
                                        <TableCell className="font-medium">{inv.student_name}</TableCell>
                                        <TableCell>{inv.month}</TableCell>
                                        <TableCell>{inv.total_amount} DH</TableCell>
                                        <TableCell>{inv.paid_amount} DH</TableCell>
                                        <TableCell>{getStatusBadge(inv.status)}</TableCell>
                                        <TableCell>{inv.due_date}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewDetails(inv.id)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        {t('View Details')}
                                                    </DropdownMenuItem>
                                                    {inv.status !== 'PAID' && (
                                                        <DropdownMenuItem onClick={() => handleRecordPayment(inv)}>
                                                            <DollarSign className="mr-2 h-4 w-4" />
                                                            {t('Record Payment')}
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {invoices.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            {t('No invoices found')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {totalPages > 1 && (
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {renderPaginationItems()}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Generate Monthly Invoices')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleBulkGenerate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('Academic Year')}</Label>
                                <Select value={String(bulkForm.academic_year_id)} onValueChange={(val) => setBulkForm({ ...bulkForm, academic_year_id: val })}>
                                    <SelectTrigger><SelectValue placeholder={t('Select Year')} /></SelectTrigger>
                                    <SelectContent>
                                        {academicYears.map(year => (
                                            <SelectItem key={year.id} value={String(year.id)}>{year.year} {year.is_current ? '(Current)' : ''}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Grade')}</Label>
                                <Select value={String(bulkForm.grade_id)} onValueChange={(val) => setBulkForm({ ...bulkForm, grade_id: val })}>
                                    <SelectTrigger><SelectValue placeholder={t('Select Grade')} /></SelectTrigger>
                                    <SelectContent>
                                        {grades.map(grade => (
                                            <SelectItem key={grade.id} value={String(grade.id)}>{grade.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('For Month')}</Label>
                                <Input type="date" value={bulkForm.month} onChange={(e) => setBulkForm({ ...bulkForm, month: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Due Date')}</Label>
                                <Input type="date" value={bulkForm.due_date} onChange={(e) => setBulkForm({ ...bulkForm, due_date: e.target.value })} required />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {t('Generate')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Record Payment')}</DialogTitle>
                            {selectedInvoice && (
                                <p className="text-sm text-muted-foreground">
                                    {t('Invoice')}: INV-{selectedInvoice.id} - {selectedInvoice.student_name}
                                </p>
                            )}
                        </DialogHeader>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('Amount (DH)')}</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Payment Method')}</Label>
                                <Select value={paymentForm.method} onValueChange={(val) => setPaymentForm({ ...paymentForm, method: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">{t('Cash')}</SelectItem>
                                        <SelectItem value="CHECK">{t('Check')}</SelectItem>
                                        <SelectItem value="TRANSFER">{t('Bank Transfer')}</SelectItem>
                                        <SelectItem value="OTHER">{t('Other')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Transaction ID / Check #')}</Label>
                                <Input
                                    value={paymentForm.transaction_id}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, transaction_id: e.target.value })}
                                    placeholder={t('Optional')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Notes')}</Label>
                                <Input
                                    value={paymentForm.notes}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {t('Record Payment')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </motion.div>
        </AdminPageLayout>
    );
};

export default InvoicesPage;
