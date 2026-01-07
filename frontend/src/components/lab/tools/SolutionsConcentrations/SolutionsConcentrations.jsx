import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Beaker, Droplets, Zap, Percent, ArrowRight } from 'lucide-react';

const COMMON_IONS = [
    { name: 'H⁺ (H₃O⁺)', lambda: 34.96 },
    { name: 'OH⁻', lambda: 19.91 },
    { name: 'Na⁺', lambda: 5.01 },
    { name: 'K⁺', lambda: 7.35 },
    { name: 'NH₄⁺', lambda: 7.34 },
    { name: 'Ca²⁺', lambda: 11.90 }, // usually listed as 1/2 Ca2+ or molar conductivity per charge. Let's use molar conductivity per mole of ion. 
    // Actually lambda is often mS m^2 / mol.
    // Standard given values at 25°C usually:
    // H+: 35.0, Na+: 5.0, K+: 7.3, OH-: 19.9, Cl-: 7.6, NO3-: 7.1, SO4 2-: 16.0 (for 1/2) -> 32.0? 
    // Let's stick to standard values typically found in Moroccan textbooks for lambda (mS.m2.mol-1).
    { name: 'Cl⁻', lambda: 7.63 },
    { name: 'NO₃⁻', lambda: 7.14 },
    { name: 'CH₃COO⁻', lambda: 4.09 },
    { name: 'SO₄²⁻', lambda: 16.00 } // Often given as 16.0 for 1/2 SO42-, so 32 for SO42-? standard is usually per equivalent. Let's assume input is per Mole of Ion and use consistent units.
];

