import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Atom, Hexagon, FlaskConical, Eraser, Move, Plus, Search } from 'lucide-react';

const ELEMENTS = {
    C: { name: 'Carbon', color: '#333333', radius: 20, valence: 4 },
    H: { name: 'Hydrogen', color: '#EEEEEE', radius: 12, valence: 1, stroke: '#333' },
    O: { name: 'Oxygen', color: '#F00000', radius: 18, valence: 2 },
    N: { name: 'Nitrogen', color: '#0000FF', radius: 18, valence: 3 },
    Cl: { name: 'Chlorine', color: '#00FF00', radius: 18, valence: 1 },
};

const COMMON_MOLECULES = [
    { name: 'Water', formula: 'H₂O', atoms: [{ id: 1, el: 'O', x: 150, y: 150 }, { id: 2, el: 'H', x: 100, y: 180 }, { id: 3, el: 'H', x: 200, y: 180 }], bonds: [[1, 2, 1], [1, 3, 1]] },
    { name: 'Carbon Dioxide', formula: 'CO₂', atoms: [{ id: 1, el: 'C', x: 150, y: 150 }, { id: 2, el: 'O', x: 80, y: 150 }, { id: 3, el: 'O', x: 220, y: 150 }], bonds: [[1, 2, 2], [1, 3, 2]] },
    { name: 'Methane', formula: 'CH₄', atoms: [{ id: 1, el: 'C', x: 150, y: 150 }, { id: 2, el: 'H', x: 150, y: 80 }, { id: 3, el: 'H', x: 220, y: 150 }, { id: 4, el: 'H', x: 150, y: 220 }, { id: 5, el: 'H', x: 80, y: 150 }], bonds: [[1, 2, 1], [1, 3, 1], [1, 4, 1], [1, 5, 1]] },
];

const FUNCTIONAL_GROUPS = [
    { name: 'Alkane', formula: 'C-C', desc: 'Single bonds only', family: 'Hydrocarbon' },
    { name: 'Alkene', formula: 'C=C', desc: 'Double bond', family: 'Hydrocarbon' },
    { name: 'Alkyne', formula: 'C≡C', desc: 'Triple bond', family: 'Hydrocarbon' },
    { name: 'Alcohol', formula: '-OH', desc: 'Hydroxyl group', family: 'Oxygenated' },
    { name: 'Aldehyde', formula: '-CHO', desc: 'Carbonyl group at end', family: 'Oxygenated' },
    { name: 'Ketone', formula: '-CO-', desc: 'Carbonyl group in middle', family: 'Oxygenated' },
    { name: 'Carboxylic Acid', formula: '-COOH', desc: 'Carboxyl group', family: 'Acid' },
    { name: 'Ester', formula: '-COO-', desc: 'Ester linkage', family: 'Oxygenated' },
    { name: 'Amine', formula: '-NH₂', desc: 'Amino group', family: 'Nitrogenated' },
];

