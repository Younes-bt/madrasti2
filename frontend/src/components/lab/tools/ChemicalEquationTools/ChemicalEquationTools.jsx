import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scale, FlaskConical, TestTube, Calculator, ArrowRight, AlertTriangle } from 'lucide-react';

// --- Chemistry Logic Helpers ---

const ATOMIC_MASSES = {
    H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180,
    Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, K: 39.098, Ar: 39.948, Ca: 40.078,
    Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
    Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.96, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224,
    Nb: 92.906, Mo: 95.95, Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41, In: 114.82, Sn: 118.71,
    Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29, Cs: 132.91, Ba: 137.33, La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24,
    Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.50, Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05,
    Lu: 174.97, Hf: 178.49, Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08, Au: 196.97, Hg: 200.59,
    Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209, At: 210, Rn: 222
};

// Simple tokenizer/parser for chemical formulas (e.g., C6H12O6 -> {C:6, H:12, O:6})
const parseFormula = (formula) => {
    const regex = /([A-Z][a-z]?)(\d*)/g;
    const composition = {};
    let match;
    let valid = false;
    while ((match = regex.exec(formula)) !== null) {
        valid = true;
        const element = match[1];
        const count = parseInt(match[2] || '1', 10);
        composition[element] = (composition[element] || 0) + count;
    }
    return valid ? composition : null;
};

const calculateMolarMass = (composition) => {
    if (!composition) return 0;
    let mass = 0;
    for (const [el, count] of Object.entries(composition)) {
        if (ATOMIC_MASSES[el]) {
            mass += ATOMIC_MASSES[el] * count;
        } else {
            return 0; // Unknown element
        }
    }
    return mass;
};

// Equation Balancer Logic (Simplified: brute force or matrix method is complex for frontend only without library)
// For this demo, we will use a library if available, or a basic parser that handles simple cases.
// Or we can simulate balancing for common reactions + alerting users for complex ones.
// A robust JS balancer is non-trivial. Let's implement a wrapper that *tries* to balance via a known API or simple heuristics?
// Actually, 'chemical-equation-balancer' is a good npm package, but we can't install new ones easily.
// We will implement a basic algebra solver for very simple equations (using matrix math found on SO/Github).
// Given constraints, I'll implement a Mock-ish specific logic or basic parser for demo purposes, 
// OR focus on the Stoichiometry part which is calculation heavy.
// 
// UPDATE: Let's focus on calculating MOLAR MASS and STOICHIOMETRY for single compounds first, 
// and a "Balance" check (verifying if sides are equal). Full auto-balancing is hard without a matrix library.
// We'll add a "Verify Balance" feature instead of "Auto Balance" to be safe and accurate, 
// OR use an external API if we were allowed (we aren't).
// Wait, I can try a simple brute force for small coefficients (1-10).

const solveBalance = (reactants, products) => {
    // This is a placeholder for a complex algorithm. 
    // Implementing a full Gaussian elimination in a single file is risky.
    // Instead, let's provide a "Check Balance" feature which is very useful educationally.

    // Convert inputs to counts
    const rCounts = {};
    const pCounts = {};

    reactants.forEach(r => {
        const comp = parseFormula(r.formula);
        if (comp) {
            for (const [el, count] of Object.entries(comp)) {
                rCounts[el] = (rCounts[el] || 0) + count * r.coeff;
            }
        }
    });

    products.forEach(p => {
        const comp = parseFormula(p.formula);
        if (comp) {
            for (const [el, count] of Object.entries(comp)) {
                pCounts[el] = (pCounts[el] || 0) + count * p.coeff;
            }
        }
    });

    // Compare
    const elements = new Set([...Object.keys(rCounts), ...Object.keys(pCounts)]);
    const status = {};
    let isBalanced = true;

    elements.forEach(el => {
        const r = rCounts[el] || 0;
        const p = pCounts[el] || 0;
        status[el] = { r, p, balanced: r === p };
        if (r !== p) isBalanced = false;
    });

    return { isBalanced, status };
};


