import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, DollarSign, CheckCircle, AlertCircle, Clock, Download } from 'lucide-react';
import financeService from '@/services/finance';
import { toast } from 'sonner';

const FinancialStatusPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [paidAmount, setpaidAmount] = useState(0);
    const [overdueAmount, setOverdueAmount] = useState(0);

    useEffect(() => {
        fetchFinancialData();
    }, []);

    const fetchFinancialData = async () => {
        setLoading(true);
        try {
            const data = await financeService.getInvoices();
            const invoiceList = data.results || data;
            setInvoices(invoiceList);

            // Calculate totals
            const total = invoiceList.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
            const paid = invoiceList.reduce((sum, inv) => sum + parseFloat(inv.paid_amount || 0), 0);
            const overdue = invoiceList.filter(inv => inv.status === 'OVERDUE').reduce((sum, inv) => sum + parseFloat(inv.remaining_amount || 0), 0);

            setTotalBalance(total - paid);
            setpaidAmount(paid);
            setOverdueAmount(overdue);
        } catch (error) {
            console.error('Error fetching financial data:', error);
            toast.error(t('Failed to load financial information'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            PAID: { color: 'bg-green-500', icon: CheckCircle, label: t('Paid') },
            PARTIALLY_PAID: { color: 'bg-yellow-500', icon: Clock, label: t('Partial') },
            OVERDUE: { color: 'bg-red-500', icon: AlertCircle, label: t('Overdue') },
            ISSUED: { color: 'bg-blue-500', icon: Clock, label: t('Pending') },
            DRAFT: { color: 'bg-gray-400', icon: Clock, label: t('Draft') }
        };

        const config = statusConfig[status] || statusConfig.DRAFT;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const pendingInvoices = invoices.filter(inv => ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE'].includes(inv.status));
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('Financial Status')}</h1>
                    <p className="text-muted-foreground">{t('View invoices and payment history for your children')}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('Outstanding Balance')}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBalance.toFixed(2)} DH</div>
                        {overdueAmount > 0 && (
                            <p className="text-xs text-red-500 mt-1">
                                {t('Overdue')}: {overdueAmount.toFixed(2)} DH
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('Total Paid')}</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{paidAmount.toFixed(2)} DH</div>
                        <p className="text-xs text-muted-foreground">{paidInvoices.length} {t('invoices paid')}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('Pending Invoices')}</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingInvoices.length}</div>
                        <p className="text-xs text-muted-foreground">{t('invoices to pay')}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices Tabs */}
            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">
                        {t('Pending')} ({pendingInvoices.length})
                    </TabsTrigger>
                    <TabsTrigger value="paid">
                        {t('Paid')} ({paidInvoices.length})
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        {t('All')} ({invoices.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('Pending Invoices')}</CardTitle>
                            <CardDescription>{t('Invoices awaiting payment')}</CardDescription>
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
                                        <TableHead>{t('Balance')}</TableHead>
                                        <TableHead>{t('Due Date')}</TableHead>
                                        <TableHead>{t('Status')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingInvoices.map((inv) => (
                                        <TableRow key={inv.id}>
                                            <TableCell className="font-mono">INV-{inv.id}</TableCell>
                                            <TableCell className="font-medium">{inv.student_name}</TableCell>
                                            <TableCell>{inv.month || '-'}</TableCell>
                                            <TableCell>{inv.total_amount} DH</TableCell>
                                            <TableCell className="text-green-600">{inv.paid_amount} DH</TableCell>
                                            <TableCell className="font-bold">{inv.remaining_amount} DH</TableCell>
                                            <TableCell>{inv.due_date}</TableCell>
                                            <TableCell>{getStatusBadge(inv.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {pendingInvoices.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                {t('No pending invoices')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="paid">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('Paid Invoices')}</CardTitle>
                            <CardDescription>{t('Payment history')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('Invoice #')}</TableHead>
                                        <TableHead>{t('Student')}</TableHead>
                                        <TableHead>{t('Month')}</TableHead>
                                        <TableHead>{t('Amount')}</TableHead>
                                        <TableHead>{t('Issue Date')}</TableHead>
                                        <TableHead>{t('Status')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paidInvoices.map((inv) => (
                                        <TableRow key={inv.id}>
                                            <TableCell className="font-mono">INV-{inv.id}</TableCell>
                                            <TableCell className="font-medium">{inv.student_name}</TableCell>
                                            <TableCell>{inv.month || '-'}</TableCell>
                                            <TableCell className="font-bold">{inv.total_amount} DH</TableCell>
                                            <TableCell>{inv.issue_date}</TableCell>
                                            <TableCell>{getStatusBadge(inv.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {paidInvoices.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                {t('No paid invoices')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('All Invoices')}</CardTitle>
                            <CardDescription>{t('Complete invoice history')}</CardDescription>
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
                                        <TableHead>{t('Balance')}</TableHead>
                                        <TableHead>{t('Status')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((inv) => (
                                        <TableRow key={inv.id}>
                                            <TableCell className="font-mono">INV-{inv.id}</TableCell>
                                            <TableCell className="font-medium">{inv.student_name}</TableCell>
                                            <TableCell>{inv.month || '-'}</TableCell>
                                            <TableCell>{inv.total_amount} DH</TableCell>
                                            <TableCell className="text-green-600">{inv.paid_amount} DH</TableCell>
                                            <TableCell className="font-bold">{inv.remaining_amount} DH</TableCell>
                                            <TableCell>{getStatusBadge(inv.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FinancialStatusPage;
