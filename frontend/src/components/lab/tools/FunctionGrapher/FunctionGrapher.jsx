import React, { useState, useMemo } from 'react'
import { create, all } from 'mathjs'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card'
import { Button } from '../../../ui/button'
import { Input } from '../../../ui/input'
import { Label } from '../../../ui/label'
import { Trash2, Plus, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

const math = create(all)

const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

const getRandomColor = (index) => colors[index % colors.length]

export default function FunctionGrapher() {
  const { t } = useTranslation()
  const [functions, setFunctions] = useState([])
  const [newFunction, setNewFunction] = useState('')
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [yMin, setYMin] = useState(-10)
  const [yMax, setYMax] = useState(10)
  const [error, setError] = useState('')

  const handleAddFunction = () => {
    if (!newFunction.trim()) {
      setError('Please enter a function')
      return
    }

    try {
      // Test compile the function
      const compiled = math.compile(newFunction)
      // Test evaluate with x = 0
      compiled.evaluate({ x: 0 })

      setFunctions([
        ...functions,
        {
          id: Date.now(),
          expression: newFunction,
          compiled,
          color: getRandomColor(functions.length),
          visible: true
        }
      ])
      setNewFunction('')
      setError('')
    } catch (err) {
      setError('Invalid function syntax. Use "x" as the variable. Example: x^2 + 2*x + 1')
    }
  }

  const handleRemoveFunction = (id) => {
    setFunctions(functions.filter(f => f.id !== id))
  }

  const handleToggleVisibility = (id) => {
    setFunctions(functions.map(f =>
      f.id === id ? { ...f, visible: !f.visible } : f
    ))
  }

  const handleZoomIn = () => {
    const xRange = xMax - xMin
    const yRange = yMax - yMin
    setXMin(xMin + xRange * 0.1)
    setXMax(xMax - xRange * 0.1)
    setYMin(yMin + yRange * 0.1)
    setYMax(yMax - yRange * 0.1)
  }

  const handleZoomOut = () => {
    const xRange = xMax - xMin
    const yRange = yMax - yMin
    setXMin(xMin - xRange * 0.1)
    setXMax(xMax + xRange * 0.1)
    setYMin(yMin - yRange * 0.1)
    setYMax(yMax + yRange * 0.1)
  }

  const handleReset = () => {
    setXMin(-10)
    setXMax(10)
    setYMin(-10)
    setYMax(10)
  }

  const plotData = useMemo(() => {
    const points = []
    const step = (xMax - xMin) / 200

    for (let x = xMin; x <= xMax; x += step) {
      const point = { x: parseFloat(x.toFixed(4)) }

      functions.forEach(func => {
        if (func.visible) {
          try {
            const y = func.compiled.evaluate({ x })
            // Filter out invalid values
            if (isFinite(y) && y >= yMin && y <= yMax) {
              point[func.id] = parseFloat(y.toFixed(4))
            } else {
              point[func.id] = null
            }
          } catch {
            point[func.id] = null
          }
        }
      })

      points.push(point)
    }

    return points
  }, [functions, xMin, xMax, yMin, yMax])

  const findZeros = (func) => {
    const zeros = []
    const step = (xMax - xMin) / 100

    for (let x = xMin; x <= xMax - step; x += step) {
      try {
        const y1 = func.compiled.evaluate({ x })
        const y2 = func.compiled.evaluate({ x: x + step })

        // Check for sign change
        if (y1 * y2 < 0) {
          zeros.push(parseFloat(x.toFixed(2)))
        }
      } catch {
        // Ignore errors
      }
    }

    return zeros.slice(0, 5) // Return max 5 zeros
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('lab.tools.functionGrapher.title')}</CardTitle>
          <CardDescription>
            {t('lab.tools.functionGrapher.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Function */}
          <div className="space-y-2">
            <Label>{t('lab.tools.functionGrapher.addFunction')}</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-secondary rounded-l-md border border-r-0">
                    f(x) =
                  </span>
                  <Input
                    placeholder={t('lab.tools.functionGrapher.enterFunction')}
                    value={newFunction}
                    onChange={(e) => setNewFunction(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFunction()}
                    className="rounded-l-none"
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive mt-1">{error}</p>
                )}
              </div>
              <Button onClick={handleAddFunction}>
                <Plus className="h-4 w-4 mr-2" />
                {t('lab.tools.functionGrapher.addFunction')}
              </Button>
            </div>
          </div>

          {/* Function List */}
          {functions.length > 0 && (
            <div className="space-y-2">
              <Label>{t('lab.tools.functionGrapher.functions')}</Label>
              <div className="space-y-2">
                {functions.map((func) => (
                  <Card key={func.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-4 h-4 rounded cursor-pointer border-2"
                          style={{
                            backgroundColor: func.visible ? func.color : 'transparent',
                            borderColor: func.color
                          }}
                          onClick={() => handleToggleVisibility(func.id)}
                        />
                        <span className="font-mono">f(x) = {func.expression}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          Zeros: {findZeros(func).join(', ') || 'None visible'}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFunction(func.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Graph Controls */}
          <div className="flex gap-4 items-end">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
              <div className="space-y-1">
                <Label className="text-xs">{t('lab.tools.functionGrapher.xRange')} {t('lab.tools.functionGrapher.min')}</Label>
                <Input
                  type="number"
                  value={xMin}
                  onChange={(e) => setXMin(parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('lab.tools.functionGrapher.xRange')} {t('lab.tools.functionGrapher.max')}</Label>
                <Input
                  type="number"
                  value={xMax}
                  onChange={(e) => setXMax(parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('lab.tools.functionGrapher.yRange')} {t('lab.tools.functionGrapher.min')}</Label>
                <Input
                  type="number"
                  value={yMin}
                  onChange={(e) => setYMin(parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('lab.tools.functionGrapher.yRange')} {t('lab.tools.functionGrapher.max')}</Label>
                <Input
                  type="number"
                  value={yMax}
                  onChange={(e) => setYMax(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Graph */}
          <div className="bg-white dark:bg-secondary p-4 rounded-lg border">
            {functions.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p>{t('lab.tools.functionGrapher.noFunctions')}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={plotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[xMin, xMax]}
                    label={{ value: 'x', position: 'insideBottomRight', offset: -5 }}
                  />
                  <YAxis
                    type="number"
                    domain={[yMin, yMax]}
                    label={{ value: 'y', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Legend />
                  {functions.filter(f => f.visible).map((func) => (
                    <Line
                      key={func.id}
                      type="monotone"
                      dataKey={func.id}
                      stroke={func.color}
                      dot={false}
                      strokeWidth={2}
                      name={func.expression}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Function Examples - Keep English as they are mathematical terms */}
          <div className="space-y-2">
            <Label>Example Functions</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { name: 'Linear', expr: '2*x + 1' },
                { name: 'Quadratic', expr: 'x^2' },
                { name: 'Cubic', expr: 'x^3 - 3*x' },
                { name: 'Sine', expr: 'sin(x)' },
                { name: 'Cosine', expr: 'cos(x)' },
                { name: 'Exponential', expr: 'exp(x/3)' }
              ].map((example) => (
                <Button
                  key={example.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewFunction(example.expr)}
                >
                  {example.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