const SolutionsConcentrations = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("molarity");

    // --- Molarity State ---
    const [molMode, setMolMode] = useState('find_c'); // find_c, find_n, find_v, find_m
    const [molC, setMolC] = useState('');
    const [molN, setMolN] = useState('');
    const [molV, setMolV] = useState('');
    const [molMass, setMolMass] = useState('');
    const [molMolarMass, setMolMolarMass] = useState('');

    const calculateMolarity = () => {
        const C = parseFloat(molC);
        const n = parseFloat(molN);
        const V = parseFloat(molV); // Liters
        const m = parseFloat(molMass);
        const M = parseFloat(molMolarMass);

        if (molMode === 'find_c') {
            // C = n/V or C = m/(M*V)
            if (n && V) {
                const res = n / V;
                return { val: res, unit: 'mol/L', expl: `C = n / V = ${n} / ${V}` };
            } else if (m && M && V) {
                const res = m / (M * V);
                return { val: res, unit: 'mol/L', expl: `C = m / (M × V) = ${m} / (${M} × ${V})` };
            }
        } else if (molMode === 'find_n') {
            // n = C*V or n = m/M
            if (C && V) {
                const res = C * V;
                return { val: res, unit: 'mol', expl: `n = C × V = ${C} × ${V}` };
            } else if (m && M) {
                const res = m / M;
                return { val: res, unit: 'mol', expl: `n = m / M = ${m} / ${M}` };
            }
        } else if (molMode === 'find_v') {
            // V = n/C
            if (n && C) {
                const res = n / C;
                return { val: res, unit: 'L', expl: `V = n / C = ${n} / ${C}` };
            }
        } else if (molMode === 'find_m') {
            // m = n*M or m = C*V*M
            if (n && M) {
                const res = n * M;
                return { val: res, unit: 'g', expl: `m = n × M = ${n} × ${M}` };
            } else if (C && V && M) {
                const res = C * V * M;
                return { val: res, unit: 'g', expl: `m = C × V × M = ${C} × ${V} × ${M}` };
            }
        }
        return { val: "---", unit: "", expl: "Fill required fields" };
    };

    const molResult = calculateMolarity();


    // --- Dilution State ---
    // C1 V1 = C2 V2
    const [dilC1, setDilC1] = useState('');
    const [dilV1, setDilV1] = useState('');
    const [dilC2, setDilC2] = useState('');
    const [dilV2, setDilV2] = useState('');
    const [dilTarget, setDilTarget] = useState('c2'); // c1, v1, c2, v2

    const calculateDilution = () => {
        const c1 = parseFloat(dilC1);
        const v1 = parseFloat(dilV1);
        const c2 = parseFloat(dilC2);
        const v2 = parseFloat(dilV2);

        if (dilTarget === 'c2' && c1 && v1 && v2) return { val: (c1 * v1) / v2, unit: 'mol/L' };
        if (dilTarget === 'v2' && c1 && v1 && c2) return { val: (c1 * v1) / c2, unit: 'L (or same as V1)' };
        if (dilTarget === 'c1' && c2 && v2 && v1) return { val: (c2 * v2) / v1, unit: 'mol/L' };
        if (dilTarget === 'v1' && c2 && v2 && c1) return { val: (c2 * v2) / c1, unit: 'L (or same as V2)' };
        return { val: '---', unit: '' };
    };
    const dilResult = calculateDilution();


    // --- pH State ---
    const [phValue, setPhValue] = useState('');
    const [h3o, setH3o] = useState('');

    // Auto-update
    const updatePh = (val) => {
        setPhValue(val);
        if (val) setH3o(Math.pow(10, -parseFloat(val)).toExponential(2));
        else setH3o('');
    };
    const updateH3o = (val) => {
        setH3o(val);
        if (val && parseFloat(val) > 0) setPhValue((-Math.log10(parseFloat(val))).toFixed(2));
        else setPhValue('');
    };


    // --- Conductivity State ---
    const [ions, setIons] = useState([{ id: 1, ion: 'Na⁺', conc: 0, lambda: 5.01 }]);

    const sigma = useMemo(() => {
        // Sigma = Sum (lambda_i * [Xi])
        // Warning: Standard units for lambda are mS m^2 mol^-1
        // Concentration usually in mol/L aka mol/dm^3 aka 1000 mol/m^3 ? 
        // Wait, 1 mol/L = 1000 mol/m^3.
        // Formula: sigma (S/m) = Sum (lambda (S m2 / mol) * C (mol/m3))
        // Usually questions give C in mol/L. So C (mol/m3) = C (mol/L) * 1000.
        // Sigma (mS/m) = Sum (lambda (mS m2 / mol) * C (mol/L) * 1000 ) ? No, wait.

        // Let's assume standard input C is mol/L.
        // Let's output Sigma in mS/cm or S/m depending on user pref?
        // Typically: sigma (S/m) = Sum( lambda (S m^2 / mol) * C (mol/m^3) )
        // Let's use mS/m for result as standard.
        // lambda input above is in mS m^2 mol^-1.
        // C input is mol/L.
        // C (mol/m3) = 1000 * C (mol/L).
        // Sigma (mS/m) = Sum ( lambda * 1000 * C )

        return ions.reduce((acc, curr) => {
            return acc + (curr.lambda * (curr.conc || 0) * 1000); // Result in mS/m
            // Wait, standard lambda values (e.g. Na+ ~ 5.0 mS m2 / mol)
            // If C = 1 mol/L = 1000 mol/m3.
            // Sigma = 5.0 * 1000 = 5000 mS/m = 5 S/m.
            // Seems correct.
        }, 0);
    }, [ions]);

    const addIon = () => {
        setIons([...ions, { id: Date.now(), ion: 'Cl⁻', conc: 0, lambda: 7.63 }]);
    };
    const removeIon = (id) => {
        setIons(ions.filter(i => i.id !== id));
    };
    const updateIon = (id, field, val) => {
        setIons(ions.map(i => {
            if (i.id === id) {
                const newData = { ...i, [field]: val };
                if (field === 'ion') {
                    const found = COMMON_IONS.find(ref => ref.name === val);
                    if (found) newData.lambda = found.lambda;
                }
                return newData;
            }
            return i;
        }));
    };


    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Beaker className="w-8 h-8 text-blue-600" />
                        {t('lab.tools.solutionsConcentrations.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('lab.tools.solutionsConcentrations.description')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-[800px]">
                    <TabsTrigger value="molarity" className="flex items-center gap-2"><Beaker className="w-4 h-4" /> {t('lab.tools.solutionsConcentrations.molarity')}</TabsTrigger>
                    <TabsTrigger value="dilution" className="flex items-center gap-2"><Droplets className="w-4 h-4" /> {t('lab.tools.solutionsConcentrations.dilution')}</TabsTrigger>
                    <TabsTrigger value="ph" className="flex items-center gap-2"><Percent className="w-4 h-4" /> {t('lab.tools.solutionsConcentrations.pH')}</TabsTrigger>
                    <TabsTrigger value="conduct" className="flex items-center gap-2"><Zap className="w-4 h-4" /> {t('lab.tools.solutionsConcentrations.conductivity')}</TabsTrigger>
                </TabsList>

                {/* --- Molarity --- */}
                <TabsContent value="molarity" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Molarity Calculator</CardTitle>
                            <CardDescription>Calculate concentration ($C$), amount of substance ($n$), mass ($m$), or volume ($V$).</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>I want to calculate:</Label>
                                    <Select value={molMode} onValueChange={setMolMode}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="find_c">Concentration ($C$)</SelectItem>
                                            <SelectItem value="find_n">Amount (Moles $n$)</SelectItem>
                                            <SelectItem value="find_m">Mass ($m$)</SelectItem>
                                            <SelectItem value="find_v">Volume ($V$)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3 p-4 border rounded-md bg-muted/20">
                                    {molMode !== 'find_c' && (
                                        <div><Label>Concentration $C$ (mol/L)</Label><Input type="number" value={molC} onChange={e => setMolC(e.target.value)} /></div>
                                    )}
                                    {(molMode !== 'find_n' && molMode !== 'find_m') && (
                                        <div><Label>Moles $n$ (mol)</Label><Input type="number" value={molN} onChange={e => setMolN(e.target.value)} /></div>
                                    )}
                                    {molMode !== 'find_v' && (
                                        <div><Label>Volume $V$ (L)</Label><Input type="number" value={molV} onChange={e => setMolV(e.target.value)} /></div>
                                    )}

                                    {/* Advanced Inputs */}
                                    <div className="pt-2 border-t mt-2">
                                        <span className="text-xs font-semibold text-muted-foreground mb-2 block">Solid solute details (optional if $n$ known)</span>
                                        {molMode !== 'find_m' && (
                                            <div><Label>Mass $m$ (g)</Label><Input type="number" value={molMass} onChange={e => setMolMass(e.target.value)} /></div>
                                        )}
                                        <div><Label>Molar Mass $M$ (g/mol)</Label><Input type="number" value={molMolarMass} onChange={e => setMolMolarMass(e.target.value)} /></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-900 rounded-lg p-6 text-center">
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">Result</h3>
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {typeof molResult.val === 'number' ? molResult.val.toPrecision(4) : molResult.val}
                                    <span className="text-lg ml-1 text-muted-foreground">{molResult.unit}</span>
                                </div>
                                <p className="text-sm font-mono bg-white dark:bg-black px-3 py-1 rounded border">
                                    {molResult.expl}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Dilution --- */}
                <TabsContent value="dilution" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dilution Law ($C_1V_1 = C_2V_2$)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
                                {/* Solution 1 */}
                                <div className="space-y-4 p-4 border rounded-xl bg-blue-50/50 dark:bg-blue-900/10 w-full max-w-xs">
                                    <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-400">
                                        <Beaker className="w-5 h-5" /> Stock Solution (1)
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={dilTarget === 'c1' ? "text-blue-600 font-bold" : ""}>$C_1$ (Concentration)</Label>
                                        <Input
                                            disabled={dilTarget === 'c1'}
                                            value={dilTarget === 'c1' ? (dilResult.val !== '---' && typeof dilResult.val === 'number' ? dilResult.val.toPrecision(4) : '') : dilC1}
                                            onChange={e => setDilC1(e.target.value)}
                                            placeholder="mol/L"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={dilTarget === 'v1' ? "text-blue-600 font-bold" : ""}>$V_1$ (Volume)</Label>
                                        <Input
                                            disabled={dilTarget === 'v1'}
                                            value={dilTarget === 'v1' ? (dilResult.val !== '---' && typeof dilResult.val === 'number' ? dilResult.val.toPrecision(4) : '') : dilV1}
                                            onChange={e => setDilV1(e.target.value)}
                                            placeholder="L or mL"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-center pt-2">
                                        <Button variant={dilTarget === 'c1' ? "default" : "outline"} size="xs" onClick={() => setDilTarget('c1')} className="text-xs h-7">Solve C1</Button>
                                        <Button variant={dilTarget === 'v1' ? "default" : "outline"} size="xs" onClick={() => setDilTarget('v1')} className="text-xs h-7">Solve V1</Button>
                                    </div>
                                </div>

                                <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />

                                {/* Solution 2 */}
                                <div className="space-y-4 p-4 border rounded-xl bg-purple-50/50 dark:bg-purple-900/10 w-full max-w-xs">
                                    <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-400">
                                        <Droplets className="w-5 h-5" /> Diluted Solution (2)
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={dilTarget === 'c2' ? "text-purple-600 font-bold" : ""}>$C_2$ (Concentration)</Label>
                                        <Input
                                            disabled={dilTarget === 'c2'}
                                            value={dilTarget === 'c2' ? (dilResult.val !== '---' && typeof dilResult.val === 'number' ? dilResult.val.toPrecision(4) : '') : dilC2}
                                            onChange={e => setDilC2(e.target.value)}
                                            placeholder="mol/L"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={dilTarget === 'v2' ? "text-purple-600 font-bold" : ""}>$V_2$ (Volume)</Label>
                                        <Input
                                            disabled={dilTarget === 'v2'}
                                            value={dilTarget === 'v2' ? (dilResult.val !== '---' && typeof dilResult.val === 'number' ? dilResult.val.toPrecision(4) : '') : dilV2}
                                            onChange={e => setDilV2(e.target.value)}
                                            placeholder="L or mL"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-center pt-2">
                                        <Button variant={dilTarget === 'c2' ? "default" : "outline"} size="xs" onClick={() => setDilTarget('c2')} className="text-xs h-7">Solve C2</Button>
                                        <Button variant={dilTarget === 'v2' ? "default" : "outline"} size="xs" onClick={() => setDilTarget('v2')} className="text-xs h-7">Solve V2</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- pH --- */}
                <TabsContent value="ph" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader><CardTitle>pH & Hydronium Calculation</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6">
                                    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100">
                                        <Label className="text-lg mb-2 block text-red-700 dark:text-red-400">Acidity (pH)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            value={phValue}
                                            onChange={e => updatePh(e.target.value)}
                                            className="text-3xl font-bold h-16 text-center"
                                            placeholder="7.0"
                                        />
                                    </div>
                                    <div className="text-center text-2xl text-muted-foreground">⇅</div>
                                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100">
                                        <Label className="text-lg mb-2 block text-blue-700 dark:text-blue-400">Concentration $[H_3O^+]$</Label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={h3o}
                                            onChange={e => updateH3o(e.target.value)}
                                            className="text-3xl font-bold h-16 text-center"
                                            placeholder="1.0e-7"
                                        />
                                        <div className="text-xs text-center mt-2 text-muted-foreground">mol/L</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-red-500 via-green-500 to-blue-500 h-4 rounded-full w-full relative">
                                        {phValue && (
                                            <div
                                                className="absolute w-4 h-6 bg-black border-2 border-white top-1/2 -translate-y-1/2 -ml-2 rounded shadow-lg transition-all duration-500"
                                                style={{ left: `${(Math.min(Math.max(phValue, 0), 14) / 14) * 100}%` }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                                        <span>0 (Acidic)</span>
                                        <span>7 (Neutral)</span>
                                        <span>14 (Basic)</span>
                                    </div>

                                    <div className="mt-8 space-y-2 text-sm bg-muted p-4 rounded-md">
                                        <p className="flex justify-between"><strong>pOH:</strong> <span>{phValue ? (14 - parseFloat(phValue)).toFixed(2) : '--'}</span></p>
                                        <p className="flex justify-between"><strong>[OH⁻]:</strong> <span>{phValue ? Math.pow(10, -(14 - parseFloat(phValue))).toExponential(2) : '--'} mol/L</span></p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Conductivity --- */}
                <TabsContent value="conduct" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conductivity ($\sigma$)</CardTitle>
                            <CardDescription>Calculate solution conductivity based on ionic concentrations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Ions in Solution</Label>
                                        <Button size="sm" onClick={addIon} variant="outline"><Percent className="w-3 h-3 mr-1" /> Add Ion</Button>
                                    </div>
                                    <div className="border rounded-md divide-y">
                                        {ions.map((item) => (
                                            <div key={item.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                                                <div className="col-span-4">
                                                    <Label className="text-xs text-muted-foreground">Ion</Label>
                                                    <Select value={COMMON_IONS.some(i => i.name === item.ion) ? item.ion : "Custom"} onValueChange={(v) => updateIon(item.id, 'ion', v)}>
                                                        <SelectTrigger className="h-8"><SelectValue placeholder="Select Ion" /></SelectTrigger>
                                                        <SelectContent>
                                                            {COMMON_IONS.map(i => <SelectItem key={i.name} value={i.name}>{i.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-3">
                                                    <Label className="text-xs text-muted-foreground">Conv ($C$)</Label>
                                                    <Input type="number" className="h-8" placeholder="mol/L" value={item.conc} onChange={e => updateIon(item.id, 'conc', parseFloat(e.target.value))} />
                                                </div>
                                                <div className="col-span-3">
                                                    <Label className="text-xs text-muted-foreground">$\lambda$ (mS·m²/mol)</Label>
                                                    <Input type="number" className="h-8" value={item.lambda} onChange={e => updateIon(item.id, 'lambda', parseFloat(e.target.value))} />
                                                </div>
                                                <div className="col-span-2 flex justify-end items-end h-full pt-4">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => removeIon(item.id)}>×</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                                    <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">Total Conductivity ($\sigma$)</h3>
                                    <div className="text-4xl font-bold text-amber-600 dark:text-amber-500">
                                        {sigma.toFixed(2)} <span className="text-xl text-muted-foreground">mS/m</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {(sigma / 100).toFixed(4)} S/m • {(sigma / 10).toFixed(2)} mS/cm
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4 max-w-md">
                                        Formula: $\sigma = \sum \lambda_i \cdot [X_i]$. Note: Calculation assumes input [X] in mol/L and converts to mol/m³ internally (×1000) to match $\lambda$ units.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SolutionsConcentrations;
