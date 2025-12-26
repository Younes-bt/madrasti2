# -*- coding: utf-8 -*-
"""Revert all block resources back to markdown"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from lessons.models import LessonResource

# Find all resources with type 'blocks'
blocks_resources = LessonResource.objects.filter(resource_type='blocks')
count = blocks_resources.count()

print(f"Found {count} resources with type 'blocks'")
print("Reverting to 'markdown'...")

# Update them back to markdown
blocks_resources.update(resource_type='markdown')

print(f"Done! {count} resources reverted to 'markdown'")
print("All lessons will now use the enhanced markdown renderer with smart callouts!")
