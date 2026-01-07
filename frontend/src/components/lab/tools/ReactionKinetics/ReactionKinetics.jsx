import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Timer, Activity, TrendingDown, Clock, Atom } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ReactionKinetics = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("kinetics");

    // --- Chemical Kinetics State ---
    const [order, setOrder] = useState('1'); // 0, 1, 2
    const [conc0, setConc0] = useState(1.0); // mol/L
    const [rateK, setRateK] = useState(0.05); // unit depends on order
    const [timeMax, setTimeMax] = useState(100);

    const kineticsData = useMemo(() => {
        const data = [];
        const steps = 50;
        const dt = timeMax / steps;

        for (let i = 0; i <= steps; i++) {
            const t = i * dt;
            let c = 0;
            let rate = 0;

            if (order === '0') {
                // [A] = [A]0 - kt
                c = conc0 - rateK * t;
                if (c < 0) c = 0;
                rate = rateK;
            } else if (order === '1') {
                // [A] = [A]0 * e^(-kt)
                c = conc0 * Math.exp(-rateK * t);
                rate = rateK * c;
            } else if (order === '2') {
                // 1/[A] = 1/[A]0 + kt  => [A] = 1 / (1/[A]0 + kt)
                c = 1 / ((1 / conc0) + rateK * t);
                rate = rateK * c * c;
            }

            data.push({
                t: parseFloat(t.toFixed(1)),
                conc: parseFloat(c.toFixed(4)),
                rate: parseFloat(rate.toFixed(4))
            });
        }
        return data;
    }, [order, conc0, rateK, timeMax]);

    const halfLifeChem = useMemo(() => {
        const k = parseFloat(rateK);
        const c0 = parseFloat(conc0);
        if (k <= 0) return 0;

        if (order === '0') return c0 / (2 * k);
        if (order === '1') return Math.log(2) / k;
        if (order === '2') return 1 / (k * c0);
        return 0;
    }, [order, rateK, conc0]);


    // --- Radioactive Decay State ---
    const [decayMode, setDecayMode] = useState('halflife'); // halflife, constant
    const [n0, setN0] = useState(10000000); // Initial Nuclei
    const [tHalf, setTHalf] = useState(5730); // C-14 example
    const [lambda, setLambda] = useState(0.000121);
    const [decayTimeMax, setDecayTimeMax] = useState(30000);

    const decayData = useMemo(() => {
        // lambda = ln(2) / tHalf
        const lam = decayMode === 'halflife' ? (Math.log(2) / tHalf) : lambda;

        const data = [];
        const steps = 50;
        const dt = decayTimeMax / steps;

        for (let i = 0; i <= steps; i++) {
            const t = i * dt;
            // N(t) = N0 * e^(-lambda * t)
            const n = n0 * Math.exp(-lam * t);
            // Activity A(t) = lambda * N(t) (Bq if t in seconds)
            // Just tracking N mostly
            data.push({
                t: parseFloat(t.toFixed(1)),
                n: Math.round(n),
                // Remaining percentage
                pct: parseFloat(((n / n0) * 100).toFixed(1))
            });
        }
        return { data, lam };
    }, [decayMode, n0, tHalf, lambda, decayTimeMax]);


    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Timer className="w-8 h-8 text-orange-600" />
                        {t('lab.tools.reactionKinetics.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('lab.tools.reactionKinetics.description')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="kinetics" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" /> {t('lab.tools.reactionKinetics.chemicalKinetics')}
                    </TabsTrigger>
                    <TabsTrigger value="decay" className="flex items-center gap-2">
                        <Atom className="w-4 h-4" /> {t('lab.tools.reactionKinetics.radioactiveDecay')}
                    </TabsTrigger>
                </TabsList>

                {/* --- Chemical Kinetics Tab --- */}
                <TabsContent value="kinetics" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Reaction Parameters</CardTitle>
                                <CardDescription>Configure the reaction order and constants.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Reaction Order ($n$)</Label>
                                    <Select value={order} onValueChange={setOrder}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Zero Order (0)</SelectItem>
                                            <SelectItem value="1">First Order (1)</SelectItem>
                                            <SelectItem value="2">Second Order (2)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label>Initial Conc. $[A]_0$ (mol/L)</Label>
                                        <Input type="number" step="0.1" value={conc0} onChange={e => setConc0(parseFloat(e.target.value) || 0)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Rate Constant $k$</Label>
                                        <Input type="number" step="0.01" value={rateK} onChange={e => setRateK(parseFloat(e.target.value) || 0)} />
                                        <div className="text-xs text-muted-foreground">
                                            Unit: {order === '0' ? 'mol·L⁻¹·s⁻¹' : order === '1' ? 's⁻¹' : 'L·mol⁻¹·s⁻¹'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Simulation Time ($t_{'{'}max{'}'}$)</Label>
                                        <Input type="number" step="10" value={timeMax} onChange={e => setTimeMax(parseFloat(e.target.value) || 0)} />
                                    </div>
                                </div>

                                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border rounded-md">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-sm">Half-Life ($t_{1 / 2}$)</span>
                                        <span className="font-bold text-xl">{halfLifeChem.toPrecision(4)} s</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {order === '1' ? 'Constant (ln(2)/k)' : order === '0' ? 'Depends on [A]₀' : 'Depends on [A]₀'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Concentration & Rate vs Time</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={kineticsData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis
                                            dataKey="t"
                                            label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            label={{ value: '[A] (mol/L)', angle: -90, position: 'insideLeft' }}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            label={{ value: 'Rate (mol/L/s)', angle: 90, position: 'insideRight' }}
                                        />
                                        <Tooltip
                                            labelFormatter={(l) => `Time: ${l} s`}
                                            formatter={(val, name) => [val, name === 'conc' ? '[A]' : 'Rate']}
                                        />
                                        <Legend />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="conc"
                                            name="[A] Conc"
                                            stroke="#2563eb"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="rate"
                                            name="Rate"
                                            stroke="#ea580c"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>


                {/* --- Radioactive Decay Tab --- */}
                <TabsContent value="decay" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Decay Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label>Input Mode</Label>
                                    <RadioGroup value={decayMode} onValueChange={setDecayMode} className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="halflife" id="hl" />
                                            <Label htmlFor="hl">Half-Life ($t_{1 / 2}$)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="constant" id="lc" />
                                            <Label htmlFor="lc">Decay Const ($\lambda$)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label>Initial Nuclei ($N_0$)</Label>
                                        <Input type="number" value={n0} onChange={e => setN0(parseFloat(e.target.value) || 0)} />
                                    </div>

                                    {decayMode === 'halflife' ? (
                                        <div className="space-y-1">
                                            <Label>Half-Life ($t_{1 / 2}$)</Label>
                                            <Input type="number" value={tHalf} onChange={e => setTHalf(parseFloat(e.target.value) || 0)} />
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <Label>Decay Constant ($\lambda$)</Label>
                                            <Input type="number" value={lambda} onChange={e => setLambda(parseFloat(e.target.value) || 0)} />
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <Label>Time Horizon ($t_{'{'}max{'}'}$)</Label>
                                        <Input type="number" value={decayTimeMax} onChange={e => setDecayTimeMax(parseFloat(e.target.value) || 0)} />
                                    </div>
                                </div>

                                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border rounded-md">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-sm">Decay Constant $\lambda$</span>
                                        <span className="font-mono text-lg">{decayData.lam.toExponential(4)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-sm">Time Constant $\tau$ ($1/\lambda$)</span>
                                        <span className="font-mono text-lg">{(1 / decayData.lam).toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Radioactive Decay Curve ($N$ vs $t$)</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={decayData.data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis
                                            dataKey="t"
                                            label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
                                        />
                                        <YAxis
                                            label={{ value: 'Nuclei N', angle: -90, position: 'insideLeft', offset: 10 }}
                                        />
                                        <Tooltip
                                            labelFormatter={(l) => `Time: ${l}`}
                                            formatter={(val, name) => [name === 'pct' ? `${val}%` : val, name === 'pct' ? 'Remaining' : 'Nuclei']}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="n"
                                            name="Nuclei N(t)"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ReactionKinetics;
