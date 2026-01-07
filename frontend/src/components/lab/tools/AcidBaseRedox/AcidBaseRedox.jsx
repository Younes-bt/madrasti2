import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pipette, Battery, Droplets, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Titration Data ---
// Simplified Simulation for Strong Acid (HA) + Strong Base (BOH)
// Or Weak Acid (HA) + Strong Base (BOH)
const calculateTitrationPoints = (type, ca, va, cb) => {
    // type: 'SA_SB' (Strong Acid w/ Strong Base) or 'WA_SB' (Weak Acid w/ Strong Base, pKa=4.75 e.g. Acetic)
    const points = [];
    const step = 0.5;
    const maxVb = (ca * va / cb) * 2; // Go up to 2x equivalence logic usually

    // Equivalence Point Volume
    const ve = (ca * va) / cb;

    // pKa for Weak Acid example
    const pKa = 4.75;

    for (let vb = 0; vb <= maxVb; vb += step) {
        let ph = 7;

        if (type === 'SA_SB') {
            // Strong Acid - Strong Base logic
            if (vb < ve) {
                // Excess Acid
                // [H+] = (CaVa - CbVb) / (Va + Vb)
                const h = (ca * va - cb * vb) / (va + vb);
                ph = -Math.log10(h);
            } else if (Math.abs(vb - ve) < 0.05) {
                ph = 7;
            } else {
                // Excess Base
                // [OH-] = (CbVb - CaVa) / (Va + Vb)
                const oh = (cb * vb - ca * va) / (va + vb);
                const poh = -Math.log10(oh);
                ph = 14 - poh;
            }
        } else {
            // Weak Acid (approx) - Strong Base
            if (vb === 0) {
                // Initial pH of Weak Acid: pH = 0.5 * (pKa - log Ca)
                ph = 0.5 * (pKa - Math.log10(ca));
            } else if (vb < ve) {
                // Buffer Region: pH = pKa + log([A-]/[HA])
                // [A-] ~ CbVb / Vtotal
                // [HA] ~ (CaVa - CbVb) / Vtotal
                // ratio = CbVb / (CaVa - CbVb)
                if (ca * va > cb * vb) {
                    const ratio = (cb * vb) / (ca * va - cb * vb);
                    ph = pKa + Math.log10(ratio);
                }
            } else if (Math.abs(vb - ve) < 0.05) {
                // Equivalence for WA+SB is basic (>7)
                // pH = 0.5 * (pKw + pKa + log[A-])
                // [A-] = CaVa / (Va + Vb) at equiv
                const concA = (ca * va) / (va + vb);
                ph = 0.5 * (14 + pKa + Math.log10(concA));
            } else {
                // Excess Base same as Strong-Strong
                const oh = (cb * vb - ca * va) / (va + vb);
                const poh = -Math.log10(oh);
                ph = 14 - poh;
            }
        }

        points.push({ vb, ph: Math.min(14, Math.max(0, ph)) });
    }
    return points;
};

// --- Redox Data ---
const REDOX_PAIRS = [
    { ox: 'F₂(g)', red: 'F⁻', e0: 2.87 },
    { ox: 'MnO₄⁻', red: 'Mn²⁺', e0: 1.51 },
    { ox: 'Cl₂(g)', red: 'Cl⁻', e0: 1.36 },
    { ox: 'O₂(g)', red: 'H₂O', e0: 1.23 },
    { ox: 'Br₂(l)', red: 'Br⁻', e0: 1.07 },
    { ox: 'NO₃⁻', red: 'NO(g)', e0: 0.96 },
    { ox: 'Ag⁺', red: 'Ag(s)', e0: 0.80 },
    { ox: 'Fe³⁺', red: 'Fe²⁺', e0: 0.77 },
    { ox: 'I₂(s)', red: 'I⁻', e0: 0.54 },
    { ox: 'Cu²⁺', red: 'Cu(s)', e0: 0.34 },
    { ox: '2H⁺', red: 'H₂(g)', e0: 0.00 },
    { ox: 'Pb²⁺', red: 'Pb(s)', e0: -0.13 },
    { ox: 'Sn²⁺', red: 'Sn(s)', e0: -0.14 },
    { ox: 'Ni²⁺', red: 'Ni(s)', e0: -0.25 },
    { ox: 'Fe²⁺', red: 'Fe(s)', e0: -0.44 },
    { ox: 'Zn²⁺', red: 'Zn(s)', e0: -0.76 },
    { ox: 'Al³⁺', red: 'Al(s)', e0: -1.66 },
    { ox: 'Mg²⁺', red: 'Mg(s)', e0: -2.37 },
    { ox: 'Na⁺', red: 'Na(s)', e0: -2.71 },
    { ox: 'Li⁺', red: 'Li(s)', e0: -3.04 },
];

