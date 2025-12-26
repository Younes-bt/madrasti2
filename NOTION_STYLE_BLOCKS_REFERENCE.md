# Notion-Style Block Examples - Visual Reference

## Overview
This document provides visual examples of all enhanced block types with their new modern, Notion-style design.

---

## Semantic Block Types

### 1. Introduction Block (Blue) 📘

**Visual Characteristics:**
- **Background**: Light blue (`bg-blue-50` / `dark:bg-blue-950/30`)
- **Border**: Left border, 4px, solid blue (`border-blue-500`)
- **Icon**: BookOpen icon in blue rounded container
- **Label**: "Introduction" / "مقدمة" / "Introduction"

**When to Use:**
- Introducing new topics or concepts
- Lesson overview
- Starting a new section

**Example JSON:**
```json
{
  "id": "intro_1",
  "type": "paragraph",
  "content": {
    "text": "في هذا الدرس، سنتعلم عن أساسيات الإحصاء وكيفية تنظيم البيانات.",
    "text_en": "In this lesson, we'll learn about statistics fundamentals and data organization.",
    "text_fr": "Dans cette leçon, nous apprendrons les bases des statistiques."
  },
  "properties": {
    "semanticType": "introduction"
  }
}
```

**Visual Preview:**
```
┌─────────────────────────────────────────────────┐
│ ┏━━━┓  Introduction                             │
│ ┃ 📖 ┃  في هذا الدرس، سنتعلم عن أساسيات...     │
│ ┗━━━┛                                            │
│ Light blue background, blue left border         │
└─────────────────────────────────────────────────┘
```

---

### 2. Definition Block (Purple) 🧠

**Visual Characteristics:**
- **Background**: Light purple (`bg-purple-50` / `dark:bg-purple-950/30`)
- **Border**: Left border, 4px, solid purple (`border-purple-500`)
- **Icon**: BrainCircuit icon in purple rounded container
- **Label**: "Definition" / "تعريف" / "Définition"

**When to Use:**
- Defining key terms
- Explaining concepts
- Formal definitions

**Example JSON:**
```json
{
  "id": "def_1",
  "type": "paragraph",
  "content": {
    "text": "الإحصاء: هو علم جمع وتنظيم وتحليل البيانات.",
    "text_en": "Statistics: The science of collecting, organizing, and analyzing data.",
    "text_fr": "Statistiques: La science de la collecte et de l'analyse des données."
  },
  "properties": {
    "semanticType": "definition"
  }
}
```

**Visual Preview:**
```
┌─────────────────────────────────────────────────┐
│ ┏━━━┓  تعريف                                    │
│ ┃ 🧠 ┃  الإحصاء: هو علم جمع وتنظيم...          │
│ ┗━━━┛                                            │
│ Light purple background, purple left border     │
└─────────────────────────────────────────────────┘
```

---

### 3. Example Block (Amber) 💡

**Visual Characteristics:**
- **Background**: Light amber/orange (`bg-amber-50` / `dark:bg-amber-950/30`)
- **Border**: Left border, 4px, solid amber (`border-amber-500`)
- **Icon**: Lightbulb icon in amber rounded container
- **Label**: "Example" / "مثال" / "Exemple"

**When to Use:**
- Providing practical examples
- Illustrating concepts
- Worked problems

**Example JSON:**
```json
{
  "id": "ex_1",
  "type": "paragraph",
  "content": {
    "text": "مثال: إذا كان لدينا الأعداد {5, 8, 12, 15}، المتوسط = $\\frac{5+8+12+15}{4} = 10$",
    "text_en": "Example: For numbers {5, 8, 12, 15}, mean = $\\frac{5+8+12+15}{4} = 10$"
  },
  "properties": {
    "semanticType": "example"
  }
}
```

**With SVG:**
```json
{
  "id": "ex_2",
  "type": "paragraph",
  "content": {
    "text": "مثال: الشكل التالي يوضح مثلث: <svg width=\"60\" height=\"50\"><polygon points=\"30,5 55,45 5,45\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/></svg>"
  },
  "properties": {
    "semanticType": "example"
  }
}
```

**Visual Preview:**
```
┌─────────────────────────────────────────────────┐
│ ┏━━━┓  مثال                                     │
│ ┃ 💡 ┃  إذا كان لدينا الأعداد...               │
│ ┗━━━┛  المتوسط = (formula here)                │
│ Light amber background, amber left border       │
└─────────────────────────────────────────────────┘
```

---

### 4. Theorem Block (Emerald) ⚗️

**Visual Characteristics:**
- **Background**: Light emerald/green (`bg-emerald-50` / `dark:bg-emerald-950/30`)
- **Border**: Left border, 4px, solid emerald (`border-emerald-500`)
- **Icon**: FlaskConical icon in emerald rounded container
- **Label**: "Theorem" / "نظرية" / "Théorème"

