# PushAudit - UI Components & Pages

## Pages Overview

| Page | File | Purpose |
|------|------|---------|
| Login | login.html | Google OAuth authentication |
| Homepage | index.html | Audit list, new audit button |
| Audit Wizard | audit.html | 10-section wizard form |
| View Audit | view.html | Read-only audit display |

---

## Page 1: Login (login.html)

### Wireframe
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                                                                  │
│                     ┌─────────────────────┐                     │
│                     │                     │                     │
│                     │    🔍 PushAudit     │                     │
│                     │                     │                     │
│                     │  Operational AI     │                     │
│                     │  Audit Platform     │                     │
│                     │                     │                     │
│                     │ ┌─────────────────┐ │                     │
│                     │ │ Sign in with    │ │                     │
│                     │ │   G  Google     │ │                     │
│                     │ └─────────────────┘ │                     │
│                     │                     │                     │
│                     └─────────────────────┘                     │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### HTML Structure
```html
<!-- login.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In - PushAudit</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/layout.css">
</head>
<body class="login-page">
  <main class="login-container">
    <div class="login-card">
      <div class="login-logo">
        <img src="assets/images/logo.svg" alt="PushAudit">
      </div>
      <h1 class="login-title">PushAudit</h1>
      <p class="login-subtitle">Operational AI Audit Platform</p>

      <button id="google-signin-btn" class="btn btn-google">
        <svg class="google-icon"><!-- Google icon --></svg>
        Sign in with Google
      </button>

      <p class="login-footer">
        By signing in, you agree to our Terms of Service
      </p>
    </div>
  </main>

  <script src="js/auth.js"></script>
</body>
</html>
```

---

## Page 2: Homepage (index.html)

### Wireframe
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🔍 PushAudit              user@company.com ▼  [Sign Out]    │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ My Audits                         [+ New Audit]           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Filter: [All ▼]  [All Departments ▼]  🔍 Search...        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  AUDIT LIST                                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ AUD-2024-0001                           [Draft]     │   │  │
│  │ │ Finance • John Doe • Financial Analyst              │   │  │
│  │ │ Jan 15, 2024 • Last edited 2 hours ago              │   │  │
│  │ │ ROI Score: ████████░░ 78                            │   │  │
│  │ │                                    [View] [Continue]│   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ AUD-2024-0002                        [Validated]    │   │  │
│  │ │ HR • Jane Smith • HR Manager                        │   │  │
│  │ │ Jan 10, 2024 • Validated Jan 12, 2024               │   │  │
│  │ │ ROI Score: █████████░ 92                            │   │  │
│  │ │                                            [View]   │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Showing 2 of 15 audits                    [1] 2 3 ... 8   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER: © 2024 PushAudit                                        │
└─────────────────────────────────────────────────────────────────┘
```

### HTML Structure
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Audits - PushAudit</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="header-container">
      <a href="/" class="header-logo">
        <img src="assets/images/logo.svg" alt="PushAudit">
        <span>PushAudit</span>
      </a>
      <div class="header-user">
        <span id="user-email"></span>
        <button id="signout-btn" class="btn btn-text">Sign Out</button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-content">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>My Audits</h1>
        <button id="new-audit-btn" class="btn btn-primary">
          <span class="icon">+</span> New Audit
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filter-group">
          <select id="filter-status" class="select">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="validated">Validated</option>
          </select>

          <select id="filter-department" class="select">
            <option value="">All Departments</option>
            <!-- Populated dynamically -->
          </select>
        </div>

        <div class="search-box">
          <input type="search" id="search-input"
                 placeholder="Search audits..." class="input">
        </div>
      </div>

      <!-- Audit List -->
      <div id="audit-list" class="audit-list">
        <!-- Cards populated by JavaScript -->
      </div>

      <!-- Pagination -->
      <div id="pagination" class="pagination">
        <!-- Pagination populated by JavaScript -->
      </div>

      <!-- Empty State -->
      <div id="empty-state" class="empty-state hidden">
        <div class="empty-icon">📋</div>
        <h2>No audits yet</h2>
        <p>Create your first operational audit to get started.</p>
        <button class="btn btn-primary" onclick="createNewAudit()">
          Create First Audit
        </button>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>© 2024 PushAudit. All rights reserved.</p>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="js/api.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/components/toast.js"></script>
  <script src="js/pages/home.js"></script>
  <script src="js/pages/audit-list.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

### Audit Card Component
```html
<!-- Template for audit card (generated by JS) -->
<article class="audit-card" data-audit-id="AUD-2024-0001">
  <div class="audit-card-header">
    <span class="audit-id">AUD-2024-0001</span>
    <span class="badge badge-draft">Draft</span>
  </div>

  <div class="audit-card-body">
    <h3 class="audit-title">Finance • John Doe</h3>
    <p class="audit-subtitle">Financial Analyst</p>
    <p class="audit-date">
      Jan 15, 2024 • Last edited 2 hours ago
    </p>
  </div>

  <div class="audit-card-roi">
    <span class="roi-label">ROI Score</span>
    <div class="roi-bar">
      <div class="roi-fill" style="width: 78%"></div>
    </div>
    <span class="roi-value">78</span>
  </div>

  <div class="audit-card-actions">
    <a href="view.html?id=AUD-2024-0001" class="btn btn-outline">View</a>
    <a href="audit.html?id=AUD-2024-0001" class="btn btn-primary">Continue</a>
  </div>
