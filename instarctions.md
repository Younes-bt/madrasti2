# Madrasti 2.0 - Lab Feature Implementation Instructions

## Project Overview

**Project**: Madrasti 2.0 Educational Platform  
**Feature**: My Lab (مختبري) - Interactive Educational Tools Suite  
**Tech Stack**: React + Vite, Tailwind CSS, Django + DRF (Backend), PostgreSQL  
**Target**: Moroccan students (1AC → 2BAC, all tracks)  
**Languages**: Arabic (RTL), French, English

---

## Feature Description

Transform the existing "Practice Mode" page into "My Lab" - a comprehensive toolkit of interactive educational tools mapped to the Moroccan curriculum. The Lab provides students with calculators, simulators, visualizers, and educational tools spanning Math, Physics, Chemistry, Biology, and more.

---

## Phase 1: Foundation (Priority Build - 6 Core Tools)

Build these tools first to establish the Lab infrastructure and provide immediate value across all grade levels.

### 1. Lab Landing Page

**Route**: `/student/exercises/lab` (rename from `/practice`)  
**Purpose**: Main hub to browse and access all lab tools

#### Requirements:

**UI Components:**
- Header: "My Lab | مختبري" with breadcrumb navigation
- Category tabs/pills: Math, Physics, Chemistry, Biology, Economics, Languages
- Tool cards grid (responsive: 1 col mobile, 2 cols tablet, 3-4 cols desktop)
- Search/filter bar (by tool name, subject, grade level)
- Grade level filter dropdown (1AC, 2AC, 3AC, TC, 1BAC, 2BAC)

**Tool Card Design:**
```
┌─────────────────────────────┐
│  [Icon]                     │
│  Tool Name (AR/FR/EN)       │
│  Brief description          │
│  Grade levels: 3AC → 2BAC   │
│  [Open Tool →]              │
└─────────────────────────────┘
```

**Data Structure:**
```javascript
const labTools = [
  {
    id: 'function-grapher',
    nameAr: 'رسم الدوال',
    nameFr: 'Grapheur de Fonctions',
    nameEn: 'Function Grapher',
    category: 'math',
    descriptionAr: 'رسم وتحليل جميع أنواع الدوال الرياضية',
    descriptionFr: 'Tracer et analyser toutes les fonctions mathématiques',
    descriptionEn: 'Plot and analyze all mathematical functions',
    gradeLevels: ['3AC', 'TC', '1BAC', '2BAC'],
    icon: 'ChartLine', // Lucide icon name
    route: '/student/lab/function-grapher',
    isNew: true, // badge
    isPremium: false // for future monetization
  },
  // ... more tools
];
```

**Features:**
- Tool cards should show a "NEW" badge for recently added tools
- Filter tools by student's current grade level (from user context)
- Persist last used tool in localStorage
- Show "Recently Used" section at top (max 3 tools)
- Empty state when no tools match filters
- Loading skeleton while fetching data

**Styling:**
- Card hover effect: subtle lift + border color change
- Icons use Lucide React (consistent with your existing design)
- Gradient backgrounds for category headers
- RTL support for Arabic interface
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

---

### 2. Function Grapher (رسم الدوال)

**Route**: `/student/lab/function-grapher`  
**Priority**: HIGHEST - Universal across 3AC → 2BAC  
**Libraries**: math.js (parsing), recharts or plotly.js (graphing)

#### Features:

**Input Panel:**
- Function input field with validation
- Support for notation: `f(x) = ...` or just `y = ...`
- Autocomplete suggestions for common functions
- Example functions dropdown:
  - Linear: `2x + 3`
  - Quadratic: `x^2 - 4x + 3`
  - Cubic: `x^3 - 2x`
  - Trigonometric: `sin(x)`, `cos(x)`, `tan(x)`
  - Exponential: `e^x`, `2^x`
  - Logarithmic: `ln(x)`, `log(x)`
  - Rational: `1/x`, `(x+1)/(x-2)`
  - Absolute: `abs(x)`, `abs(x-2)`
  - Piecewise (advanced)

**Graph Display:**
- Coordinate system with labeled axes
- Grid lines (major + minor)
- Interactive: zoom (mouse wheel), pan (drag)
- Trace mode: hover to see (x, y) coordinates
- Multiple functions support (different colors)
- Toggle axes, grid, labels on/off
- Export as PNG/SVG

