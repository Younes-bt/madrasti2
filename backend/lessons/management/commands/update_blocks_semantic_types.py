# lessons/management/commands/update_blocks_semantic_types.py

from django.core.management.base import BaseCommand
from lessons.models import LessonResource


class Command(BaseCommand):
    help = 'Update existing lesson blocks with semantic types based on section titles and content'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting semantic type update...'))
        
        # Get all block-type resources
        resources = LessonResource.objects.filter(resource_type='blocks')
        total_count = resources.count()
        
        self.stdout.write(f'Found {total_count} block resources to update')
        
        updated_count = 0
        error_count = 0
        
        for resource in resources:
            try:
                if not resource.blocks_content or 'blocks' not in resource.blocks_content:
                    continue
                
                blocks = resource.blocks_content.get('blocks', [])
                current_semantic_type = None
                modified = False
                
                for block in blocks:
                    if not isinstance(block, dict):
                        continue
                    
                    block_type = block.get('type', '')
                    
                    # If it's a heading, detect semantic type for following blocks
                    if block_type == 'heading':
                        content = block.get('content', {})
                        title = content.get('text', '')
                        section_type = content.get('section_type', '')
                        
                        current_semantic_type = self._detect_semantic_type(section_type, title, '')
                    
                    # Apply semantic type to paragraphs
                    elif block_type == 'paragraph' and current_semantic_type:
                        if 'properties' not in block:
                            block['properties'] = {}
                        
                        # Only add if not already set
                        if 'semanticType' not in block.get('properties', {}):
                            block['properties']['semanticType'] = current_semantic_type
                            modified = True
                
                # Save if modified
                if modified:
                    resource.save()
                    updated_count += 1
                    self.stdout.write(f'  [OK] Updated resource ID {resource.id} for lesson "{resource.lesson.title[:40]}..."')

                    
            except Exception as e:
                error_count += 1
                self.stdout.write(self.style.ERROR(f'  [ERROR] Error updating resource ID {resource.id}: {str(e)}'))
        
        self.stdout.write('\n' + '='*80)
        self.stdout.write(self.style.SUCCESS(f'Update complete!'))
        self.stdout.write(f'  [OK] Resources updated: {updated_count}')
        self.stdout.write(f'  [SKIP] Resources skipped: {total_count - updated_count - error_count}')
        if error_count > 0:
            self.stdout.write(self.style.ERROR(f'  [ERROR] Errors: {error_count}'))
        self.stdout.write('='*80)
    
    def _detect_semantic_type(self, section_type, title, text):
        """Detect semantic type based on section type, title, and content"""
        
        # Normalize for comparison
        title_lower = title.lower() if title else ''
        text_lower = text.lower() if text else ''
        section_type_lower = section_type.lower() if section_type else ''
        
        # Introduction indicators
        introduction_keywords = ['مقدمة', 'introduction', 'تمهيد', 'présentation']
        if any(keyword in title_lower for keyword in introduction_keywords):
            return 'introduction'
        if section_type_lower == 'introduction':
            return 'introduction'
            
        # Definition indicators
        definition_keywords = ['تعريف', 'definition', 'définition', 'مفهوم', 'concept']
        if any(keyword in title_lower for keyword in definition_keywords):
            return 'definition'
        if section_type_lower in ['definition', 'concept']:
            return 'definition'
            
        # Example indicators
        example_keywords = ['مثال', 'example', 'exemple', 'تطبيق', 'application']
        if any(keyword in title_lower for keyword in example_keywords):
            return 'example'
        if section_type_lower in ['example', 'application', 'exercise']:
            return 'example'
            
        # Theorem/Formula indicators
        theorem_keywords = ['نظرية', 'theorem', 'théorème', 'خاصية', 'property', 'قانون', 'law', 'صيغة', 'formula']
        if any(keyword in title_lower for keyword in theorem_keywords):
            return 'theorem'
        if section_type_lower in ['theorem', 'property', 'formula', 'law']:
            return 'theorem'
            
        # Default: no semantic type
        return None