</article>
```

---

## Page 3: Audit Wizard (audit.html)

### Wireframe
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ← Back    AUD-2024-0001           ●Saving... | ✓ Saved     │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PROGRESS BAR                                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ●──●──●──○──○──○──○──○──○──○                              │  │
│  │ 1  2  3  4  5  6  7  8  9  10                             │  │
│  │ General Information                         Step 1 of 10  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  SECTION CONTENT                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  Section 1: General Information                           │  │
│  │  ─────────────────────────────────────────────────────    │  │
│  │                                                           │  │
│  │  Department *                                             │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │ Select department...                            ▼ │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  Audited Person Name *                                    │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │                                                   │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  Role / Position *                                        │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │                                                   │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ... more fields ...                                      │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  NAVIGATION                                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [◀ Previous]                                 [Next ▶]     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### HTML Structure
```html
<!-- audit.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audit Wizard - PushAudit</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/wizard.css">
  <link rel="stylesheet" href="css/forms.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <!-- Header -->
  <header class="header header-wizard">
    <div class="header-container">
      <a href="/" class="header-back">
        <span class="icon">←</span> Back
      </a>
      <span id="audit-id" class="header-audit-id">AUD-2024-0001</span>
      <div id="autosave-indicator" class="autosave-indicator">
        <span class="autosave-text">Saved</span>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-content">
    <div class="wizard-container">

      <!-- Progress Bar -->
      <div class="wizard-progress">
        <div class="progress-steps" id="progress-steps">
          <!-- Steps generated by JavaScript -->
        </div>
        <div class="progress-info">
          <span id="section-name">General Information</span>
          <span id="step-counter">Step 1 of 10</span>
        </div>
      </div>

      <!-- Section Content -->
      <div id="wizard-content" class="wizard-content">
        <!-- Section forms rendered here by JavaScript -->
      </div>

      <!-- Navigation -->
      <div class="wizard-navigation">
        <button id="prev-btn" class="btn btn-outline" disabled>
          <span class="icon">←</span> Previous
        </button>
        <button id="next-btn" class="btn btn-primary">
          Next <span class="icon">→</span>
        </button>
      </div>

    </div>
  </main>

  <!-- Toast Container -->
  <div id="toast-container" class="toast-container"></div>

  <!-- Scripts -->
  <script src="js/utils/debounce.js"></script>
  <script src="js/utils/validators.js"></script>
  <script src="js/utils/formatters.js"></script>
  <script src="js/api.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/components/toast.js"></script>
  <script src="js/components/yes-no-toggle.js"></script>
  <script src="js/components/priority-selector.js"></script>
  <script src="js/components/dynamic-list.js"></script>
  <script src="js/components/timeline-editor.js"></script>
  <script src="js/components/process-mapper.js"></script>
  <script src="js/wizard/autosave.js"></script>
  <script src="js/wizard/progress.js"></script>
  <script src="js/wizard/navigation.js"></script>
  <script src="js/sections/section1-general.js"></script>
  <script src="js/sections/section2-workday.js"></script>
  <script src="js/sections/section3-process.js"></script>
  <script src="js/sections/section4-workload.js"></script>
  <script src="js/sections/section5-data.js"></script>
  <script src="js/sections/section6-ai.js"></script>
  <script src="js/sections/section7-roi.js"></script>
  <script src="js/sections/section8-usecases.js"></script>
  <script src="js/sections/section9-summary.js"></script>
  <script src="js/sections/section10-validation.js"></script>
  <script src="js/wizard/wizard.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## Section Templates