**When to Use:**
- Mathematical theorems
- Scientific principles
- Important formulas
- Laws and rules

**Example JSON:**
```json
{
  "id": "thm_1",
  "type": "paragraph",
  "content": {
    "text": "نظرية فيثاغورس: في المثلث القائم، $a^2 + b^2 = c^2$",
    "text_en": "Pythagorean Theorem: In a right triangle, $a^2 + b^2 = c^2$",
    "text_fr": "Théorème de Pythagore: $a^2 + b^2 = c^2$"
  },
  "properties": {
    "semanticType": "theorem"
  }
}
```

**Visual Preview:**
```
┌─────────────────────────────────────────────────┐
│ ┏━━━┓  نظرية                                    │
│ ┃ ⚗️  ┃  نظرية فيثاغورس: في المثلث القائم...   │
│ ┗━━━┛  a² + b² = c²                             │
│ Light green background, green left border       │
└─────────────────────────────────────────────────┘
```

---

### 5. Note Block (Gray) 📝

**Visual Characteristics:**
- **Background**: Light gray (`bg-gray-50` / `dark:bg-gray-900/30`)
- **Border**: Left border, 4px, solid gray (`border-gray-500`)
- **Icon**: BookOpen icon in gray rounded container
- **Label**: "Note" / "ملاحظة" / "Remarque"

**When to Use:**
- Important reminders
- Additional information
- Warnings or tips
- Side notes

**Example JSON:**
```json
{
  "id": "note_1",
  "type": "paragraph",
  "content": {
    "text": "ملاحظة: تأكد من جمع جميع القيم بدقة قبل حساب المتوسط.",
    "text_en": "Note: Make sure to sum all values accurately before calculating the mean.",
    "text_fr": "Remarque: Assurez-vous de bien additionner toutes les valeurs."
  },
  "properties": {
    "semanticType": "note"
  }
}
```

**Visual Preview:**
```
┌─────────────────────────────────────────────────┐
│ ┏━━━┓  ملاحظة                                   │
│ ┃ 📝 ┃  تأكد من جمع جميع القيم بدقة...         │
│ ┗━━━┛                                            │
│ Light gray background, gray left border         │
└─────────────────────────────────────────────────┘
```

---

## Table Blocks with SVG

### Array-Based Table with SVG
```json
{
  "id": "table_1",
  "type": "table",
  "content": {
    "headers": ["الشكل", "الاسم", "المساحة"],
    "rows": [
      [
        "<svg width=\"40\" height=\"40\"><circle cx=\"20\" cy=\"20\" r=\"15\" fill=\"#3b82f6\"/></svg>",
        "دائرة",
        "$A = \\pi r^2$"
      ],
      [
        "<svg width=\"40\" height=\"40\"><rect x=\"5\" y=\"5\" width=\"30\" height=\"30\" fill=\"#ef4444\"/></svg>",
        "مربع",
        "$A = a^2$"
      ],
      [
        "<svg width=\"40\" height=\"40\"><polygon points=\"20,5 35,35 5,35\" fill=\"#10b981\"/></svg>",
        "مثلث",
        "$A = \\frac{1}{2}bh$"
      ]
    ]
  },
  "properties": {
    "hasHeader": true,
    "striped": true
  }
}
```

**Visual Preview:**
```
┌──────────────────────────────────────────────┐
│  الشكل  │   الاسم   │      المساحة        │
├──────────────────────────────────────────────┤
│   🔵    │   دائرة   │   A = πr²           │
├──────────────────────────────────────────────┤
│   🟥    │   مربع    │   A = a²            │
├──────────────────────────────────────────────┤
│   🟩    │   مثلث    │   A = ½bh           │
└──────────────────────────────────────────────┘
```

### HTML Table
```json
{
  "id": "table_2",
  "type": "table",
  "content": {
    "html": "<table><thead><tr><th>القيمة</th><th>التكرار</th><th>النسبة</th></tr></thead><tbody><tr><td>100</td><td>5</td><td>25%</td></tr><tr><td>150</td><td>10</td><td>50%</td></tr><tr><td>200</td><td>5</td><td>25%</td></tr></tbody></table>",
    "description": "جدول توزيع التكرارات"
  }
}
```

---

## Complete Lesson Example

Here's a complete lesson combining all block types:

