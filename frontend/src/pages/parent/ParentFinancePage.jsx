import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
    FileText,
    History,
    Filter,
    ChevronDown,
    User as UserIcon,
    Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';

// Services
import financeService from '../../services/finance';
import api from '../../services/api';

// Components
import FinanceSummaryCards from '../../components/parent/finance/FinanceSummaryCards';
import InvoiceListTab from '../../components/parent/finance/InvoiceListTab';
import PaymentHistoryTab from '../../components/parent/finance/PaymentHistoryTab';
import InvoiceDetailModal from '../../components/parent/finance/InvoiceDetailModal';

const ParentFinancePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // UI State
    const [selectedChildId, setSelectedChildId] = useState('all');
    const [viewingInvoice, setViewingInvoice] = useState(null);

    // Data Fetching: Children
    const { data: childrenData, isLoading: isLoadingChildren } = useQuery({
        queryKey: ['parent-children', user?.id],
        queryFn: async () => {
            const response = await api.get(`/users/${user.id}/children/`);
            return response.data;
        },
        enabled: !!user?.id
    });

    const children = useMemo(() => childrenData?.children || [], [childrenData]);

    // Data Fetching: Invoices
    const { data: invoicesData, isLoading: isLoadingInvoices } = useQuery({
        queryKey: ['parent-invoices', user?.id, selectedChildId],
        queryFn: () => financeService.getInvoices({
            student: selectedChildId === 'all' ? undefined : selectedChildId
        }),
        enabled: !!user?.id
    });

    const invoices = invoicesData?.results || invoicesData || [];

    // Data Fetching: Payments
    const { data: paymentsData, isLoading: isLoadingPayments } = useQuery({
        queryKey: ['parent-payments', user?.id, selectedChildId],
        queryFn: () => financeService.getPayments({
            student: selectedChildId === 'all' ? undefined : selectedChildId
        }),
        enabled: !!user?.id
    });

    const payments = paymentsData?.results || paymentsData || [];

    // Derived State
    const selectedChildName = useMemo(() => {
        if (selectedChildId === 'all') return t('finance.allChildren');
        const child = children.find(c => c.id.toString() === selectedChildId.toString());
        return child ? child.full_name : t('finance.selectChild');
    }, [selectedChildId, children, t]);

    const isLoading = isLoadingChildren || isLoadingInvoices || isLoadingPayments;

    if (isLoading) {
        return (
            <DashboardLayout user={user}>
                <div className="flex h-[70vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        <p className="text-slate-500 font-medium">{t('common.loading')}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="mx-auto max-w-7xl p-6 md:p-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                            {t('finance.financialHub')}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {t('finance.financialHubDesc')}
                        </p>
                    </div>

                    {/* Child Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{t('finance.filterBy')}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="min-w-[200px] justify-between rounded-xl border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all py-6 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-indigo-50 p-1.5 text-indigo-600">
                                            <UserIcon className="h-4 w-4" />
                                        </div>
                                        <span className="font-bold text-slate-700">{selectedChildName}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-slate-400 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[240px] rounded-xl p-2 shadow-xl border-slate-100">
                                <DropdownMenuItem
                                    onClick={() => setSelectedChildId('all')}
                                    className={`rounded-lg py-2.5 px-3 cursor-pointer ${selectedChildId === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
                                >
                                    {t('finance.allChildren')}
                                </DropdownMenuItem>
                                {children.map(child => (
                                    <DropdownMenuItem
                                        key={child.id}
                                        onClick={() => setSelectedChildId(child.id)}
                                        className={`rounded-lg py-2.5 px-3 cursor-pointer mt-1 ${selectedChildId === child.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
                                    >
                                        {child.full_name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Summary Cards */}
                <FinanceSummaryCards invoices={invoices} payments={payments} />

                {/* Main Content Tabs */}
                <Tabs defaultValue="invoices" className="w-full space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                        <TabsList className="bg-transparent h-auto p-0 gap-8">
                            <TabsTrigger
                                value="invoices"
                                className="relative rounded-none border-b-2 border-transparent bg-transparent px-1 pb-4 pt-2 text-base font-semibold text-slate-500 transition-all hover:text-indigo-600 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    {t('finance.invoices')}
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="history"
                                className="relative rounded-none border-b-2 border-transparent bg-transparent px-1 pb-4 pt-2 text-base font-semibold text-slate-500 transition-all hover:text-indigo-600 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none"
                            >
                                <div className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    {t('finance.paymentHistory')}
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="invoices" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <InvoiceListTab
                            invoices={invoices}
                            onViewInvoice={(inv) => setViewingInvoice(inv)}
                        />
                    </TabsContent>

                    <TabsContent value="history" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <PaymentHistoryTab payments={payments} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modals */}
            <InvoiceDetailModal
                invoice={viewingInvoice}
                isOpen={!!viewingInvoice}
                onClose={() => setViewingInvoice(null)}
            />
        </DashboardLayout>
    );
};

export default ParentFinancePage;
