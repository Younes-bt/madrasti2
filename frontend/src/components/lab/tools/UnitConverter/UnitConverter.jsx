import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card'
import { Button } from '../../../ui/button'
import { Input } from '../../../ui/input'
import { Label } from '../../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { ArrowLeftRight } from 'lucide-react'

const conversionData = {
  length: {
    name: 'unitConverter.categories.length',
    units: {
      meter: { name: 'Meter (m)', factor: 1 },
      kilometer: { name: 'Kilometer (km)', factor: 0.001 },
      centimeter: { name: 'Centimeter (cm)', factor: 100 },
      millimeter: { name: 'Millimeter (mm)', factor: 1000 },
      mile: { name: 'Mile (mi)', factor: 0.000621371 },
      yard: { name: 'Yard (yd)', factor: 1.09361 },
      foot: { name: 'Foot (ft)', factor: 3.28084 },
      inch: { name: 'Inch (in)', factor: 39.3701 }
    }
  },
  mass: {
    name: 'unitConverter.categories.mass',
    units: {
      kilogram: { name: 'Kilogram (kg)', factor: 1 },
      gram: { name: 'Gram (g)', factor: 1000 },
      milligram: { name: 'Milligram (mg)', factor: 1000000 },
      ton: { name: 'Metric Ton (t)', factor: 0.001 },
      pound: { name: 'Pound (lb)', factor: 2.20462 },
      ounce: { name: 'Ounce (oz)', factor: 35.274 }
    }
  },
  volume: {
    name: 'unitConverter.categories.volume',
    units: {
      liter: { name: 'Liter (L)', factor: 1 },
      milliliter: { name: 'Milliliter (mL)', factor: 1000 },
      cubicMeter: { name: 'Cubic Meter (m³)', factor: 0.001 },
      gallon: { name: 'Gallon (gal)', factor: 0.264172 },
      quart: { name: 'Quart (qt)', factor: 1.05669 },
      pint: { name: 'Pint (pt)', factor: 2.11338 },
      cup: { name: 'Cup', factor: 4.22675 }
    }
  },
  temperature: {
    name: 'unitConverter.categories.temperature',
    special: true
  },
  energy: {
    name: 'unitConverter.categories.energy',
    units: {
      joule: { name: 'Joule (J)', factor: 1 },
      kilojoule: { name: 'Kilojoule (kJ)', factor: 0.001 },
      calorie: { name: 'Calorie (cal)', factor: 0.239006 },
      kilocalorie: { name: 'Kilocalorie (kcal)', factor: 0.000239006 },
      kilowattHour: { name: 'Kilowatt-hour (kWh)', factor: 2.77778e-7 }
    }
  },
  pressure: {
    name: 'unitConverter.categories.pressure',
    units: {
      pascal: { name: 'Pascal (Pa)', factor: 1 },
      kilopascal: { name: 'Kilopascal (kPa)', factor: 0.001 },
      bar: { name: 'Bar', factor: 0.00001 },
      atmosphere: { name: 'Atmosphere (atm)', factor: 0.00000986923 },
      mmHg: { name: 'Millimeter of Mercury (mmHg)', factor: 0.00750062 },
      psi: { name: 'Pound per Square Inch (psi)', factor: 0.000145038 }
    }
  }
}

const convertTemperature = (value, from, to) => {
  // Convert to Celsius first
  let celsius = value
  if (from === 'fahrenheit') {
    celsius = (value - 32) * (5 / 9)
  } else if (from === 'kelvin') {
    celsius = value - 273.15
  }

  // Convert from Celsius to target
  if (to === 'fahrenheit') {
    return (celsius * (9 / 5)) + 32
  } else if (to === 'kelvin') {
    return celsius + 273.15
  }
  return celsius
}

const convert = (value, category, fromUnit, toUnit) => {
  if (!value || value === '') return ''

  const numValue = parseFloat(value)
  if (isNaN(numValue)) return ''

  if (category === 'temperature') {
    return convertTemperature(numValue, fromUnit, toUnit).toFixed(4)
  }

  const categoryData = conversionData[category]
  if (!categoryData || categoryData.special) return ''

  const fromFactor = categoryData.units[fromUnit].factor
  const toFactor = categoryData.units[toUnit].factor

  const baseValue = numValue / fromFactor
  const result = baseValue * toFactor

  return result.toFixed(6)
}

