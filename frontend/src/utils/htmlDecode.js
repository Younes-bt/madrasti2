/**
 * Utility function to decode HTML entities in text content
 * This is useful when backend sends HTML-escaped content like &lt; instead of <
 */

export const decodeHTMLEntities = (text) => {
  if (!text || typeof text !== 'string') return text
  
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

/**
 * Recursively decode HTML entities in block content
 */
export const decodeBlocksContent = (blocksContent) => {
  if (!blocksContent || !blocksContent.blocks) return blocksContent
  
  const decodedBlocks = blocksContent.blocks.map(block => {
    const decodedBlock = { ...block }
    
    // Decode text content
    if (block.content) {
      decodedBlock.content = { ...block.content }
      
      // Decode all text fields
      if (block.content.text) {
        decodedBlock.content.text = decodeHTMLEntities(block.content.text)
      }
      if (block.content.text_ar) {
        decodedBlock.content.text_ar = decodeHTMLEntities(block.content.text_ar)
      }
      if (block.content.text_en) {
        decodedBlock.content.text_en = decodeHTMLEntities(block.content.text_en)
      }
      if (block.content.text_fr) {
        decodedBlock.content.text_fr = decodeHTMLEntities(block.content.text_fr)
      }
      
      // Decode HTML tables
      if (block.content.html) {
        decodedBlock.content.html = decodeHTMLEntities(block.content.html)
      }
      
      // Decode table cells
      if (block.content.rows && Array.isArray(block.content.rows)) {
        decodedBlock.content.rows = block.content.rows.map(row =>
          row.map(cell => decodeHTMLEntities(cell))
        )
      }
      
      if (block.content.headers && Array.isArray(block.content.headers)) {
        decodedBlock.content.headers = block.content.headers.map(header =>
          decodeHTMLEntities(header)
        )
      }
    }
    
    return decodedBlock
  })
  
  return {
    ...blocksContent,
    blocks: decodedBlocks
  }
}

/**
 * Check if text contains encoded HTML entities
 */
export const hasEncodedHTML = (text) => {
  if (!text || typeof text !== 'string') return false
  return /&[a-z]+;|&#\d+;/i.test(text)
}
