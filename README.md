# PushAudit

**Operational AI Audit Platform** - A 100% client-side web application for conducting structured operational audits. No server required!

## Quick Start

```bash
# Option 1: Just open the file
double-click index.html

# Option 2: Use a simple server (recommended)
python -m http.server 8000
# Then open http://localhost:8000

# Option 3: VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

## Features

- **10-section wizard** for comprehensive audit data capture
- **Auto-save** to browser storage (IndexedDB)
- **No backend required** - everything runs in browser
- **Works offline** - no internet needed
- **Export/Import** - JSON and CSV formats
- **ROI scoring** - automatic calculation
- **Responsive** - works on laptop and tablet

## How It Works

```
User fills form → Auto-save to IndexedDB → Export to JSON/CSV when needed
```

All data stays in your browser. Export files to share or backup.

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System overview, project structure |
| [DATA_MODEL.md](DATA_MODEL.md) | IndexedDB schema, data fields |
| [UI_COMPONENTS.md](UI_COMPONENTS.md) | Page layouts, HTML templates |
| [SAVE_FLOW.md](SAVE_FLOW.md) | Auto-save logic, import/export |

## Audit Sections

| # | Section | Purpose |
|---|---------|---------|
| 1 | General Information | Department, person, role, tools |
| 2 | Typical Workday | Timeline of daily tasks |
| 3 | Process Mapping | A→B→C→D process flows |
| 4 | Workload & Friction | Volume, errors, bottlenecks |
| 5 | Data & Constraints | Data sources, confidentiality |
| 6 | AI Automation Potential | Business view of automation |
| 7 | Business Impact & ROI | Time savings, priority |
| 8 | Department Use Cases | Custom workflows |
| 9 | AI Opportunities | Quick wins and structural cases |
| 10 | Validation | Review and finalize |

## Project Structure

```
pushaudit/
├── index.html          # Homepage (audit list)
├── audit.html          # Audit wizard
├── view.html           # Read-only view
├── css/
│   ├── main.css        # Variables, reset
│   ├── components.css  # Buttons, cards
│   ├── wizard.css      # Wizard styles
│   ├── forms.css       # Form layouts
│   └── responsive.css  # Mobile/tablet
├── js/
│   ├── app.js          # Main entry
│   ├── storage.js      # IndexedDB wrapper
│   ├── wizard/         # Wizard logic
│   ├── sections/       # Section renderers
│   ├── components/     # UI components
│   └── utils/          # Helpers
└── assets/
    └── images/
```

## Technology

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid
- **JavaScript (ES6+)** - No frameworks
- **IndexedDB** - Browser database

No dependencies. No build step. Just open and use.

## Data Storage

| What | Where | Capacity |
|------|-------|----------|
| Audit data | IndexedDB | 50MB+ |
| Settings | localStorage | 5MB |
| Backups | Export files | Unlimited |

## Export Options

- **JSON** - Full data with all related items
- **CSV** - Excel-compatible flat format

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Tips

1. **Backup regularly** - Export to JSON periodically
2. **Use a server** - IndexedDB works best via HTTP
3. **One browser** - Data is browser-specific
4. **Don't clear data** - Browser cleanup removes audits

## ROI Scoring

Score 0-100 based on:
- Time savings potential (0-25)
- Automation feasibility (0-25)
- Decision complexity penalty (-10 to 0)
- Data readiness (0-25)
- Business priority (0-25)

**Readiness levels:**
- 70+ = Ready
- 40-69 = Needs Work
- <40 = Not Ready

## License

MIT License
