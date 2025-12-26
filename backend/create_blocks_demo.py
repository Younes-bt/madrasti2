# -*- coding: utf-8 -*-
"""Create a demo blocks resource to showcase the new Notion-style rendering"""

import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from lessons.models import Lesson, LessonResource

def create_blocks_demo():
    # Get the lesson from screenshot (ID 2268)
    lesson = Lesson.objects.filter(id=2268).first()

    if not lesson:
        print('Lesson 2268 not found')
        return

    print(f'Found lesson ID: {lesson.id}')

    # Create sample blocks content with various block types
    blocks_content = {
        'blocks': [
            {
                'id': 'block_1',
                'type': 'heading',
                'level': 2,
                'content': {
                    'text_ar': '📚 ملخص الدرس التفاعلي',
                    'text_en': '📚 Interactive Lesson Summary',
                    'text_fr': '📚 Résumé de leçon interactif'
                },
                'properties': {
                    'color': 'blue',
                    'alignment': 'right'
                }
            },
            {
                'id': 'block_2',
                'type': 'callout',
                'content': {
                    'text_ar': 'هذا مثال على عرض الدروس بطريقة نوشن التفاعلية! يمكنك الآن رؤية المحتوى بطريقة جميلة وحديثة.',
                    'text_en': 'This is an example of Notion-style interactive lesson display! You can now see content in a beautiful, modern way.',
                    'text_fr': 'Ceci est un exemple d\'affichage de leçon interactive de style Notion!'
                },
                'properties': {
                    'calloutType': 'info',
                    'icon': 'lightbulb'
                }
            },
            {
                'id': 'block_3',
                'type': 'heading',
                'level': 3,
                'content': {
                    'text_ar': 'المستقيم في المستوى',
                    'text_en': 'Lines in the Plane',
                    'text_fr': 'Lignes dans le plan'
                },
                'properties': {
                    'color': 'default',
                    'alignment': 'right'
                }
            },
            {
                'id': 'block_4',
                'type': 'paragraph',
                'content': {
                    'text_ar': 'المستقيم هو مجموعة من نقط المستوى، وهو غير محدود.',
                    'text_en': 'A line is a set of points in a plane, and it is unlimited.',
                    'text_fr': 'Une ligne est un ensemble de points dans un plan.'
                },
                'properties': {
                    'color': 'default'
                }
            },
            {
                'id': 'block_5',
                'type': 'callout',
                'content': {
                    'text_ar': 'تعريف: تكون نقط مستقيمية إذا كانت تنتمي إلى نفس المستقيم.',
                    'text_en': 'Definition: Points are collinear if they belong to the same line.',
                    'text_fr': 'Définition: Les points sont colinéaires s\'ils appartiennent à la même ligne.'
                },
                'properties': {
                    'calloutType': 'tip',
                    'icon': 'check'
                }
            },
            {
                'id': 'block_6',
                'type': 'list',
                'listType': 'bulleted',
                'content': {
                    'items': [
                        {
                            'text_ar': 'المستقيم المار من نقطتين متطابقتين',
                            'text_en': 'Line passing through two identical points'
                        },
                        {
                            'text_ar': 'المستقيمان المتطابقان',
                            'text_en': 'Two identical lines'
                        },
                        {
                            'text_ar': 'المستقيمان المتقاطعان',
                            'text_en': 'Two intersecting lines'
                        }
                    ]
                }
            },
            {
                'id': 'block_7',
                'type': 'divider',
                'properties': {
                    'style': 'solid'
                }
            },
            {
                'id': 'block_8',
                'type': 'heading',
                'level': 3,
                'content': {
                    'text_ar': 'المسافة بين نقطتين',
                    'text_en': 'Distance Between Two Points'
                },
                'properties': {
                    'color': 'default',
                    'alignment': 'right'
                }
            },
            {
                'id': 'block_9',
                'type': 'math',
                'content': {
                    'formula': 'AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}',
                    'displayMode': 'block'
                },
                'properties': {
                    'caption_ar': 'صيغة المسافة بين نقطتين',
                    'caption_en': 'Distance formula between two points'
                }
            },
            {
                'id': 'block_10',
                'type': 'callout',
                'content': {
                    'text_ar': 'مثال: المستقيم المار من النقطتين A و B يُرمز له بالرمز (AB).',
                    'text_en': 'Example: The line passing through points A and B is denoted by (AB).'
                },
                'properties': {
                    'calloutType': 'success',
                    'icon': 'check'
                }
            }
        ],
        'version': 1
    }

    # Check if blocks demo already exists
    existing = LessonResource.objects.filter(
        lesson=lesson,
        resource_type='blocks',
        title__contains='Blocks Demo'
    ).first()

    if existing:
        print(f'Blocks demo already exists (ID: {existing.id}), updating it...')
        existing.blocks_content = blocks_content
        existing.content_version += 1
        existing.save()
        print(f'Updated blocks resource ID: {existing.id}')
    else:
        # Create new blocks resource
        resource = LessonResource.objects.create(
            lesson=lesson,
            title='Interactive Lesson Summary (Blocks Demo)',
            description='Demonstration of Notion-style blocks rendering',
            resource_type='blocks',
            blocks_content=blocks_content,
            content_version=1,
            is_visible_to_students=True,
            order=0
        )
        print(f'Created blocks resource with ID: {resource.id}')

    print(f'Blocks count: {len(blocks_content["blocks"])}')
    print(f'View at: http://localhost:5173/student/lessons/{lesson.id}')

if __name__ == '__main__':
    create_blocks_demo()
