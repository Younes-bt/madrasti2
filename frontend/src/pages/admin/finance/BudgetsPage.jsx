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
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import {
    Plus, Search, Loader2, MoreVertical, FileText,
    Calendar, DollarSign, CheckCircle2, AlertCircle,
    PieChart, BarChart3, TrendingUp, Info
} from 'lucide-react';
import financeService from '@/services/finance';
import schoolsService from '@/services/schools';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';

const BudgetsPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState('ALL');

    const [formData, setFormData] = useState({
        academic_year: '',
        category: '',
        allocated_amount: '',
        notes: ''
    });

    useEffect(() => {
        fetchBudgets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear]);

    useEffect(() => {
        fetchCategories();
        fetchAcademicYears();
    }, []);

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedYear !== 'ALL') params.academic_year = selectedYear;
            const data = await financeService.getBudgets(params);
            setBudgets(data.results || data);
        } catch {
            toast.error(t('finance.budgets.failedToLoad', 'Failed to load budgets'));
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

    const fetchAcademicYears = async () => {
        try {
            const data = await schoolsService.getAcademicYears();
            setAcademicYears(data.results || data);
            if (data.results?.length > 0 || data.length > 0) {
                const current = (data.results || data).find(y => y.is_current);
                if (current) setFormData(prev => ({ ...prev, academic_year: current.id.toString() }));
            }
        } catch {
            console.error('Failed to fetch academic years');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await financeService.createBudget(formData);
            toast.success(t('finance.budgets.created', 'Budget allocation created'));
            setIsDialogOpen(false);
            fetchBudgets();
        } catch (error) {
            toast.error(error.message || t('finance.budgets.failedToSave', 'Failed to save budget'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminPageLayout
            title={t('finance.budgets.title', 'Budget Planning')}
            subtitle={t('finance.budgets.subtitle', 'Allocate and monitor school budgets')}
        >
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Academic Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Years</SelectItem>
                                {academicYears.map(year => (
                                    <SelectItem key={year.id} value={year.id.toString()}>{year.display_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={fetchBudgets}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Allocation
                    </Button>
                </div>

                {/* Overviews */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="col-span-1 md:col-span-2 shadow-sm border-none bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Budget Utilization
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {budgets.length === 0 ? (
                                    <p className="text-center py-8 text-muted-foreground italic">No budget data for this period.</p>
                                ) : (
                                    budgets.slice(0, 4).map(budget => {
                                        const percent = (parseFloat(budget.spent_amount) / parseFloat(budget.allocated_amount)) * 100;
                                        const isOver = percent > 100;
                                        return (
                                            <div key={budget.id} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="font-semibold text-sm">{budget.category_name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase">{t('finance.budgets.spent', 'Spent')}: {budget.spent_amount} / {budget.allocated_amount} MAD</p>
                                                    </div>
                                                    <Badge variant={isOver ? "destructive" : "outline"} className={!isOver ? "text-emerald-600 bg-emerald-50 border-emerald-100" : ""}>
                                                        {percent.toFixed(1)}%
                                                    </Badge>
                                                </div>
                                                <Progress value={Math.min(percent, 100)} className={`h-2 ${isOver ? 'bg-red-100' : ''}`} />
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-none bg-slate-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                                Overall Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pt-4">
                            <div className="relative h-40 w-40 flex items-center justify-center">
                                {/* SVG Gauge Implementation placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-4xl font-bold">
                                        {budgets.length > 0 ?
                                            ((budgets.reduce((a, b) => a + parseFloat(b.spent_amount), 0) /
                                                budgets.reduce((a, b) => a + parseFloat(b.allocated_amount), 0)) * 100).toFixed(0) : 0}%
                                    </span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Utilization</span>
                                </div>
                                <svg className="h-full w-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" className="stroke-slate-800" strokeWidth="12" fill="transparent" />
                                    <circle cx="80" cy="80" r="70" className="stroke-emerald-400 transition-all duration-1000" strokeWidth="12" fill="transparent"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * (budgets.length > 0 ?
                                            (budgets.reduce((a, b) => a + parseFloat(b.spent_amount), 0) /
                                                budgets.reduce((a, b) => a + parseFloat(b.allocated_amount), 0)) : 0))}
                                    />
                                </svg>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-8 w-full">
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-400 uppercase">Allocated</p>
                                    <p className="text-lg font-bold">{budgets.reduce((a, b) => a + parseFloat(b.allocated_amount), 0).toLocaleString()} MAD</p>
                                </div>
                                <div className="text-center border-l border-slate-700">
                                    <p className="text-[10px] text-slate-400 uppercase">Remaining</p>
                                    <p className="text-lg font-bold text-emerald-400">{(budgets.reduce((a, b) => a + parseFloat(b.remaining_amount), 0)).toLocaleString()} MAD</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Details Table */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Category</TableHead>
                                <TableHead>School Year</TableHead>
                                <TableHead>Allocated</TableHead>
                                <TableHead>Spent</TableHead>
                                <TableHead>Remaining</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {budgets.map((budget) => (
                                <TableRow key={budget.id} className="hover:bg-muted/30">
                                    <TableCell className="font-medium">{budget.category_name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{budget.academic_year_name}</TableCell>
                                    <TableCell className="font-semibold">{budget.allocated_amount} MAD</TableCell>
                                    <TableCell className="text-red-500 font-medium">{budget.spent_amount} MAD</TableCell>
                                    <TableCell className="text-emerald-600 font-bold">{budget.remaining_amount} MAD</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Budget Allocation</DialogTitle>
                            <DialogDescription>Set a maximum spending limit for a specific category.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">Academic Year</Label>
                                <Select value={formData.academic_year} onValueChange={(val) => setFormData({ ...formData, academic_year: val })}>
                                    <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                    <SelectContent>
                                        {academicYears.map(y => (
                                            <SelectItem key={y.id} value={y.id.toString()}>{y.display_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Allocated Amount (MAD)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="amount" type="number" step="0.01"
                                        className="pl-9"
                                        value={formData.allocated_amount}
                                        onChange={(e) => setFormData({ ...formData, allocated_amount: e.target.value })}
                                        placeholder="0.00" required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes" value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading}>Create Allocation</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
};

export default BudgetsPage;
