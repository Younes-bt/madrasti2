import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Search, Loader2 } from 'lucide-react';
import financeService from '@/services/finance';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';

const PaymentsPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [invoices, setInvoices] = useState([]); // For the payment form

    // Payment Dialog
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        invoice: '',
        amount: '',
        method: 'CASH',
        transaction_id: '',
        notes: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [payData, invData] = await Promise.all([
                financeService.getPayments(),
                financeService.getInvoices() // Fetch all invoices including PAID ones
            ]);
            setPayments(payData.results || payData);
            setInvoices(invData.results || invData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(t('Failed to load payments'));
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await financeService.createPayment(paymentForm);
            toast.success(t('Payment recorded successfully'));
            setIsPaymentDialogOpen(false);
            setPaymentForm({ invoice: '', amount: '', method: 'CASH', transaction_id: '', notes: '' });
            fetchInitialData();
        } catch (error) {
            console.error(error);
            toast.error(t('Failed to record payment'));
        } finally {
            setLoading(false);
        }
    };

    const handleInvoiceSelect = (invoiceId) => {
        const invoice = invoices.find(i => String(i.id) === String(invoiceId));
        if (invoice) {
            setPaymentForm({
                ...paymentForm,
                invoice: invoiceId,
                amount: invoice.remaining_amount // Auto-fill remaining amount
            });
        }
    };

    return (
        <AdminPageLayout
            title={t('Payments')}
            subtitle={t('Track and record payments')}
            actions={[
                <Button key="record-payment" onClick={() => setIsPaymentDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> {t('Record Payment')}
                </Button>
            ]}
            loading={loading && payments.length === 0}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>{t('Recent Transactions')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('ID')}</TableHead>
                                    <TableHead>{t('Date')}</TableHead>
                                    <TableHead>{t('Invoice')}</TableHead>
                                    <TableHead>{t('Amount')}</TableHead>
                                    <TableHead>{t('Method')}</TableHead>
                                    <TableHead>{t('Recorded By')}</TableHead>
                                    <TableHead>{t('Ref #')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((pay) => (
                                    <TableRow key={pay.id}>
                                        <TableCell className="font-mono">PAY-{pay.id}</TableCell>
                                        <TableCell>{pay.date}</TableCell>
                                        <TableCell>INV-{pay.invoice}</TableCell>
                                        <TableCell className="font-bold text-green-600">+{pay.amount} DH</TableCell>
                                        <TableCell>{pay.method}</TableCell>
                                        <TableCell>{pay.recorded_by_name}</TableCell>
                                        <TableCell>{pay.transaction_id || '-'}</TableCell>
                                    </TableRow>
                                ))}
                                {payments.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{t('No payments found')}</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* ==================== RECORD PAYMENT DIALOG ==================== */}
                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Record New Payment')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('Invoice')}</Label>
                                <Select value={String(paymentForm.invoice)} onValueChange={handleInvoiceSelect}>
                                    <SelectTrigger><SelectValue placeholder={t('Select Invoice')} /></SelectTrigger>
                                    <SelectContent>
                                        {invoices.map(inv => (
                                            <SelectItem key={inv.id} value={String(inv.id)}>
                                                INV-{inv.id} - {inv.student_name} ({inv.remaining_amount} DH due)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Amount (DH)')}</Label>
                                <Input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} required />
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
                                <Input value={paymentForm.transaction_id} onChange={(e) => setPaymentForm({ ...paymentForm, transaction_id: e.target.value })} placeholder={t('Optional')} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Notes')}</Label>
                                <Input value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} />
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

export default PaymentsPage;
