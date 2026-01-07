import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card'
import { Button } from '../../../ui/button'
import { Input } from '../../../ui/input'
import { Label } from '../../../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Triangle, Circle, Square, ArrowUpRight, RotateCw, Ruler, Calculator } from 'lucide-react'

// --- Sub-components for specific calculators ---

const ShapeCalculator = () => {
    const { t } = useTranslation()
    const [shape, setShape] = useState('rectangle')
    const [params, setParams] = useState({ a: '', b: '', r: '' })
    const [result, setResult] = useState(null)

    const calculate = () => {
        let area = 0
        let perimeter = 0
        const a = parseFloat(params.a)
        const b = parseFloat(params.b)
        const r = parseFloat(params.r)

        switch (shape) {
            case 'rectangle':
                if (a && b) {
                    area = a * b
                    perimeter = 2 * (a + b)
                }
                break
            case 'square':
                if (a) {
                    area = a * a
                    perimeter = 4 * a
                }
                break
            case 'circle':
                if (r) {
                    area = Math.PI * r * r
                    perimeter = 2 * Math.PI * r
                }
                break
            case 'triangle':
                if (a && b) { // Assuming base and height for area, primitive for now
                    area = 0.5 * a * b
                    // Perimeter needs more inputs, keeping simple for demo
                }
                break
        }
        setResult({ area, perimeter })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <Label>{t('lab.tools.geometryToolkit.selectShape')}</Label>
                <Select value={shape} onValueChange={setShape}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rectangle">{t('lab.tools.geometryToolkit.rectangle')}</SelectItem>
                        <SelectItem value="square">{t('lab.tools.geometryToolkit.square')}</SelectItem>
                        <SelectItem value="circle">{t('lab.tools.geometryToolkit.circle')}</SelectItem>
                        <SelectItem value="triangle">{t('lab.tools.geometryToolkit.triangle')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {shape === 'rectangle' && (
                    <>
                        <div className="space-y-2"><Label>{t('lab.tools.geometryToolkit.length')}</Label><Input type="number" onChange={e => setParams({ ...params, a: e.target.value })} /></div>
                        <div className="space-y-2"><Label>{t('lab.tools.geometryToolkit.width')}</Label><Input type="number" onChange={e => setParams({ ...params, b: e.target.value })} /></div>
                    </>
                )}
                {shape === 'square' && (
                    <div className="space-y-2"><Label>{t('lab.tools.geometryToolkit.side')}</Label><Input type="number" onChange={e => setParams({ ...params, a: e.target.value })} /></div>
                )}
                {shape === 'circle' && (
                    <div className="space-y-2"><Label>{t('lab.tools.geometryToolkit.radius')}</Label><Input type="number" onChange={e => setParams({ ...params, r: e.target.value })} /></div>
                )}
                {shape === 'triangle' && (
                    <>
                        <div className="space-y-2"><Label>{t('lab.tools.geometryToolkit.base')}</Label><Input type="number" onChange={e => setParams({ ...params, a: e.target.value })} /></div>
                        <div className="space-y-2"><Label>{t('lab.tools.geometryToolkit.height')}</Label><Input type="number" onChange={e => setParams({ ...params, b: e.target.value })} /></div>
                    </>
                )}
            </div>

            <Button onClick={calculate} className="w-full">{t('lab.tools.geometryToolkit.calculate')}</Button>

            {result && (
                <Card className="bg-secondary/20">
                    <CardContent className="pt-6 grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">{t('lab.tools.geometryToolkit.area')}</p>
                            <p className="text-2xl font-bold">{result.area.toFixed(2)}</p>
                        </div>
                        {shape !== 'triangle' && (
                            <div>
                                <p className="text-sm text-muted-foreground">{t('lab.tools.geometryToolkit.perimeter')}</p>
                                <p className="text-2xl font-bold">{result.perimeter.toFixed(2)}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

const TriangleSolver = () => {
    const { t } = useTranslation()
    // Simple Right Triangle Solver for Pythagorean & Trig
    const [values, setValues] = useState({ a: '', b: '', c: '', angle: '' })
    const [solution, setSolution] = useState(null)

    const solve = () => {
        // Basic Pythagorean: a^2 + b^2 = c^2
        const a = parseFloat(values.a)
        const b = parseFloat(values.b)
        const c = parseFloat(values.c)

        let sol = {}

        if (values.a && values.b && !values.c) {
            sol.c = Math.sqrt(a * a + b * b)
            sol.alpha = Math.atan(a / b) * (180 / Math.PI)
            sol.beta = 90 - sol.alpha
            setSolution(sol)
        } else if (values.c && (values.a || values.b)) {
            const known = values.a || values.b
            if (known >= c) {
                alert("Leg cannot be longer than hypotenuse")
                return
            }
            const other = Math.sqrt(c * c - known * known)
            sol.other = other
            setSolution(sol)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                <div className="w-32 h-32 relative border-l-4 border-b-4 border-primary ml-4">
                    {/* Simple CSS triangle rep */}
                    <div className="absolute -left-1 bottom-0 w-[120%] h-[1px] bg-primary origin-bottom-left -rotate-[35deg] transform-gpu" />
                    <span className="absolute -left-6 top-1/2">a</span>
                    <span className="absolute bottom-[-24px] left-1/2">b</span>
                    <span className="absolute top-[30%] left-[40%] text-primary font-bold">c</span>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold mb-2">{t('lab.tools.geometryToolkit.rightTriangleCalculator')}</h4>
                    <p className="text-sm text-muted-foreground">{t('lab.tools.geometryToolkit.rightTriangleDescription')}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>{t('lab.tools.geometryToolkit.sideAAltitude')}</Label><Input type="number" onChange={e => setValues({ ...values, a: e.target.value })} /></div>
                <div className="space-y-2"><Label>{t('lab.tools.geometryToolkit.sideBBase')}</Label><Input type="number" onChange={e => setValues({ ...values, b: e.target.value })} /></div>
                <div className="space-y-2"><Label>{t('lab.tools.geometryToolkit.sideCHypotenuse')}</Label><Input type="number" onChange={e => setValues({ ...values, c: e.target.value })} /></div>
            </div>

            <Button onClick={solve} className="w-full">{t('lab.tools.geometryToolkit.calculate')}</Button>

            {solution && (
                <Card>
                    <CardContent className="pt-6">
                        <h4 className="font-bold mb-2">{t('lab.tools.geometryToolkit.results')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {solution.c && <div className="p-2 bg-secondary rounded">{t('lab.tools.geometryToolkit.hypotenuse')}: {solution.c.toFixed(2)}</div>}
                            {solution.other && <div className="p-2 bg-secondary rounded">{t('lab.tools.geometryToolkit.missingSide')}: {solution.other.toFixed(2)}</div>}
                            {solution.alpha && <div className="p-2 bg-secondary rounded">{t('lab.tools.geometryToolkit.angleAlpha')}: {solution.alpha.toFixed(1)}°</div>}
                            {solution.beta && <div className="p-2 bg-secondary rounded">{t('lab.tools.geometryToolkit.angleBeta')}: {solution.beta.toFixed(1)}°</div>}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

const VectorCalculator = () => {
    const { t } = useTranslation()
    const [v1, setV1] = useState({ x: 0, y: 0, z: 0 })
    const [v2, setV2] = useState({ x: 0, y: 0, z: 0 })
    const [results, setResults] = useState(null)

    const calculate = () => {
        const magnitude1 = Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2)
        const magnitude2 = Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2.z ** 2)

        const dotProduct = (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z)

        const crossProduct = {
            x: (v1.y * v2.z) - (v1.z * v2.y),
            y: (v1.z * v2.x) - (v1.x * v2.z),
            z: (v1.x * v2.y) - (v1.y * v2.x)
        }

        const addition = {
            x: parseFloat(v1.x) + parseFloat(v2.x),
            y: parseFloat(v1.y) + parseFloat(v2.y),
            z: parseFloat(v1.z) + parseFloat(v2.z)
        }

        setResults({ magnitude1, magnitude2, dotProduct, crossProduct, addition })
    }

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Vector 1 */}
                <div className="space-y-4">
                    <Label className="text-primary font-bold">{t('lab.tools.geometryToolkit.vectorA')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <div><Label className="text-xs">x</Label><Input type="number" value={v1.x} onChange={e => setV1({ ...v1, x: parseFloat(e.target.value) || 0 })} /></div>
                        <div><Label className="text-xs">y</Label><Input type="number" value={v1.y} onChange={e => setV1({ ...v1, y: parseFloat(e.target.value) || 0 })} /></div>
                        <div><Label className="text-xs">z</Label><Input type="number" value={v1.z} onChange={e => setV1({ ...v1, z: parseFloat(e.target.value) || 0 })} /></div>
                    </div>
                </div>

                {/* Vector 2 */}
                <div className="space-y-4">
                    <Label className="text-primary font-bold">{t('lab.tools.geometryToolkit.vectorB')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <div><Label className="text-xs">x</Label><Input type="number" value={v2.x} onChange={e => setV2({ ...v2, x: parseFloat(e.target.value) || 0 })} /></div>
                        <div><Label className="text-xs">y</Label><Input type="number" value={v2.y} onChange={e => setV2({ ...v2, y: parseFloat(e.target.value) || 0 })} /></div>
                        <div><Label className="text-xs">z</Label><Input type="number" value={v2.z} onChange={e => setV2({ ...v2, z: parseFloat(e.target.value) || 0 })} /></div>
                    </div>
                </div>
            </div>

            <Button onClick={calculate} className="w-full">{t('lab.tools.geometryToolkit.calculateOperations')}</Button>

            {results && (
                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm">{t('lab.tools.geometryToolkit.magnitudes')}</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p>||A|| = {results.magnitude1.toFixed(4)}</p>
                                <p>||B|| = {results.magnitude2.toFixed(4)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm">{t('lab.tools.geometryToolkit.scalarProduct')}</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{results.dotProduct}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm">{t('lab.tools.geometryToolkit.vectorAddition')}</CardTitle></CardHeader>
                        <CardContent>
                            <p className="font-mono">({results.addition.x}, {results.addition.y}, {results.addition.z})</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm">{t('lab.tools.geometryToolkit.vectorProduct')}</CardTitle></CardHeader>
                        <CardContent>
                            <p className="font-mono">({results.crossProduct.x}, {results.crossProduct.y}, {results.crossProduct.z})</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

// --- Main Container ---

export default function GeometryToolkit() {
    const { t } = useTranslation()
    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <Card className="min-h-[600px]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Ruler className="w-6 h-6 text-primary" />
                        {t('lab.tools.geometryToolkit.title')}
                    </CardTitle>
                    <CardDescription>
                        {t('lab.tools.geometryToolkit.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="shapes" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="shapes" className="flex gap-2"><Circle className="w-4 h-4" /> {t('lab.tools.geometryToolkit.shapesAreas')}</TabsTrigger>
                            <TabsTrigger value="triangle" className="flex gap-2"><Triangle className="w-4 h-4" /> {t('lab.tools.geometryToolkit.triangleSolver')}</TabsTrigger>
                            <TabsTrigger value="vectors" className="flex gap-2"><ArrowUpRight className="w-4 h-4" /> {t('lab.tools.geometryToolkit.vectors')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="shapes">
                            <ShapeCalculator />
                        </TabsContent>

                        <TabsContent value="triangle">
                            <TriangleSolver />
                        </TabsContent>

                        <TabsContent value="vectors">
                            <VectorCalculator />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
