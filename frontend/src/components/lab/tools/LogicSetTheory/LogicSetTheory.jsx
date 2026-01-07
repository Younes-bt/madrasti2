import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Binary, BoxSelect, Circle, Wand2 } from 'lucide-react';
import { evaluate } from 'mathjs';

const LogicSetTheory = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("logic");

    // --- Logic State ---
    const [logicExpression, setLogicExpression] = useState("A and (B or not C)");
    const [compareExpr1, setCompareExpr1] = useState("not (A and B)");
    const [compareExpr2, setCompareExpr2] = useState("(not A) or (not B)");

    // --- Set State ---
    const [setA, setSetA] = useState("1, 2, 3, 4");
    const [setB, setSetB] = useState("3, 4, 5, 6");


    // --- Methods for Logic ---

    const getVariables = (expr) => {
        const matches = expr.match(/[A-Za-z]+/g);
        if (!matches) return [];
        // Filter out keywords like 'and', 'or', 'not', 'xor', 'true', 'false'
        const keywords = ['and', 'or', 'not', 'xor', 'true', 'false', 'xor', 'implies', 'iff'];
        return [...new Set(matches.filter(m => !keywords.includes(m.toLowerCase())))].sort();
    };

    const generateTruthTable = (expr) => {
        try {
            const vars = getVariables(expr);
            if (vars.length === 0) return null;

            const rows = 1 << vars.length; // 2^n rows
            const table = [];

            for (let i = 0; i < rows; i++) {
                const row = {};
                // Create boolean values for each variable
                vars.forEach((v, index) => {
                    // Start from high bit for first variable to match standard truth table generic order
                    // e.g. for A, B: 00, 01, 10, 11
                    row[v] = Boolean((i >> (vars.length - 1 - index)) & 1);
                });

                // Evaluate sub-expression
                const scope = { ...row };

                let result;
                try {
                    result = evaluate(expr, scope);
                } catch {
                    result = "Error";
                }

                table.push({ ...row, result });
            }
            return { vars, table };
        } catch {
            return null;
        }
    };

    const truthTable = useMemo(() => generateTruthTable(logicExpression), [logicExpression]);

    const equivalenceCheck = useMemo(() => {
        const table1 = generateTruthTable(compareExpr1);
        const table2 = generateTruthTable(compareExpr2);

        if (!table1 || !table2) return { areEquivalent: false, error: "Invalid Expressions" };

        const vars1 = table1.vars;
        const vars2 = table2.vars;

        // Basic check: Are variables same?
        const allVars = [...new Set([...vars1, ...vars2])].sort();

        // If variable sets are different, we technically can compare, but need to expand the smaller table.
        // For simplicity, let's assume valid comparison only if mostly overlapping or we re-evaluate both with combined vars.

        // Let's re-eval both with ALL vars to be safe
        const rows = 1 << allVars.length;
        let equivalent = true;
        let counterExample = null;

        for (let i = 0; i < rows; i++) {
            const scope = {};
            allVars.forEach((v, index) => {
                scope[v] = Boolean((i >> (allVars.length - 1 - index)) & 1);
            });

            let res1, res2;
            try { res1 = evaluate(compareExpr1, scope); } catch { res1 = 'err'; }
            try { res2 = evaluate(compareExpr2, scope); } catch { res2 = 'err'; }

            if (res1 !== res2) {
                equivalent = false;
                counterExample = scope;
                break;
            }
        }
        return { areEquivalent: equivalent, vars: allVars, counterExample };
    }, [compareExpr1, compareExpr2]);


    // --- Methods for Sets ---

    const parseSet = (str) => {
        if (!str.trim()) return new Set();
        return new Set(str.split(',').map(s => s.trim()).filter(s => s !== ''));
    };

    const setCalculations = useMemo(() => {
        const sA = parseSet(setA);
        const sB = parseSet(setB);

        const unionAB = new Set([...sA, ...sB]);
        const intersectionAB = new Set([...sA].filter(x => sB.has(x)));
        const differenceAB = new Set([...sA].filter(x => !sB.has(x))); // A - B
        const differenceBA = new Set([...sB].filter(x => !sA.has(x))); // B - A
        const symDiffAB = new Set([...differenceAB, ...differenceBA]); // A delta B

        return {
            A: Array.from(sA).sort().join(', '),
            B: Array.from(sB).sort().join(', '),
            union: Array.from(unionAB).sort().join(', '),
            intersection: Array.from(intersectionAB).sort().join(', '),
            diffAB: Array.from(differenceAB).sort().join(', '),
            diffBA: Array.from(differenceBA).sort().join(', '),
            symDiff: Array.from(symDiffAB).sort().join(', '),
            cardA: sA.size,
            cardB: sB.size,
            cardUnion: unionAB.size,
            cardInter: intersectionAB.size
        };
    }, [setA, setB]);


    // --- Venn Diagram Visualizer (SVG) ---
    const VennDiagram2Sets = ({ setA, setB }) => {
        // Simple 2-set Venn
        // Circle A: cx=100, cy=150, r=80
        // Circle B: cx=200, cy=150, r=80
        const sA = parseSet(setA);
        const sB = parseSet(setB);

        // We can't easily dynamically place text inside SVG overlaps without complex logic.
        // But we can just show the circles representation.

        // Let's settle for a static representation that highlights areas?
        // Or simple text placement for common areas.

        const intersection = [...sA].filter(x => sB.has(x));
        const onlyA = [...sA].filter(x => !sB.has(x));
        const onlyB = [...sB].filter(x => !sA.has(x));

        return (
            <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
                <circle cx="100" cy="150" r="90" fill="rgba(59, 130, 246, 0.5)" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="200" cy="150" r="90" fill="rgba(239, 68, 68, 0.5)" stroke="#ef4444" strokeWidth="2" />

                <text x="50" y="50" className="fill-foreground font-bold">Set A</text>
                <text x="220" y="50" className="fill-foreground font-bold">Set B</text>

                {/* Only A Content */}
                <foreignObject x="30" y="110" width="60" height="80">
                    <div className="text-xs text-center break-words">{onlyA.join(', ')}</div>
                </foreignObject>

                {/* Intersection Content */}
                <foreignObject x="120" y="110" width="60" height="80">
                    <div className="text-xs text-center break-words font-semibold">{intersection.join(', ')}</div>
                </foreignObject>

                {/* Only B Content */}
                <foreignObject x="210" y="110" width="60" height="80">
                    <div className="text-xs text-center break-words">{onlyB.join(', ')}</div>
                </foreignObject>
            </svg>
        );
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Binary className="w-8 h-8 text-indigo-600" />
                        {t('lab.tools.logicSetTheory.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('lab.tools.logicSetTheory.description')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="logic" className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4" /> {t('lab.tools.logicSetTheory.logic')}
                    </TabsTrigger>
                    <TabsTrigger value="sets" className="flex items-center gap-2">
                        <BoxSelect className="w-4 h-4" /> {t('lab.tools.logicSetTheory.sets')}
                    </TabsTrigger>
                </TabsList>

                {/* --- Logic Tab --- */}
                <TabsContent value="logic" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Truth Table Generator */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('lab.tools.logicSetTheory.truthTableGenerator')}</CardTitle>
                                <CardDescription>{t('lab.tools.logicSetTheory.truthTableDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>{t('lab.tools.logicSetTheory.expression')}</Label>
                                    <Input
                                        value={logicExpression}
                                        onChange={(e) => setLogicExpression(e.target.value)}
                                        placeholder="not (A and B)"
                                        className="font-mono"
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Examples: <code>A and B</code>, <code>not A or B</code>, <code>A xor B</code>
                                    </div>
                                </div>

                                {truthTable ? (
                                    <ScrollArea className="h-[300px] border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    {truthTable.vars.map(v => (
                                                        <TableHead key={v} className="text-center w-[50px]">{v}</TableHead>
                                                    ))}
                                                    <TableHead className="text-center font-bold bg-muted/50">{t('lab.tools.logicSetTheory.result')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {truthTable.table.map((row, idx) => (
                                                    <TableRow key={idx}>
                                                        {truthTable.vars.map(v => (
                                                            <TableCell key={v} className="text-center">
                                                                <span className={row[v] ? "text-green-600 font-bold" : "text-red-400"}>
                                                                    {row[v] ? "T" : "F"}
                                                                </span>
                                                            </TableCell>
                                                        ))}
                                                        <TableCell className="text-center font-bold bg-muted/20">
                                                            <span className={row.result === true ? "text-green-600" : row.result === false ? "text-red-600" : "text-yellow-600"}>
                                                                {row.result === true ? "TRUE" : row.result === false ? "FALSE" : "ERR"}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                ) : (
                                    <div className="p-4 text-center text-muted-foreground border rounded-md border-dashed">
                                        {t('lab.tools.logicSetTheory.invalidExpression')}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Equivalence Checker */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('lab.tools.logicSetTheory.equivalenceChecker')}</CardTitle>
                                <CardDescription>{t('lab.tools.logicSetTheory.equivalenceDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <Label>{t('lab.tools.logicSetTheory.expression1')}</Label>
                                        <Input
                                            value={compareExpr1}
                                            onChange={(e) => setCompareExpr1(e.target.value)}
                                            className="font-mono bg-indigo-50/50 dark:bg-indigo-950/20"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <span className="text-2xl font-bold text-muted-foreground">≡ ?</span>
                                    </div>
                                    <div>
                                        <Label>{t('lab.tools.logicSetTheory.expression2')}</Label>
                                        <Input
                                            value={compareExpr2}
                                            onChange={(e) => setCompareExpr2(e.target.value)}
                                            className="font-mono bg-purple-50/50 dark:bg-purple-950/20"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col items-center gap-2">
                                <div className={`px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2 ${equivalenceCheck.areEquivalent
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    }`}>
                                    {equivalenceCheck.areEquivalent ? t('lab.tools.logicSetTheory.equivalent') : t('lab.tools.logicSetTheory.notEquivalent')}
                                </div>
                                {!equivalenceCheck.areEquivalent && equivalenceCheck.counterExample && (
                                    <div className="text-sm text-center text-muted-foreground bg-muted p-2 rounded-md w-full">
                                        <strong>{t('lab.tools.logicSetTheory.counterExample')}:</strong><br />
                                        {Object.entries(equivalenceCheck.counterExample).map(([k, v]) => (
                                            <span key={k} className="mx-2">{k}: {String(v)}</span>
                                        ))}
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- Sets Tab --- */}
                <TabsContent value="sets" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Set Inputs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('lab.tools.logicSetTheory.setDefinitions')}</CardTitle>
                                <CardDescription>{t('lab.tools.logicSetTheory.setDefinitionsDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Set $A$</Label>
                                    <Input value={setA} onChange={e => setSetA(e.target.value)} placeholder="e.g. 1, 2, 3" />
                                    <p className="text-xs text-muted-foreground mt-1">Size: {setCalculations.cardA}</p>
                                </div>
                                <div>
                                    <Label>Set $B$</Label>
                                    <Input value={setB} onChange={e => setSetB(e.target.value)} placeholder="e.g. 3, 4, 5" />
                                    <p className="text-xs text-muted-foreground mt-1">Size: {setCalculations.cardB}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Set Operations Results */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('lab.tools.logicSetTheory.operations')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px]">
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-bold">Union ($A \cup B$)</TableCell>
                                                <TableCell className="font-mono text-blue-600">
                                                    {`{ ${setCalculations.union} }`}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">Intersection ($A \cap B$)</TableCell>
                                                <TableCell className="font-mono text-indigo-600">
                                                    {`{ ${setCalculations.intersection} }`}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">Difference ($A - B$)</TableCell>
                                                <TableCell className="font-mono">
                                                    {`{ ${setCalculations.diffAB} }`}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">Difference ($B - A$)</TableCell>
                                                <TableCell className="font-mono">
                                                    {`{ ${setCalculations.diffBA} }`}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-bold">Sym. Diff ($A \Delta B$)</TableCell>
                                                <TableCell className="font-mono">
                                                    {`{ ${setCalculations.symDiff} }`}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Venn Diagram */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Circle className="w-5 h-5" /> {t('lab.tools.logicSetTheory.vennDiagram')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <VennDiagram2Sets setA={setA} setB={setB} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default LogicSetTheory;
