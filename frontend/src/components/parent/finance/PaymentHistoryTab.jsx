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
import { CreditCard, Banknote, Landmark } from 'lucide-react';

const PaymentHistoryTab = ({ payments = [] }) => {
    const { t } = useTranslation();

    const getMethodIcon = (method) => {
        switch (method) {
            case 'CASH':
                return <Banknote className="h-4 w-4 text-emerald-500" />;
            case 'CHECK':
                return <Landmark className="h-4 w-4 text-blue-500" />;
            case 'TRANSFER':
                return <CreditCard className="h-4 w-4 text-purple-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead>{t('finance.date', 'Date')}</TableHead>
                        <TableHead>{t('finance.invoice', 'Invoice')}</TableHead>
                        <TableHead>{t('finance.method', 'Method')}</TableHead>
                        <TableHead>{t('finance.reference', 'Reference')}</TableHead>
                        <TableHead className="text-right">{t('finance.amount', 'Amount')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                {t('finance.noPayments', 'No payment history found.')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        payments.map((payment) => (
                            <TableRow key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-medium text-slate-600">
                                    {new Date(payment.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium text-slate-900">#{payment.invoice}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getMethodIcon(payment.method)}
                                        <span className="text-sm font-medium text-slate-700 capitalize">
                                            {payment.method.toLowerCase()}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-500 font-mono text-xs">
                                    {payment.transaction_id || '-'}
                                </TableCell>
                                <TableCell className="text-right font-bold text-emerald-600">
                                    +{parseFloat(payment.amount).toFixed(2)} MAD
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default PaymentHistoryTab;
