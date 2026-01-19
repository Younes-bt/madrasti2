import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../../ui/card';
import { Wallet, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

const FinanceSummaryCards = ({ invoices = [], payments = [] }) => {
    const { t } = useTranslation();

    const totalBalance = invoices.reduce((sum, inv) => sum + (parseFloat(inv.remaining_amount) || 0), 0);
    const totalPaid = payments.reduce((sum, pay) => sum + (parseFloat(pay.amount) || 0), 0);

    // Find earliest due date for unpaid invoices
    const unpaidInvoices = invoices.filter(inv => inv.status !== 'PAID' && inv.status !== 'CANCELLED');
    const nextDue = unpaidInvoices.length > 0
        ? unpaidInvoices.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0].due_date
        : null;

    const cards = [
        {
            title: t('finance.totalBalance', 'Total Balance'),
            value: `${totalBalance.toFixed(2)} MAD`,
            icon: Wallet,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            description: t('finance.unpaidAmount', 'Amount to be paid')
        },
        {
            title: t('finance.totalPaid', 'Total Paid'),
            value: `${totalPaid.toFixed(2)} MAD`,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            description: t('finance.paidAmountDesc', 'Consolidated payments')
        },
        {
            title: t('finance.nextDue', 'Next Due Date'),
            value: nextDue ? new Date(nextDue).toLocaleDateString() : t('common.none', 'None'),
            icon: Calendar,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            description: nextDue ? t('finance.upcomingPayment', 'Earliest deadline') : t('finance.noPendingInvoices', 'All cleared!')
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`rounded-xl p-3 ${card.bgColor}`}>
                                <card.icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <p className="text-2xl font-bold tracking-tight text-slate-900">{card.value}</p>
                                <p className="text-xs text-slate-400">{card.description}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default FinanceSummaryCards;
