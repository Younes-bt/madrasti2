import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import * as math from 'mathjs';
import { Calculator, BarChart as BarChartIcon, PieChart as PieChartIcon, Sigma, Percent, Activity, Table as TableIcon } from 'lucide-react';


// Colors for Pie Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const StatisticsLab = () => {
    const { t } = useTranslation();

    const [rawInput, setRawInput] = useState("10, 12, 15, 12, 14, 18, 15, 12, 20");


    // Probability States
    const [probState, setProbState] = useState({
        n: 10,
        r: 3,
        p: 0.5,
        k: 5,
        probA: 0.3,
        probB: 0.4,
        probAandB: 0.12
    });

    const [activeTab, setActiveTab] = useState("descriptive");

    // --- Data Processing ---
    // --- Data Processing ---
    const data = useMemo(() => {
        try {
            const numbers = rawInput.split(/[\s,]+/)
                .map(s => s.trim())
                .filter(s => s !== "")
                .map(Number)
                .filter(n => !isNaN(n));
            return numbers.sort((a, b) => a - b);
        } catch {
            return [];
        }
    }, [rawInput]);

    const stats = useMemo(() => {
        if (data.length === 0) return null;
        try {
            const mean = math.mean(data);
            const median = math.median(data);
            const mode = math.mode(data);
            const stdSample = math.std(data, 'unbiased');
            const stdPop = math.std(data, 'uncorrected');
            const varianceSample = math.variance(data, 'unbiased');
            const variancePop = math.variance(data, 'uncorrected');
            const range = math.max(data) - math.min(data);
            const sum = math.sum(data);
            const count = data.length;

            // Frequency Table
            const freqMap = {};
            data.forEach(val => {
                freqMap[val] = (freqMap[val] || 0) + 1;
            });

            const uniqueValues = Object.keys(freqMap).map(Number).sort((a, b) => a - b);
            let cumFreq = 0;
            const frequencyTable = uniqueValues.map(val => {
                const freq = freqMap[val];
                cumFreq += freq;
                return {
                    value: val,
                    frequency: freq,
                    relativeFrequency: freq / count,
                    cumulativeFrequency: cumFreq
                };
            });

            return {
                mean, median, mode, stdSample, stdPop, varianceSample, variancePop, range, sum, count, frequencyTable
            };
        } catch {
            return null;
        }
    }, [data]);

    // --- Handlers ---
    const handleProbChange = (field, value) => {
        setProbState(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    // --- Probability Calculations ---
    const combinations = useMemo(() => {
        try {
            return math.combinations(probState.n, probState.r);
        } catch { return "Error"; }
    }, [probState.n, probState.r]);

    const permutations = useMemo(() => {
        try {
            return math.permutations(probState.n, probState.r);
        } catch { return "Error"; }
    }, [probState.n, probState.r]);

    const binomial = useMemo(() => {
        try {
            // P(X=k) = (nCk) * p^k * (1-p)^(n-k)
            const n = probState.n;
            const k = probState.k;
            const p = probState.p;
            if (p < 0 || p > 1) return "Error (p must be 0-1)";
            if (k < 0 || k > n) return "Error (k must be 0-n)";

            const nCk = math.combinations(n, k);
            const prob = nCk * Math.pow(p, k) * Math.pow(1 - p, n - k);
            return prob.toFixed(6);
        } catch { return "Error"; }
    }, [probState.n, probState.k, probState.p]);

    const conditional = useMemo(() => {
        // P(A|B) = P(A and B) / P(B)
        if (probState.probB === 0) return "Undefined";
        return (probState.probAandB / probState.probB).toFixed(4);
    }, [probState.probAandB, probState.probB]);


    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BarChartIcon className="w-8 h-8 text-blue-600" />
                        {t('lab.tools.statisticsLab.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('lab.tools.statisticsLab.description')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-[600px]">
                    <TabsTrigger value="descriptive" className="flex items-center gap-2">
                        <TableIcon className="w-4 h-4" /> {t('lab.tools.statisticsLab.descriptiveStats')}
                    </TabsTrigger>
                    <TabsTrigger value="charts" className="flex items-center gap-2">
                        <PieChartIcon className="w-4 h-4" /> {t('lab.tools.statisticsLab.visualization')}
                    </TabsTrigger>
                    <TabsTrigger value="probability" className="flex items-center gap-2">
                        <Percent className="w-4 h-4" /> {t('lab.tools.statisticsLab.probability')}
                    </TabsTrigger>
                </TabsList>

                {/* --- Descriptive Statistics Tab --- */}
                <TabsContent value="descriptive" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('lab.tools.statisticsLab.dataInput')}</CardTitle>
                            <CardDescription>{t('lab.tools.statisticsLab.dataInputDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="gap-4 flex flex-col">
                                <div>
                                    <Label htmlFor="data-input">{t('lab.tools.statisticsLab.dataSet')}</Label>
                                    <Input
                                        id="data-input"
                                        value={rawInput}
                                        onChange={(e) => setRawInput(e.target.value)}
                                        placeholder={t('lab.tools.statisticsLab.dataPlaceholder')}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {t('lab.tools.statisticsLab.count')}: {data.length} {t('lab.tools.statisticsLab.values')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Sigma className="w-5 h-5 text-purple-500" /> {t('lab.tools.statisticsLab.summaryStatistics')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <span className="text-sm text-muted-foreground block">{t('lab.tools.statisticsLab.mean')}</span>
                                            <span className="text-xl font-semibold">{stats.mean.toFixed(4)}</span>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <span className="text-sm text-muted-foreground block">{t('lab.tools.statisticsLab.median')}</span>
                                            <span className="text-xl font-semibold">{stats.median}</span>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <span className="text-sm text-muted-foreground block">{t('lab.tools.statisticsLab.mode')}</span>
                                            <span className="text-xl font-semibold">
                                                {Array.isArray(stats.mode) ? stats.mode.join(', ') : stats.mode}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <span className="text-sm text-muted-foreground block">{t('lab.tools.statisticsLab.range')}</span>
                                            <span className="text-xl font-semibold">{stats.range}</span>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <span className="text-sm text-muted-foreground block">{t('lab.tools.statisticsLab.stdDevData')}</span>
                                            <span className="text-xl font-semibold">{stats.stdPop.toFixed(4)}</span>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <span className="text-sm text-muted-foreground block">{t('lab.tools.statisticsLab.stdDevSample')}</span>
                                            <span className="text-xl font-semibold">{stats.stdSample.toFixed(4)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('lab.tools.statisticsLab.frequencyTable')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[300px] w-full rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>{t('lab.tools.statisticsLab.value')}</TableHead>
                                                    <TableHead>{t('lab.tools.statisticsLab.frequency')}</TableHead>
                                                    <TableHead>{t('lab.tools.statisticsLab.relativeFrequency')}</TableHead>
                                                    <TableHead>{t('lab.tools.statisticsLab.cumulativeFrequency')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {stats.frequencyTable.map((row, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium">{row.value}</TableCell>
                                                        <TableCell>{row.frequency}</TableCell>
                                                        <TableCell>{row.relativeFrequency.toFixed(3)}</TableCell>
                                                        <TableCell>{row.cumulativeFrequency}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* --- Charts Tab --- */}
                <TabsContent value="charts" className="space-y-6 mt-6">
                    {stats ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>{t('lab.tools.statisticsLab.barChartFrequency')}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.frequencyTable}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="value" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Bar dataKey="frequency" fill="#3b82f6" name="Frequency" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>{t('lab.tools.statisticsLab.pieChartDistribution')}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.frequencyTable}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="frequency"
                                                nameKey="value"
                                            >
                                                {stats.frequencyTable.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="col-span-1 lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>{t('lab.tools.statisticsLab.lineChartCumulative')}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stats.frequencyTable}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="value" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="cumulativeFrequency" stroke="#10b981" name="Cumulative Frequency" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            {t('lab.tools.statisticsLab.enterDataFirst')}
                        </div>
                    )}
                </TabsContent>

                {/* --- Probability Tab --- */}
                <TabsContent value="probability" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Combinatorics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('lab.tools.statisticsLab.combinatorics')}</CardTitle>
                                <CardDescription>{t('lab.tools.statisticsLab.combinatoricsDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Total Items ($n$)</Label>
                                        <Input type="number" min="0" value={probState.n} onChange={(e) => handleProbChange('n', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Selected Items ($r$)</Label>
                                        <Input type="number" min="0" max={probState.n} value={probState.r} onChange={(e) => handleProbChange('r', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-3 bg-muted/50 rounded-md">
                                        <span className="text-xs text-muted-foreground block mb-1">Permutations ($P$)</span>
                                        <span className="text-lg font-bold">{permutations}</span>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-md">
                                        <span className="text-xs text-muted-foreground block mb-1">Combinations ($C$)</span>
                                        <span className="text-lg font-bold">{combinations}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Binomial Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('lab.tools.statisticsLab.binomialDistribution')}</CardTitle>
                                <CardDescription>{t('lab.tools.statisticsLab.binomialDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label>Trials ($n$)</Label>
                                        <Input type="number" value={probState.n} disabled className="bg-muted" />
                                        <span className="text-[10px] text-muted-foreground">Uses $n$ from Combinatorics</span>
                                    </div>
                                    <div>
                                        <Label>Prob ($p$)</Label>
                                        <Input type="number" step="0.1" min="0" max="1" value={probState.p} onChange={(e) => handleProbChange('p', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Successes ($k$)</Label>
                                        <Input type="number" min="0" max={probState.n} value={probState.k} onChange={(e) => handleProbChange('k', e.target.value)} />
                                    </div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-md mt-2">
                                    <span className="text-xs text-muted-foreground block mb-1">Probability $P(X=k)$</span>
                                    <span className="text-lg font-bold">{binomial}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conditional Probability */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>{t('lab.tools.statisticsLab.conditionalProbability')}</CardTitle>
                                <CardDescription>{t('lab.tools.statisticsLab.conditionalDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label>Prob ($P(A \cap B)$)</Label>
                                        <Input type="number" step="0.01" min="0" max="1" value={probState.probAandB} onChange={(e) => handleProbChange('probAandB', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Prob ($P(B)$)</Label>
                                        <Input type="number" step="0.01" min="0" max="1" value={probState.probB} onChange={(e) => handleProbChange('probB', e.target.value)} />
                                    </div>
                                    <div className="flex items-end">
                                        <div className="w-full p-2.5 bg-muted/50 rounded-md flex justify-between items-center px-4">
                                            <span className="text-sm font-semibold">Result $P(A|B)$: </span>
                                            <span className="text-lg font-bold text-blue-600">{conditional}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default StatisticsLab;