### Section 1: General Information
```html
<section class="wizard-section" data-section="1">
  <h2 class="section-title">1. General Information</h2>
  <p class="section-description">
    Basic information about the audit and the person being audited.
  </p>

  <form id="section-1-form" class="form">
    <div class="form-row">
      <div class="form-group">
        <label for="department" class="label required">Department</label>
        <select id="department" name="department" class="select" required>
          <option value="">Select department...</option>
          <option value="Finance">Finance</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Operations">Operations</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Legal">Legal</option>
          <option value="Customer Service">Customer Service</option>
          <option value="R&D">R&D</option>
          <option value="Procurement">Procurement</option>
        </select>
      </div>
    </div>

    <div class="form-row form-row-2col">
      <div class="form-group">
        <label for="audited_person" class="label required">Audited Person Name</label>
        <input type="text" id="audited_person" name="audited_person"
               class="input" placeholder="Enter full name" required>
      </div>

      <div class="form-group">
        <label for="role_position" class="label required">Role / Position</label>
        <input type="text" id="role_position" name="role_position"
               class="input" placeholder="e.g., Financial Analyst" required>
      </div>
    </div>

    <div class="form-row form-row-2col">
      <div class="form-group">
        <label for="seniority" class="label">Seniority</label>
        <select id="seniority" name="seniority" class="select">
          <option value="">Select level...</option>
          <option value="Junior">Junior</option>
          <option value="Mid-level">Mid-level</option>
          <option value="Senior">Senior</option>
          <option value="Manager">Manager</option>
          <option value="Director">Director</option>
          <option value="Executive">Executive</option>
        </select>
      </div>

      <div class="form-group">
        <label for="audit_date" class="label required">Audit Date</label>
        <input type="date" id="audit_date" name="audit_date"
               class="input" required>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="auditors" class="label required">Auditors</label>
        <input type="text" id="auditors" name="auditors"
               class="input" placeholder="Names separated by commas" required>
        <span class="form-help">Enter names of people conducting the audit</span>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="label">Current Tools Used</label>
        <div id="current-tools-list" class="dynamic-list">
          <!-- Dynamic list items added by JS -->
        </div>
        <button type="button" class="btn btn-text btn-add-item"
                onclick="addToolItem()">
          + Add another tool
        </button>
      </div>
    </div>
  </form>
</section>
```

### Section 2: Typical Workday (Timeline)
```html
<section class="wizard-section" data-section="2">
  <h2 class="section-title">2. Typical Workday</h2>
  <p class="section-description">
    Map out a typical day's tasks and their durations.
  </p>

  <div class="timeline-editor" id="timeline-editor">
    <div class="timeline-header">
      <span>Time</span>
      <span>Task Description</span>
      <span>Duration</span>
      <span></span>
    </div>

    <div id="timeline-items" class="timeline-items">
      <!-- Timeline entries generated by JavaScript -->
    </div>

    <button type="button" class="btn btn-outline btn-add-timeline"
            id="add-timeline-btn">
      + Add Task
    </button>
  </div>

  <div class="timeline-summary" id="timeline-summary">
    <span>Total mapped time: <strong id="total-time">0 hours</strong></span>
  </div>
</section>
```

