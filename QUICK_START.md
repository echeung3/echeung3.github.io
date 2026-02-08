# Quick Reference - Adding Entries and Images

## Adding a New Database Entry

1. Open `reference_data.json`
2. Add your entry in the `"database"` array:

```json
{
  "data": "condition name - key info",
  "template": "treatment notes",
  "imgs": "image_url_or_path"
},
```

**Don't forget the comma after the `}` (except for the last entry)!**

## Adding Images - Three Methods

### Method 1: Online Image URL (Easiest)
```json
"imgs": "https://example.com/image.jpg"
```

### Method 2: Local Image File
1. Create an `images` folder
2. Put your image file there
3. Reference it:
```json
"imgs": "images/my-image.jpg"
```

### Method 3: Multiple Images
Separate with commas:
```json
"imgs": "images/xray1.jpg, images/xray2.jpg, https://example.com/ct.jpg"
```

## Supported Image Types
- JPG, JPEG, PNG, GIF, WebP, SVG

## Quick Checklist
- [ ] Image file is under 2MB
- [ ] File path is correct
- [ ] No spaces in filename (use hyphens: `my-image.jpg`)
- [ ] Added comma after previous entry in JSON
- [ ] Tested in browser

## Example Entry with Image
```json
{
  "data": "pneumonia - RLL consolidation on CXR",
  "template": "- CTX 1g IV q24h\n- Azithro 500mg PO daily\n- Monitor O2",
  "imgs": "images/rll-pneumonia.jpg"
}
```

## Testing
1. Open `index.html` in browser
2. Click "Database" tab
3. Search for your entry
4. Click image to enlarge

## Common Errors
❌ Missing comma → `}, {` not `} {`  
❌ Wrong path → Check spelling and location  
❌ Too large → Compress image to < 2MB  
❌ Special characters → Use only letters, numbers, hyphens

## Need Help?
See `README.md` for detailed instructions and troubleshooting.
