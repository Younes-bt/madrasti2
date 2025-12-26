# SVG/HTML Rendering Debug Guide

## Problem
SVGs and HTML content are visible in Django admin but not rendering in the frontend.

## Solution Steps

### Step 1: Check Browser Console

1. Open the lesson page (http://localhost:5173/student/lessons/17084)
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Look for these debug messages:

```
📦 Blocks Resource: [resource title]
📦 Blocks Content: {blocks: Array(X)}
📦 Block 0 (paragraph): [text content with potential SVG]
🔍 TextBlock - HTML/SVG detected: [SVG or HTML content]
🔧 Decoding HTML entities in blocks content
```

### Step 2: Identify the Issue

#### Case A: SVG is HTML-Escaped
If you see in console:
```
📦 Block 0: &lt;svg width="100"&gt;...&lt;/svg&gt;
```

**This means**: Backend is HTML-escaping the content

**Solution**: The HTML decode utility we just added should fix this automatically. You should see:
```
🔧 Decoding HTML entities in blocks content
```

#### Case B: SVG is in correct format but not rendering
If you see in console:
```
📦 Block 0: <svg width="100">...</svg>
🔍 TextBlock - HTML/SVG detected: <svg...
```

**This means**: SVG is passed correctly, but CSS might not be applying

**Solution**: Check if CSS is loaded:
1. In DevTools, go to Elements tab
2. Find the SVG element in the DOM
3. Check Computed styles
4. Verify `display: inline-block !important` is applied

#### Case C: No SVG in the content at all
If the console doesn't show any SVG:
```
📦 Block 0: Some text without SVG
```

**This means**: The SVG is not in the blocks_content from the database

**Solution**: Check the Django admin again - ensure SVG is actually saved in the JSON field

### Step 3: Verify in Network Tab

1. Go to Network tab in DevTools
2. Refresh the page
3. Find the API request for lessons (should be something like `/api/lessons/17084/`)
4. Click on it
5. Go to Response tab
6. Search for "blocks_content" in the response
7. Check if SVG content is there and if it's escaped or not

**Expected good response:**
```json
{
  "blocks": [
    {
      "content": {
        "text": "Some text <svg width=\"100\">...</svg> more text"
      }
    }
  ]
}
```

**Problematic response (HTML-escaped):**
```json
{
  "blocks": [
    {
      "content": {
        "text": "Some text &lt;svg width=&quot;100&quot;&gt;...&lt;/svg&gt; more text"
      }
    }
  ]
}
```

### Step 4: Manual Testing

Try creating a simple test lesson resource with this blocks_content:

```json
{
  "blocks": [
    {
      "id": "test_1",
      "type": "paragraph",
      "content": {
        "text": "Test SVG: <svg width=\"100\" height=\"100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"red\"/></svg>"
      },
      "properties": {
        "semanticType": "example"
      }
    }
  ]
}
```

If this works, the issue is with your existing data.
If this doesn't work, the issue is with therendering logic.

## Common Fixes

### Fix 1: Clear Browser Cache
```
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)
```
Or hard refresh:
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

### Fix 2: Restart Dev Server
```bash
cd frontend
npm run dev
```

### Fix 3: Check for Django Middleware
If content is being HTML-escaped, check `backend/madrasti/settings.py` for:
- Any HTML sanitization middleware
- SecurityMiddleware settings
- CORS settings that might affect JSON serialization

### Fix 4: Re-save the Lesson Resource
Sometimes Django admin caches the JSON. Try:
1. Go to Django admin
2. Open the LessonResource
3. Make a small change (add a space)
4. Save
5. Refresh frontend

## Expected Behavior After Fixes

1. ✅ Console should show: `🔍 TextBlock - HTML/SVG detected`
2. ✅ SVG should be visible in the rendered page
3. ✅ SVG should be inline with text
4. ✅ SVG should scale properly
5. ✅ Tables with SVG cells should render both text and SVG

## Testing Different Content Types

### Test 1: Simple SVG in Paragraph
```json
{
  "id": "1",
  "type": "paragraph",
  "content": {
    "text": "Circle: <svg width=\"40\" height=\"40\"><circle cx=\"20\" cy=\"20\" r=\"15\" fill=\"blue\"/></svg>"
  }
}
```

### Test 2: SVG in Semantic Block
```json
{
  "id": "2",
  "type": "paragraph",
  "content": {
    "text": "Diagram: <svg width=\"60\" height=\"60\"><rect x=\"10\" y=\"10\" width=\"40\" height=\"40\" fill=\"green\"/></svg>"
  },
  "properties": {
    "semanticType": "example"
  }
}
```

### Test 3: Table with SVG
```json
{
  "id": "3",
  "type": "table",
  "content": {
    "headers": ["Shape", "Name"],
    "rows": [
      [
        "<svg width=\"30\" height=\"30\"><circle cx=\"15\" cy=\"15\" r=\"12\" fill=\"red\"/></svg>",
        "Circle"
      ]
    ]
  }
}
```

## Debugging Tools Added

### 1. Console Logging in StudentViewLessonPage.jsx
- Logs entire blocks_content object
- Logs each block's text content
- Helps identify if SVG is in the data

### 2. Console Logging in TextBlock.jsx
- Logs when HTML/SVG is detected
- Shows first 100 characters of detected HTML

### 3. HTML Entity Decoder (htmlDecode.js)
- Automatically decodes `&lt;` → `<`
- Handles `&gt;`, `&quot;`, `&amp;`, etc.
- Recursively processes all block content

### 4. Enhanced CSS (block-content.css)
- `display: inline-block !important` for SVGs
- Better sizing and scaling
- Minimum height to ensure visibility

## Still Not Working?

If after all these steps SVGs still don't render:

1. **Check Django JSON Encoder**
Look for custom JSON encoders in the backend that might escape HTML

2. **Check DRF Renderer**
Check if Django REST Framework has a custom renderer that escapes HTML

3. **Database Check**
Connect to PostgreSQL directly and check the actual stored value:
```sql
SELECT blocks_content FROM lessons_lessonresource WHERE id = [your_resource_id];
```

4. **Create Simple Test Case**
Create a new lesson resource from scratch with just a simple SVG in Django admin

5. **Check Content Security Policy**
Some servers block inline SVG for security. Check if there's a CSP header blocking it.

## Contact Points

If you need to share debug info, provide:
1. Screenshot of browser console with logs
2. Network tab response showing blocks_content
3. Django admin screenshot showing the JSON
4. Browser and version you're using
