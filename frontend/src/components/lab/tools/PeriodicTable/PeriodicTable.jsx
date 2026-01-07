import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card'
import { Button } from '../../../ui/button'
import { Input } from '../../../ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog'

// Simplified periodic table data (first 36 elements for demonstration)
const elements = [
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, type: 'nonmetal', group: 1, period: 1 },
  { number: 2, symbol: 'He', name: 'Helium', mass: 4.003, type: 'noble-gas', group: 18, period: 1 },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.941, type: 'alkali-metal', group: 1, period: 2 },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.012, type: 'alkaline-earth', group: 2, period: 2 },
  { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, type: 'metalloid', group: 13, period: 2 },
  { number: 6, symbol: 'C', name: 'Carbon', mass: 12.01, type: 'nonmetal', group: 14, period: 2 },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.01, type: 'nonmetal', group: 15, period: 2 },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: 16.00, type: 'nonmetal', group: 16, period: 2 },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: 19.00, type: 'halogen', group: 17, period: 2 },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.18, type: 'noble-gas', group: 18, period: 2 },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.99, type: 'alkali-metal', group: 1, period: 3 },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.31, type: 'alkaline-earth', group: 2, period: 3 },
  { number: 13, symbol: 'Al', name: 'Aluminum', mass: 26.98, type: 'post-transition', group: 13, period: 3 },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.09, type: 'metalloid', group: 14, period: 3 },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.97, type: 'nonmetal', group: 15, period: 3 },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.07, type: 'nonmetal', group: 16, period: 3 },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, type: 'halogen', group: 17, period: 3 },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.95, type: 'noble-gas', group: 18, period: 3 },
  { number: 19, symbol: 'K', name: 'Potassium', mass: 39.10, type: 'alkali-metal', group: 1, period: 4 },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.08, type: 'alkaline-earth', group: 2, period: 4 },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.85, type: 'transition-metal', group: 8, period: 4 },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.55, type: 'transition-metal', group: 11, period: 4 },
  { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, type: 'transition-metal', group: 12, period: 4 },
  { number: 35, symbol: 'Br', name: 'Bromine', mass: 79.90, type: 'halogen', group: 17, period: 4 },
  { number: 36, symbol: 'Kr', name: 'Krypton', mass: 83.80, type: 'noble-gas', group: 18, period: 4 },
  { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, type: 'transition-metal', group: 11, period: 5 },
  { number: 53, symbol: 'I', name: 'Iodine', mass: 126.90, type: 'halogen', group: 17, period: 5 },
  { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, type: 'transition-metal', group: 11, period: 6 },
  { number: 80, symbol: 'Hg', name: 'Mercury', mass: 200.59, type: 'transition-metal', group: 12, period: 6 }
]

const typeColors = {
  'nonmetal': '#4ade80',
  'noble-gas': '#c084fc',
  'alkali-metal': '#fb923c',
  'alkaline-earth': '#fbbf24',
  'metalloid': '#38bdf8',
  'halogen': '#f87171',
  'transition-metal': '#94a3b8',
  'post-transition': '#a3e635'
}

const typeNames = {
  'nonmetal': 'Nonmetal',
  'noble-gas': 'Noble Gas',
  'alkali-metal': 'Alkali Metal',
  'alkaline-earth': 'Alkaline Earth Metal',
  'metalloid': 'Metalloid',
  'halogen': 'Halogen',
  'transition-metal': 'Transition Metal',
  'post-transition': 'Post-transition Metal'
}

export default function PeriodicTable() {
  const { t } = useTranslation()
  const [selectedElement, setSelectedElement] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredElements = elements.filter(el => {
    const matchesSearch = searchQuery === '' ||
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.number.toString() === searchQuery

    const matchesType = filterType === 'all' || el.type === filterType

    return matchesSearch && matchesType
  })

  const getGridPosition = (element) => {
    return {
      gridColumn: element.group,
      gridRow: element.period
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('lab.tools.periodicTable.title')}</CardTitle>
          <CardDescription>
            {t('lab.tools.periodicTable.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <Input
              placeholder="Search by name, symbol, or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            {Object.entries(typeNames).map(([type, name]) => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
                style={{
                  backgroundColor: filterType === type ? typeColors[type] : undefined,
                  borderColor: typeColors[type]
                }}
              >
                {name}
              </Button>
            ))}
          </div>

          {/* Periodic Table Grid */}
          {searchQuery === '' && filterType === 'all' ? (
            <div
              className="periodic-table-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(18, minmax(50px, 1fr))',
                gridTemplateRows: 'repeat(7, minmax(60px, auto))',
                gap: '4px'
              }}
            >
              {elements.map((element) => (
                <div
                  key={element.number}
                  className="element-cell cursor-pointer transition-transform hover:scale-105 hover:z-10 border-2 rounded-lg p-2 flex flex-col items-center justify-center"
                  style={{
                    ...getGridPosition(element),
                    backgroundColor: typeColors[element.type] + '20',
                    borderColor: typeColors[element.type]
                  }}
                  onClick={() => setSelectedElement(element)}
                >
                  <div className="text-xs font-semibold">{element.number}</div>
                  <div className="text-2xl font-bold">{element.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate w-full text-center">
                    {element.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredElements.map((element) => (
                <Card
                  key={element.number}
                  className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                  style={{
                    borderColor: typeColors[element.type],
                    borderWidth: '2px'
                  }}
                  onClick={() => setSelectedElement(element)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-sm font-semibold text-muted-foreground">
                      {element.number}
                    </div>
                    <div className="text-4xl font-bold my-2">{element.symbol}</div>
                    <div className="text-sm font-medium">{element.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {element.mass.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Legend */}
          <Card className="bg-secondary/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Element Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(typeNames).map(([type, name]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{
                        backgroundColor: typeColors[type],
                        borderColor: typeColors[type]
                      }}
                    />
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Element Details Dialog */}
      <Dialog open={!!selectedElement} onOpenChange={(open) => !open && setSelectedElement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl">
              {selectedElement?.symbol} - {selectedElement?.name}
            </DialogTitle>
            <DialogDescription>
              Atomic Number: {selectedElement?.number}
            </DialogDescription>
          </DialogHeader>
          {selectedElement && (
            <div className="space-y-4">
              <div
                className="w-32 h-32 mx-auto rounded-lg flex flex-col items-center justify-center border-4"
                style={{
                  backgroundColor: typeColors[selectedElement.type] + '40',
                  borderColor: typeColors[selectedElement.type]
                }}
              >
                <div className="text-sm font-semibold">{selectedElement.number}</div>
                <div className="text-5xl font-bold">{selectedElement.symbol}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Element Name</p>
                  <p className="font-semibold">{selectedElement.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Atomic Mass</p>
                  <p className="font-semibold">{selectedElement.mass.toFixed(3)} u</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold">{typeNames[selectedElement.type]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Group</p>
                  <p className="font-semibold">{selectedElement.group}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Period</p>
                  <p className="font-semibold">{selectedElement.period}</p>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm">
                  {selectedElement.name} is {typeNames[selectedElement.type].toLowerCase()} element
                  located in group {selectedElement.group} and period {selectedElement.period} of the
                  periodic table.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
