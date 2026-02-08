# Medical Reference Website - Update Guide

## Overview
This is a medical reference website for UCI Medical Center that provides quick access to clinical guidelines, medical conditions database, and documentation templates (dot phrases).

## Website Structure

The website consists of three main files:
- **index.html** - The main website file with all the code and styling
- **reference_data.json** - Database of medical conditions and treatments
- **dotphrases.txt** - Documentation templates for medical charting

## How to Update the Database

### 1. Updating Medical Conditions (reference_data.json)

The `reference_data.json` file contains an array of medical condition entries. Each entry has three fields:

```json
{
  "data": "Condition name and description",
  "template": "Treatment notes and orders",
  "imgs": "Image URLs or paths (optional)"
}
```

#### Adding a New Entry

1. Open `reference_data.json` in a text editor
2. Find the `"database": [` section
3. Add a new entry following this format:

```json
{
  "data": "Your condition name - Description and key information",
  "template": "Treatment protocol, orders, and management notes",
  "imgs": ""
}
```

4. Make sure to add a comma after the previous entry
5. Save the file

#### Example Entry:
```json
{
  "data": "pneumonia - Dx: CXR, CBC, blood culture, sputum culture",
  "template": "- CBC, CMP, blood culture x2\n- CXR\n- Antibiotics: CTX 1g IV q24h + azithro 500mg PO daily",
  "imgs": ""
}
```

### 2. Adding Images to Entries

Images can be added in two ways:

#### Option A: Using Image URLs (Recommended)
Store your images on a web hosting service or cloud storage and reference them by URL:

```json
{
  "data": "ECG findings - ST elevation in leads II, III, aVF",
  "template": "Suspect inferior STEMI. Activate cath lab immediately.",
  "imgs": "https://example.com/images/inferior-stemi.jpg"
}
```

#### Option B: Using Local Images
1. Create an `images` folder in the same directory as your website files
2. Place your image files in this folder
3. Reference them using relative paths:

```json
{
  "data": "Chest X-ray findings - Right lower lobe opacity",
  "template": "Suspect pneumonia vs atelectasis",
  "imgs": "images/rll-pneumonia.jpg"
}
```

#### Multiple Images
To include multiple images, separate URLs with commas:

```json
{
  "imgs": "images/xray-pa.jpg, images/xray-lateral.jpg, https://example.com/ct-scan.jpg"
}
```

**Supported Image Formats:**
- JPG/JPEG
- PNG
- GIF
- WebP

### 3. Updating Dot Phrases (dotphrases.txt)

Dot phrases are medical documentation templates. To add or update them:

1. Open `dotphrases.txt`
2. Add a new phrase using this format:

```
DOTPHRASE Your Phrase Name

Your template content here.
Can include multiple lines.
Use @VARIABLES@ for patient-specific fields.


```

3. Leave a blank line between phrases
4. Save the file

#### Example:
```
DOTPHRASE Discharge Summary

Patient @M@ @LNAME@ was admitted on @DATE@ for @REASON@. 
During hospitalization, the patient was treated with @TREATMENT@.
Patient is discharged in stable condition with follow-up in @DAYS@ days.


```

## Image Best Practices

### File Size and Format
- **Keep images under 2MB** for fast loading
- Use **JPG** for photographs and complex images
- Use **PNG** for diagrams, charts, and images with text
- Compress images before uploading using tools like TinyPNG or ImageOptim

### Image Organization
If using local images:
```
/Ecref/
  ├── index.html
  ├── reference_data.json
  ├── dotphrases.txt
  └── images/
      ├── cardiology/
      │   ├── stemi-ecg.jpg
      │   └── inferior-mi.jpg
      ├── radiology/
      │   ├── pneumonia-xray.jpg
      │   └── pe-cta.jpg
      └── dermatology/
          └── rash-examples.jpg
```

### Naming Convention
Use descriptive, lowercase names with hyphens:
- ✅ `inferior-stemi-ecg.jpg`
- ✅ `rll-pneumonia-xray.jpg`
- ❌ `Image1.jpg`
- ❌ `photo copy.JPG`

## Testing Your Changes

1. Open `index.html` in a web browser
2. Navigate to the "Database" tab
3. Search for your new entry
4. Verify:
   - Text displays correctly
   - Images load properly
   - Templates are readable
   - Links are clickable

## Common Issues and Solutions

### Images Not Displaying
- **Check the file path** - Make sure it's correct and matches the actual location
- **Check image permissions** - Ensure the image file is readable
- **Check file extension** - Make sure the extension matches the actual file type
- **Use absolute URLs** - If hosting images online, use the full URL

### JSON Syntax Errors
- **Missing comma** - Each entry except the last needs a comma after the closing `}`
- **Unescaped quotes** - Use `\"` for quotes inside strings
- **Missing brackets** - Make sure all `{` have matching `}`

### Special Characters
In JSON strings, escape these characters:
- Quotes: `\"` instead of `"`
- Backslash: `\\` instead of `\`
- Newline: `\n` for line breaks

Example:
```json
{
  "data": "He said \"Check the labs\"",
  "template": "Line 1\nLine 2\nLine 3",
  "imgs": ""
}
```

## Backing Up Your Data

Before making changes:
1. **Make a copy** of `reference_data.json` (e.g., `reference_data_backup.json`)
2. Keep previous versions dated (e.g., `reference_data_2026-02-08.json`)
3. Consider using version control (Git) for tracking changes

## Advanced: Hosting the Website

### Local Use
Simply open `index.html` in any web browser. No server needed.

### Web Hosting
To make it accessible online:
1. Upload all files to a web server or hosting service (GitHub Pages, Netlify, etc.)
2. If using local images, upload the `images` folder as well
3. Update any local image paths to match the server structure

### Cloud Storage for Images
For better performance:
1. Upload images to cloud storage (AWS S3, Google Cloud Storage, Cloudinary)
2. Use the provided URLs in the `imgs` field
3. Enable public read access for the images

## Contact & Support

For issues or questions about updating this reference website, contact the development team or refer to the HTML comments in `index.html` for technical details.

---

**Last Updated:** February 2026  
**Version:** 2026.1
