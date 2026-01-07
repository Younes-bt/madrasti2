import React, { useState, useCallback } from 'react'
import { evaluate, pi, e } from 'mathjs'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs'
import { Delete, RotateCcw, History } from 'lucide-react'

export default function Calculator() {
  const { t } = useTranslation()
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState([])
  const [memory, setMemory] = useState(0)
  const [angleMode, setAngleMode] = useState('deg') // 'deg' or 'rad'
  const [lastResult, setLastResult] = useState(null)
  const [newNumber, setNewNumber] = useState(true)

  const handleNumber = useCallback((num) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }, [display, newNumber])

  const handleOperator = useCallback((op) => {
    setDisplay(display + ' ' + op + ' ')
    setNewNumber(false)
  }, [display])

  const handleFunction = useCallback((func) => {
    setDisplay(display + func + '(')
    setNewNumber(false)
  }, [display])

  const handleCalculate = useCallback(() => {
    try {
      let expression = display

      // Convert degrees to radians if needed
      if (angleMode === 'deg') {
        expression = expression.replace(/sin\(([^)]+)\)/g, (match, angle) => `sin((${angle}) * pi / 180)`)
        expression = expression.replace(/cos\(([^)]+)\)/g, (match, angle) => `cos((${angle}) * pi / 180)`)
        expression = expression.replace(/tan\(([^)]+)\)/g, (match, angle) => `tan((${angle}) * pi / 180)`)
      }

      const result = evaluate(expression)
      const roundedResult = Math.round(result * 1000000000) / 1000000000

      setHistory([...history, { expression: display, result: roundedResult }])
      setDisplay(String(roundedResult))
      setLastResult(roundedResult)
      setNewNumber(true)
    } catch (error) {
      setDisplay('Error')
      setNewNumber(true)
    }
  }, [display, angleMode, history])

  const handleClear = useCallback(() => {
    setDisplay('0')
    setNewNumber(true)
  }, [])

  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
      setNewNumber(true)
    }
  }, [display])

  const handleMemoryStore = useCallback(() => {
    try {
      const result = evaluate(display)
      setMemory(result)
    } catch (error) {
      // Ignore
    }
  }, [display])

  const handleMemoryRecall = useCallback(() => {
    setDisplay(String(memory))
    setNewNumber(true)
  }, [memory])

  const handleMemoryAdd = useCallback(() => {
    try {
      const result = evaluate(display)
      setMemory(memory + result)
    } catch (error) {
      // Ignore
    }
  }, [display, memory])

  const handleMemoryClear = useCallback(() => {
    setMemory(0)
  }, [])

  const handleConstant = useCallback((constant) => {
    const value = constant === 'pi' ? pi : e
    if (newNumber) {
      setDisplay(String(value))
      setNewNumber(false)
    } else {
      setDisplay(display + String(value))
    }
  }, [display, newNumber])

  const buttonClass = 'h-14 text-lg font-semibold'
  const operatorClass = 'h-14 text-lg font-semibold bg-primary/10 hover:bg-primary/20'
  const functionClass = 'h-14 text-sm font-semibold bg-secondary'

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('lab.tools.scientificCalculator.title')}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={angleMode === 'deg' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAngleMode('deg')}
              >
                {t('lab.tools.scientificCalculator.deg')}
              </Button>
              <Button
                variant={angleMode === 'rad' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAngleMode('rad')}
              >
                {t('lab.tools.scientificCalculator.rad')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculator">{t('lab.tools.scientificCalculator.calculator')}</TabsTrigger>
              <TabsTrigger value="history">{t('lab.tools.scientificCalculator.history')}</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-4">
              {/* Display */}
              <div className="bg-secondary p-4 rounded-lg">
                <div className="text-right text-3xl font-mono break-all min-h-[3rem] flex items-center justify-end">
                  {display}
                </div>
                {memory !== 0 && (
                  <div className="text-right text-sm text-muted-foreground mt-1">
                    M: {memory}
                  </div>
                )}
              </div>

              {/* Scientific Functions */}
              <div className="grid grid-cols-5 gap-2">
                <Button className={functionClass} onClick={() => handleFunction('sin')}>sin</Button>
                <Button className={functionClass} onClick={() => handleFunction('cos')}>cos</Button>
                <Button className={functionClass} onClick={() => handleFunction('tan')}>tan</Button>
                <Button className={functionClass} onClick={() => handleFunction('log')}>log</Button>
                <Button className={functionClass} onClick={() => handleFunction('ln')}>ln</Button>

                <Button className={functionClass} onClick={() => handleFunction('asin')}>asin</Button>
                <Button className={functionClass} onClick={() => handleFunction('acos')}>acos</Button>
                <Button className={functionClass} onClick={() => handleFunction('atan')}>atan</Button>
                <Button className={functionClass} onClick={() => handleFunction('sqrt')}>√</Button>
                <Button className={functionClass} onClick={() => handleOperator('^')}>x^y</Button>
              </div>

              {/* Memory & Constants */}
              <div className="grid grid-cols-6 gap-2">
                <Button className={buttonClass} variant="outline" onClick={handleMemoryClear}>{t('lab.tools.scientificCalculator.memoryClear')}</Button>
                <Button className={buttonClass} variant="outline" onClick={handleMemoryRecall}>{t('lab.tools.scientificCalculator.memoryRecall')}</Button>
                <Button className={buttonClass} variant="outline" onClick={handleMemoryStore}>{t('lab.tools.scientificCalculator.memoryStore')}</Button>
                <Button className={buttonClass} variant="outline" onClick={handleMemoryAdd}>{t('lab.tools.scientificCalculator.memoryAdd')}</Button>
                <Button className={buttonClass} variant="outline" onClick={() => handleConstant('pi')}>π</Button>
                <Button className={buttonClass} variant="outline" onClick={() => handleConstant('e')}>e</Button>
              </div>

              {/* Main Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <Button className={buttonClass} variant="destructive" onClick={handleClear}>{t('lab.tools.scientificCalculator.clear')}</Button>
                <Button className={buttonClass} variant="outline" onClick={handleBackspace}>
                  <Delete className="h-5 w-5" />
                </Button>
                <Button className={operatorClass} onClick={() => handleOperator('%')}>%</Button>
                <Button className={operatorClass} onClick={() => handleOperator('/')}>/</Button>

                <Button className={buttonClass} onClick={() => handleNumber('7')}>7</Button>
                <Button className={buttonClass} onClick={() => handleNumber('8')}>8</Button>
                <Button className={buttonClass} onClick={() => handleNumber('9')}>9</Button>
                <Button className={operatorClass} onClick={() => handleOperator('*')}>×</Button>

                <Button className={buttonClass} onClick={() => handleNumber('4')}>4</Button>
                <Button className={buttonClass} onClick={() => handleNumber('5')}>5</Button>
                <Button className={buttonClass} onClick={() => handleNumber('6')}>6</Button>
                <Button className={operatorClass} onClick={() => handleOperator('-')}>-</Button>

                <Button className={buttonClass} onClick={() => handleNumber('1')}>1</Button>
                <Button className={buttonClass} onClick={() => handleNumber('2')}>2</Button>
                <Button className={buttonClass} onClick={() => handleNumber('3')}>3</Button>
                <Button className={operatorClass} onClick={() => handleOperator('+')}>+</Button>

                <Button className={buttonClass} onClick={() => handleNumber('0')}>0</Button>
                <Button className={buttonClass} onClick={() => handleNumber('.')}>.</Button>
                <Button className={buttonClass} onClick={() => handleNumber('(')}>(</Button>
                <Button className={buttonClass} onClick={() => handleNumber(')')}>)</Button>
              </div>

              <Button className="w-full h-14 text-xl font-bold" onClick={handleCalculate}>=</Button>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>{t('lab.tools.scientificCalculator.noHistory')}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Calculation History</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setHistory([])}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                    {[...history].reverse().map((item, index) => (
                      <Card
                        key={index}
                        className="p-3 cursor-pointer hover:bg-secondary/50"
                        onClick={() => {
                          setDisplay(String(item.result))
                          setNewNumber(true)
                        }}
                      >
                        <div className="text-sm text-muted-foreground">{item.expression}</div>
                        <div className="text-lg font-semibold">= {item.result}</div>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