### Section 3: Process Mapping
```html
<section class="wizard-section" data-section="3">
  <h2 class="section-title">3. Process Mapping</h2>
  <p class="section-description">
    Document key processes as step-by-step flows.
  </p>

  <div id="processes-container" class="processes-container">
    <!-- Process cards generated by JavaScript -->
  </div>

  <button type="button" class="btn btn-primary" id="add-process-btn">
    + Add New Process
  </button>
</section>

<!-- Process Card Template -->
<template id="process-card-template">
  <div class="process-card" data-process-id="">
    <div class="process-card-header">
      <input type="text" class="input process-name"
             placeholder="Process Name" name="process_name">
      <button type="button" class="btn btn-icon btn-remove-process">
        ×
      </button>
    </div>

    <div class="process-card-body">
      <div class="form-group">
        <label class="label">Trigger Event</label>
        <input type="text" class="input" name="trigger_event"
               placeholder="What starts this process?">
      </div>

      <div class="process-flow">
        <div class="process-step">
          <span class="step-label">A</span>
          <input type="text" class="input" name="step_a"
                 placeholder="First step">
        </div>
        <div class="process-arrow">→</div>
        <div class="process-step">
          <span class="step-label">B</span>
          <input type="text" class="input" name="step_b"
                 placeholder="Second step">
        </div>
        <div class="process-arrow">→</div>
        <div class="process-step">
          <span class="step-label">C</span>
          <input type="text" class="input" name="step_c"
                 placeholder="Third step">
        </div>
        <div class="process-arrow">→</div>
        <div class="process-step">
          <span class="step-label">D</span>
          <input type="text" class="input" name="step_d"
                 placeholder="Fourth step">
        </div>
      </div>

      <div class="form-group">
        <label class="label">End of Process</label>
        <input type="text" class="input" name="end_state"
               placeholder="Final outcome">
      </div>
    </div>
  </div>
</template>
```

### Section 4: Workload & Friction
```html
<section class="wizard-section" data-section="4">
  <h2 class="section-title">4. Workload & Friction</h2>
  <p class="section-description">
    Quantify workload and identify pain points.
  </p>

  <form id="section-4-form" class="form">
    <div class="form-row form-row-3col">
      <div class="form-group">
        <label for="avg_processing_time" class="label">
          Average Processing Time
        </label>
        <input type="text" id="avg_processing_time" name="avg_processing_time"
               class="input" placeholder="e.g., 45 minutes">
      </div>

      <div class="form-group">
        <label for="daily_volume" class="label">Daily Volume</label>
        <input type="number" id="daily_volume" name="daily_volume"
               class="input" placeholder="Tasks per day" min="0">
      </div>

      <div class="form-group">
        <label for="weekly_volume" class="label">Weekly Volume</label>
        <input type="number" id="weekly_volume" name="weekly_volume"
               class="input" placeholder="Tasks per week" min="0">
      </div>
    </div>

    <div class="form-row form-row-2col">
      <div class="form-group">
        <label class="label">Human Intervention Required?</label>
        <div class="yes-no-toggle" data-field="human_intervention">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
      </div>

      <div class="form-group">
        <label class="label">Is This Task Repetitive?</label>
        <div class="yes-no-toggle" data-field="is_repetitive">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
      </div>
    </div>

    <div class="form-row form-row-2col">
      <div class="form-group">
        <label class="label">Frequent Errors Occur?</label>
        <div class="yes-no-toggle" data-field="frequent_errors">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
      </div>

      <div class="form-group">
        <label class="label">Single Person Dependency?</label>
        <div class="yes-no-toggle" data-field="single_person_dependency">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="blocking_points" class="label">Blocking Points</label>
        <textarea id="blocking_points" name="blocking_points"
                  class="textarea" rows="4"
                  placeholder="Describe any bottlenecks or blocking issues..."></textarea>
      </div>
    </div>
  </form>
</section>
```

