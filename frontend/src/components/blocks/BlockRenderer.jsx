import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { decodeBlocksContent, hasEncodedHTML } from '../../utils/htmlDecode'
import TextBlock from './blocks/TextBlock'
import ListBlock from './blocks/ListBlock'
import QuoteBlock from './blocks/QuoteBlock'
import CalloutBlock from './blocks/CalloutBlock'
import CodeBlock from './blocks/CodeBlock'
import MathBlock from './blocks/MathBlock'
import ImageBlock from './blocks/ImageBlock'
import VideoBlock from './blocks/VideoBlock'
import AudioBlock from './blocks/AudioBlock'
import DividerBlock from './blocks/DividerBlock'
import ToggleBlock from './blocks/ToggleBlock'
import TableBlock from './blocks/TableBlock'
import './blocks/block-content.css'


/**
 * BlockRenderer - Main component for rendering Notion-style blocks
 *
 * @param {Object} props
 * @param {Object} props.blocksContent - The blocks content object with blocks array
 * @param {string} props.language - Current language (ar, en, fr)
 * @param {string} props.className - Additional CSS classes
 */
const BlockRenderer = ({ blocksContent, language = 'en', className = '' }) => {
  // Decode HTML entities if present (fixes escaped content from backend)
  // This must be before any conditional returns (React Hooks rule)
  const decodedContent = useMemo(() => {
    if (!blocksContent || !blocksContent.blocks || !Array.isArray(blocksContent.blocks)) {
      return blocksContent
    }

    const firstBlock = blocksContent.blocks[0]
    if (firstBlock?.content?.text && hasEncodedHTML(firstBlock.content.text)) {
      console.log('🔧 Decoding HTML entities in blocks content')
      return decodeBlocksContent(blocksContent)
    }
    return blocksContent
  }, [blocksContent])

  const blocks = useMemo(() => decodedContent?.blocks || [], [decodedContent])
  const isRTL = language === 'ar'

  /* Check if content has Arabic characters to determine direction */
  const contentIsArabic = useMemo(() => {
    if (!blocks.length) return false;

    // Check the first few blocks for Arabic characters
    // We check regular text blocks and headings
    const textBlocks = blocks.slice(0, 5).filter(b => ['paragraph', 'heading', 'callout', 'quote'].includes(b.type));

    // Combine text from these blocks
    const sampleText = textBlocks.map(b => {
      if (typeof b.content === 'string') return b.content;
      if (b.content?.text) return b.content.text;
      return '';
    }).join(' ');

    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(sampleText);
  }, [blocks]);

  // Determine direction: if content is consistently Arabic, force RTL. 
  // Otherwise default to language setting.
  const contentDirection = contentIsArabic ? 'rtl' : (isRTL ? 'rtl' : 'ltr');
  const alignmentClass = contentDirection === 'rtl' ? 'text-right' : 'text-left';

  // Handle empty or invalid content
  if (!blocks.length) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No content available</p>
      </div>
    )
  }

  // Map block types to components
  const renderBlock = (block, index) => {
    const blockProps = {
      block,
      language,
      direction: contentDirection,
      key: block.id || `block-${index}`,
    }

    // Animation variants for smooth appearance
    const blockVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: index * 0.05 }
      }
    }

    const getBlockComponent = (block, blockProps) => {
      switch (block.type) {
        case 'heading': return <TextBlock {...blockProps} />
        case 'paragraph': return <TextBlock {...blockProps} />
        case 'list': return <ListBlock {...blockProps} />
        case 'quote': return <QuoteBlock {...blockProps} />
        case 'callout': return <CalloutBlock {...blockProps} />
        case 'code': return <CodeBlock {...blockProps} />
        case 'math': return <MathBlock {...blockProps} />
        case 'image': return <ImageBlock {...blockProps} />
        case 'video': return <VideoBlock {...blockProps} />
        case 'audio': return <AudioBlock {...blockProps} />
        case 'divider': return <DividerBlock {...blockProps} />
        case 'spacer': return <div className="h-8" key={blockProps.key} />
        case 'toggle': return <ToggleBlock {...blockProps} />
        case 'table': return <TableBlock {...blockProps} />
        case 'embed': return <VideoBlock {...blockProps} />
        default:
          console.warn(`Unknown block type: ${block.type}`)
          return null
      }
    }

    return (
      <motion.div
        key={blockProps.key}
        variants={blockVariants}
        initial="hidden"
        animate="visible"
      >
        {getBlockComponent(block, blockProps)}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'block-renderer',
        'space-y-10',
        'w-full',
        alignmentClass,
        className
      )}
      dir={contentDirection}
    >
      <AnimatePresence mode="sync">
        {blocks.map((block, index) => renderBlock(block, index))}
      </AnimatePresence>
    </div>
  )
}

export default BlockRenderer