export default function UnitConverter() {
  const { t } = useTranslation()
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [fromValue, setFromValue] = useState('')
  const [toValue, setToValue] = useState('')

  // Initialize units when category changes
  useEffect(() => {
    if (category === 'temperature') {
      setFromUnit('celsius')
      setToUnit('fahrenheit')
    } else {
      const units = Object.keys(conversionData[category].units || {})
      if (units.length >= 2) {
        setFromUnit(units[0])
        setToUnit(units[1])
      }
    }
    setFromValue('')
    setToValue('')
  }, [category])

  // Perform conversion when values change
  useEffect(() => {
    if (fromValue && fromUnit && toUnit) {
      const result = convert(fromValue, category, fromUnit, toUnit)
      setToValue(result)
    }
  }, [fromValue, fromUnit, toUnit, category])

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
    setToValue(fromValue)
  }

  const temperatureUnits = {
    celsius: { name: 'Celsius (°C)' },
    fahrenheit: { name: 'Fahrenheit (°F)' },
    kelvin: { name: 'Kelvin (K)' }
  }

  const currentUnits = category === 'temperature'
    ? temperatureUnits
    : conversionData[category].units

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('lab.tools.unitConverter.title')}</CardTitle>
          <CardDescription>
            {t('lab.tools.unitConverter.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(conversionData).map(([key, data]) => (
                <Button
                  key={key}
                  variant={category === key ? 'default' : 'outline'}
                  onClick={() => setCategory(key)}
                >
                  {t(`lab.tools.${data.name}`)}
                </Button>
              ))}
            </div>
          </div>

          {/* Conversion Interface */}
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            {/* From */}
            <div className="space-y-2">
              <Label>{t('lab.tools.unitConverter.from')}</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue placeholder={t('lab.tools.unitConverter.selectUnit')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentUnits).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder={t('lab.tools.unitConverter.value')}
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* Swap Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwap}
              className="mb-2"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>

            {/* To */}
            <div className="space-y-2">
              <Label>{t('lab.tools.unitConverter.to')}</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue placeholder={t('lab.tools.unitConverter.selectUnit')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentUnits).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={toValue}
                readOnly
                placeholder={t('lab.tools.unitConverter.result')}
                className="text-lg bg-secondary"
              />
            </div>
          </div>

          {/* Conversion Formula */}
          {fromValue && toValue && (
            <Card className="bg-secondary/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('lab.tools.unitConverter.result')}</p>
                  <p className="text-2xl font-semibold">
                    {fromValue} {currentUnits[fromUnit]?.name} = {toValue} {currentUnits[toUnit]?.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reference Table */}
          <div className="mt-8">
            <h3 className="font-semibold mb-3">Common Conversions</h3>
            <div className="grid gap-2">
              {category === 'length' && (
                <>
                  <div className="text-sm p-2 bg-secondary/30 rounded">1 kilometer = 1000 meters</div>
                  <div className="text-sm p-2 bg-secondary/30 rounded">1 mile = 1.60934 kilometers</div>
                  <div className="text-sm p-2 bg-secondary/30 rounded">1 foot = 30.48 centimeters</div>
                </>
              )}
              {category === 'mass' && (
                <>
                  <div className="text-sm p-2 bg-secondary/30 rounded">1 kilogram = 1000 grams</div>
                  <div className="text-sm p-2 bg-secondary/30 rounded">1 pound = 0.453592 kilograms</div>
                  <div className="text-sm p-2 bg-secondary/30 rounded">1 ton = 1000 kilograms</div>
                </>
              )}
              {category === 'volume' && (
                <>
                  <div className="text-sm p-2 bg-secondary/30 rounded">1 liter = 1000 milliliters</div>
                  <div className="text-sm p-2 bg-secondary/30 rounded">1 gallon = 3.78541 liters</div>
                  <div className="text-sm p-2 bg-secondary/30 rounded">1 cup = 236.588 milliliters</div>
                </>
              )}
              {category === 'temperature' && (
                <>
                  <div className="text-sm p-2 bg-secondary/30 rounded">Water freezes at 0°C = 32°F = 273.15K</div>
                  <div className="text-sm p-2 bg-secondary/30 rounded">Water boils at 100°C = 212°F = 373.15K</div>
                  <div className="text-sm p-2 bg-secondary/30 rounded">Formula: °F = (°C × 9/5) + 32</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
