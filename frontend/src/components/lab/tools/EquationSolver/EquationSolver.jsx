import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card'
import { Button } from '../../../ui/button'
import { Input } from '../../../ui/input'
import { Label } from '../../../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs'
import { CheckCircle2, XCircle } from 'lucide-react'

const solveLinear = (a, b, c) => {
  // Equation: ax + b = c
  // Solution: x = (c - b) / a

  if (a === 0) {
    if (b === c) {
      return {
        solution: null,
        message: 'Infinite solutions (identity)',
        steps: [
          `Given: ${a}x + ${b} = ${c}`,
          `Since a = 0, we have: ${b} = ${c}`,
          b === c ? 'This is always true, infinite solutions' : 'This is never true, no solution'
        ]
      }
    } else {
      return {
        solution: null,
        message: 'No solution',
        steps: [
          `Given: ${a}x + ${b} = ${c}`,
          `Since a = 0, we have: ${b} = ${c}`,
          'This is false, no solution exists'
        ]
      }
    }
  }

  const solution = (c - b) / a

  return {
    solution,
    steps: [
      `Given: ${a}x + ${b} = ${c}`,
      `Subtract ${b} from both sides: ${a}x = ${c} - ${b}`,
      `Simplify: ${a}x = ${c - b}`,
      `Divide both sides by ${a}: x = ${(c - b)}/${a}`,
      `Solution: x = ${solution.toFixed(4)}`
    ]
  }
}

const solveQuadratic = (a, b, c) => {
  // Equation: ax² + bx + c = 0
  // Solution: x = (-b ± √(b² - 4ac)) / 2a

  if (a === 0) {
    return solveLinear(b, c, 0)
  }

  const discriminant = b * b - 4 * a * c

  const steps = [
    `Given: ${a}x² + ${b}x + ${c} = 0`,
    `Using quadratic formula: x = (-b ± √(b² - 4ac)) / 2a`,
    `Calculate discriminant: Δ = b² - 4ac = ${b}² - 4(${a})(${c})`,
    `Δ = ${b * b} - ${4 * a * c} = ${discriminant}`
  ]

  if (discriminant > 0) {
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a)
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a)

    steps.push(
      `Since Δ > 0, there are two real solutions`,
      `x₁ = (-${b} + √${discriminant}) / ${2 * a} = ${x1.toFixed(4)}`,
      `x₂ = (-${b} - √${discriminant}) / ${2 * a} = ${x2.toFixed(4)}`
    )

    return {
      solutions: [x1, x2],
      discriminant,
      type: 'two_real',
      steps
    }
  } else if (discriminant === 0) {
    const x = -b / (2 * a)

    steps.push(
      `Since Δ = 0, there is one real solution (repeated root)`,
      `x = -${b} / ${2 * a} = ${x.toFixed(4)}`
    )

    return {
      solutions: [x],
      discriminant,
      type: 'one_real',
      steps
    }
  } else {
    const real = -b / (2 * a)
    const imag = Math.sqrt(-discriminant) / (2 * a)

    steps.push(
      `Since Δ < 0, there are two complex solutions`,
      `x₁ = ${real.toFixed(4)} + ${imag.toFixed(4)}i`,
      `x₂ = ${real.toFixed(4)} - ${imag.toFixed(4)}i`
    )

    return {
      solutions: [],
      complex: { real, imag },
      discriminant,
      type: 'complex',
      steps
    }
  }
}

const verifyLinear = (a, b, c, x) => {
  const left = a * x + b
  const right = c
  return Math.abs(left - right) < 0.0001
}

const verifyQuadratic = (a, b, c, x) => {
  const result = a * x * x + b * x + c
  return Math.abs(result) < 0.0001
}

