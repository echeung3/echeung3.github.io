# Medical Reference Website

A clinical reference website for UCI Medical Center — quick guidelines, a searchable knowledge base, documentation templates (dot phrases), a password-gated Clinical Reasoning doc, and a password-gated patient log.

Author: Elaine Cheung

---

## Tabs

| Tab | What it is |
|---|---|
| **Quick Reference** | Admission workflow, triage criteria, telemetry guidelines |
| **Knowledge Base** | ~425 medical entries with categories, tags, favorites, recents, scoped search |
| **Dot Phrases** | Searchable, copy-to-clipboard documentation templates |
| **Clinical Reasoning** | Embedded Google Doc, gated by encrypted password (Web Crypto) |
| **Patients** | Embedded Google Sheet for de-identified patient log, same gate |

---

## Editing the Knowledge Base from your browser (no coding required)

The site has a built-in editor that saves directly to GitHub. Once set up, you just click **+ Add entry** and fill out a form — the site commits to your repo for you, and GitHub Pages republishes within ~60 seconds.

### One-time setup (~3 minutes)

1. Visit the live site and open the **Knowledge Base** tab.
2. Click **+ Add entry** (or the gear ⚙ icon). The setup wizard opens.
3. Follow the on-screen steps. You'll need to:
   - Create a **fine-grained personal access token** at <https://github.com/settings/personal-access-tokens/new>
   - Repository access: **Only select repositories** → pick the Ecref repo
   - Repository permissions → **Contents: Read and write**
   - Click "Generate token," copy the token (starts with `github_pat_`)
   - Paste it into the wizard
   - Choose a password (use the same one as your other gates for convenience)
4. The wizard tests the token and stores it encrypted in your browser. Done.

### Adding / editing / deleting

- **+ Add entry** in the toolbar opens the editor.
- Expand any card → **Edit** button at the bottom right.
- The Edit modal has a **Delete** button (with a confirmation prompt).
- Images can be dragged into the form — they upload to `images/` in your repo on save.

### Behind the scenes

- Your token is encrypted at rest with your password (PBKDF2 → AES-GCM, same primitives as the URL gates) and stored in `localStorage`.
- The token is decrypted in memory only once per browser session, the first time you click Add/Edit.
- Saves use the GitHub Contents API: image uploads first, then a JSON update commit.
- Optimistic UI — the entry appears in your KB immediately; the commit happens in the background and a toast confirms once GitHub accepted it.

### When something goes wrong

- **"Token rejected"** — copy/paste error. Generate a new token and re-do setup (gear ⚙ button).
- **"Token lacks the right permissions"** — recreate the token with Contents: Read **and write**.
- **"Repo not found"** — the token doesn't include this repo in its scope. Recreate it and pick the right repo under "Only select repositories."
- **Setup fails with "cannot detect your repo"** — you're previewing locally. Deploy first, then run setup from the live GitHub Pages URL.
- **Token expired** — fine-grained tokens have an expiration (you picked it during setup). Just run setup again with a fresh token.
- **Lost your password** — click ⚙, click through to re-setup. This overwrites the encrypted token; you'll need to paste a new token too.

### If your token leaks

Revoke it immediately at <https://github.com/settings/tokens?type=beta>. Then run setup again with a fresh token. Old token = no longer works = no exposure beyond the moment it leaked.

### What the token CAN'T do

The fine-grained token is scoped to one repo with Contents permission only. It cannot delete the repo, change settings, access your other repos, or read your personal info. Worst case if leaked: someone could edit/add/delete files in this one repo.

---

## Updating the Knowledge Base by hand (`reference_data.json`)

If you'd rather edit the JSON directly (or the in-browser editor isn't available), each entry has this shape:

```json
{
  "id": "stable-kebab-case-slug",
  "data": "Title and clinical notes (first non-empty line becomes the card title)",
  "template": "Order set / treatment template",
  "imgs": "images/foo.png, https://example.com/bar.jpg",
  "category": "Cardiac",
  "tags": ["acs", "chest pain"],
  "links": [
    {"label": "CPSolvers schema: chest pain", "url": "https://clinicalproblemsolving.com/..."}
  ]
}
```

### Fields

- **`id`** — required, must be unique. Used as the stable key for favorites/recents. Use kebab-case (`acute-pancreatitis`).
- **`data`** — markdown-ish clinical content. First non-empty line is shown as the card title. Markdown tables (pipe-delimited) are auto-rendered.
- **`template`** — order set / assessment template. Has its own Copy button in the card.
- **`imgs`** — comma-separated. Local paths (`images/foo.png`) or external URLs. Image extensions are rendered as thumbnails with click-to-enlarge; non-image strings render as text/link.
  - **CPSolvers images:** put under `images/cpsolvers/<topic>.png` and the card will auto-caption them with attribution.
