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
import { Badge } from '@/components/ui/badge';
import {
    Search, Loader2, FileDown,
    Calendar, DollarSign, TrendingUp, TrendingDown,
    ArrowUpCircle, ArrowDownCircle, Filter, RotateCcw
} from 'lucide-react';
import financeService from '@/services/finance';
import schoolsService from '@/services/schools';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';

const TransactionsPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [yearFilter, setYearFilter] = useState('ALL');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    useEffect(() => {
        fetchTransactions();
        fetchAcademicYears();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {};
            if (typeFilter !== 'ALL') params.transaction_type = typeFilter;
            if (yearFilter !== 'ALL') params.academic_year = yearFilter;
            if (searchQuery) params.search = searchQuery;
            if (dateRange.start) params.date_after = dateRange.start;
            if (dateRange.end) params.date_before = dateRange.end;

            const data = await financeService.getTransactions(params);
            setTransactions(data.results || data);
        } catch {
            toast.error(t('finance.transactions.failedToLoad', 'Failed to load transaction history'));
        } finally {
            setLoading(false);
        }
    };

    const fetchAcademicYears = async () => {
        try {
            const data = await schoolsService.getAcademicYears();
            setAcademicYears(data.results || data);
        } catch {
            console.error('Failed to fetch academic years');
        }
    };

    const handleReset = () => {
        setTypeFilter('ALL');
        setYearFilter('ALL');
        setSearchQuery('');
        setDateRange({ start: '', end: '' });
        fetchTransactions();
    };

    const handleExport = () => {
        // Simple CSV export logic
        const headers = ["Date", "Type", "Category", "Description", "Amount", "Payment Method"];
        const rows = transactions.map(t => [
            t.transaction_date,
            t.transaction_type,
            t.transaction_type === 'INCOME' ? t.income_category_display : t.expense_category_display,
            t.description || '',
            t.amount,
            t.payment_method
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(r => r.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AdminPageLayout
            title={t('finance.transactions.title', 'General Ledger')}
            subtitle={t('finance.transactions.subtitle', 'Unified view of all income and expenses')}
        >
            <div className="space-y-6">
                {/* Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-none shadow-sm bg-emerald-50 text-emerald-700">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600/70">{t('finance.transactions.totalIncome', 'Income')}</p>
                                <p className="text-2xl font-black mt-1">
                                    {transactions.reduce((acc, curr) => curr.transaction_type === 'INCOME' ? acc + parseFloat(curr.amount) : acc, 0).toLocaleString()} MAD
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <ArrowUpCircle className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-red-50 text-red-700">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-red-600/70">{t('finance.transactions.totalExpense', 'Expenses')}</p>
                                <p className="text-2xl font-black mt-1">
                                    {transactions.reduce((acc, curr) => curr.transaction_type === 'EXPENSE' ? acc + parseFloat(curr.amount) : acc, 0).toLocaleString()} MAD
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <ArrowDownCircle className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-slate-900 text-white">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('finance.transactions.netBalance', 'Net Balance')}</p>
                                <p className="text-2xl font-black mt-1">
                                    {(transactions.reduce((acc, curr) => curr.transaction_type === 'INCOME' ? acc + parseFloat(curr.amount) : acc - parseFloat(curr.amount), 0)).toLocaleString()} MAD
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by description or transaction ID..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Types</SelectItem>
                                        <SelectItem value="INCOME">Income</SelectItem>
                                        <SelectItem value="EXPENSE">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={yearFilter} onValueChange={setYearFilter}>
                                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Years</SelectItem>
                                        {academicYears.map(y => (
                                            <SelectItem key={y.id} value={y.id.toString()}>{y.display_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                                <Input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <span className="text-xs text-muted-foreground">{transactions.length} transactions found</span>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={handleReset}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                                <Button variant="outline" size="sm" onClick={fetchTransactions}>
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply filters
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleExport}>
                                    <FileDown className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ledger Table */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>ID / Reference</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Category / Desc</TableHead>
                                <TableHead>Payment Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right">Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="h-32 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">No transactions found match your criteria.</TableCell></TableRow>
                            ) : (
                                transactions.map(t => (
                                    <TableRow key={t.id} className="hover:bg-muted/30">
                                        <TableCell className="font-mono text-[10px] text-muted-foreground">#{t.transaction_id || t.id}</TableCell>
                                        <TableCell className="text-sm">{t.transaction_date}</TableCell>
                                        <TableCell>
                                            <div className="font-medium text-sm">
                                                {t.transaction_type === 'INCOME' ? t.income_category_display : t.expense_category_display}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground line-clamp-1">{t.description || '-'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal text-[10px]">
                                                {t.payment_method?.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {t.transaction_type === 'INCOME' ? '+' : '-'}{t.amount} MAD
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {t.transaction_type === 'INCOME' ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-600 border-none">
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                    Income
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-500/10 text-red-600 border-none">
                                                    <TrendingDown className="h-3 w-3 mr-1" />
                                                    Expense
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AdminPageLayout>
    );
};

export default TransactionsPage;