### Section 5: Data & Constraints
```html
<section class="wizard-section" data-section="5">
  <h2 class="section-title">5. Data & Constraints</h2>
  <p class="section-description">
    Identify data sources, sensitivity, and constraints.
  </p>

  <form id="section-5-form" class="form">
    <div class="form-row">
      <div class="form-group">
        <label for="data_used" class="label">Data Used</label>
        <textarea id="data_used" name="data_used" class="textarea" rows="3"
                  placeholder="Types of data used (e.g., customer records, invoices)"></textarea>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="data_sources" class="label">Data Sources</label>
        <input type="text" id="data_sources" name="data_sources" class="input"
               placeholder="e.g., SAP, Salesforce, Excel files">
      </div>
    </div>

    <div class="form-row form-row-2col">
      <div class="form-group">
        <label class="label">Contains Confidential Data?</label>
        <div class="yes-no-toggle" data-field="is_confidential">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
        <span class="form-help">PII, financial data, trade secrets</span>
      </div>

      <div class="form-group">
        <label class="label">Requires Local Processing?</label>
        <div class="yes-no-toggle" data-field="requires_local_processing">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
        <span class="form-help">Cannot use cloud services</span>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="regulatory_constraints" class="label">
          Regulatory or Policy Constraints
        </label>
        <textarea id="regulatory_constraints" name="regulatory_constraints"
                  class="textarea" rows="3"
                  placeholder="e.g., GDPR, SOX, industry regulations"></textarea>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="label">Historical Data Available?</label>
        <div class="yes-no-toggle" data-field="historical_data_available">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
        <span class="form-help">For training AI models</span>
      </div>
    </div>
  </form>
</section>
```

### Section 6: AI Automation Potential
```html
<section class="wizard-section" data-section="6">
  <h2 class="section-title">6. AI Automation Potential</h2>
  <p class="section-description">
    Business perspective on automation possibilities (non-technical).
  </p>

  <form id="section-6-form" class="form">
    <div class="form-row form-row-2col">
      <div class="form-group">
        <label class="label">Partial Automation Possible?</label>
        <div class="yes-no-toggle" data-field="partial_automation_possible">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
        <span class="form-help">Can some steps be automated?</span>
      </div>

      <div class="form-group">
        <label class="label">Human Assistance from AI Possible?</label>
        <div class="yes-no-toggle" data-field="human_assistance_possible">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
        <span class="form-help">AI suggests, human decides</span>
      </div>
    </div>

    <div class="form-row form-row-2col">
      <div class="form-group">
        <label class="label">Automatic Prioritization Possible?</label>
        <div class="yes-no-toggle" data-field="auto_prioritization_possible">
          <button type="button" class="toggle-btn" data-value="true">Yes</button>
          <button type="button" class="toggle-btn" data-value="false">No</button>
        </div>
        <span class="form-help">AI can rank by urgency/importance</span>
      </div>

      <div class="form-group">
        <label class="label">Decision Complexity</label>
        <div class="priority-selector" data-field="decision_complexity">
          <button type="button" class="priority-btn" data-value="Low">Low</button>
          <button type="button" class="priority-btn" data-value="Medium">Medium</button>
          <button type="button" class="priority-btn" data-value="High">High</button>
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="required_confidence_level" class="label">
          Required Confidence Level
        </label>
        <input type="text" id="required_confidence_level"
               name="required_confidence_level" class="input"
               placeholder="e.g., 95% accuracy required">
        <span class="form-help">How accurate must AI decisions be?</span>
      </div>
    </div>
  </form>
</section>
```

### Section 7: Business Impact & ROI
```html
<section class="wizard-section" data-section="7">
  <h2 class="section-title">7. Business Impact & ROI</h2>
  <p class="section-description">
    Estimate the business value of automation.
  </p>

  <form id="section-7-form" class="form">
    <div class="form-row form-row-2col">
      <div class="form-group">
        <label for="estimated_time_saved_daily" class="label">
          Estimated Time Saved per Day
        </label>
        <input type="text" id="estimated_time_saved_daily"
               name="estimated_time_saved_daily" class="input"
               placeholder="e.g., 2 hours">
      </div>

      <div class="form-group">
        <label for="resources_freed" class="label">Resources Freed</label>
        <input type="text" id="resources_freed" name="resources_freed"
               class="input" placeholder="e.g., 0.5 FTE">
      </div>
    </div>

    <div class="form-row form-row-2col">
      <div class="form-group">
        <label for="error_reduction" class="label">Error Reduction</label>
        <input type="text" id="error_reduction" name="error_reduction"
               class="input" placeholder="e.g., 80% reduction">
      </div>

      <div class="form-group">
        <label for="sla_improvement" class="label">
          SLA / Performance Improvement
        </label>
        <input type="text" id="sla_improvement" name="sla_improvement"
               class="input" placeholder="e.g., Response time 4h to 1h">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="end_user_impact" class="label">
          End-User / Customer Impact
        </label>
        <textarea id="end_user_impact" name="end_user_impact"
                  class="textarea" rows="3"
                  placeholder="How will customers or end-users benefit?"></textarea>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="label">Business Priority</label>
        <div class="priority-selector priority-selector-large"
             data-field="business_priority">
          <button type="button" class="priority-btn priority-low"
                  data-value="Low">
            <span class="priority-icon">○</span>
            <span>Low</span>
          </button>
          <button type="button" class="priority-btn priority-medium"
                  data-value="Medium">
            <span class="priority-icon">◐</span>
            <span>Medium</span>
          </button>
          <button type="button" class="priority-btn priority-high"
                  data-value="High">
            <span class="priority-icon">●</span>
            <span>High</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</section>
```

