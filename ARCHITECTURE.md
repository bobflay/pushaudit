# PushAudit - Technical Architecture (Client-Side Only)

## 1. System Overview

**No backend required!** Everything runs in the browser.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PushAudit (100% Client-Side)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐     ┌─────────────────────┐     ┌────────────────┐ │
│  │    HTML Pages       │     │   JavaScript        │     │   Browser      │ │
│  │                     │────▶│   Application       │────▶│   Storage      │ │
│  │    CSS Styles       │     │   Logic             │     │   (IndexedDB)  │ │
│  └─────────────────────┘     └─────────────────────┘     └────────────────┘ │
│                                                                              │
│                              ┌─────────────────────┐                        │
│                              │   Export/Import     │                        │
│                              │   JSON / Excel      │                        │
│                              └─────────────────────┘                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Technology Stack

### Frontend (Everything!)
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Flexbox, Grid
- **Vanilla JavaScript (ES6+)**: No frameworks, no dependencies
- **IndexedDB**: Browser database (via simple wrapper)
- **localStorage**: Settings and preferences

### Storage Options
| Option | Capacity | Best For |
|--------|----------|----------|
| **IndexedDB** | 50MB+ | Main audit data |
| **localStorage** | 5MB | Settings, preferences |
| **File Export** | Unlimited | Backup, sharing |

### No Backend Needed!
- No Node.js
- No server
- No API calls
- No authentication complexity
- Just open the HTML file!

## 3. Project Structure

```
pushaudit/
├── index.html                    # Homepage (audit list)
├── audit.html                    # Audit wizard
├── view.html                     # Read-only audit view
│
├── css/
│   ├── main.css                  # Variables, reset, typography
│   ├── components.css            # Buttons, cards, inputs
│   ├── wizard.css                # Wizard styles
│   ├── forms.css                 # Form layouts
│   └── responsive.css            # Mobile/tablet
│
├── js/
│   ├── app.js                    # Main entry point
│   ├── storage.js                # IndexedDB wrapper
│   ├── router.js                 # Simple page routing
│   │
│   ├── wizard/
│   │   ├── wizard.js             # Wizard controller
│   │   ├── navigation.js         # Step navigation
│   │   ├── progress.js           # Progress indicator
│   │   └── autosave.js           # Auto-save to IndexedDB
│   │
│   ├── sections/
│   │   ├── section1-general.js
│   │   ├── section2-workday.js
│   │   ├── section3-process.js
│   │   ├── section4-workload.js
│   │   ├── section5-data.js
│   │   ├── section6-ai.js
│   │   ├── section7-roi.js
│   │   ├── section8-usecases.js
│   │   ├── section9-summary.js
│   │   └── section10-validation.js
│   │
│   ├── components/
│   │   ├── timeline-editor.js
│   │   ├── process-mapper.js
│   │   ├── yes-no-toggle.js
│   │   ├── dynamic-list.js
│   │   └── toast.js
│   │
│   └── utils/
│       ├── export.js             # Export to JSON/Excel
│       ├── import.js             # Import from JSON
│       ├── roi-calculator.js     # ROI scoring
│       ├── id-generator.js       # Unique IDs
│       └── formatters.js         # Date/number formatting
│
└── assets/
    └── images/
        └── logo.svg
```

## 4. Data Flow

### Simple Flow (No Server!)

```
User Input
    │
    ▼
┌──────────────────┐
│  Update Form     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Auto-save       │ ◀─── Debounce 500ms
│  to IndexedDB    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Show "Saved"    │
│  indicator       │
└──────────────────┘

         │ (When needed)
         ▼
┌──────────────────┐
│  Export to       │ ──▶ Download JSON or Excel file
│  File            │
└──────────────────┘
```

### Export/Import Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PORTABILITY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Export Options:                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ JSON File   │  │ Excel File  │  │ PDF Report  │             │
│  │ (.json)     │  │ (.xlsx)     │  │ (.pdf)      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  Import Options:                                                 │
│  ┌─────────────┐                                                │
│  │ JSON File   │ ──▶ Restore all audits                        │
│  │ (.json)     │                                                │
│  └─────────────┘                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 5. Storage Architecture

### IndexedDB Schema

```javascript
// Database: PushAuditDB
// Version: 1

// Object Stores:
{
  "audits": {
    keyPath: "id",
    indexes: ["status", "department", "createdAt"]
  },
  "tasks": {
    keyPath: "id",
    indexes: ["auditId"]
  },
  "processes": {
    keyPath: "id",
    indexes: ["auditId"]
  },
  "useCases": {
    keyPath: "id",
    indexes: ["auditId"]
  },
  "opportunities": {
    keyPath: "id",
    indexes: ["auditId"]
  }
}
```

### Data Persistence

| Data Type | Storage | Persistence |
|-----------|---------|-------------|
| Audit data | IndexedDB | Until browser data cleared |
| Settings | localStorage | Until browser data cleared |
| Exports | File system | Permanent (user manages) |

## 6. How to Run

### Option 1: Direct File Open
```bash
# Just double-click index.html
# Or right-click → Open with → Browser
```

### Option 2: Simple Local Server (for development)
```bash
# Using Python (built-in)
python -m http.server 8000

# Using Node.js (if you have it)
npx serve

# Then open http://localhost:8000
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click index.html → "Open with Live Server"

**Note:** IndexedDB works best when served via HTTP(S), not file:// protocol. Use a simple local server for best results.

## 7. Browser Compatibility

| Browser | IndexedDB | Tested |
|---------|-----------|--------|
| Chrome 90+ | ✅ Full | ✅ |
| Firefox 88+ | ✅ Full | ✅ |
| Safari 14+ | ✅ Full | ✅ |
| Edge 90+ | ✅ Full | ✅ |

## 8. Limitations & Solutions

| Limitation | Solution |
|------------|----------|
| Data in one browser only | Export/Import JSON to share |
| Browser data can be cleared | Regular exports as backup |
| No multi-user collaboration | Each user runs their own copy |
| ~50MB storage limit | More than enough for audits |

## 9. Security Considerations

- **Data stays local** - Never leaves your machine
- **No network calls** - Works offline
- **No authentication needed** - Single user, local use
- **Export files** - You control where they go

## 10. Advantages of This Approach

1. **Zero setup** - Just open HTML file
2. **No server costs** - Nothing to host
3. **Works offline** - No internet needed
4. **Fast** - No network latency
5. **Private** - Data never leaves your machine
6. **Portable** - Copy folder anywhere
7. **No dependencies** - Pure HTML/CSS/JS
