# Image URL Format Examples

## Copy-Paste Templates

### Single Image (Online URL)
```json
{
  "data": "your condition description",
  "template": "your treatment notes",
  "imgs": "https://example.com/path/to/image.jpg"
}
```

### Single Image (Local File)
```json
{
  "data": "your condition description",
  "template": "your treatment notes",
  "imgs": "images/cardiology/stemi-ecg.jpg"
}
```

### Multiple Images (comma-separated)
```json
{
  "data": "your condition description",
  "template": "your treatment notes",
  "imgs": "images/xray-pa.jpg, images/xray-lateral.jpg"
}
```

### Mixed: Images + Text Notes
```json
{
  "data": "your condition description",
  "template": "your treatment notes",
  "imgs": "images/diagram.jpg, See also: page 123 in reference manual"
}
```

### No Images (leave empty)
```json
{
  "data": "your condition description",
  "template": "your treatment notes",
  "imgs": ""
}
```

## Real-World Example

Here's a complete realistic example:

```json
{
  "data": "Inferior STEMI - ST elevation in leads II, III, aVF. Reciprocal ST depression in I, aVL",
  "template": "- ACTIVATE CATH LAB\n- ASA 325mg chewed\n- Heparin 60 U/kg bolus\n- Ticagrelor 180mg load\n- Serial troponins q6h\n- Telemetry monitoring",
  "imgs": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/12_Lead_EKG_ST_Elevation_tracing_color_coded.jpg/800px-12_Lead_EKG_ST_Elevation_tracing_color_coded.jpg"
}
```

## Common Image Hosting Services

If you don't have a web server, you can host images on:

1. **Imgur** (imgur.com) - Free, easy to use
   - Upload image → Right click → "Copy image address"
   - Example: `https://i.imgur.com/AbCdEfG.jpg`

2. **Google Drive** (with direct link)
   - Upload → Share → Anyone with link can view
   - Get direct link: `https://drive.google.com/uc?export=view&id=FILE_ID`

3. **Dropbox** (with direct link)
   - Upload → Share → Copy link
   - Change `www.dropbox.com` to `dl.dropboxusercontent.com`
   - Change `?dl=0` to `?dl=1`

4. **GitHub** (if using version control)
   - Upload to repository
   - Get raw URL: `https://raw.githubusercontent.com/user/repo/main/images/file.jpg`

## Folder Structure for Local Images

Recommended organization:

```
/Ecref/
├── index.html
├── reference_data.json
└── images/
    ├── cardiology/
    │   ├── inferior-mi.jpg
    │   ├── anterior-mi.jpg
    │   └── lateral-mi.jpg
    ├── radiology/
    │   ├── pneumonia-xray.jpg
    │   ├── pe-cta.jpg
    │   └── pleural-effusion.jpg
    ├── dermatology/
    │   └── cellulitis.jpg
    └── neurology/
        └── stroke-ct.jpg
```

Then reference as:
```json
"imgs": "images/cardiology/inferior-mi.jpg"
```

## Tips

✅ **DO:**
- Use descriptive names: `inferior-stemi-ecg.jpg`
- Keep files under 2MB
- Use hyphens, not spaces: `chest-xray.jpg`
- Use lowercase extensions: `.jpg` not `.JPG`

❌ **DON'T:**
- Use spaces: `my image.jpg` ❌
- Use generic names: `image1.jpg` ❌
- Upload huge files: `10MB-photo.jpg` ❌
- Use special characters: `image#1.jpg` ❌

## Testing Your Images

After adding image URLs:

1. Open index.html in browser
2. Go to "Database" tab
3. Search for your entry
4. You should see:
   - Thumbnail image(s) displayed
   - Hover effect (zoom + shadow)
   - Click to view full-size
   - X button or click outside to close

If images don't appear:
- Check the URL/path is correct
- Verify file extension matches actual file
- Check file permissions (for local files)
- Look at browser console for errors (F12)
