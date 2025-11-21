import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import financeService from '@/services/finance';
import schoolsService from '@/services/schools';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';

const FeeSetupPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [structures, setStructures] = useState([]);
    const [grades, setGrades] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);

    // Dialog states
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingStructure, setEditingStructure] = useState(null);

    // Form states
    const [categoryForm, setCategoryForm] = useState({ name: '', fee_type: 'RECURRING', description: '' });
    const [structureForm, setStructureForm] = useState({ academic_year: '', grade: '', category: '', amount: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [cats, structs, gradesData, yearsData] = await Promise.all([
                financeService.getFeeCategories(),
                financeService.getFeeStructures(),
                schoolsService.getGrades(),
                schoolsService.getAcademicYears()
            ]);
            setCategories(cats.results || cats || []);
            setStructures(structs.results || structs || []);
            setGrades(gradesData.results || gradesData || []);
            setAcademicYears(yearsData.results || yearsData || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(t('Failed to load fee data'));
        } finally {
            setLoading(false);
        }
    };

    // ==================== CATEGORY HANDLERS ====================
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await financeService.updateFeeCategory(editingCategory.id, categoryForm);
                toast.success(t('Fee category updated'));
            } else {
                await financeService.createFeeCategory(categoryForm);
                toast.success(t('Fee category created'));
            }
            setIsCategoryDialogOpen(false);
            setEditingCategory(null);
            setCategoryForm({ name: '', fee_type: 'RECURRING', description: '' });
            fetchInitialData();
        } catch (error) {
            toast.error(t('Operation failed'));
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm(t('Are you sure?'))) {
            try {
                await financeService.deleteFeeCategory(id);
                toast.success(t('Category deleted'));
                fetchInitialData();
            } catch (error) {
                toast.error(t('Delete failed'));
            }
        }
    };

    const openCategoryDialog = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({ name: category.name, fee_type: category.fee_type, description: category.description });
        } else {
            setEditingCategory(null);
            setCategoryForm({ name: '', fee_type: 'RECURRING', description: '' });
        }
        setIsCategoryDialogOpen(true);
    };

    // ==================== STRUCTURE HANDLERS ====================
    const handleStructureSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStructure) {
                await financeService.updateFeeStructure(editingStructure.id, structureForm);
                toast.success(t('Fee structure updated'));
            } else {
                await financeService.createFeeStructure(structureForm);
                toast.success(t('Fee structure created'));
            }
            setIsStructureDialogOpen(false);
            setEditingStructure(null);
            setStructureForm({ academic_year: '', grade: '', category: '', amount: '' });
            fetchInitialData();
        } catch (error) {
            toast.error(t('Operation failed'));
        }
    };

    const handleDeleteStructure = async (id) => {
        if (window.confirm(t('Are you sure?'))) {
            try {
                await financeService.deleteFeeStructure(id);
                toast.success(t('Structure deleted'));
                fetchInitialData();
            } catch (error) {
                toast.error(t('Delete failed'));
            }
        }
    };

    const openStructureDialog = (structure = null) => {
        if (structure) {
            setEditingStructure(structure);
            setStructureForm({
                academic_year: structure.academic_year,
                grade: structure.grade,
                category: structure.category,
                amount: structure.amount
            });
        } else {
            setEditingStructure(null);
            // Set defaults if available
            const currentYear = academicYears.find(y => y.is_current);
            setStructureForm({
                academic_year: currentYear ? currentYear.id : '',
                grade: '',
                category: '',
                amount: ''
            });
        }
        setIsStructureDialogOpen(true);
    };

    return (
        <AdminPageLayout
            title={t('Fee Setup')}
            subtitle={t('Manage fee structures and categories')}
            loading={loading && categories.length === 0}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <Tabs defaultValue="structures" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="structures">{t('Fee Structures')}</TabsTrigger>
                        <TabsTrigger value="categories">{t('Fee Categories')}</TabsTrigger>
                    </TabsList>

                    {/* ==================== STRUCTURES TAB ==================== */}
                    <TabsContent value="structures">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{t('Tuition & Fees per Grade')}</CardTitle>
                                <Button onClick={() => openStructureDialog()}><Plus className="mr-2 h-4 w-4" /> {t('Add Fee')}</Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('Academic Year')}</TableHead>
                                            <TableHead>{t('Grade')}</TableHead>
                                            <TableHead>{t('Fee Category')}</TableHead>
                                            <TableHead>{t('Amount')}</TableHead>
                                            <TableHead className="text-right">{t('Actions')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {structures.map((struct) => (
                                            <TableRow key={struct.id}>
                                                <TableCell>{academicYears.find(y => y.id === struct.academic_year)?.year || struct.academic_year}</TableCell>
                                                <TableCell>{struct.grade_name}</TableCell>
                                                <TableCell>{struct.category_name}</TableCell>
                                                <TableCell className="font-bold">{struct.amount} DH</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => openStructureDialog(struct)}><Pencil className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteStructure(struct.id)}><Trash2 className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {structures.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">{t('No fee structures defined')}</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ==================== CATEGORIES TAB ==================== */}
                    <TabsContent value="categories">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{t('Fee Categories')}</CardTitle>
                                <Button onClick={() => openCategoryDialog()}><Plus className="mr-2 h-4 w-4" /> {t('Add Category')}</Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('Name')}</TableHead>
                                            <TableHead>{t('Type')}</TableHead>
                                            <TableHead>{t('Description')}</TableHead>
                                            <TableHead className="text-right">{t('Actions')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.map((cat) => (
                                            <TableRow key={cat.id}>
                                                <TableCell className="font-medium">{cat.name}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${cat.fee_type === 'RECURRING' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {cat.fee_type === 'RECURRING' ? t('Monthly') : t('Yearly')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{cat.description}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => openCategoryDialog(cat)}><Pencil className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteCategory(cat.id)}><Trash2 className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* ==================== CATEGORY DIALOG ==================== */}
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? t('Edit Category') : t('New Fee Category')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('Name')}</Label>
                                <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required placeholder="e.g. Monthly Tuition" />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Type')}</Label>
                                <Select value={categoryForm.fee_type} onValueChange={(val) => setCategoryForm({ ...categoryForm, fee_type: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RECURRING">{t('Recurring (Monthly)')}</SelectItem>
                                        <SelectItem value="ONE_TIME">{t('One Time (Yearly)')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Description')}</Label>
                                <Input value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                            </div>
                            <DialogFooter>
                                <Button type="submit">{t('Save')}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* ==================== STRUCTURE DIALOG ==================== */}
                <Dialog open={isStructureDialogOpen} onOpenChange={setIsStructureDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingStructure ? t('Edit Fee Structure') : t('New Fee Structure')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleStructureSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('Academic Year')}</Label>
                                <Select value={String(structureForm.academic_year)} onValueChange={(val) => setStructureForm({ ...structureForm, academic_year: val })}>
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
                                <Select value={String(structureForm.grade)} onValueChange={(val) => setStructureForm({ ...structureForm, grade: val })}>
                                    <SelectTrigger><SelectValue placeholder={t('Select Grade')} /></SelectTrigger>
                                    <SelectContent>
                                        {grades.map(grade => (
                                            <SelectItem key={grade.id} value={String(grade.id)}>{grade.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Fee Category')}</Label>
                                <Select value={String(structureForm.category)} onValueChange={(val) => setStructureForm({ ...structureForm, category: val })}>
                                    <SelectTrigger><SelectValue placeholder={t('Select Category')} /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Amount (DH)')}</Label>
                                <Input type="number" value={structureForm.amount} onChange={(e) => setStructureForm({ ...structureForm, amount: e.target.value })} required />
                            </div>
                            <DialogFooter>
                                <Button type="submit">{t('Save')}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </motion.div>
        </AdminPageLayout>
    );
};

export default FeeSetupPage;
