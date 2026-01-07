import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Calendar,
    BarChart3,
    PieChart as PieChartIcon,
    RefreshCcw,
    Search
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import financeService from '@/services/finance';
import schoolsService from '@/services/schools';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';
import { useLanguage } from '../../../hooks/useLanguage';

const FinanceDashboard = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('ALL');
    const [selectedMonth, setSelectedMonth] = useState('ALL');
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchInitialData = async () => {
        try {
            const yearsData = await schoolsService.getAcademicYears();
            const years = yearsData.results || yearsData || [];
            setAcademicYears(years);

            const currentYear = years.find(y => y.is_current);
            if (currentYear) {
                setSelectedYear(String(currentYear.id));
            }

            await fetchDashboardData(currentYear ? String(currentYear.id) : 'ALL', 'ALL');
        } catch (error) {
            console.error("Error fetching initial data:", error);
            setLoading(false);
        }
    };

    const fetchDashboardData = async (yearId = selectedYear, month = selectedMonth) => {
        setLoading(true);
        try {
            const params = {};
            if (yearId !== 'ALL') params.academic_year_id = yearId;
            if (month !== 'ALL') params.month = month;

            const data = await financeService.getDashboardData(params);
            setDashboardData(data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error(t('finance.dashboard.failedToLoad', 'Failed to load dashboard data'));
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (type, value) => {
        if (type === 'year') {
            setSelectedYear(value);
            fetchDashboardData(value, selectedMonth);
        } else if (type === 'month') {
            setSelectedMonth(value);
            fetchDashboardData(selectedYear, value);
        }
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    const summaryCards = useMemo(() => {
        if (!dashboardData?.summary) return [];
        const { total_income, total_expenses, net_balance } = dashboardData.summary;

        return [
            {
                title: t('finance.dashboard.totalIncome', 'Total Income'),
                amount: total_income,
                icon: TrendingUp,
                color: 'text-green-600',
                bg: 'bg-green-100 dark:bg-green-900/20',
                trend: '+12.5%', // Placeholder for trend
                trendType: 'up'
            },
            {
                title: t('finance.dashboard.totalExpenses', 'Total Expenses'),
                amount: total_expenses,
                icon: TrendingDown,
                color: 'text-red-600',
                bg: 'bg-red-100 dark:bg-red-900/20',
                trend: '+8.2%', // Placeholder for trend
                trendType: 'up'
            },
            {
                title: t('finance.dashboard.netBalance', 'Net Balance'),
                amount: net_balance,
                icon: Wallet,
                color: net_balance >= 0 ? 'text-blue-600' : 'text-orange-600',
                bg: net_balance >= 0 ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-orange-100 dark:bg-orange-900/20',
                trend: '', // Placeholder for trend
                trendType: 'none'
            },
            {
                title: t('finance.dashboard.transactions', 'Transactions'),
                amount: dashboardData.summary.transaction_count,
                icon: RefreshCcw,
                color: 'text-purple-600',
                bg: 'bg-purple-100 dark:bg-purple-900/20',
                unit: 'records'
            }
        ];
    }, [dashboardData, t]);

    const chartData = useMemo(() => {
        if (!dashboardData) return [];
        return [
            { name: t('finance.dashboard.income', 'Income'), value: dashboardData.summary.total_income },
            { name: t('finance.dashboard.expenses', 'Expenses'), value: dashboardData.summary.total_expenses }
        ];
    }, [dashboardData, t]);

    if (loading && !dashboardData) {
        return (
            <AdminPageLayout title={t('finance.dashboard.title', 'Financial Dashboard')} loading={true}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout
            title={t('finance.dashboard.title', 'Financial Dashboard')}
            subtitle={t('finance.dashboard.subtitle', 'Overview of school finances, income, and expenses')}
            showRefreshButton
            onRefresh={() => fetchDashboardData()}
            actions={[
                <div key="filters" className="flex items-center gap-2">
                    <Select value={selectedYear} onValueChange={(val) => handleFilterChange('year', val)}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="mr-2 h-4 w-4 opacity-50" />
                            <SelectValue placeholder={t('finance.dashboard.selectYear', 'Academic Year')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">{t('finance.dashboard.allYears', 'All Years')}</SelectItem>
                            {academicYears.map(year => (
                                <SelectItem key={year.id} value={String(year.id)}>
                                    {year.year} {year.is_current ? `(${t('common.current')})` : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedMonth} onValueChange={(val) => handleFilterChange('month', val)}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4 opacity-50" />
                            <SelectValue placeholder={t('finance.dashboard.selectMonth', 'Filter by Month')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">{t('finance.dashboard.allMonths', 'All Time')}</SelectItem>
                            {(() => {
                                const months = [];
                                const currentDate = new Date();
                                for (let i = 0; i < 12; i++) {
                                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                                    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                                    const label = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
                                    months.push(<SelectItem key={value} value={value}>{label}</SelectItem>);
                                }
                                return months;
                            })()}
                        </SelectContent>
                    </Select>
                </div>
            ]}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:shadow-md transition-all duration-200 border-none bg-background/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${card.bg} p-2 rounded-xl`}>
                                        <card.icon className={`h-6 w-6 ${card.color}`} />
                                    </div>
                                    {card.trend && (
                                        <Badge variant="outline" className={`font-mono text-[10px] ${card.trendType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                            {card.trendType === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                            {card.trend}
                                        </Badge>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                                    <h3 className="text-2xl font-bold mt-1 tabular-nums">
                                        {card.unit === 'records' ? card.amount : `${parseFloat(card.amount).toLocaleString()} DH`}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Cash Flow Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            {t('finance.dashboard.cashFlowOverview', 'Cash Flow Overview')}
                        </CardTitle>
                        <CardDescription>{t('finance.dashboard.overviewDesc', 'Income vs Expenses comparison summary')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${parseFloat(value).toLocaleString()} DH`, '']}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Expense Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            {t('finance.dashboard.expenseBreakdown', 'Expense Breakdown')}
                        </CardTitle>
                        <CardDescription>{t('finance.dashboard.byCategory', 'Distribution by category')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {dashboardData?.expense_breakdown?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dashboardData.expense_breakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="total"
                                        nameKey="category"
                                    >
                                        {dashboardData.expense_breakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => `${parseFloat(value).toLocaleString()} DH`}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground italic">
                                {t('finance.dashboard.noData', 'No expense data available')}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{t('finance.dashboard.recentTransactions', 'Recent Transactions')}</CardTitle>
                            <CardDescription>{t('finance.dashboard.recentDesc', 'Latest financial activities recorded')}</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/finance/transactions')}>
                            {t('common.viewAll', 'View All')}
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('finance.dashboard.date', 'Date')}</TableHead>
                                    <TableHead>{t('finance.dashboard.type', 'Type')}</TableHead>
                                    <TableHead>{t('finance.dashboard.amount', 'Amount')}</TableHead>
                                    <TableHead>{t('finance.dashboard.category', 'Category')}</TableHead>
                                    <TableHead className="hidden md:table-cell">{t('finance.dashboard.description', 'Description')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dashboardData?.recent_transactions?.map((txn) => (
                                    <TableRow key={txn.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/admin/finance/transactions')}>
                                        <TableCell className="font-mono text-xs">
                                            {txn.date}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={txn.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}
                                            >
                                                {txn.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            <span className={txn.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}>
                                                {txn.type === 'INCOME' ? '+' : '-'}{parseFloat(txn.amount).toLocaleString()} MAD
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-medium">{txn.category_display || txn.category}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground text-xs truncate max-w-[200px]">
                                            {txn.description}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!dashboardData?.recent_transactions || dashboardData.recent_transactions.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                            {t('finance.dashboard.noTransactions', 'No recent transactions found')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Budget Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                            {t('finance.dashboard.budgetAlerts', 'Budget Alerts')}
                        </CardTitle>
                        <CardDescription>{t('finance.dashboard.alertsDesc', 'Budgets exceeding or near thresholds')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {dashboardData?.budget_alerts?.map((alert, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium">{alert.category}</span>
                                        <span className={`${alert.utilization >= 100 ? 'text-red-600' : 'text-orange-600'} font-bold`}>
                                            {alert.utilization.toFixed(1)}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={Math.min(alert.utilization, 100)}
                                        className="h-2"
                                        indicatorClassName={alert.utilization >= 100 ? 'bg-red-600' : 'bg-orange-600'}
                                    />
                                    <div className="flex justify-between text-[11px] text-muted-foreground">
                                        <span>Spent: {alert.spent.toLocaleString()} DH</span>
                                        <span>Allocated: {alert.allocated.toLocaleString()} DH</span>
                                    </div>
                                </div>
                            ))}
                            {(!dashboardData?.budget_alerts || dashboardData.budget_alerts.length === 0) && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                        <Badge className="bg-green-500 rounded-full h-8 w-8 flex items-center justify-center p-0">
                                            <RefreshCcw className="h-4 w-4 text-white" />
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t('finance.dashboard.allBudgetsOk', 'All budgets are within limits')}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminPageLayout>
    );
};

export default FinanceDashboard;