### Section 8: Department-Specific Use Cases
```html
<section class="wizard-section" data-section="8">
  <h2 class="section-title">8. Department-Specific Use Cases</h2>
  <p class="section-description">
    Custom workflows and specific needs for this department.
  </p>

  <div id="usecases-container" class="usecases-container">
    <!-- Use case cards generated by JavaScript -->
  </div>

  <button type="button" class="btn btn-primary" id="add-usecase-btn">
    + Add Use Case
  </button>
</section>

<!-- Use Case Template -->
<template id="usecase-template">
  <div class="usecase-card" data-usecase-id="">
    <div class="usecase-header">
      <input type="text" class="input usecase-title"
             placeholder="Use Case Title" name="usecase_title">
      <button type="button" class="btn btn-icon btn-remove-usecase">×</button>
    </div>

    <div class="usecase-body">
      <div class="form-group">
        <label class="label">Description</label>
        <textarea class="textarea" name="usecase_description" rows="2"
                  placeholder="Describe this use case"></textarea>
      </div>

      <div class="form-row form-row-2col">
        <div class="form-group">
          <label class="label">Current Process</label>
          <textarea class="textarea" name="current_process" rows="2"
                    placeholder="How is this done today?"></textarea>
        </div>
        <div class="form-group">
          <label class="label">Desired Outcome</label>
          <textarea class="textarea" name="desired_outcome" rows="2"
                    placeholder="What should change?"></textarea>
        </div>
      </div>

      <div class="form-group">
        <label class="label">Estimated Impact</label>
        <div class="priority-selector" data-field="estimated_impact">
          <button type="button" class="priority-btn" data-value="Low">Low</button>
          <button type="button" class="priority-btn" data-value="Medium">Medium</button>
          <button type="button" class="priority-btn" data-value="High">High</button>
        </div>
      </div>
    </div>
  </div>
</template>
```

### Section 9: AI Opportunities Summary
```html
<section class="wizard-section" data-section="9">
  <h2 class="section-title">9. AI Opportunities Summary</h2>
  <p class="section-description">
    Synthesize identified AI opportunities and categorize by timeline.
  </p>

  <div class="opportunities-grid">
    <!-- Quick Wins Column -->
    <div class="opportunities-column">
      <h3 class="column-title column-quickwin">
        Quick Wins
        <span class="column-subtitle">(≤ 1 month)</span>
      </h3>
      <div id="quickwin-opportunities" class="opportunities-list">
        <!-- Opportunity items -->
      </div>
      <button type="button" class="btn btn-text"
              onclick="addOpportunity('quickwin')">
        + Add Quick Win
      </button>
    </div>

    <!-- Mid/Long Term Column -->
    <div class="opportunities-column">
      <h3 class="column-title column-structural">
        Structural Cases
        <span class="column-subtitle">(Mid/Long term)</span>
      </h3>
      <div id="structural-opportunities" class="opportunities-list">
        <!-- Opportunity items -->
      </div>
      <button type="button" class="btn btn-text"
              onclick="addOpportunity('structural')">
        + Add Structural Case
      </button>
    </div>
  </div>

  <!-- Summary Cards -->
  <div class="ai-summary-cards">
    <div class="summary-card">
      <label class="label">AI Use Case #1 (Highest Priority)</label>
      <input type="text" id="ai_usecase_1" name="ai_usecase_1" class="input"
             placeholder="Primary AI automation opportunity">
    </div>
    <div class="summary-card">
      <label class="label">AI Use Case #2</label>
      <input type="text" id="ai_usecase_2" name="ai_usecase_2" class="input"
             placeholder="Secondary AI automation opportunity">
    </div>
    <div class="summary-card">
      <label class="label">AI Use Case #3</label>
      <input type="text" id="ai_usecase_3" name="ai_usecase_3" class="input"
             placeholder="Third AI automation opportunity">
    </div>
  </div>
</section>
```

