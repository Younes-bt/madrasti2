# -*- coding: utf-8 -*-
"""Quick script to convert a single lesson"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from convert_markdown_to_blocks import MarkdownToBlocksConverter
from lessons.models import LessonResource

# Convert lesson 2269's resource (ID 3)
converter = MarkdownToBlocksConverter()
resource = LessonResource.objects.get(id=3)

print(f"Converting resource ID {resource.id}: {resource.title}")
print(f"Current type: {resource.resource_type}")

blocks_content, error = converter.convert_resource(resource, dry_run=False)

if error:
    print(f"ERROR: {error}")
else:
    print(f"SUCCESS! Generated {len(blocks_content['blocks'])} blocks")
    print(f"Resource type changed to: blocks")
    print(f"\nRefresh lesson page: http://localhost:5173/teacher/content/lessons/view/2269")