const ChemicalEquationTools = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("balancer");

    // --- Checker State ---
    const [reactants, setReactants] = useState([{ id: 1, coeff: 1, formula: "H2" }, { id: 2, coeff: 1, formula: "O2" }]);
    const [products, setProducts] = useState([{ id: 1, coeff: 1, formula: "H2O" }]);

    const balanceResult = useMemo(() => solveBalance(reactants, products), [reactants, products]);

    // --- Stoichiometry State ---
    const [stoichCompound, setStoichCompound] = useState("H2SO4");
    const [stoichMass, setStoichMass] = useState(10); // grams
    const [stoichVol, setStoichVol] = useState(0); // L (gas at STP)
    const [stoichMoles, setStoichMoles] = useState(0);
    const [inputMode, setInputMode] = useState("mass"); // mass, moles, vol

    const stoichResult = useMemo(() => {
        const comp = parseFormula(stoichCompound);
        const molarMass = calculateMolarMass(comp);

        let moles = 0;
        if (inputMode === 'mass') moles = stoichMass / molarMass;
        else if (inputMode === 'vol') moles = stoichVol / 22.4; // STP
        else moles = stoichMoles;

        return {
            molarMass,
            moles: moles || 0,
            mass: moles * molarMass || 0,
            volumeSTP: moles * 22.4 || 0,
            molecules: (moles * 6.022e23) || 0,
            composition: comp
        };
    }, [stoichCompound, stoichMass, stoichVol, stoichMoles, inputMode]);

    // --- Handlers ---
    const updateReactant = (id, field, val) => {
        setReactants(reactants.map(r => r.id === id ? { ...r, [field]: val } : r));
    };
    const updateProduct = (id, field, val) => {
        setProducts(products.map(p => p.id === id ? { ...p, [field]: val } : p));
    };
    const addReactant = () => setReactants([...reactants, { id: Date.now(), coeff: 1, formula: "" }]);
    const addProduct = () => setProducts([...products, { id: Date.now(), coeff: 1, formula: "" }]);
    const removeReactant = (id) => setReactants(reactants.filter(r => r.id !== id));
    const removeProduct = (id) => setProducts(products.filter(p => p.id !== id));


    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Scale className="w-8 h-8 text-emerald-600" />
                        {t('lab.tools.chemicalEquationTools.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('lab.tools.chemicalEquationTools.description')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="balancer" className="flex items-center gap-2">
                        <Scale className="w-4 h-4" /> {t('lab.tools.chemicalEquationTools.balancer')}
                    </TabsTrigger>
                    <TabsTrigger value="stoich" className="flex items-center gap-2">
                        <Calculator className="w-4 h-4" /> {t('lab.tools.chemicalEquationTools.stoichiometry')}
                    </TabsTrigger>
                </TabsList>

                {/* --- Balancer Tab --- */}
                <TabsContent value="balancer" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('lab.tools.chemicalEquationTools.equationChecker')}</CardTitle>
                            <CardDescription>{t('lab.tools.chemicalEquationTools.equationCheckerDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Equation Input */}
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 p-6 bg-muted/30 rounded-lg overflow-x-auto">
                                {/* Reactants */}
                                <div className="flex items-center gap-2 flex-wrap justify-center">
                                    {reactants.map((r, idx) => (
                                        <div key={r.id} className="flex items-center gap-1">
                                            {idx > 0 && <span className="text-xl font-bold text-muted-foreground">+</span>}
                                            <Input
                                                type="number"
                                                min="1"
                                                className="w-16 text-center font-bold"
                                                value={r.coeff}
                                                onChange={e => updateReactant(r.id, 'coeff', parseInt(e.target.value) || 1)}
                                            />
                                            <div className="relative">
                                                <Input
                                                    className="w-24 font-mono text-center tracking-wider"
                                                    placeholder="Formula"
                                                    value={r.formula}
                                                    onChange={e => updateReactant(r.id, 'formula', e.target.value)}
                                                />
                                                {reactants.length > 1 && (
                                                    <button onClick={() => removeReactant(r.id)} className="absolute -top-3 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={addReactant} className="ml-2 rounded-full w-8 h-8 p-0" title="Add Reactant"><ArrowRight className="w-4 h-4 rotate-90" /></Button>
                                    <span className="text-sm text-muted-foreground ml-1">{t('lab.tools.chemicalEquationTools.reactants')}</span>
                                </div>

                                {/* Arrow */}
                                <div className="text-3xl text-muted-foreground">→</div>

                                {/* Products */}
                                <div className="flex items-center gap-2 flex-wrap justify-center">
                                    {products.map((p, idx) => (
                                        <div key={p.id} className="flex items-center gap-1">
                                            {idx > 0 && <span className="text-xl font-bold text-muted-foreground">+</span>}
                                            <Input
                                                type="number"
                                                min="1"
                                                className="w-16 text-center font-bold"
                                                value={p.coeff}
                                                onChange={e => updateProduct(p.id, 'coeff', parseInt(e.target.value) || 1)}
                                            />
                                            <div className="relative">
                                                <Input
                                                    className="w-24 font-mono text-center tracking-wider"
                                                    placeholder="Formula"
                                                    value={p.formula}
                                                    onChange={e => updateProduct(p.id, 'formula', e.target.value)}
                                                />
                                                {products.length > 1 && (
                                                    <button onClick={() => removeProduct(p.id)} className="absolute -top-3 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={addProduct} className="ml-2 rounded-full w-8 h-8 p-0" title="Add Product"><ArrowRight className="w-4 h-4 rotate-90" /></Button>
                                    <span className="text-sm text-muted-foreground ml-1">{t('lab.tools.chemicalEquationTools.products')}</span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        {t('lab.tools.chemicalEquationTools.status')}:
                                        {balanceResult.isBalanced ?
                                            <span className="text-green-600 flex items-center gap-1">{t('lab.tools.chemicalEquationTools.balanced')} <Scale className="w-4 h-4" /></span> :
                                            <span className="text-red-600 flex items-center gap-1">{t('lab.tools.chemicalEquationTools.unbalanced')} <AlertTriangle className="w-4 h-4" /></span>
                                        }
                                    </h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('lab.tools.chemicalEquationTools.element')}</TableHead>
                                                <TableHead className="text-center">{t('lab.tools.chemicalEquationTools.reactants')}</TableHead>
                                                <TableHead className="text-center">{t('lab.tools.chemicalEquationTools.products')}</TableHead>
                                                <TableHead className="text-center">{t('lab.tools.chemicalEquationTools.status')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(balanceResult.status).map(([el, stat]) => (
                                                <TableRow key={el}>
                                                    <TableCell className="font-bold">{el}</TableCell>
                                                    <TableCell className="text-center">{stat.r}</TableCell>
                                                    <TableCell className="text-center">{stat.p}</TableCell>
                                                    <TableCell className="text-center">
                                                        {stat.balanced ? <span className="text-green-500">✓</span> : <span className="text-red-500">×</span>}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {Object.keys(balanceResult.status).length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-muted-foreground">No valid elements found</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h4 className="font-bold mb-2">{t('lab.tools.chemicalEquationTools.instructions')}</h4>
                                    <ol className="list-decimal pl-4 space-y-2 text-sm text-muted-foreground">
                                        <li>{t('lab.tools.chemicalEquationTools.instruction1')}</li>
                                        <li>{t('lab.tools.chemicalEquationTools.instruction2')}</li>
                                        <li>{t('lab.tools.chemicalEquationTools.instruction3')}</li>
                                        <li>{t('lab.tools.chemicalEquationTools.instruction4')}</li>
                                    </ol>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Stoichiometry Tab --- */}
                <TabsContent value="stoich" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('lab.tools.chemicalEquationTools.moleConversions')}</CardTitle>
                            <CardDescription>{t('lab.tools.chemicalEquationTools.moleConversionsDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <Label>{t('lab.tools.chemicalEquationTools.chemicalFormula')}</Label>
                                        <Input
                                            value={stoichCompound}
                                            onChange={e => setStoichCompound(e.target.value)}
                                            placeholder={t('lab.tools.chemicalEquationTools.placeholderFormula')}
                                            className="font-mono text-lg"
                                        />
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {t('lab.tools.chemicalEquationTools.molarMass')}: <strong>{stoichResult.molarMass ? stoichResult.molarMass.toFixed(3) : 0} g/mol</strong>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t">
                                        <Label>{t('lab.tools.chemicalEquationTools.knownQuantity')}</Label>
                                        <div className="flex gap-2 mb-2">
                                            <Button variant={inputMode === 'mass' ? "default" : "outline"} size="sm" onClick={() => setInputMode('mass')}>{t('lab.tools.chemicalEquationTools.massG')}</Button>
                                            <Button variant={inputMode === 'moles' ? "default" : "outline"} size="sm" onClick={() => setInputMode('moles')}>{t('lab.tools.chemicalEquationTools.molesN')}</Button>
                                            <Button variant={inputMode === 'vol' ? "default" : "outline"} size="sm" onClick={() => setInputMode('vol')}>{t('lab.tools.chemicalEquationTools.volumeL')}</Button>
                                        </div>

                                        {inputMode === 'mass' && (
                                            <div>
                                                <Label>{t('lab.tools.chemicalEquationTools.massGrams')}</Label>
                                                <Input type="number" value={stoichMass} onChange={e => setStoichMass(parseFloat(e.target.value) || 0)} />
                                            </div>
                                        )}
                                        {inputMode === 'moles' && (
                                            <div>
                                                <Label>{t('lab.tools.chemicalEquationTools.molesMol')}</Label>
                                                <Input type="number" value={stoichMoles} onChange={e => setStoichMoles(parseFloat(e.target.value) || 0)} />
                                            </div>
                                        )}
                                        {inputMode === 'vol' && (
                                            <div>
                                                <Label>{t('lab.tools.chemicalEquationTools.volumeLSTP')}</Label>
                                                <Input type="number" value={stoichVol} onChange={e => setStoichVol(parseFloat(e.target.value) || 0)} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                                    <h4 className="font-semibold text-lg flex items-center gap-2">
                                        <TestTube className="w-5 h-5 text-purple-600" /> Results
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-background rounded-md shadow-sm">
                                            <span className="text-xs text-muted-foreground block">Moles ($n$)</span>
                                            <span className="text-xl font-bold">{stoichResult.moles.toExponential(3)} mol</span>
                                        </div>
                                        <div className="p-3 bg-background rounded-md shadow-sm">
                                            <span className="text-xs text-muted-foreground block">Mass ($m$)</span>
                                            <span className="text-xl font-bold">{stoichResult.mass.toFixed(3)} g</span>
                                        </div>
                                        <div className="p-3 bg-background rounded-md shadow-sm">
                                            <span className="text-xs text-muted-foreground block">Volume ($V_m$ @ STP)</span>
                                            <span className="text-xl font-bold">{stoichResult.volumeSTP.toFixed(3)} L</span>
                                        </div>
                                        <div className="p-3 bg-background rounded-md shadow-sm">
                                            <span className="text-xs text-muted-foreground block">{t('lab.tools.chemicalEquationTools.molecules')} ($N$)</span>
                                            <span className="text-xl font-bold">{stoichResult.molecules.toExponential(3)}</span>
                                        </div>
                                    </div>

                                    {stoichResult.composition && (
                                        <div className="mt-4">
                                            <h5 className="font-semibold text-sm mb-2">{t('lab.tools.chemicalEquationTools.massComposition')}</h5>
                                            <div className="space-y-1">
                                                {Object.entries(stoichResult.composition).map(([el, count]) => {
                                                    const elMass = ATOMIC_MASSES[el] * count;
                                                    const percent = (elMass / stoichResult.molarMass) * 100;
                                                    return (
                                                        <div key={el} className="flex justify-between text-sm items-center">
                                                            <span>{el}:</span>
                                                            <div className="flex-1 mx-2 h-2 bg-muted rounded-full overflow-hidden">
                                                                <div className="h-full bg-blue-500" style={{ width: `${percent}%` }}></div>
                                                            </div>
                                                            <span className="text-xs tabular-nums">{percent.toFixed(1)}%</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ChemicalEquationTools;