- **`category`** — one of: *Cardiac, Pulmonary, GI, Renal, ID, Neuro, Heme/Onc, Endo, Derm, Tox, MSK, Psych, OB/GYN, Other*.
- **`tags`** — array of free-text tags. Render as clickable chips on the card; clicking a chip adds it as a filter.
- **`links`** — array of `{label, url}` for an "External resources" section on the expanded card. Where CPSolvers / MDCalc / UpToDate deep links go.

### Adding a new entry

Append to `database` in `reference_data.json`:

```json
{
  "id": "pneumonia",
  "data": "pneumonia\n- Dx: CXR, CBC, blood culture, sputum culture",
  "template": "- CBC, CMP, blood cultures x2\n- CXR\n- CTX 1g IV q24h + azithro 500mg PO daily",
  "imgs": "",
  "category": "ID",
  "tags": ["sepsis", "abx"],
  "links": []
}
```

Don't forget the comma after the previous entry.

### Categorizing existing entries

Run a quick edit pass on `reference_data.json` — entries in the "Other" category and any obvious miscategorizations can be retagged by changing the `category` value. Tags can be expanded freely. The sidebar counts and category dots update automatically.

---

## Updating Dot Phrases (`dotphrases.txt`)

```
DOTPHRASE Phrase Name
@VARIABLE@-style content goes here.
Multiple lines allowed.
```

Blank line between phrases. Search bar filters by any text in the phrase.

---

## The password-gated tabs (Clinical Reasoning, Patients)

Both gates use real client-side encryption (PBKDF2 + AES-GCM via Web Crypto). The Google URLs are **never** present in plaintext in the deployed source — only ciphertext blobs in `script.js` under `const SECRETS`. Wrong password → decryption fails → no URL is ever revealed.

The two gates share one password (the SECRETS were encrypted together).

### Setting up / rotating the password / changing a URL

1. Open `tools/encrypt-urls.html` **locally** (double-click the file). It runs in your browser and never sends anything anywhere. This file is gitignored — never commit it.
2. Enter your new password (12+ characters recommended) and the two Google URLs.
3. Click **Encrypt**. Copy the generated `const SECRETS = { ... };` block.
4. Paste it into `script.js`, replacing the existing `SECRETS` constant near the top.
5. Commit `script.js`. The new ciphertext is what gets served from GitHub Pages.

### Security caveats — read this

- **Strength depends on password strength.** With a 12+ char password and 200,000 PBKDF2 iterations, brute-forcing is impractical. With a short or guessable password, it's not. Pick a good one.
- **Once unlocked in your browser**, the decrypted URL is loaded into the iframe — anyone shoulder-surfing can read it from there. That's unavoidable for any client-side gate.
- **The Google Sheet's own sharing setting still matters.** The encryption only hides the URL; if your sheet is set to "anyone with link can view/edit," anyone who learns the URL can access it. Use a long, hard-to-guess URL (Google's defaults are fine) and rotate it if leaked.
- **Do not store PHI** in the Patient sheet. Use de-identified initials, MRN-last-4, etc. — never names, DOB, full MRN, or other identifying detail. The site is not HIPAA-compliant infrastructure.

### Setting up the Patients tab for the first time

The bundled `SECRETS` ship with `patientsSheetUrl: null`, so the Patients gate shows "not configured yet" until you do this:

1. Create a Google Sheet with the columns you want (suggested: *Date | Initials | MRN-last4 | Age/Sex | Scenario | Status | Notes*).
2. Share it: "Anyone with the link — Editor."
3. Run `tools/encrypt-urls.html`, give it your password + both URLs, replace `SECRETS` in `script.js`, commit, push.

---

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

---

## Repo layout

```
.
├── index.html              # Page structure + tabs
├── script.js               # KB renderer, secure gate, dot phrases, image modal
├── styles.css              # Bootstrap + custom (KB sidebar/cards, gate, etc.)
├── reference_data.json     # 425 KB entries with id/category/tags/links
├── dotphrases.txt          # Documentation templates
├── images/                 # Reference images (algorithms, tables, schemas)
├── tools/                  # LOCAL ONLY — gitignored
│   └── encrypt-urls.html   # Run locally to generate SECRETS
└── .gitignore
```

**Last Updated:** May 2026
**Version:** 2026.3
