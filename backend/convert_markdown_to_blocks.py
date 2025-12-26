# -*- coding: utf-8 -*-
"""
Markdown to Blocks Converter
Converts existing markdown lesson resources to Notion-style blocks format
"""

import os
import django
import re
import uuid
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from lessons.models import LessonResource
from django.db import transaction

class MarkdownToBlocksConverter:
    """Convert markdown content to blocks structure"""

    def __init__(self):
        self.block_counter = 0

    def generate_block_id(self):
        """Generate unique block ID"""
        self.block_counter += 1
        return f"block_{uuid.uuid4().hex[:8]}_{self.block_counter}"

    def parse_markdown_to_blocks(self, markdown_content):
        """Parse markdown and convert to blocks structure"""
        if not markdown_content or not markdown_content.strip():
            return []

        blocks = []
        lines = markdown_content.split('\n')
        i = 0

        while i < len(lines):
            line = lines[i]

            # Skip empty lines
            if not line.strip():
                i += 1
                continue

            # Heading (# ## ###)
            heading_match = re.match(r'^(#{1,6})\s+(.+)$', line)
            if heading_match:
                level = len(heading_match.group(1))
                text = heading_match.group(2).strip()
                blocks.append(self.create_heading_block(level, text))
                i += 1
                continue

            # Code block (```)
            if line.strip().startswith('```'):
                code_block, lines_consumed = self.parse_code_block(lines, i)
                if code_block:
                    blocks.append(code_block)
                    i += lines_consumed
                    continue

            # Math block ($$)
            if line.strip().startswith('$$'):
                math_block, lines_consumed = self.parse_math_block(lines, i)
                if math_block:
                    blocks.append(math_block)
                    i += lines_consumed
                    continue

            # Blockquote (>)
            if line.strip().startswith('>'):
                quote_block, lines_consumed = self.parse_quote_block(lines, i)
                blocks.append(quote_block)
                i += lines_consumed
                continue

            # Horizontal rule (---, ___, ***)
            if re.match(r'^(\*{3,}|-{3,}|_{3,})$', line.strip()):
                blocks.append(self.create_divider_block())
                i += 1
                continue

            # Unordered list (-, *, +)
            if re.match(r'^[\s]*[-*+]\s+', line):
                list_block, lines_consumed = self.parse_list_block(lines, i, 'bulleted')
                blocks.append(list_block)
                i += lines_consumed
                continue

            # Ordered list (1., 2., etc)
            if re.match(r'^[\s]*\d+\.\s+', line):
                list_block, lines_consumed = self.parse_list_block(lines, i, 'numbered')
                blocks.append(list_block)
                i += lines_consumed
                continue

            # Task list (- [ ] or - [x])
            if re.match(r'^[\s]*[-*+]\s+\[([ xX])\]\s+', line):
                list_block, lines_consumed = self.parse_task_list_block(lines, i)
                blocks.append(list_block)
                i += lines_consumed
                continue

            # Paragraph (default)
            paragraph_block, lines_consumed = self.parse_paragraph_block(lines, i)
            blocks.append(paragraph_block)
            i += lines_consumed

        return blocks

    def create_heading_block(self, level, text):
        """Create heading block"""
        # Clean markdown formatting
        text = self.clean_markdown_formatting(text)
        text = text.replace('$', '')  # Remove $ symbols

        return {
            'id': self.generate_block_id(),
            'type': 'heading',
            'level': level,
            'content': {
                'text': text,
                'text_ar': text if self.is_arabic(text) else '',
                'text_en': text if not self.is_arabic(text) else '',
                'text_fr': ''
            },
            'properties': {
                'color': 'default',
                'alignment': 'right' if self.is_arabic(text) else 'left'
            }
        }

    def parse_code_block(self, lines, start_idx):
        """Parse code block"""
        first_line = lines[start_idx].strip()
        language = first_line[3:].strip() or 'text'

        code_lines = []
        i = start_idx + 1

        while i < len(lines):
            if lines[i].strip().startswith('```'):
                # Found closing ```
                code = '\n'.join(code_lines)
                block = {
                    'id': self.generate_block_id(),
                    'type': 'code',
                    'content': {
                        'code': code,
                        'language': language
                    },
                    'properties': {
                        'showLineNumbers': True
                    }
                }
                return block, i - start_idx + 1
            code_lines.append(lines[i])
            i += 1

        # No closing ``` found, treat as paragraph
        return None, 1

    def parse_math_block(self, lines, start_idx):
        """Parse math block"""
        math_lines = []
        i = start_idx + 1

        while i < len(lines):
            if lines[i].strip().startswith('$$'):
                # Found closing $$
                formula = '\n'.join(math_lines).strip()
                block = {
                    'id': self.generate_block_id(),
                    'type': 'math',
                    'content': {
                        'formula': formula,
                        'displayMode': 'block'
                    },
                    'properties': {}
                }
                return block, i - start_idx + 1
            math_lines.append(lines[i])
            i += 1

        # No closing $$ found
        return None, 1

    def parse_quote_block(self, lines, start_idx):
        """Parse blockquote"""
        quote_lines = []
        i = start_idx

        while i < len(lines) and lines[i].strip().startswith('>'):
            # Remove > and leading space
            text = re.sub(r'^>\s?', '', lines[i])
            quote_lines.append(text)
            i += 1

        text = ' '.join(quote_lines).strip()
        block = {
            'id': self.generate_block_id(),
            'type': 'quote',
            'content': {
                'text': text,
                'text_ar': text if self.is_arabic(text) else '',
                'text_en': text if not self.is_arabic(text) else '',
                'text_fr': ''
            },
            'properties': {
                'color': 'default'
            }
        }
        return block, i - start_idx

    def parse_list_block(self, lines, start_idx, list_type):
        """Parse bulleted or numbered list"""
        items = []
        i = start_idx

        pattern = r'^[\s]*[-*+]\s+' if list_type == 'bulleted' else r'^[\s]*\d+\.\s+'

        while i < len(lines):
            line = lines[i]
            if not re.match(pattern, line):
                break

            # Extract text after marker
            text = re.sub(pattern, '', line).strip()
            # Clean markdown formatting
            text = self.clean_markdown_formatting(text)
            text = text.replace('$', '')  # Remove $ symbols

            items.append({
                'text': text,
                'text_ar': text if self.is_arabic(text) else '',
                'text_en': text if not self.is_arabic(text) else '',
                'text_fr': ''
            })
            i += 1

        block = {
            'id': self.generate_block_id(),
            'type': 'list',
            'listType': list_type,
            'content': {
                'items': items
            }
        }
        return block, i - start_idx

    def parse_task_list_block(self, lines, start_idx):
        """Parse task list"""
        items = []
        i = start_idx

        pattern = r'^[\s]*[-*+]\s+\[([ xX])\]\s+'

        while i < len(lines):
            line = lines[i]
            match = re.match(pattern, line)
            if not match:
                break

            checked = match.group(1).lower() == 'x'
            text = re.sub(pattern, '', line).strip()

            items.append({
                'text': text,
                'text_ar': text if self.is_arabic(text) else '',
                'text_en': text if not self.is_arabic(text) else '',
                'text_fr': '',
                'checked': checked
            })
            i += 1

        block = {
            'id': self.generate_block_id(),
            'type': 'list',
            'listType': 'todo',
            'content': {
                'items': items
            }
        }
        return block, i - start_idx

    def clean_markdown_formatting(self, text):
        """Remove markdown formatting from text"""
        # Remove bold/italic (**text**, __text__, *text*, _text_)
        text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)  # **bold**
        text = re.sub(r'__(.+?)__', r'\1', text)      # __bold__
        text = re.sub(r'\*(.+?)\*', r'\1', text)      # *italic*
        text = re.sub(r'_(.+?)_', r'\1', text)        # _italic_

        # Remove inline code (`code`)
        text = re.sub(r'`(.+?)`', r'\1', text)

        # Remove inline math ($math$) - we'll handle this separately
        # For now, keep it as is since we want to detect and convert to math blocks

        return text

    def parse_paragraph_block(self, lines, start_idx):
        """Parse paragraph"""
        paragraph_lines = []
        i = start_idx

        while i < len(lines):
            line = lines[i].strip()

            # Stop at empty line or special markdown syntax
            if not line or \
               line.startswith('#') or \
               line.startswith('```') or \
               line.startswith('$$') or \
               line.startswith('>') or \
               re.match(r'^(\*{3,}|-{3,}|_{3,})$', line) or \
               re.match(r'^[\s]*[-*+]\s+', line) or \
               re.match(r'^[\s]*\d+\.\s+', line):
                break

            paragraph_lines.append(line)
            i += 1

        text = ' '.join(paragraph_lines).strip()

        # Check for inline math patterns ($...$) and extract them as separate math blocks
        # This handles cases like: $P = 4q$ or المحيط:** 4q$ = P**
        inline_math_pattern = r'\$([^$]+)\$'
        math_matches = list(re.finditer(inline_math_pattern, text))

        # If text is mostly math (more than 50% is math), create a math block instead
        if math_matches:
            total_math_chars = sum(len(m.group(0)) for m in math_matches)
            if total_math_chars > len(text) * 0.3:  # If more than 30% is math
                # Extract all math formulas
                formulas = [m.group(1).strip() for m in math_matches]
                if formulas:
                    # Create a math block with the first formula
                    return {
                        'id': self.generate_block_id(),
                        'type': 'math',
                        'content': {
                            'formula': formulas[0],
                            'displayMode': 'inline'
                        },
                        'properties': {}
                    }, i - start_idx

        # Clean markdown formatting from text
        text = self.clean_markdown_formatting(text)

        # Remove any remaining $ symbols from inline math
        text = text.replace('$', '')

        # Detect if this might be a callout (starts with Note:, Warning:, etc.)
        callout_match = re.match(r'^(Note|Important|Warning|Tip|Info|تعريف|ملاحظة|خاصية|مثال):\s*(.+)$', text, re.IGNORECASE)
        if callout_match:
            callout_type_map = {
                'note': 'info',
                'important': 'warning',
                'warning': 'error',
                'tip': 'tip',
                'info': 'info',
                'تعريف': 'tip',
                'ملاحظة': 'info',
                'خاصية': 'success',
                'مثال': 'success'
            }
            callout_type = callout_type_map.get(callout_match.group(1).lower(), 'info')
            text = callout_match.group(2).strip()

            return {
                'id': self.generate_block_id(),
                'type': 'callout',
                'content': {
                    'text': text,
                    'text_ar': text if self.is_arabic(text) else '',
                    'text_en': text if not self.is_arabic(text) else '',
                    'text_fr': ''
                },
                'properties': {
                    'calloutType': callout_type,
                    'icon': 'lightbulb' if callout_type == 'tip' else 'info'
                }
            }, i - start_idx

        block = {
            'id': self.generate_block_id(),
            'type': 'paragraph',
            'content': {
                'text': text,
                'text_ar': text if self.is_arabic(text) else '',
                'text_en': text if not self.is_arabic(text) else '',
                'text_fr': ''
            },
            'properties': {
                'color': 'default'
            }
        }
        return block, i - start_idx

    def create_divider_block(self):
        """Create divider block"""
        return {
            'id': self.generate_block_id(),
            'type': 'divider',
            'properties': {
                'style': 'solid'
            }
        }

    def is_arabic(self, text):
        """Check if text contains Arabic characters"""
        arabic_pattern = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+')
        return bool(arabic_pattern.search(text))

    def convert_resource(self, resource, dry_run=True):
        """Convert a single resource from markdown to blocks"""
        if not resource.markdown_content:
            return None, "No markdown content"

        try:
            # Parse markdown to blocks
            blocks = self.parse_markdown_to_blocks(resource.markdown_content)

            if not blocks:
                return None, "No blocks generated"

            # Create blocks_content structure
            blocks_content = {
                'blocks': blocks,
                'version': 1,
                'lastModified': datetime.now().isoformat()
            }

            if not dry_run:
                # Update resource
                resource.resource_type = 'blocks'
                resource.blocks_content = blocks_content
                resource.content_version = 1
                resource.save()

            return blocks_content, None

        except Exception as e:
            return None, str(e)