const AcidBaseRedox = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("titration");

    // --- Titration State ---
    const [titrType, setTitrType] = useState('SA_SB');
    const [concAcid, setConcAcid] = useState(0.1);
    const [volAcid, setVolAcid] = useState(20); // mL
    const [concBase, setConcBase] = useState(0.1);

    const titrationCurve = useMemo(() => {
        return calculateTitrationPoints(titrType, concAcid, volAcid, concBase);
    }, [titrType, concAcid, volAcid, concBase]);

    const equivPoint = useMemo(() => {
        const ve = (concAcid * volAcid) / concBase;
        return ve.toFixed(2);
    }, [concAcid, volAcid, concBase]);


    // --- Electrochemistry State ---
    const [anodeIdx, setAnodeIdx] = useState(15); // Zn
    const [cathodeIdx, setCathodeIdx] = useState(9); // Cu

    const cellData = useMemo(() => {
        const anode = REDOX_PAIRS[anodeIdx];
        const cathode = REDOX_PAIRS[cathodeIdx];

        // E_cell = E_cathode - E_anode (if cathode is reduction, anode is oxidation by convention for galvanic)
        // Usually calculate potential difference then determine spontaneous direction.
        // Assuming user selected Left and Right.
        // Real spontaneous cell: Higher E0 is Cathode (Reduction). Lower E0 is Anode (Oxidation).

        const realCathode = anode.e0 > cathode.e0 ? anode : cathode;
        const realAnode = anode.e0 > cathode.e0 ? cathode : anode;

        return {
            potential: (realCathode.e0 - realAnode.e0).toFixed(2),
            anode: realAnode,
            cathode: realCathode,
            notation: `${realAnode.red}/${realAnode.ox} // ${realCathode.ox}/${realCathode.red}`
        };
    }, [anodeIdx, cathodeIdx]);


    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Zap className="w-8 h-8 text-yellow-600" />
                        {t('lab.tools.acidBaseRedox.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('lab.tools.acidBaseRedox.description')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-[600px]">
                    <TabsTrigger value="titration" className="flex items-center gap-2">
                        <Pipette className="w-4 h-4" /> Titration
                    </TabsTrigger>
                    <TabsTrigger value="electro" className="flex items-center gap-2">
                        <Battery className="w-4 h-4" /> Cell Builder
                    </TabsTrigger>
                    <TabsTrigger value="redox" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Potentials Table
                    </TabsTrigger>
                </TabsList>

                {/* --- Titration Tab --- */}
                <TabsContent value="titration" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Setup</CardTitle>
                                <CardDescription>Configure the acid and base parameters.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Reaction Type</Label>
                                    <Select value={titrType} onValueChange={setTitrType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SA_SB">Strong Acid + Strong Base</SelectItem>
                                            <SelectItem value="WA_SB">Weak Acid + Strong Base</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="p-4 border rounded-md bg-pink-50 dark:bg-pink-900/10 space-y-3">
                                    <Label className="text-pink-600 font-bold">Acid (Beaker)</Label>
                                    <div>
                                        <Label className="text-xs">Concentration $C_a$ (mol/L)</Label>
                                        <Input type="number" step="0.01" value={concAcid} onChange={e => setConcAcid(parseFloat(e.target.value) || 0)} />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Volume $V_a$ (mL)</Label>
                                        <Input type="number" step="1" value={volAcid} onChange={e => setVolAcid(parseFloat(e.target.value) || 0)} />
                                    </div>
                                </div>

                                <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-900/10 space-y-3">
                                    <Label className="text-blue-600 font-bold">Base (Burette)</Label>
                                    <div>
                                        <Label className="text-xs">Concentration $C_b$ (mol/L)</Label>
                                        <Input type="number" step="0.01" value={concBase} onChange={e => setConcBase(parseFloat(e.target.value) || 0)} />
                                    </div>
                                </div>

                                <div className="bg-muted p-4 rounded-md text-center">
                                    <span className="text-sm text-muted-foreground block mb-1">Equivalence Volume ($V_E$)</span>
                                    <span className="text-2xl font-bold">{equivPoint} mL</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Titration Curve</CardTitle>
                                <CardDescription>pH vs Volume of Base added ($V_b$)</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={titrationCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPh" x1="0" y1="1" x2="0" y2="0">
                                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.1} />
                                                <stop offset="50%" stopColor="#22c55e" stopOpacity={0.1} />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis
                                            dataKey="vb"
                                            label={{ value: 'Vol Base (mL)', position: 'insideBottom', offset: -5 }}
                                            type="number"
                                        />
                                        <YAxis
                                            domain={[0, 14]}
                                            label={{ value: 'pH', angle: -90, position: 'insideLeft' }}
                                            ticks={[0, 2, 4, 6, 7, 8, 10, 12, 14]}
                                        />
                                        <Tooltip
                                            formatter={(val) => val.toFixed(2)}
                                            labelFormatter={(l) => `Vol: ${l} mL`}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="ph"
                                            stroke="#8884d8"
                                            fill="url(#colorPh)"
                                            strokeWidth={3}
                                        />
                                        {/* Reference Line for Equivalence */}
                                        {/* Should be a proper reference line, simplified here */}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- Electrochemical Cell Builder --- */}
                <TabsContent value="electro" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Galvanic Cell Builder</CardTitle>
                            <CardDescription>Select two half-cells to construct a battery and calculate its standard potential.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-8">
                                {/* Left Electrode */}
                                <div className="flex flex-col gap-2 w-full md:w-1/3">
                                    <Label className="font-bold text-center">Electrode 1</Label>
                                    <Select onValueChange={(v) => setAnodeIdx(parseInt(v))} defaultValue={anodeIdx.toString()}>
                                        <SelectTrigger className="h-14">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {REDOX_PAIRS.map((p, i) => (
                                                <SelectItem key={i} value={i.toString()}>
                                                    <span className="font-mono font-bold mr-2">{p.red}/{p.ox}</span> (E⁰ = {p.e0 > 0 ? '+' : ''}{p.e0} V)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col items-center">
                                    <Zap className="w-12 h-12 text-yellow-500 animate-pulse" />
                                    <ArrowRight className="w-6 h-6 text-muted-foreground mt-2" />
                                </div>

                                {/* Right Electrode */}
                                <div className="flex flex-col gap-2 w-full md:w-1/3">
                                    <Label className="font-bold text-center">Electrode 2</Label>
                                    <Select onValueChange={(v) => setCathodeIdx(parseInt(v))} defaultValue={cathodeIdx.toString()}>
                                        <SelectTrigger className="h-14">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {REDOX_PAIRS.map((p, i) => (
                                                <SelectItem key={i} value={i.toString()}>
                                                    <span className="font-mono font-bold mr-2">{p.red}/{p.ox}</span> (E⁰ = {p.e0 > 0 ? '+' : ''}{p.e0} V)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 text-center space-y-4">
                                <h3 className="text-xl font-semibold">Cell Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-red-200">
                                        <span className="text-sm text-red-500 font-bold block mb-1">ANODE (-) Oxidation</span>
                                        <div className="font-mono text-lg">{cellData.anode.red} → {cellData.anode.ox} + ne⁻</div>
                                        <div className="text-xs text-muted-foreground mt-1">E⁰ = {cellData.anode.e0} V</div>
                                    </div>

                                    <div className="p-4 bg-white dark:bg-black rounded-lg border-2 border-yellow-400 flex flex-col justify-center">
                                        <span className="text-sm text-muted-foreground font-bold uppercase mb-1">Cell Potential</span>
                                        <div className="text-4xl font-bold text-yellow-600">{cellData.potential} V</div>
                                    </div>

                                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-blue-200">
                                        <span className="text-sm text-blue-500 font-bold block mb-1">CATHODE (+) Reduction</span>
                                        <div className="font-mono text-lg">{cellData.cathode.ox} + ne⁻ → {cellData.cathode.red}</div>
                                        <div className="text-xs text-muted-foreground mt-1">E⁰ = {cellData.cathode.e0} V</div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-dashed">
                                    <span className="text-sm text-muted-foreground mr-2">Schematic Notation:</span>
                                    <code className="bg-muted px-2 py-1 rounded font-bold text-lg">{cellData.notation}</code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Potentials Table --- */}
                <TabsContent value="redox" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Standard Electrode Potentials ($E^0$) at 25°C</CardTitle>
                            <CardDescription>Reference table ordered by oxidizing power.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[500px] border rounded-md">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted sticky top-0">
                                        <tr>
                                            <th className="p-3 font-bold text-center">Oxidizing Agent</th>
                                            <th className="p-3 font-bold text-center">Reducing Agent</th>
                                            <th className="p-3 font-bold text-right">E⁰ (V)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {REDOX_PAIRS.map((pair, idx) => (
                                            <tr key={idx} className="hover:bg-muted/50">
                                                <td className="p-3 text-center font-mono text-blue-600 font-semibold">{pair.ox} + ne⁻</td>
                                                <td className="p-3 text-center font-mono text-pink-600 font-semibold">⇌ {pair.red}</td>
                                                <td className="p-3 text-right font-bold">{pair.e0 > 0 ? '+' : ''}{pair.e0.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AcidBaseRedox;
