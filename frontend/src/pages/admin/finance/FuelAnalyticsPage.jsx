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
import {
    Fuel, Car, Search, Loader2,
    Calendar, DollarSign, TrendingUp, Filter, History, MapPin, CreditCard
} from 'lucide-react';
import financeService from '@/services/finance';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';

// Mock list of vehicles (normally from a transport service)
// const VEHICLES = [
//     { id: 'BUS01', name: 'School Bus #1 (AB 1234)', driver: 'Mohammed' },
//     { id: 'BUS02', name: 'School Bus #2 (CD 5678)', driver: 'Ahmed' },
//     { id: 'VAN01', name: 'Transit Van #1 (EF 9012)', driver: 'Said' },
// ];

const FuelAnalyticsPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [fuelLogs, setFuelLogs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [vehicles, setVehicles] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        vehicle: '', // This will now store the vehicle ID
        date: new Date().toISOString().split('T')[0],
        liters: '',
        price_per_liter: '',
        total_amount: '',
        odometer_reading: '',
        gas_station: '',
        payment_method: 'VOUCHER',
        notes: ''
    });

    useEffect(() => {
        fetchFuelTracking();
        fetchVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await financeService.getVehicles();
            setVehicles(data.results || data);
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
        }
    }

    const fetchFuelTracking = async () => {
        setLoading(true);
        try {
            const data = await financeService.getFuelTracking();
            setFuelLogs(data.refills || []);
            setAnalytics(data);
        } catch {
            toast.error(t('finance.fuel.failedToLoad', 'Failed to load fuel records'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Calculate amount if not explicitly set but components are available
            let finalAmount = formData.total_amount;
            if ((!finalAmount || finalAmount === '') && formData.liters && formData.price_per_liter) {
                finalAmount = (parseFloat(formData.liters) * parseFloat(formData.price_per_liter)).toFixed(2);
            }

            const refillData = {
                refuel_date: formData.date,
                liters: formData.liters,
                amount: finalAmount,
                fuel_station: formData.gas_station,
                payment_method: formData.payment_method,
                receipt_number: `REF-${Date.now()}`, // Auto-gen for now
                notes: `Odometer: ${formData.odometer_reading}, Price/L: ${formData.price_per_liter}`
            };

            await financeService.createFuelRefill(formData.vehicle, refillData);

            toast.success(t('finance.fuel.recorded', 'Fuel expense recorded'));
            setIsDialogOpen(false);
            // Reset form
            setFormData({
                vehicle: '',
                date: new Date().toISOString().split('T')[0],
                liters: '',
                price_per_liter: '',
                total_amount: '',
                odometer_reading: '',
                gas_station: '',
                payment_method: 'VOUCHER',
                notes: ''
            });
            fetchFuelTracking();
        } catch (error) {
            console.error(error);
            toast.error(t('finance.fuel.failedToSave', 'Failed to save fuel record'));
        } finally {
            setLoading(false);
        }
    };

    // Calculate total spend from current logs
    // const totalSpent = fuelLogs.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

    return (
        <AdminPageLayout
            title={t('finance.fuel.title', 'Fuel Analytics & Tracking')}
            subtitle={t('finance.fuel.subtitle', 'Monitor vehicle fuel consumption and costs')}
        >
            <div className="space-y-6">
                {/* Stats Header */}
                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> */}
                {/* Commenting out old stats temporarily to debug layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-primary/5 border-none">
                        <CardContent className="p-4">
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Vouchers Purchased</p>
                            <p className="text-2xl font-bold text-primary">{(analytics?.summary?.total_vouchers_purchased || 0).toLocaleString()} MAD</p>
                            <div className="flex items-center gap-1 text-[10px] text-primary opacity-70 mt-2">
                                <DollarSign className="h-3 w-3" />
                                <span>Total invested</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-none">
                        <CardContent className="p-4">
                            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">Voucher Balance</p>
                            <p className="text-2xl font-bold text-blue-700">
                                {(analytics?.summary?.voucher_balance || 0).toLocaleString()} MAD
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-blue-600 opacity-70 mt-2">
                                <Filter className="h-3 w-3" />
                                <span>Remaining</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-amber-50 border-none">
                        <CardContent className="p-4">
                            <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-1">Total Liters</p>
                            <p className="text-2xl font-bold text-amber-700">
                                {(analytics?.summary?.total_liters || 0).toFixed(1)} L
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-amber-600 opacity-70 mt-2">
                                <Fuel className="h-3 w-3" />
                                <span>Avg. {(analytics?.summary?.avg_price_per_liter || 0).toFixed(2)} MAD/L</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-50 border-none">
                        <CardContent className="p-4">
                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">Total Refills</p>
                            <p className="text-2xl font-bold text-emerald-700">
                                {analytics?.summary?.refill_count || 0}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-600 opacity-70 mt-2">
                                <TrendingUp className="h-3 w-3" />
                                <span>All vehicles</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Voucher Purchases Section */}
                {analytics?.monthly_purchases && analytics.monthly_purchases.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Monthly Voucher Purchases
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {analytics.monthly_purchases.map((purchase, idx) => (
                                <Card key={idx} className="border-l-4 border-l-primary shadow-sm bg-white">
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{purchase.month}</p>
                                        <p className="text-xl font-bold text-gray-900 mt-1">{purchase.total_purchased.toLocaleString()} MAD</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{purchase.purchase_count} transactions</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Refill History
                    </h3>
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                        <Fuel className="h-4 w-4 mr-2" />
                        Log Fuel Refill
                    </Button>
                </div>

                {/* Table */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Liters</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Station</TableHead>
                                <TableHead className="text-right">Receipt</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={7} className="h-32 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                            ) : fuelLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                        No fuel records found. Start by logging your first refill.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fuelLogs.map(log => (
                                    <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Car className="h-4 w-4 text-primary" />
                                                <span className="font-medium text-sm">{log.vehicle}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{log.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-mono">
                                                {log.liters.toFixed(1)} L
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold">{log.amount.toLocaleString()} MAD</TableCell>
                                        <TableCell>
                                            <Badge variant={log.payment_method === 'CASH' ? 'outline' : 'default'}
                                                className={log.payment_method === 'CASH' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'bg-primary/10 text-primary border-primary/20'}>
                                                {log.payment_method === 'CASH' ? 'Cash' : 'Voucher'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-xs">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                {log.fuel_station || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                            {log.receipt_number || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Log Fuel Refill</DialogTitle>
                            <DialogDescription>Enter fuel purchase details for tracking and expenses.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="vehicle">Vehicle</Label>
                                    <Select value={formData.vehicle} onValueChange={(val) => setFormData({ ...formData, vehicle: val })}>
                                        <SelectTrigger><SelectValue placeholder="Select Vehicle" /></SelectTrigger>
                                        <SelectContent>
                                            {vehicles.map(v => (
                                                <SelectItem key={v.id} value={v.id.toString()}>
                                                    {v.brand} {v.model} ({v.plate_number})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="liters">Liters (L)</Label>
                                    <Input
                                        id="liters" type="number" step="0.01"
                                        value={formData.liters}
                                        onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                                        placeholder="0.00" required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ppl">Price per Liter</Label>
                                    <Input
                                        id="ppl" type="number" step="0.01"
                                        value={formData.price_per_liter}
                                        onChange={(e) => setFormData({ ...formData, price_per_liter: e.target.value })}
                                        placeholder="e.g. 12.50" required
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="total">Total Amount (MAD)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="total" type="number" step="0.01"
                                            className="pl-9 bg-muted/50 font-bold"
                                            value={formData.liters && formData.price_per_liter ? (parseFloat(formData.liters) * parseFloat(formData.price_per_liter)).toFixed(2) : formData.total_amount}
                                            onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {formData.liters && formData.price_per_liter && (
                                        <p className="text-[10px] text-emerald-600 font-medium">* Calculated automatically</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Refill Date</Label>
                                    <Input
                                        type="date" id="date" value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="payment_method">Payment Method</Label>
                                    <Select value={formData.payment_method} onValueChange={(val) => setFormData({ ...formData, payment_method: val })}>
                                        <SelectTrigger><SelectValue placeholder="Method" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VOUCHER">Voucher (Bone)</SelectItem>
                                            <SelectItem value="CASH">Cash</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="odo">Odometer (km)</Label>
                                    <Input
                                        id="odo" type="number" value={formData.odometer_reading}
                                        onChange={(e) => setFormData({ ...formData, odometer_reading: e.target.value })}
                                        placeholder="0" required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="station">Gas Station</Label>
                                    <Input
                                        id="station" value={formData.gas_station}
                                        onChange={(e) => setFormData({ ...formData, gas_station: e.target.value })}
                                        placeholder="e.g. Afriquia"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading}>Record Refill</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPageLayout>
    );
};

export default FuelAnalyticsPage;