export default function EquationSolver() {
  const { t } = useTranslation()
  const [equationType, setEquationType] = useState('linear')

  // Linear equation: ax + b = c
  const [linearA, setLinearA] = useState(2)
  const [linearB, setLinearB] = useState(3)
  const [linearC, setLinearC] = useState(7)
  const [linearResult, setLinearResult] = useState(null)

  // Quadratic equation: ax² + bx + c = 0
  const [quadA, setQuadA] = useState(1)
  const [quadB, setQuadB] = useState(-5)
  const [quadC, setQuadC] = useState(6)
  const [quadResult, setQuadResult] = useState(null)

  const handleSolveLinear = () => {
    const result = solveLinear(linearA, linearB, linearC)
    setLinearResult(result)
  }

  const handleSolveQuadratic = () => {
    const result = solveQuadratic(quadA, quadB, quadC)
    setQuadResult(result)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('lab.tools.equationSolver.title')}</CardTitle>
          <CardDescription>
            {t('lab.tools.equationSolver.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={equationType} onValueChange={setEquationType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="linear">{t('lab.tools.equationSolver.linearEquation')}</TabsTrigger>
              <TabsTrigger value="quadratic">{t('lab.tools.equationSolver.quadraticEquation')}</TabsTrigger>
            </TabsList>

            {/* Linear Equation Tab */}
            <TabsContent value="linear" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <p className="text-lg font-semibold">
                    {linearA}x + {linearB} = {linearC}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('lab.tools.equationSolver.coefficientA')}</Label>
                    <Input
                      type="number"
                      value={linearA}
                      onChange={(e) => setLinearA(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('lab.tools.equationSolver.constantB')}</Label>
                    <Input
                      type="number"
                      value={linearB}
                      onChange={(e) => setLinearB(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('lab.tools.equationSolver.rightSideC')}</Label>
                    <Input
                      type="number"
                      value={linearC}
                      onChange={(e) => setLinearC(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handleSolveLinear}>
                  {t('lab.tools.equationSolver.solveEquation')}
                </Button>

                {linearResult && (
                  <div className="space-y-4">
                    {/* Solution */}
                    <Card className="bg-primary/5">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">{t('lab.tools.equationSolver.solution')}</h3>
                        {linearResult.solution !== null ? (
                          <div className="space-y-2">
                            <p className="text-2xl font-bold">
                              x = {linearResult.solution.toFixed(4)}
                            </p>
                            {/* Verification */}
                            <div className="flex items-center gap-2 text-sm">
                              {verifyLinear(linearA, linearB, linearC, linearResult.solution) ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span className="text-green-600">{t('lab.tools.equationSolver.verified')}</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="text-red-600">{t('lab.tools.equationSolver.verificationFailed')}</span>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-lg text-muted-foreground">{linearResult.message}</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Steps */}
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-3">{t('lab.tools.equationSolver.stepByStep')}</h3>
                        <ol className="space-y-2">
                          {linearResult.steps.map((step, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="font-semibold text-primary">{index + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Quadratic Equation Tab */}
            <TabsContent value="quadratic" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <p className="text-lg font-semibold">
                    {quadA}x² + {quadB}x + {quadC} = 0
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('lab.tools.equationSolver.coefficientA')}</Label>
                    <Input
                      type="number"
                      value={quadA}
                      onChange={(e) => setQuadA(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('lab.tools.equationSolver.coefficientB')}</Label>
                    <Input
                      type="number"
                      value={quadB}
                      onChange={(e) => setQuadB(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('lab.tools.equationSolver.constantC')}</Label>
                    <Input
                      type="number"
                      value={quadC}
                      onChange={(e) => setQuadC(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handleSolveQuadratic}>
                  {t('lab.tools.equationSolver.solveEquation')}
                </Button>

                {quadResult && (
                  <div className="space-y-4">
                    {/* Solution */}
                    <Card className="bg-primary/5">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">{t('lab.tools.equationSolver.solution')}</h3>
                        {quadResult.type === 'two_real' && (
                          <div className="space-y-2">
                            <p className="text-xl font-bold">
                              x₁ = {quadResult.solutions[0].toFixed(4)}
                            </p>
                            <p className="text-xl font-bold">
                              x₂ = {quadResult.solutions[1].toFixed(4)}
                            </p>
                            <div className="flex items-center gap-2 text-sm mt-2">
                              {verifyQuadratic(quadA, quadB, quadC, quadResult.solutions[0]) ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span className="text-green-600">{t('lab.tools.equationSolver.verified')}</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="text-red-600">{t('lab.tools.equationSolver.verificationFailed')}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        {quadResult.type === 'one_real' && (
                          <div className="space-y-2">
                            <p className="text-xl font-bold">
                              x = {quadResult.solutions[0].toFixed(4)}
                            </p>
                            <p className="text-sm text-muted-foreground">{t('lab.tools.equationSolver.repeatedRoot')}</p>
                          </div>
                        )}
                        {quadResult.type === 'complex' && (
                          <div className="space-y-2">
                            <p className="text-xl font-bold">
                              x₁ = {quadResult.complex.real.toFixed(4)} + {quadResult.complex.imag.toFixed(4)}i
                            </p>
                            <p className="text-xl font-bold">
                              x₂ = {quadResult.complex.real.toFixed(4)} - {quadResult.complex.imag.toFixed(4)}i
                            </p>
                            <p className="text-sm text-muted-foreground">{t('lab.tools.equationSolver.complexSolutions')}</p>
                          </div>
                        )}
                        <div className="mt-3 p-2 bg-secondary/50 rounded text-sm">
                          <p>{t('lab.tools.equationSolver.discriminant')} = {quadResult.discriminant.toFixed(4)}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Steps */}
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-3">{t('lab.tools.equationSolver.stepByStep')}</h3>
                        <ol className="space-y-2">
                          {quadResult.steps.map((step, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="font-semibold text-primary">{index + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Example Equations */}
                <div className="space-y-2">
                  <Label>{t('lab.tools.equationSolver.examples')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuadA(1)
                        setQuadB(-5)
                        setQuadC(6)
                      }}
                    >
                      x² - 5x + 6 = 0
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuadA(1)
                        setQuadB(-4)
                        setQuadC(4)
                      }}
                    >
                      x² - 4x + 4 = 0
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuadA(1)
                        setQuadB(0)
                        setQuadC(1)
                      }}
                    >
                      x² + 1 = 0
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuadA(2)
                        setQuadB(4)
                        setQuadC(-6)
                      }}
                    >
                      2x² + 4x - 6 = 0
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