### Section 10: Validation
```html
<section class="wizard-section" data-section="10">
  <h2 class="section-title">10. Validation</h2>
  <p class="section-description">
    Review and finalize the audit.
  </p>

  <!-- Audit Summary -->
  <div class="validation-summary" id="validation-summary">
    <h3>Audit Summary</h3>
    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-label">Department</span>
        <span class="summary-value" id="summary-department">-</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Audited Person</span>
        <span class="summary-value" id="summary-person">-</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Processes Documented</span>
        <span class="summary-value" id="summary-processes">0</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">AI Opportunities</span>
        <span class="summary-value" id="summary-opportunities">0</span>
      </div>
    </div>
  </div>

  <!-- ROI Score Preview -->
  <div class="roi-preview" id="roi-preview">
    <h3>Estimated ROI Score</h3>
    <div class="roi-meter">
      <div class="roi-meter-fill" id="roi-meter-fill"></div>
      <span class="roi-meter-value" id="roi-meter-value">0</span>
    </div>
    <p class="roi-explanation" id="roi-explanation"></p>
  </div>

  <!-- Validation Form -->
  <div class="validation-form">
    <h3>Validate Audit</h3>
    <p>By validating, you confirm that this audit is complete and accurate.</p>

    <div class="form-row form-row-2col">
      <div class="form-group">
        <label for="validator_name" class="label required">Your Name</label>
        <input type="text" id="validator_name" name="validator_name"
               class="input" required>
      </div>
      <div class="form-group">
        <label for="validator_role" class="label required">Your Role</label>
        <input type="text" id="validator_role" name="validator_role"
               class="input" required>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="label">Validation Date</label>
        <input type="text" id="validation_date" class="input"
               readonly disabled>
      </div>
    </div>

    <div class="validation-actions">
      <button type="button" id="save-draft-btn" class="btn btn-outline">
        Save as Draft
      </button>
      <button type="button" id="validate-btn" class="btn btn-success">
        Validate Audit
      </button>
    </div>
  </div>
</section>
```

---

## Reusable Components

### Yes/No Toggle
```html
<div class="yes-no-toggle" data-field="fieldName">
  <button type="button" class="toggle-btn" data-value="true">Yes</button>
  <button type="button" class="toggle-btn" data-value="false">No</button>
</div>
```

### Priority Selector
```html
<div class="priority-selector" data-field="fieldName">
  <button type="button" class="priority-btn" data-value="Low">Low</button>
  <button type="button" class="priority-btn" data-value="Medium">Medium</button>
  <button type="button" class="priority-btn" data-value="High">High</button>
</div>
```

### Dynamic List
```html
<div class="dynamic-list" id="list-id">
  <div class="dynamic-item">
    <input type="text" class="input" name="items[]" value="">
    <button type="button" class="btn btn-icon btn-remove-item">×</button>
  </div>
</div>
<button type="button" class="btn btn-text btn-add-item">
  + Add Item
</button>
```

### Toast Notification
```html
<div id="toast-container" class="toast-container">
  <div class="toast toast-success">
    <span class="toast-icon">✓</span>
    <span class="toast-message">Changes saved successfully</span>
  </div>
</div>
```

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets, small laptops |
| Desktop | > 1024px | Standard screens |

### Key Responsive Behaviors
1. **Form rows**: 2-column → 1-column on mobile
2. **Process flow**: Horizontal → Vertical on mobile
3. **Navigation**: Full width buttons on mobile
4. **Progress bar**: Horizontal scrollable on mobile
5. **Cards**: Stack vertically on mobile
