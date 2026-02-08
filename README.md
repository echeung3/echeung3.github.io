# Medical Reference Website 

## Overview
This is a medical reference website for UCI Medical Center that provides quick access to clinical guidelines, medical conditions database, and documentation templates (dot phrases).

Elaine Cheung

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
  "imgs": "Image URLs or paths"
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

#### Option A: Using Image URLs 
Store your images on a web hosting service or cloud storage and reference them by URL:

```json
{
  "data": "ECG findings - ST elevation in leads II, III, aVF",
  "template": "Suspect inferior STEMI. Activate cath lab immediately.",
  "imgs": "https://example.com/images/inferior-stemi.jpg"
}
```

#### Option B: Using Local Images
1. Place your image files in the images folder
2. Reference them using relative paths:

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

**Last Updated:** February 2026  
**Version:** 2026.1