```json
{
  "blocks": [
    {
      "id": "1",
      "type": "heading",
      "level": 1,
      "content": {
        "text": "الإحصاء والبيانات"
      }
    },
    {
      "id": "2",
      "type": "paragraph",
      "content": {
        "text": "في هذا الدرس سنتعلم كيفية جمع وتنظيم البيانات الإحصائية."
      },
      "properties": {
        "semanticType": "introduction"
      }
    },
    {
      "id": "3",
      "type": "heading",
      "level": 2,
      "content": {
        "text": "التعريفات الأساسية"
      }
    },
    {
      "id": "4",
      "type": "paragraph",
      "content": {
        "text": "البيانات: مجموعة من المعلومات التي يتم جمعها لأغراض التحليل."
      },
      "properties": {
        "semanticType": "definition"
      }
    },
    {
      "id": "5",
      "type": "paragraph",
      "content": {
        "text": "مثال: درجات 5 طلاب: {85, 90, 78, 92, 88}. المتوسط = $\\frac{85+90+78+92+88}{5} = 86.6$"
      },
      "properties": {
        "semanticType": "example"
      }
    },
    {
      "id": "6",
      "type": "table",
      "content": {
        "headers": ["الطالب", "الدرجة", "الحالة"],
        "rows": [
          ["أحمد", "85", "ناجح"],
          ["فاطمة", "90", "ناجح"],
          ["محمد", "78", "ناجح"]
        ]
      }
    },
    {
      "id": "7",
      "type": "paragraph",
      "content": {
        "text": "المتوسط الحسابي = $\\bar{x} = \\frac{\\sum x_i}{n}$ حيث $n$ عدد القيم"
      },
      "properties": {
        "semanticType": "theorem"
      }
    },
    {
      "id": "8",
      "type": "paragraph",
      "content": {
        "text": "ملاحظة: تأكد من جمع جميع القيم قبل القسمة على العدد."
      },
      "properties": {
        "semanticType": "note"
      }
    }
  ]
}
```

---

## Design Specifications

### Spacing
- **Block margin**: `my-6` (1.5rem top/bottom)
- **Block padding**: `p-5` (1.25rem all sides)
- **Icon container**: `h-10 w-10` (2.5rem × 2.5rem)
- **Gap between icon and content**: `gap-4` (1rem)

### Borders
- **Semantic block border**: `border-l-4` (4px left border)
- **Border opacity**: `border-opacity-20`
- **Table borders**: `1px solid`

### Shadows
- **Default**: `shadow-md`
- **Hover**: `shadow-lg`
- **Transition**: `duration-200`

### Typography
- **Semantic label**: `font-bold text-base`
- **Content**: `text-base leading-relaxed`
- **Table headers**: `text-xs uppercase tracking-wider`

### Colors (Light Mode)

| Semantic Type | Background | Border | Icon/Text |
|--------------|------------|---------|-----------|
| Introduction | `bg-blue-50` | `border-blue-500` | `text-blue-600` |
| Definition | `bg-purple-50` | `border-purple-500` | `text-purple-600` |
| Example | `bg-amber-50` | `border-amber-500` | `text-amber-600` |
| Theorem | `bg-emerald-50` | `border-emerald-500` | `text-emerald-600` |
| Note | `bg-gray-50` | `border-gray-500` | `text-gray-600` |

### Colors (Dark Mode)

| Semantic Type | Background | Border | Icon/Text |
|--------------|------------|---------|-----------|
| Introduction | `dark:bg-blue-950/30` | `border-blue-500` | `dark:text-blue-400` |
| Definition | `dark:bg-purple-950/30` | `border-purple-500` | `dark:text-purple-400` |
| Example | `dark:bg-amber-950/30` | `border-amber-500` | `dark:text-amber-400` |
| Theorem | `dark:bg-emerald-950/30` | `border-emerald-500` | `dark:text-emerald-400` |
| Note | `dark:bg-gray-900/30` | `border-gray-500` | `dark:text-gray-400` |

---

## Animation Details

### Block Entry Animation
```javascript
{
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.05 }
  }
}
```

- **Effect**: Fade in from bottom
- **Duration**: 400ms
- **Stagger**: 50ms per block
- **Easing**: Default (ease-out)

---

## Best Practices

### ✅ DO:
- Use semantic types to classify content logically
- Include Arabic, English, and French translations
- Use inline math with `$formula$` syntax
- Keep SVGs simple and properly sized
- Test in both light and dark mode
- Verify RTL layout for Arabic

### ❌ DON'T:
- Nest semantic blocks inside each other
- Use overly complex SVGs (performance)
- Forget to include language variants
- Mix different content types in same block unnecessarily
- Override semantic colors unless absolutely needed

---

## Accessibility Features

- ✅ Proper heading hierarchy
- ✅ Semantic HTML elements
- ✅ Color contrast ratios meet WCAG AA
- ✅ Keyboard navigable tables
- ✅ Screen reader friendly labels
- ✅ RTL support for Arabic
- ✅ Responsive on all screen sizes
- ✅ Dark mode support

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Further Customization

To add new semantic types, edit `TextBlock.jsx`:

```javascript
const semanticTypes = {
  yourNewType: {
    icon: YourIcon,
    label: { en: 'Your Type', ar: 'نوعك', fr: 'Votre Type' },
    bg: 'bg-color-50 dark:bg-color-950/30',
    border: 'border-l-4 border-color-500',
    iconColor: 'text-color-600 dark:text-color-400',
    textColor: 'text-color-900 dark:text-color-100'
  }
}
```