**Side Panel:**
- Function list (add/remove/toggle visibility)
- Color picker per function
- Domain/range input (x: [-10, 10], y: auto or custom)
- Show zeros (roots) toggle
- Show critical points (max/min) - for differentiable functions
- Show inflection points (2BAC level)
- Show asymptotes (vertical/horizontal)

**Table of Values:**
- Generate table for current function
- Customizable x-range and step
- Export to CSV

**Advanced Features (Optional for later):**
- Derivative overlay (f'(x) in different color)
- Integral shading (area under curve)
- Tangent line at point
- Animation mode (watch function draw)

**Implementation Notes:**
```javascript
// Use math.js for parsing and evaluation
import { create, all } from 'mathjs';
const math = create(all);

const parseFunction = (expression) => {
  try {
    const node = math.parse(expression);
    return (x) => node.evaluate({ x });
  } catch (error) {
    throw new Error('Invalid function syntax');
  }
};

// Generate points for graphing
const generatePoints = (func, xMin, xMax, step = 0.1) => {
  const points = [];
  for (let x = xMin; x <= xMax; x += step) {
    try {
      const y = func(x);
      if (isFinite(y)) {
        points.push({ x, y });
      }
    } catch (e) {
      // Handle discontinuities
      points.push({ x, y: null });
    }
  }
  return points;
};
```

**Error Handling:**
- Show clear error messages for invalid syntax
- Highlight problematic part of expression
- Suggestions for common mistakes (e.g., `2x` → `2*x`)
- Handle division by zero gracefully (show asymptote)

**Styling:**
- Two-column layout: left (input/controls), right (graph)
- Graph should be responsive but maintain aspect ratio
- Mobile: stack vertically, graph takes full width
- Dark mode support (optional)

---

### 3. Scientific Calculator (آلة حاسبة علمية)

**Route**: `/student/lab/calculator`  
**Priority**: HIGH - Universal need

#### Features:

**Basic Operations:**
- Addition, subtraction, multiplication, division
- Parentheses for order of operations
- Clear (C), Clear Entry (CE), Backspace
- Equals (=)

**Scientific Functions:**
- Trigonometry: sin, cos, tan, arcsin, arccos, arctan
- Angle mode toggle: Degrees (DEG) / Radians (RAD)
- Exponential: e^x, 10^x, x^y
- Logarithms: ln, log10, log (custom base)
- Square root, nth root
- Factorials (n!)
- Absolute value |x|
- Power of 10 (EXP)

**Memory Functions:**
- MC (Memory Clear)
- MR (Memory Recall)
- M+ (Memory Add)
- M- (Memory Subtract)
- MS (Memory Store)

**Display:**
- Current input (large font)
- Previous calculation (smaller, above)
- History panel (toggle sidebar)
  - Shows last 20 calculations
  - Click to recall
  - Clear history button

**Special Features:**
- Fraction mode: display as fractions when possible (e.g., 0.5 → 1/2)
- Scientific notation for very large/small numbers
- Constants: π, e
- Keyboard shortcuts (numbers, operators, Enter for =)

**Layout:**
```
┌─────────────────────────────┐
│  History  │  8.544 - 2.1   │ ← Previous
│  Panel    │  6.444         │ ← Current (large)
├───────────┼─────────────────┤
│  [DEG]    │  MC  MR  M+  M- │
│  [sin]    │  (   )   ← C CE │
│  [cos]    │  7   8   9   ÷  │
│  [tan]    │  4   5   6   ×  │
│  [√]      │  1   2   3   -  │
│  [x²]     │  0   .   =   +  │
│  [ln]     │  π   e   EXP    │
└───────────┴─────────────────┘
```

**Implementation:**
```javascript
// Use math.js for calculations
import { evaluate } from 'mathjs';

const [display, setDisplay] = useState('0');
const [history, setHistory] = useState([]);
const [angleMode, setAngleMode] = useState('deg'); // 'deg' or 'rad'

const calculate = () => {
  try {
    // Configure math.js
    const config = { number: 'BigNumber' };
    let expression = display;
    
    // Convert trig functions based on angle mode
    if (angleMode === 'deg') {
      expression = convertToRadians(expression);
    }
    
    const result = evaluate(expression, config);
    setHistory([...history, { expression: display, result }]);
    setDisplay(String(result));
  } catch (error) {
    setDisplay('Error');
  }
};
```

**Error Handling:**
- "Syntax Error" for invalid expressions
- "Math Error" for operations like sqrt(-1) (unless complex mode)
- "Divide by Zero" error

**Responsive Design:**
- Desktop: full calculator layout
- Mobile: larger buttons for touch
- Portrait mode optimized

---

### 4. Equation Solver (حل المعادلات)

**Route**: `/student/lab/equation-solver`  
**Priority**: HIGH - Core curriculum 1AC → 2BAC

#### Solver Types:

**1. Linear Equations (1 variable)**
- Input: `ax + b = c` or `2x + 5 = 13`
- Show solution steps
- Verify solution
- Grade levels: 1AC+

**2. System of 2 Equations (2 variables)**
- Input format:
  ```
  Equation 1: ax + by = c
  Equation 2: dx + ey = f
  ```
- Solution methods (toggle):
  - Substitution method (with steps)
  - Elimination method (with steps)
  - Graphical method (show intersection)
  - Matrix method (for 2BAC)
- Grade levels: 3AC+

**3. Quadratic Equations**
- Input: `ax² + bx + c = 0`
- Show:
  - Discriminant (Δ = b² - 4ac)
  - Nature of roots (2 real, 1 real, 2 complex)
  - Solutions (exact form with √)
  - Factored form: `a(x - x₁)(x - x₂)`
- Vertex form: `a(x - h)² + k`
- Graph the parabola
- Grade levels: 3AC+

**4. Inequations**
- Linear inequations: `ax + b > c`
- Show solution on number line
- Grade levels: 3AC+

**5. Advanced (2BAC)**
- Polynomial equations (degree 3+)
- Numerical methods (Newton-Raphson for approximations)

#### UI Layout:

```
┌─────────────────────────────────────┐
│  Select Equation Type:              │
│  [Linear] [System] [Quadratic] ...  │
├─────────────────────────────────────┤
│  Enter Equation:                    │
│  [ 2x + 5 = 13          ]          │
│  [Solve ✓]                          │
├─────────────────────────────────────┤
│  Solution:                          │
│  ┌─────────────────────────────┐   │
│  │ Step 1: 2x + 5 = 13         │   │
│  │ Step 2: 2x = 13 - 5         │   │
│  │ Step 3: 2x = 8              │   │
│  │ Step 4: x = 4               │   │
│  │                              │   │
│  │ ✓ Verification: 2(4)+5 = 13 │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Features:**
- Step-by-step solutions (toggleable)
- Verify solution button
- Copy solution to clipboard
- Show work in Arabic mathematical notation (RTL numbers)
- Export as PDF (for homework)

**Implementation Notes:**
```javascript
// Linear equation solver
const solveLinear = (a, b, c) => {
  // ax + b = c → x = (c - b) / a
  if (a === 0) {
    if (b === c) return 'Infinite solutions';
    return 'No solution';
  }
  return (c - b) / a;
};

// Quadratic solver with steps
const solveQuadratic = (a, b, c) => {
  const discriminant = b * b - 4 * a * c;
  const steps = [
    `Given equation: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
    `Calculate discriminant: Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`,
  ];
  
  if (discriminant > 0) {
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    steps.push(`Two real solutions:`);
    steps.push(`x₁ = ${formatSolution(x1)}`);
    steps.push(`x₂ = ${formatSolution(x2)}`);
    return { discriminant, solutions: [x1, x2], steps };
  } else if (discriminant === 0) {
    const x = -b / (2 * a);
    steps.push(`One real solution: x = ${formatSolution(x)}`);
    return { discriminant, solutions: [x], steps };
  } else {
    // Complex solutions for 2BAC
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-discriminant) / (2 * a);
    steps.push(`Two complex solutions:`);
    steps.push(`x₁ = ${realPart} + ${imagPart}i`);
    steps.push(`x₂ = ${realPart} - ${imagPart}i`);
    return { discriminant, solutions: [], complex: true, steps };
  }
};
```

---

### 5. Unit Converter (محول الوحدات)

**Route**: `/student/lab/unit-converter`  
**Priority**: HIGH - Universal for sciences

#### Conversion Categories:

**1. Length**
- Metric: mm, cm, m, km
- Imperial: inch, foot, yard, mile
- Common uses: Physics, everyday

**2. Mass**
- Metric: mg, g, kg, ton
- Imperial: ounce, pound, ton
- Common uses: Chemistry, Physics

**3. Volume**
- Metric: mL, cL, dL, L, m³, cm³
- Imperial: fl oz, cup, pint, quart, gallon
- Common uses: Chemistry

**4. Time**
- ms, s, min, hour, day, week, month, year
- Common uses: All sciences

**5. Speed**
- m/s, km/h, mph, knot
- Common uses: Physics (3AC, 1BAC, 2BAC PC)

**6. Temperature**
- Celsius (°C), Fahrenheit (°F), Kelvin (K)
- Common uses: Chemistry, Physics

**7. Pressure**
- Pascal (Pa), bar, atmosphere (atm), mmHg
- Common uses: 1AC PC, 2BAC PC

**8. Energy**
- Joule (J), kJ, calorie, kcal, kWh, eV
- Common uses: Physics (1BAC, 2BAC PC)

**9. Power**
- Watt (W), kW, MW, horsepower
- Common uses: Physics (3AC, 1BAC PC)

**10. Electric Units**
- Voltage: V, kV, mV
- Current: A, mA, µA
- Resistance: Ω, kΩ, MΩ
- Common uses: 1AC, 3AC, 1BAC, 2BAC PC

**11. Frequency**
- Hz, kHz, MHz, GHz
- Common uses: 2BAC PC (waves)

**12. Amount of Substance (Mole)**
- mol, mmol, kmol
- Particle count ↔ moles (using Avogadro's number)
- Common uses: 1BAC, 2BAC PC (chemistry)

#### UI Design:

```
┌───────────────────────────────────────┐
│  Category: [Length ▼]                 │
├───────────────────────────────────────┤
│  From: [100] [meters ▼]              │
│   ↓↑                                  │
│  To:   [328.084] [feet ▼]            │
├───────────────────────────────────────┤
│  Quick Conversions:                   │
│  • 1 meter = 100 cm                   │
│  • 1 meter = 3.28084 feet             │
│  • 1 km = 1000 m                      │
└───────────────────────────────────────┘
```

**Features:**
- Auto-convert as user types
- Swap button (flip from/to units)
- Recent conversions history
- Precision selector (2-6 decimal places)
- Copy result button
- Common conversion reference table per category

**Implementation:**
```javascript
const conversionFactors = {
  length: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    millimeter: 1000,
    foot: 3.28084,
    inch: 39.3701,
    mile: 0.000621371,
    yard: 1.09361,
  },
  mass: {
    kilogram: 1,
    gram: 1000,
    milligram: 1000000,
    ton: 0.001,
    pound: 2.20462,
    ounce: 35.274,
  },
  // ... more categories
};

const convert = (value, fromUnit, toUnit, category) => {
  const factors = conversionFactors[category];
  // Convert to base unit, then to target unit
  const baseValue = value / factors[fromUnit];
  return baseValue * factors[toUnit];
};
```

**Styling:**
- Large input fields for easy mobile input
- Visual swap icon between units
- Category tabs or dropdown (prominent)
- Color-coded categories (math=blue, physics=purple, chem=green)

---

### 6. Periodic Table Explorer (الجدول الدوري التفاعلي)

**Route**: `/student/lab/periodic-table`  
**Priority**: HIGH - Chemistry goldmine (3AC, 1BAC, 2BAC PC)

#### Features:

**Interactive Table:**
- Full periodic table layout (18 groups × 7 periods + lanthanides/actinides)
- Color-coded by:
  - Metal / Non-metal / Metalloid
  - Element groups (alkali metals, noble gases, halogens, etc.)
  - State at room temp (solid/liquid/gas)
  - Block (s, p, d, f)
- Hover effect: highlight element
- Click element: show details panel

**Element Details Panel:**
When clicking an element (e.g., Oxygen - O):
```
┌───────────────────────────────────┐
│  O                                │
│  Oxygen | الأكسجين               │
│  Atomic Number: 8                 │
│  Atomic Mass: 15.999 u            │
│  Symbol: O                        │
│  Group: 16 (Chalcogens)          │
│  Period: 2                        │
│  Block: p                         │
│  State: Gas (at 20°C)            │
│  Electron Config: 1s² 2s² 2p⁴    │
│  Electronegativity: 3.44         │
│  Melting Point: -218.79°C        │
│  Boiling Point: -182.95°C        │
│  Density: 1.43 g/L               │
│  Uses: Respiration, combustion   │
└───────────────────────────────────┘
```

**Search & Filter:**
- Search by name (AR/FR/EN), symbol, atomic number
- Filter by:
  - Element type (metal/non-metal/metalloid)
  - State (solid/liquid/gas)
  - Group
  - Period
  - Block

**Learning Modes:**
- Quiz mode: "Name this element" (show symbol, user types name)
- Trends visualizer:
  - Atomic radius trend
  - Ionization energy trend
  - Electronegativity trend
  - Show as heatmap on table

**Color Legend:**
- Toggle legend visibility
- Explain what each color represents
- Allow switching color scheme (by type, group, state, etc.)

**Additional Info:**
- Common compounds section per element
- Historical discovery date
- Named after (person/place/property)
- Isotopes (for 2BAC level)

**Implementation:**
```javascript
// Element data structure
const elements = [
  {
    atomicNumber: 1,
    symbol: 'H',
    nameEn: 'Hydrogen',
    nameFr: 'Hydrogène',
    nameAr: 'الهيدروجين',
    atomicMass: 1.008,
    group: 1,
    period: 1,
    block: 's',
    type: 'nonmetal',
    state: 'gas',
    electronConfig: '1s¹',
    electronegativity: 2.20,
    meltingPoint: -259.16, // °C
    boilingPoint: -252.87,
    density: 0.0899, // g/L at STP
    uses: ['Fuel', 'Ammonia production', 'Petroleum refining'],
    discoveryYear: 1766,
  },
  // ... 118 elements total
];

// Render periodic table grid
const PeriodicTable = () => {
  return (
    <div className="periodic-table-grid">
      {elements.map(el => (
        <ElementCell 
          key={el.atomicNumber} 
          element={el}
          style={{
            gridColumn: el.group,
            gridRow: el.period,
          }}
          onClick={() => showElementDetails(el)}
        />
      ))}
    </div>
  );
};
```

**Data Source:**
- Use public periodic table API or embed JSON file
- Suggested: https://github.com/Bowserinator/Periodic-Table-JSON

**Styling:**
- CSS Grid for table layout
- Responsive: on mobile, show list view with search
- Element cells: square with symbol, atomic number, name
- Smooth transitions when filtering
- Print-friendly version (optional)

---

## Technical Implementation Guidelines

### Project Structure

```
madrasti-frontend/
├── src/
│   ├── pages/
│   │   └── student/
│   │       └── lab/
│   │           ├── LabHome.jsx              # Main lab page
│   │           ├── FunctionGrapher.jsx      # Tool pages
│   │           ├── ScientificCalculator.jsx
│   │           ├── EquationSolver.jsx
│   │           ├── UnitConverter.jsx
│   │           ├── PeriodicTable.jsx
│   │           └── [other-tools].jsx
│   ├── components/
│   │   └── lab/
│   │       ├── ToolCard.jsx                 # Reusable components
│   │       ├── CategoryFilter.jsx
│   │       ├── LabLayout.jsx                # Common layout wrapper
│   │       ├── MathInput.jsx                # Math expression input
│   │       ├── GraphCanvas.jsx              # Reusable graph component
│   │       └── StepDisplay.jsx              # Solution steps display
│   ├── utils/
│   │   └── lab/
│   │       ├── mathHelpers.js               # Math.js wrappers
│   │       ├── converters.js                # Unit conversion logic
│   │       ├── equationSolvers.js           # Solver algorithms
│   │       └── periodicTableData.js         # Element data
│   ├── data/
│   │   └── labTools.js                      # Tool metadata
│   └── styles/
│       └── lab.css                          # Lab-specific styles
```

### Common Components

**LabLayout.jsx** - Wrapper for all lab tools:
```jsx
const LabLayout = ({ title, children, backLink = '/student/exercises/lab' }) => {
  return (
    <div className="lab-layout">
      <header className="lab-header">
        <button onClick={() => navigate(backLink)}>← Back to Lab</button>
        <h1>{title}</h1>
        <div className="lab-actions">
          <button>Share</button>
          <button>Help</button>
        </div>
      </header>
      <main className="lab-content">
        {children}
      </main>
    </div>
  );
};
```

**MathInput.jsx** - Math expression input with validation:
```jsx
import { useState, useEffect } from 'react';
import { parse } from 'mathjs';

const MathInput = ({ value, onChange, onValidate, placeholder }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      parse(value);
      setError(null);
      onValidate?.(true);
    } catch (err) {
      setError(err.message);
      onValidate?.(false);
    }
  }, [value]);

  return (
    <div className="math-input">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
```

### State Management

Use React Context for lab-wide settings:
```javascript
// contexts/LabContext.jsx
export const LabContext = createContext();

export const LabProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    language: 'ar', // ar, fr, en
    theme: 'light',
    gradeLevel: null, // from user profile
    showSteps: true,
    decimalPrecision: 2,
  });

  const [recentTools, setRecentTools] = useState([]);

  const addRecentTool = (toolId) => {
    setRecentTools(prev => [
      toolId,
      ...prev.filter(id => id !== toolId)
    ].slice(0, 3));
  };

  return (
    <LabContext.Provider value={{
      settings,
      setSettings,
      recentTools,
      addRecentTool,
    }}>
      {children}
    </LabContext.Provider>
  );
};
```

### Routing

```javascript
// App.jsx or routes config
import { Routes, Route } from 'react-router-dom';

<Route path="/student/exercises/lab">
  <Route index element={<LabHome />} />
  <Route path="function-grapher" element={<FunctionGrapher />} />
  <Route path="calculator" element={<ScientificCalculator />} />
  <Route path="equation-solver" element={<EquationSolver />} />
  <Route path="unit-converter" element={<UnitConverter />} />
  <Route path="periodic-table" element={<PeriodicTable />} />
  {/* More tool routes */}
</Route>
```

### Backend Requirements (Django)

**Models:**
```python
# models.py
class LabTool(models.Model):
    CATEGORY_CHOICES = [
        ('math', 'Mathematics'),
        ('physics', 'Physics'),
        ('chemistry', 'Chemistry'),
        ('biology', 'Biology'),
        ('economics', 'Economics'),
        ('languages', 'Languages'),
    ]
    
    tool_id = models.CharField(max_length=50, unique=True)
    name_ar = models.CharField(max_length=100)
    name_fr = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description_ar = models.TextField()
    description_fr = models.TextField()
    description_en = models.TextField()
    grade_levels = models.JSONField()  # ["1AC", "2AC", "3AC"]
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    icon = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['category', 'name_en']

class LabUsage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tool = models.ForeignKey(LabTool, on_delete=models.CASCADE)
    used_at = models.DateTimeField(auto_now_add=True)
    duration_seconds = models.IntegerField(null=True)  # Time spent
    
    class Meta:
        ordering = ['-used_at']
```

**API Endpoints:**
```python
# views.py
from rest_framework import viewsets
from rest_framework.decorators import action

class LabToolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LabTool.objects.filter(is_active=True)
    serializer_class = LabToolSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by grade level
        grade = self.request.query_params.get('grade')
        if grade:
            queryset = queryset.filter(grade_levels__contains=grade)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get user's recently used tools"""
        recent_usage = LabUsage.objects.filter(
            user=request.user
        ).order_by('-used_at')[:5]
        
        tool_ids = [usage.tool_id for usage in recent_usage]
        tools = LabTool.objects.filter(id__in=tool_ids)
        
        serializer = self.get_serializer(tools, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def track_usage(self, request, pk=None):
        """Track when a student uses a tool"""
        tool = self.get_object()
        LabUsage.objects.create(
            user=request.user,
            tool=tool,
            duration_seconds=request.data.get('duration')
        )
        return Response({'status': 'tracked'})

# urls.py
router.register(r'lab-tools', LabToolViewSet, basename='lab-tools')
```

### Dependencies to Install

**Frontend:**
```json
{
  "dependencies": {
    "mathjs": "^12.0.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.300.0"
  }
}
```

Install:
```bash
npm install mathjs recharts lucide-react
```

**Backend:**
```
# No new dependencies needed - using existing DRF setup
```

### CSS/Styling Guidelines

**Lab-specific styles (lab.css):**
```css
/* Lab Layout */
.lab-layout {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.lab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid var(--border-color);
}

.lab-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Tool Cards */
.tool-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.tool-card-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.tool-card-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--success-color);
  color: white;
  font-size: 0.75rem;
  border-radius: 4px;
  text-transform: uppercase;
}

/* Graph Canvas */
.graph-canvas {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  min-height: 400px;
  position: relative;
}

/* Math Input */
.math-input input {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  width: 100%;
}

.math-input input.error {
  border-color: var(--error-color);
}

.error-message {
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

/* Calculator Layout */
.calculator {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.calculator-display {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: right;
  min-height: 80px;
}

.calculator-display-current {
  font-size: 2rem;
  font-weight: 600;
  word-break: break-all;
}

.calculator-display-previous {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.calculator-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.calculator-button {
  padding: 1rem;
  font-size: 1.25rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-secondary);
}

.calculator-button:hover {
  background: var(--bg-hover);
}

.calculator-button.operator {
  background: var(--primary-color);
  color: white;
}

.calculator-button.equals {
  background: var(--success-color);
  color: white;
  grid-column: span 2;
}

/* Periodic Table */
.periodic-table-grid {
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 2px;
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
}

.element-cell {
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
}

.element-cell:hover {
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.element-cell-number {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.element-cell-symbol {
  font-size: 1.5rem;
  font-weight: bold;
}

.element-cell-name {
  font-size: 0.6rem;
  text-align: center;
}

/* Element type colors */
.element-cell.metal { background: #e3f2fd; }
.element-cell.nonmetal { background: #fff3e0; }
.element-cell.metalloid { background: #f3e5f5; }
.element-cell.noble-gas { background: #e8f5e9; }

/* Responsive */
@media (max-width: 768px) {
  .lab-content {
    padding: 1rem;
  }
  
  .tool-card {
    padding: 1rem;
  }
  
  .calculator {
    max-width: 100%;
  }
  
  .periodic-table-grid {
    display: none; /* Show list view on mobile */
  }
  
  .periodic-table-list {
    display: block;
  }
}

/* RTL Support */
[dir="rtl"] .lab-header {
  direction: rtl;
}

[dir="rtl"] .calculator-display {
  text-align: left;
}

[dir="rtl"] .tool-card {
  text-align: right;
}
```

### Testing Checklist

**For Each Tool:**
- [ ] Works with Arabic UI (RTL)
- [ ] Works with French UI
- [ ] Works with English UI
- [ ] Responsive on mobile (320px+)
- [ ] Responsive on tablet (768px+)
- [ ] Responsive on desktop (1024px+)
- [ ] Keyboard navigation works
- [ ] Error states handled gracefully
- [ ] Loading states shown
- [ ] Works offline (if applicable)
- [ ] Math expressions validated properly
- [ ] Results are accurate (test against known values)
- [ ] Accessibility: screen reader friendly
- [ ] Print-friendly (if needed)

**Browser Compatibility:**
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 9+)

### Performance Considerations

**Optimization Tips:**
1. **Lazy load tools**: Don't load all tools on Lab home page
   ```javascript
   const FunctionGrapher = lazy(() => import('./FunctionGrapher'));
   ```

2. **Memoize expensive calculations**:
   ```javascript
   const graphPoints = useMemo(() => 
     generatePoints(func, xMin, xMax), 
     [func, xMin, xMax]
   );
   ```

3. **Debounce input changes**:
   ```javascript
   const debouncedCalculate = debounce(calculate, 300);
   ```

4. **Use Web Workers for heavy math** (optional):
   - Equation solving for high-degree polynomials
   - Large dataset graphing
   - Complex number calculations

5. **Cache API responses**:
   - Lab tools list
   - Periodic table data
   - Recent usage

### Accessibility (A11Y)

**Requirements:**
- All interactive elements must be keyboard accessible (Tab, Enter, Esc)
- Proper ARIA labels for screen readers
- Sufficient color contrast (WCAG AA)
- Focus indicators visible
- Alt text for icons/images
- Form labels properly associated
- Error messages announced to screen readers

**Example:**
```jsx
<button
  onClick={calculate}
  aria-label="Calculate result"
  className="calculator-button equals"
>
  =
</button>

<input
  type="text"
  value={expression}
  onChange={handleChange}
  aria-label="Enter mathematical expression"
  aria-invalid={hasError}
  aria-describedby={hasError ? "error-message" : null}
/>
{hasError && (
  <span id="error-message" role="alert" className="error-message">
    {errorMessage}
  </span>
)}
```

### Internationalization (i18n)

**Translation Keys Structure:**
```javascript
// locales/ar.json
{
  "lab": {
    "title": "مختبري",
    "backToLab": "العودة إلى المختبر",
    "searchTools": "ابحث عن أداة...",
    "categories": {
      "math": "الرياضيات",
      "physics": "الفيزياء",
      "chemistry": "الكيمياء",
      "biology": "علوم الحياة والأرض"
    },
    "tools": {
      "functionGrapher": {
        "name": "رسم الدوال",
        "description": "رسم وتحليل جميع أنواع الدوال الرياضية"
      },
      "calculator": {
        "name": "آلة حاسبة علمية",
        "description": "آلة حاسبة مع وظائف علمية متقدمة"
      }
    }
  }
}
```

**Usage:**
```javascript
import { useTranslation } from 'react-i18next';

const LabHome = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('lab.title')}</h1>
      {/* ... */}
    </div>
  );
};
```

### Error Handling

**Global Error Boundary:**
```jsx
class LabErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lab tool error:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>حدث خطأ في الأداة</h2>
          <p>نعتذر، حدث خطأ. يرجى المحاولة مرة أخرى.</p>
          <button onClick={() => window.location.reload()}>
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Analytics & Tracking

**Track tool usage:**
```javascript
// utils/analytics.js
export const trackLabToolUsage = (toolId, duration) => {
  // Send to backend
  api.post('/lab-tools/' + toolId + '/track_usage/', {
    duration: duration
  });
  
  // Also track in Google Analytics or similar
  if (window.gtag) {
    window.gtag('event', 'lab_tool_used', {
      tool_id: toolId,
      duration: duration
    });
  }
};

// In tool component
useEffect(() => {
  const startTime = Date.now();
  
  return () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    trackLabToolUsage(toolId, duration);
  };
}, []);
```

### Future Enhancements (Post-Phase 1)

**Phase 2 Tools (8 tools):**
1. Derivative & Limit Calculator
2. Integral Calculator
3. Electricity Simulator (advanced circuits)
4. Human Body Explorer (3D anatomy)
5. Chemical Equation Balancer (with animation)
6. Stoichiometry Calculator
7. Newton's Laws Simulator
8. Sequences Calculator

**Phase 3 Tools (10 tools):**
9. Complex Numbers Calculator
10. RC/RL Circuit Simulator
11. Genetics Tools (Punnett squares)
12. Probability Calculator
13. Matrix Calculator
14. Organic Chemistry Builder
15. Oscillations & Waves Simulator
16. Nuclear Physics Calculator
17. Arabic Grammar Tool
18. 3D Geometry Visualizer

**Premium Features:**
- AI tutor integration (explain steps)
- Advanced graphing (3D plots, parametric)
- Custom tool builder (teachers create tools)
- Collaborative mode (work with classmates)
- Offline mode (PWA)
- Export to homework format
- Step-by-step video explanations
- Practice problem generator per tool

### Deployment

**Frontend Build:**
```bash
npm run build
# Outputs to dist/ folder
# Deploy to Netlify/Vercel or serve from Django static
```

**Django Migration:**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata lab_tools_initial.json  # Seed tools
```

**Environment Variables:**
```env
# .env
VITE_API_BASE_URL=https://api.madrasti.com
VITE_LAB_ANALYTICS_ID=GA-XXXXXXX
```

---

## Documentation for Teachers/Admins

Create a teacher-facing guide explaining:
- How students access the Lab
- What each tool does and which curriculum it supports
- How to track student usage (analytics dashboard)
- How to suggest new tools
- Troubleshooting common issues

---

## Success Metrics

Track these KPIs after launch:
- Daily active users (DAU) in Lab
- Most used tools (top 5)
- Average time per tool
- Tool usage by grade level
- Student satisfaction (optional survey)
- Error rate per tool
- Mobile vs desktop usage split

**Target Goals (Month 1):**
- 40% of active students use Lab at least once
- Function Grapher: most used tool
- <2% error rate across all tools
- Average session: 5+ minutes per tool

---

## Support & Maintenance

**Bug Reports:**
- Users can report bugs via "Help" button in each tool
- Captures: tool ID, user grade level, error message, screenshot
- Sends to support email or creates Jira ticket

**Updates:**
- Monthly tool improvements based on feedback
- Quarterly new tool releases
- Bug fixes deployed weekly (if critical)

**Documentation:**
- Maintain internal wiki with tool architecture
- Video tutorials for each tool (students)
- Developer onboarding docs

---

## Conclusion

This implementation guide covers the foundational Phase 1 of the Madrasti Lab feature. These 6 core tools provide immediate value across all grade levels and establish the infrastructure for future expansion.

**Estimated Timeline:**
- Week 1-2: Lab landing page + routing + backend models
- Week 3-4: Function Grapher + Scientific Calculator
- Week 5: Equation Solver
- Week 6: Unit Converter + Periodic Table
- Week 7-8: Testing, bug fixes, polish, deployment

**Next Steps:**
1. Review this document with the dev team
2. Set up project board (Jira/Trello) with tasks
3. Create design mockups (Figma) for each tool
4. Begin implementation starting with LabHome page
5. Iterate based on testing and feedback

Good luck building the Lab, Younes! This will be a game-changer for Moroccan students. 🚀