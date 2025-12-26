# Block Semantic Types - Usage Guide

This guide explains how to use semantic types in the lesson blocks to create a modern, Notion-style educational experience.

## Available Semantic Types

The TextBlock component now supports the following semantic types for educational content:

### 1. Introduction (`semanticType: "introduction"`)
- **Color**: Blue
- **Icon**: BookOpen
- **Use case**: Introducing a new topic or concept
- **Example**:
```json
{
  "id": "block_1",
  "type": "paragraph",
  "content": {
    "text": "في هذا الدرس، سنتعلم عن أساسيات الإحصاء وكيفية جمع البيانات وتنظيمها.",
    "text_en": "In this lesson, we'll learn about statistics fundamentals and how to collect and organize data.",
    "text_fr": "Dans cette leçon, nous apprendrons les bases des statistiques et comment collecter et organiser les données."
  },
  "properties": {
    "semanticType": "introduction"
  }
}
```

### 2. Definition (`semanticType: "definition"`)
- **Color**: Purple
- **Icon**: BrainCircuit
- **Use case**: Defining key terms and concepts
- **Example**:
```json
{
  "id": "block_2",
  "type": "paragraph",
  "content": {
    "text": "الإحصاء هو علم جمع وتنظيم وتحليل وتفسير البيانات.",
    "text_en": "Statistics is the science of collecting, organizing, analyzing, and interpreting data.",
    "text_fr": "Les statistiques sont la science de la collecte, de l'organisation, de l'analyse et de l'interprétation des données."
  },
  "properties": {
    "semanticType": "definition"
  }
}
```

### 3. Example (`semanticType: "example"`)
- **Color**: Amber/Orange
- **Icon**: Lightbulb
- **Use case**: Providing examples to illustrate concepts
- **Example**:
```json
{
  "id": "block_3",
  "type": "paragraph",
  "content": {
    "text": "مثال: إذا كان لدينا مجموعة من الأعداد {5, 8, 12, 15}، فإن المتوسط الحسابي = $\\frac{5+8+12+15}{4} = 10$",
    "text_en": "Example: If we have a set of numbers {5, 8, 12, 15}, the mean = $\\frac{5+8+12+15}{4} = 10$",
    "text_fr": "Exemple: Si nous avons un ensemble de nombres {5, 8, 12, 15}, la moyenne = $\\frac{5+8+12+15}{4} = 10$"
  },
  "properties": {
    "semanticType": "example"
  }
}
```

### 4. Theorem (`semanticType: "theorem"`)
- **Color**: Emerald/Green
- **Icon**: FlaskConical
- **Use case**: Presenting theorems, formulas, or mathematical principles
- **Example**:
```json
{
  "id": "block_4",
  "type": "paragraph",
  "content": {
    "text": "نظرية فيثاغورس: في المثلث القائم الزاوية، مربع الوتر يساوي مجموع مربعي الضلعين الآخرين: $a^2 + b^2 = c^2$",
    "text_en": "Pythagorean Theorem: In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: $a^2 + b^2 = c^2$",
    "text_fr": "Théorème de Pythagore: Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés: $a^2 + b^2 = c^2$"
  },
  "properties": {
    "semanticType": "theorem"
  }
}
```

### 5. Note (`semanticType: "note"`)
- **Color**: Gray
- **Icon**: BookOpen
- **Use case**: Important notes, reminders, or additional information
- **Example**:
```json
{
  "id": "block_5",
  "type": "paragraph",
  "content": {
    "text": "ملاحظة: يجب التأكد من أن جميع القيم موجبة قبل حساب الجذر التربيعي.",
    "text_en": "Note: Make sure all values are positive before calculating the square root.",
    "text_fr": "Remarque: Assurez-vous que toutes les valeurs sont positives avant de calculer la racine carrée."
  },
  "properties": {
    "semanticType": "note"
  }
}
```

## HTML/SVG Support in Blocks

Blocks now support HTML and SVG content, which will be automatically rendered:

### Example with SVG:
```json
{
  "id": "block_6",
  "type": "paragraph",
  "content": {
    "text": "هناك عدة أنواع من المثلثات المتطابقة مثل تطابق الأضلاع والزوايا: <svg width=\"100\" height=\"80\"><polygon points=\"50,10 90,70 10,70\" fill=\"none\" stroke=\"#333\" stroke-width=\"2\"/></svg>"
  },
  "properties": {
    "semanticType": "definition"
  }
}
```

