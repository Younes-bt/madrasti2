import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { FileText, Eye, Download } from 'lucide-react';

const InvoiceListTab = ({ invoices = [], onViewInvoice }) => {
    const { t } = useTranslation();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PAID':
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">{t('finance.paid', 'Paid')}</Badge>;
            case 'PARTIALLY_PAID':
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">{t('finance.partiallyPaid', 'Partially Paid')}</Badge>;
            case 'OVERDUE':
                return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none">{t('finance.overdue', 'Overdue')}</Badge>;
            case 'ISSUED':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">{t('finance.issued', 'Issued')}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[100px]">{t('finance.id', 'ID')}</TableHead>
                        <TableHead>{t('finance.student', 'Student')}</TableHead>
                        <TableHead>{t('finance.month', 'Month')}</TableHead>
                        <TableHead>{t('finance.amount', 'Amount')}</TableHead>
                        <TableHead>{t('finance.balance', 'Balance')}</TableHead>
                        <TableHead>{t('finance.status', 'Status')}</TableHead>
                        <TableHead>{t('finance.dueDate', 'Due Date')}</TableHead>
                        <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                                {t('finance.noInvoices', 'No invoices found.')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        invoices.map((invoice) => (
                            <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-medium text-slate-900">#{invoice.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700">{invoice.student_name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600">{invoice.month}</TableCell>
                                <TableCell className="font-semibold text-slate-900">{parseFloat(invoice.total_amount).toFixed(2)} MAD</TableCell>
                                <TableCell className="text-rose-600 font-medium">{parseFloat(invoice.remaining_amount).toFixed(2)} MAD</TableCell>
                                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                <TableCell className="text-slate-600 font-medium">{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                            onClick={() => onViewInvoice(invoice)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default InvoiceListTab;
