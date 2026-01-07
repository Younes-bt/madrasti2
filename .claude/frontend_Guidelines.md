# Madrasti 2.0 - UI/UX Design System & Frontend Guidelines

## 1. Core Philosophy
* **Clarity over Density:** Do not overcrowd screens. Use whitespace to separate sections.
* **Hierarchy via Contrast:** Use font weight and color to denote importance, not just size.
* **8pt Grid System:** All spacing, margins, and padding must be multiples of 8 (8px, 16px, 24px, 32px).

---

## 2. Typography System
**Font Family:** [Inter / Plus Jakarta Sans / Roboto] (Replace with your chosen font)

### Responsive Type Scale
*Use `rem` units for accessibility. Base size: 16px = 1rem.*

| Role | Desktop Size | Mobile Size | Weight | Line Height | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Page Titles)** | 32px (2rem) | 24px (1.5rem) | **SemiBold (600)** | 1.25 | `text-2xl md:text-3xl font-semibold` |
| **H2 (Section Headers)**| 24px (1.5rem) | 20px (1.25rem)| **SemiBold (600)** | 1.3 | `text-xl md:text-2xl font-semibold` |
| **H3 (Card Titles)** | 18px (1.125rem)| 16px (1rem) | **Medium (500)** | 1.4 | `text-base md:text-lg font-medium` |
| **Body (Standard)** | 16px (1rem) | 16px (1rem) | **Regular (400)** | 1.5 | `text-base font-normal` |
| **Small / Caption** | 14px (0.875rem)| 14px (0.875rem)| **Regular (400)** | 1.4 | `text-sm text-gray-500` |
| **Button Text** | 14px (0.875rem)| 14px (0.875rem)| **Medium (500)** | 1 | `text-sm font-medium` |

> **IMPORTANT RULE:** Avoid using `Bold (700)` or `ExtraBold (800)` for Card Titles. It creates too much visual noise. Use `Medium (500)` or `SemiBold (600)` instead.

---

## 3. Color Palette & Usage

### Text Colors
Never use pure black (`#000000`).
* **Primary Text:** `text-gray-900` (#111827) - Used for Headings and active values.
* **Secondary Text:** `text-gray-500` (#6B7280) - Used for subtitles, descriptions, and icon labels.
* **Tertiary/Inactive:** `text-gray-400` (#9CA3AF) - Used for placeholders or disabled states.

### Backgrounds
* **Page Background:** `bg-gray-50` or `bg-gray-100` (Light Gray) to reduce eye strain.
* **Card Surface:** `bg-white` (#FFFFFF).

---

## 4. Component Rules

### A. Dashboard Cards
* **Padding:** Internal padding must be **24px** (`p-6`) on desktop, **16px** (`p-4`) on mobile.
* **Border Radius:** 16px (`rounded-2xl`) or 20px. Consistent across all cards.
* **Shadows:** Soft, diffused shadows. Avoid harsh dark shadows.
    * *Tailwind Recc:* `shadow-sm` or `shadow` (hover: `shadow-md`).
* **Content Strategy:**
    * **Title:** Concise, clearly describes the feature (e.g., "Finance").
    * **Subtitle:** DO NOT repeat the title. Only use subtitles for dynamic status (e.g., "3 Pending Invoices" or "Updated 2m ago"). If there is no status, omit the subtitle.

### B. Buttons & Actions
* **Primary Actions:** Solid background color (Brand Blue).
* **Secondary/Card Actions:** Outline or Ghost style to reduce clutter.
    * *Example:* The "Open" button on cards should be a simple text link or a light gray button, not a bold primary button.

---

## 5. Spacing Guidelines (The 8pt Grid)

| Spacing Name | Size | Usage |
| :--- | :--- | :--- |
| **Small** | 8px (`gap-2`) | Spacing between icon and text. |
| **Medium** | 16px (`gap-4`) | Spacing between inputs, or list items. |
| **Large** | 24px (`gap-6`) | Spacing between Grid Cards. |
| **Section** | 32px - 48px | Spacing between major page sections (e.g. Header and Content). |

---

## 6. Implementation Checklist (Do's and Don'ts)

* **DON'T** use uppercase for card titles (it feels aggressive). Keep it "Sentence case" or "Title Case".
* **DO** use icons that are consistent in stroke width (approx 1.5px or 2px).
* **DON'T** center-align long text. Left-align body text for better readability.
* **DO** ensure the "Welcome" banner takes up less vertical space to push the actual tools (cards) higher up the screen (above the fold).