const MoleculeBondingTools = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("builder");

    // --- Builder State ---
    const [atoms, setAtoms] = useState([]);
    const [bonds, setBonds] = useState([]); // Array of {source: atomId, target: atomId, type: 1|2|3}
    const [selectedElement, setSelectedElement] = useState('C');
    const [mode, setMode] = useState('atom'); // 'atom', 'bond', 'move', 'delete'
    const [selectedAtom, setSelectedAtom] = useState(null);
    const canvasRef = useRef(null);
    const [nextId, setNextId] = useState(1);

    // --- Helpers ---
    const getAtomAtPos = (x, y) => {
        return atoms.find(atom => {
            const r = ELEMENTS[atom.el].radius + 5;
            return Math.abs(atom.x - x) < r && Math.abs(atom.y - y) < r;
        });
    };

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (mode === 'atom') {
            const existing = getAtomAtPos(x, y);
            if (!existing) {
                setAtoms([...atoms, { id: nextId, el: selectedElement, x, y }]);
                setNextId(nextId + 1);
            }
        } else if (mode === 'delete') {
            const target = getAtomAtPos(x, y);
            if (target) {
                // Remove atom and connected bonds
                setAtoms(atoms.filter(a => a.id !== target.id));
                setBonds(bonds.filter(b => b.source !== target.id && b.target !== target.id));
            }
        } else if (mode === 'bond') {
            const target = getAtomAtPos(x, y);
            if (target) {
                if (selectedAtom && selectedAtom.id !== target.id) {
                    // Check if bond exists
                    const exists = bonds.find(b =>
                        (b.source === selectedAtom.id && b.target === target.id) ||
                        (b.source === target.id && b.target === selectedAtom.id)
                    );

                    if (exists) {
                        // Cycle bond type: 1 -> 2 -> 3 -> delete? -> 1
                        const newType = exists.type >= 3 ? 1 : exists.type + 1;
                        setBonds(bonds.map(b => b === exists ? { ...b, type: newType } : b));
                    } else {
                        setBonds([...bonds, { source: selectedAtom.id, target: target.id, type: 1 }]);
                    }
                    setSelectedAtom(null);
                } else {
                    setSelectedAtom(target);
                }
            } else {
                setSelectedAtom(null);
            }
        }
    };

    const loadMolecule = (mol) => {
        setAtoms([...mol.atoms]);
        // map bonds array to object structure
        const formattedBonds = mol.bonds.map(b => ({ source: b[0], target: b[1], type: b[2] }));
        setBonds(formattedBonds);
        // Find max id to allow adding more
        const maxId = mol.atoms.reduce((max, a) => Math.max(max, a.id), 0);
        setNextId(maxId + 1);
    };

    const clearCanvas = () => {
        setAtoms([]);
        setBonds([]);
        setNextId(1);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Atom className="w-8 h-8 text-green-600" />
                        {t('lab.tools.moleculeBondingTools.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('lab.tools.moleculeBondingTools.description')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-[600px]">
                    <TabsTrigger value="builder" className="flex items-center gap-2">
                        <Hexagon className="w-4 h-4" /> {t('lab.tools.moleculeBondingTools.builder')}
                    </TabsTrigger>
                    <TabsTrigger value="bonding" className="flex items-center gap-2">
                        <Atom className="w-4 h-4" /> {t('lab.tools.moleculeBondingTools.funcGroups')}
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4" /> {t('lab.tools.moleculeBondingTools.commonMols')}
                    </TabsTrigger>
                </TabsList>

                {/* --- Builder Tab --- */}
                <TabsContent value="builder" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                        {/* Sidebar Tools */}
                        <Card className="col-span-1 border-r">
                            <CardHeader>
                                <CardTitle className="text-lg">Toolkit</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Mode Selection */}
                                <div className="space-y-2">
                                    <Label>Mode</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant={mode === 'atom' ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => { setMode('atom'); setSelectedAtom(null); }}
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                        <Button
                                            variant={mode === 'bond' ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setMode('bond')}
                                        >
                                            <Move className="w-4 h-4 mr-1" /> Connect
                                        </Button>
                                        <Button
                                            variant={mode === 'delete' ? "destructive" : "outline"}
                                            size="sm"
                                            onClick={() => { setMode('delete'); setSelectedAtom(null); }}
                                        >
                                            <Eraser className="w-4 h-4 mr-1" /> Delete
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={clearCanvas}>
                                            Clear
                                        </Button>
                                    </div>
                                </div>

                                {/* Element Selection */}
                                <div className="space-y-2">
                                    <Label>Element</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.entries(ELEMENTS).map(([symbol, info]) => (
                                            <button
                                                key={symbol}
                                                onClick={() => setSelectedElement(symbol)}
                                                className={`
                                                    h-10 w-full rounded-md font-bold border flex items-center justify-center transition-all
                                                    ${selectedElement === symbol ? 'ring-2 ring-primary ring-offset-2' : 'hover:bg-muted'}
                                                `}
                                                style={{
                                                    backgroundColor: info.color,
                                                    color: symbol === 'H' ? 'black' : 'white',
                                                    borderColor: info.stroke || 'transparent'
                                                }}
                                            >
                                                {symbol}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Selected: <span className="font-semibold">{ELEMENTS[selectedElement].name}</span>
                                    </p>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-xs">
                                    <h4 className="font-bold mb-1">Instructions</h4>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li><strong>Add:</strong> Click on canvas to place atom.</li>
                                        <li><strong>Connect:</strong> Click two atoms to bond. Click again to change bond type (Single/Double/Triple).</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Canvas Area */}
                        <Card className="col-span-1 lg:col-span-3 overflow-hidden relative bg-white dark:bg-slate-950">
                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                <Badge variant="secondary" className="opacity-80 pointer-events-none">
                                    {atoms.length} Atoms
                                </Badge>
                                <Badge variant="secondary" className="opacity-80 pointer-events-none">
                                    {bonds.length} Bonds
                                </Badge>
                            </div>
                            <svg
                                ref={canvasRef}
                                className="w-full h-full cursor-crosshair touch-none"
                                onClick={handleCanvasClick}
                            >
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />

                                {/* Bonds */}
                                {bonds.map((bond, idx) => {
                                    const source = atoms.find(a => a.id === bond.source);
                                    const target = atoms.find(a => a.id === bond.target);
                                    if (!source || !target) return null;

                                    return (
                                        <g key={`bond-${idx}`}>
                                            {/* Bond Line(s) */}
                                            {bond.type === 1 && (
                                                <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="gray" strokeWidth="4" />
                                            )}
                                            {bond.type === 2 && (
                                                <g>
                                                    <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="gray" strokeWidth="8" />
                                                    <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="white" strokeWidth="2" />
                                                </g>
                                            )}
                                            {bond.type === 3 && (
                                                <g>
                                                    <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="gray" strokeWidth="10" />
                                                    <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="white" strokeWidth="4" />
                                                    <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="gray" strokeWidth="2" />
                                                </g>
                                            )}
                                        </g>
                                    );
                                })}

                                {/* Atoms */}
                                {atoms.map((atom) => {
                                    const info = ELEMENTS[atom.el] || ELEMENTS.C;
                                    const isSelected = selectedAtom?.id === atom.id;

                                    return (
                                        <g key={atom.id} className="cursor-pointer">
                                            <circle
                                                cx={atom.x}
                                                cy={atom.y}
                                                r={info.radius}
                                                fill={info.color}
                                                stroke={isSelected ? '#3b82f6' : (info.stroke || 'none')}
                                                strokeWidth={isSelected ? 3 : 1}
                                            />
                                            <text
                                                x={atom.x}
                                                y={atom.y}
                                                dy="0.35em"
                                                textAnchor="middle"
                                                fill={atom.el === 'H' ? 'black' : 'white'}
                                                fontSize="12"
                                                fontWeight="bold"
                                                pointerEvents="none"
                                            >
                                                {atom.el}
                                            </text>
                                            {/* Valence Dots (Lewis Style simplified) - Optional visual flair */}
                                        </g>
                                    );
                                })}
                            </svg>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- Functional Groups & Organic Chem --- */}
                <TabsContent value="bonding" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FUNCTIONAL_GROUPS.map((group, idx) => (
                            <Card key={idx} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{group.name}</CardTitle>
                                        <Badge variant="outline">{group.family}</Badge>
                                    </div>
                                    <CardDescription>{group.desc}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-muted p-4 rounded-md flex items-center justify-center min-h-[100px]">
                                        <span className="text-2xl font-bold font-mono tracking-wider">{group.formula}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* --- Common Molecules (Analysis) --- */}
                <TabsContent value="analysis" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Common Molecules Library</CardTitle>
                            <CardDescription>Select a molecule to view its structure and load it into the builder.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {COMMON_MOLECULES.map((mol, idx) => (
                                    <Button
                                        key={idx}
                                        variant="outline"
                                        className="h-auto py-4 flex flex-col gap-2 items-center"
                                        onClick={() => {
                                            loadMolecule(mol);
                                            setActiveTab("builder");
                                        }}
                                    >
                                        <span className="font-bold text-lg">{mol.name}</span>
                                        <Badge variant="secondary" className="font-mono">{mol.formula}</Badge>
                                        <span className="text-xs text-muted-foreground">Click to Load</span>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MoleculeBondingTools;
