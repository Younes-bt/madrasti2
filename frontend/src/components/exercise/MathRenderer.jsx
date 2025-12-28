import React from 'react'
import 'katex/dist/katex.min.css'
import katex from 'katex'

/**
 * Component to render mathematical formulas using KaTeX
 * Supports inline and display mode
 *
 * Usage:
 * <MathRenderer math="CO_2" /> - renders CO₂
 * <MathRenderer math="n = \frac{m}{M}" displayMode /> - renders as block equation
 */
export function MathRenderer({ math, displayMode = false, className = '' }) {
  if (!math) return null

  try {
    const html = katex.renderToString(math, {
      displayMode,
      throwOnError: false,
      output: 'html'
    })

    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  } catch (error) {
    console.error('KaTeX rendering error:', error)
    return <span className={className}>{math}</span>
  }
}

/**
 * Hook to process text and convert LaTeX-like syntax to proper rendering
 * Converts patterns like CO_2$$ to proper KaTeX rendering
 */
export function useMathText(text) {
  if (!text) return text

  let processed = text

  // Pattern 1: Full LaTeX expressions between $$ delimiters (display mode)
  // Example: $$n = \frac{m}{M}$$ -> rendered equation
  processed = processed.replace(/\$\$([^$]+)\$\$/g, (match, latex) => {
    try {
      return katex.renderToString(latex.trim(), { throwOnError: false, displayMode: false })
    } catch {
      return match
    }
  })

  // Pattern 2: Single $ delimiters for inline math (MOST COMMON!)
  // Example: $CO_2$ -> CO₂, $H_2O$ -> H₂O, $C_6H_{12}O_6$ -> C₆H₁₂O₆
  // This handles the majority of chemistry and physics formulas
  processed = processed.replace(/\$([^$]+)\$/g, (match, latex) => {
    try {
      return katex.renderToString(latex.trim(), { throwOnError: false, displayMode: false })
    } catch {
      return match
    }
  })

  // Pattern 3: Subscripts with braces (without dollar signs): H_2O, CO_2, C_6H_{12}O_6
  // Example: C_6H_{12}O_6 -> C₆H₁₂O₆
  processed = processed.replace(/([A-Za-z0-9()]+)_\{([^}]+)\}/g, (match, base, subscript) => {
    try {
      return katex.renderToString(`${base}_{${subscript}}`, { throwOnError: false })
    } catch {
      return match
    }
  })

  // Pattern 4: Simple subscripts without braces (without dollar signs): H_2, O_2
  // Example: CO_2 -> CO₂
  processed = processed.replace(/([A-Za-z0-9()]+)_([0-9A-Za-z])/g, (match, base, subscript) => {
    try {
      return katex.renderToString(`${base}_${subscript}`, { throwOnError: false })
    } catch {
      return match
    }
  })

  // Pattern 5: Superscripts with braces (without dollar signs): C^{2+}, 10^{-3}
  // Example: C^{2+} -> C²⁺
  processed = processed.replace(/([A-Za-z0-9()]+)\^\{([^}]+)\}/g, (match, base, superscript) => {
    try {
      return katex.renderToString(`${base}^{${superscript}}`, { throwOnError: false })
    } catch {
      return match
    }
  })

  // Pattern 6: Simple superscripts without braces (without dollar signs): x^2, 10^3
  // Example: x^2 -> x²
  processed = processed.replace(/([A-Za-z0-9()]+)\^([0-9A-Za-z+-])/g, (match, base, superscript) => {
    try {
      return katex.renderToString(`${base}^{${superscript}}`, { throwOnError: false })
    } catch {
      return match
    }
  })

  // Pattern 7: Fractions (without dollar signs): \frac{a}{b}
  // Example: \frac{m}{M} -> m/M as fraction
  processed = processed.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, (match, numerator, denominator) => {
    try {
      return katex.renderToString(`\\frac{${numerator}}{${denominator}}`, { throwOnError: false })
    } catch {
      return match
    }
  })

  // Pattern 8: Greek letters (without dollar signs): \alpha, \beta, \gamma, etc.
  const greekLetters = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega']
  greekLetters.forEach(letter => {
    const regex = new RegExp(`\\\\${letter}\\b`, 'g')
    processed = processed.replace(regex, (match) => {
      try {
        return katex.renderToString(`\\${letter}`, { throwOnError: false })
      } catch {
        return match
      }
    })
  })

  // Pattern 9: Square roots (without dollar signs): \sqrt{x}
  processed = processed.replace(/\\sqrt\{([^}]+)\}/g, (match, content) => {
    try {
      return katex.renderToString(`\\sqrt{${content}}`, { throwOnError: false })
    } catch {
      return match
    }
  })

  // Pattern 10: Common math symbols (without dollar signs)
  const mathSymbols = {
    '\\times': '\\times',
    '\\div': '\\div',
    '\\pm': '\\pm',
    '\\approx': '\\approx',
    '\\neq': '\\neq',
    '\\leq': '\\leq',
    '\\geq': '\\geq',
    '\\infty': '\\infty',
    '\\degree': '^\\circ'
  }

  Object.entries(mathSymbols).forEach(([symbol, latex]) => {
    const regex = new RegExp(symbol.replace(/\\/g, '\\\\'), 'g')
    processed = processed.replace(regex, () => {
      try {
        return katex.renderToString(latex, { throwOnError: false })
      } catch {
        return symbol
      }
    })
  })

  return processed
}

/**
 * Component that automatically renders text with math formulas
 */
export function TextWithMath({ text, className = '' }) {
  const processed = useMathText(text)

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  )
}
