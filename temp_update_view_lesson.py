#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Temporary script to update ViewLessonPage.jsx with markdown rendering support"""

import re

file_path = r'd:\OpiComTech\Projects\madrasti2\frontend\src\pages\admin\ViewLessonPage.jsx'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The markdown rendering code to insert
markdown_section = """
                          
                          {/* Display markdown content if resource type is markdown */}
                          {resource.resource_type === 'markdown' && resource.markdown_content && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {resource.markdown_content}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}"""

# More targeted pattern - look for the exact sequence around line 465
old_text = """                          </div>
                        </motion.div>"""

new_text = """                          </div>
                          
                          {/* Display markdown content if resource type is markdown */}
                          {resource.resource_type === 'markdown' && resource.markdown_content && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {resource.markdown_content}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </motion.div>"""

# Replace the first occurrence (there might be others for exercises, etc.)
if old_text in content:
    # Count occurrences to be safe
    count = content.count(old_text)
    print(f"Found {count} occurrences of the pattern")
    
    # We want to replace only the first occurrence in the resources section
    content = content.replace(old_text, new_text, 1)
    print("Replacement done")
else:
    print("Pattern not found!")
    print("Searching for similar patterns...")
    # Try to find what's actually there
    lines = content.split('\n')
    for i, line in enumerate(lines[464:470], start=465):
        print(f"Line {i}: {repr(line)}")

# Write the modified content back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"File updated: {file_path}")