def convert_all_markdown_resources(dry_run=True, limit=None):
    """Convert all markdown resources to blocks"""
    converter = MarkdownToBlocksConverter()

    # Get all markdown resources
    markdown_resources = LessonResource.objects.filter(resource_type='markdown')

    if limit:
        markdown_resources = markdown_resources[:limit]

    total = markdown_resources.count()
    print(f"Found {total} markdown resources to convert")
    print(f"Mode: {'DRY RUN (no changes)' if dry_run else 'LIVE (will update database)'}")
    print("-" * 60)

    success_count = 0
    error_count = 0
    errors = []

    for idx, resource in enumerate(markdown_resources, 1):
        print(f"[{idx}/{total}] Processing resource ID {resource.id}: {resource.title[:50]}...")

        blocks_content, error = converter.convert_resource(resource, dry_run=dry_run)

        if error:
            error_count += 1
            errors.append({
                'id': resource.id,
                'title': resource.title,
                'error': error
            })
            print(f"  ERROR: {error}")
        else:
            success_count += 1
            block_count = len(blocks_content['blocks'])
            print(f"  SUCCESS: Generated {block_count} blocks")

    print("-" * 60)
    print(f"SUMMARY:")
    print(f"  Total: {total}")
    print(f"  Success: {success_count}")
    print(f"  Errors: {error_count}")

    if errors:
        print(f"\nErrors encountered:")
        for err in errors[:10]:  # Show first 10 errors
            print(f"  - ID {err['id']}: {err['title'][:40]} - {err['error']}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more")

    if dry_run:
        print(f"\nThis was a DRY RUN. No changes were made.")
        print(f"Run with dry_run=False to actually convert the resources.")
    else:
        print(f"\nConversion complete! {success_count} resources updated.")

    return success_count, error_count, errors


if __name__ == '__main__':
    import sys

    # Parse arguments
    dry_run = True
    limit = None

    if len(sys.argv) > 1:
        if sys.argv[1] == '--live':
            dry_run = False
        elif sys.argv[1] == '--preview':
            limit = 5

    print("=" * 60)
    print("MARKDOWN TO BLOCKS CONVERTER")
    print("=" * 60)
    print()

    if limit:
        print(f"Preview mode: Converting first {limit} resources only")
        print()

    convert_all_markdown_resources(dry_run=dry_run, limit=limit)