### Example with HTML Table in Paragraph:
```json
{
  "id": "block_7",
  "type": "paragraph",
  "content": {
    "text": "البيانات التالية توضح النتائج: <table><tr><th>الفئة</th><th>التكرار</th></tr><tr><td>0-10</td><td>5</td></tr><tr><td>10-20</td><td>8</td></tr></table>"
  }
}
```

## Table Blocks with HTML/SVG

Table blocks now support HTML/SVG content in cells:

### Example with SVG in table cells:
```json
{
  "id": "table_1",
  "type": "table",
  "content": {
    "headers": ["الشكل", "الاسم", "الصيغة"],
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
      ]
    ]
  },
  "properties": {
    "hasHeader": true,
    "striped": true
  }
}
```

### Example with HTML table:
```json
{
  "id": "table_2",
  "type": "table",
  "content": {
    "html": "<table><thead><tr><th>القيمة</th><th>التكرار</th><th>النسبة</th></tr></thead><tbody><tr><td>100</td><td>5</td><td>25%</td></tr><tr><td>150</td><td>10</td><td>50%</td></tr></tbody></table>",
    "description": "جدول توزيع التكرارات"
  }
}
```

## Complete Example - Full Lesson Structure

Here's a complete example showing how to structure a lesson using all features:

```json
{
  "blocks": [
    {
      "id": "1",
      "type": "heading",
      "level": 1,
      "content": {
        "text": "تنظيم المعلومات والمصطلحات الإحصائية",
        "text_en": "Organizing Information and Statistical Terms"
      }
    },
    {
      "id": "2",
      "type": "paragraph",
      "content": {
        "text": "في هذا الدرس، سوف نتعلم كيفية تنظيم البيانات وفهم المصطلحات الإحصائية الأساسية."
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
        "text": "البيانات: هي مجموعة من القيم أو المعلومات التي يتم جمعها وتنظيمها لأغراض التحليل."
      },
      "properties": {
        "semanticType": "definition"
      }
    },
    {
      "id": "5",
      "type": "paragraph",
      "content": {
        "text": "التكرار: هو عدد مرات ظهور قيمة معينة في مجموعة البيانات."
      },
      "properties": {
        "semanticType": "definition"
      }
    },
    {
      "id": "6",
      "type": "paragraph",
      "content": {
        "text": "مثال عملي: لنفترض أن لدينا درجات $10$ طلاب في امتحان: {85, 90, 78, 85, 92, 85, 88, 90, 85, 95}. التكرار للدرجة $85$ هو $4$ مرات."
      },
      "properties": {
        "semanticType": "example"
      }
    },
    {
      "id": "7",
      "type": "table",
      "content": {
        "headers": ["الدرجة", "التكرار", "النسبة المئوية"],
        "rows": [
          ["78", "1", "10%"],
          ["85", "4", "40%"],
          ["88", "1", "10%"],
          ["90", "2", "20%"],
          ["92", "1", "10%"],
          ["95", "1", "10%"]
        ]
      },
      "properties": {
        "hasHeader": true,
        "striped": true
      }
    },
    {
      "id": "8",
      "type": "paragraph",
      "content": {
        "text": "المتوسط الحسابي: مجموع القيم مقسومًا على عددها: $\\bar{x} = \\frac{\\sum x_i}{n}$"
      },
      "properties": {
        "semanticType": "theorem"
      }
    },
    {
      "id": "9",
      "type": "paragraph",
      "content": {
        "text": "ملاحظة: عند حساب المتوسط، تأكد من جمع جميع القيم بدقة وعدم نسيان أي قيمة."
      },
      "properties": {
        "semanticType": "note"
      }
    }
  ]
}
```

## Best Practices

1. **Use semantic types appropriately**: Choose the right semantic type for your content to provide visual cues to students
2. **Combine with inline math**: You can use both semantic types and inline math (`$formula$`) in the same block
3. **HTML/SVG for complex content**: Use HTML/SVG when you need charts, diagrams, or complex formatting
4. **Tables for structured data**: Use table blocks for data that needs to be presented in rows and columns
5. **Multilingual support**: Always provide translations in `text_ar`, `text_en`, and `text_fr` for better accessibility

## Styling Customization

The semantic blocks are styled using Tailwind CSS classes and can be customized in `TextBlock.jsx`:

- Backgrounds: `bg-{color}-50` for light mode, `dark:bg-{color}-950/30` for dark mode
- Borders: `border-l-4 border-{color}-500` for the left accent
- Icons: `text-{color}-600` for light, `dark:text-{color}-400` for dark mode
- Text: `text-{color}-900` for light, `dark:text-{color}-100` for dark mode
