# PushAudit - Data Model (IndexedDB)

## Overview

All data is stored locally in the browser using **IndexedDB**. This provides:
- Structured data storage (like a database)
- Large capacity (50MB+)
- Indexed queries for fast lookups
- Persistence across sessions

---

## Database Structure

### Database Name: `PushAuditDB`
### Version: `1`

```javascript
// Object Stores (Tables)
├── audits          // Main audit records
├── tasks           // Section 2 - Workday timeline
├── processes       // Section 3 - Process mappings
├── useCases        // Section 8 - Department use cases
└── opportunities   // Section 9 - AI opportunities
```

---

## Object Store: `audits`

**Purpose**: Main audit records (one document per audit)

### Schema

```javascript
{
  // System Fields
  id: "AUD-2024-0001",           // Primary key
  status: "draft",               // draft | validated
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T14:22:00Z",
  validatedAt: null,
  validatedBy: null,
  validatorRole: null,

  // Section 1 - General Information
  department: "Finance",
  auditedPerson: "John Doe",
  rolePosition: "Financial Analyst",
  seniority: "Senior",
  auditDate: "2024-01-15",
  auditors: ["Alice", "Bob"],
  currentTools: ["Excel", "SAP", "Email"],

  // Section 4 - Workload & Friction
  avgProcessingTime: "45 minutes",
  dailyVolume: 25,
  weeklyVolume: 125,
  humanIntervention: true,
  isRepetitive: true,
  frequentErrors: false,
  singlePersonDependency: true,
  blockingPoints: "Waiting for manager approval, system downtime",

  // Section 5 - Data & Constraints
  dataUsed: "Customer records, invoices, bank statements",
  dataSources: ["SAP", "Salesforce", "Excel files"],
  isConfidential: true,
  requiresLocalProcessing: false,
  regulatoryConstraints: "GDPR, SOX compliance",
  historicalDataAvailable: true,

  // Section 6 - AI Automation Potential
  partialAutomationPossible: true,
  humanAssistancePossible: true,
  autoPrioritizationPossible: true,
  decisionComplexity: "Medium",       // Low | Medium | High
  requiredConfidenceLevel: "95%",

  // Section 7 - Business Impact & ROI
  estimatedTimeSavedDaily: "2 hours",
  resourcesFreed: "0.5 FTE",
  errorReduction: "80% reduction",
  slaImprovement: "Response time from 4h to 1h",
  endUserImpact: "Faster invoice processing",
  businessPriority: "High",           // Low | Medium | High

  // Section 9 - AI Opportunities Summary
  aiUseCase1: "Invoice data extraction",
  aiUseCase2: "Smart routing",
  aiUseCase3: "Anomaly detection",

  // Computed Fields
  roiScore: 78,                       // 0-100
  automationReadiness: "Ready",       // Ready | Needs Work | Not Ready
  quickWinFlag: true
}
```

### Indexes

```javascript
{
  keyPath: "id",
  indexes: [
    { name: "status", keyPath: "status" },
    { name: "department", keyPath: "department" },
    { name: "createdAt", keyPath: "createdAt" }
  ]
}
```

---

## Object Store: `tasks`

**Purpose**: Section 2 - Workday timeline entries

### Schema

```javascript
{
  id: "TSK-0001-001",              // Primary key
  auditId: "AUD-2024-0001",        // Foreign key
  timeSlot: "09:00",
  endTime: "10:30",
  durationMinutes: 90,
  taskDescription: "Process incoming invoices",
  taskCategory: "Processing",      // Administrative | Analytical | Communication | Processing
  toolsUsed: ["SAP", "Excel"],
  isAutomatable: true,
  notes: "Peak volume on Mondays",
  displayOrder: 1
}
```

### Indexes

```javascript
{
  keyPath: "id",
  indexes: [
    { name: "auditId", keyPath: "auditId" }
  ]
}
```

---

## Object Store: `processes`

**Purpose**: Section 3 - Process mapping (A→B→C→D flows)

### Schema

```javascript
{
  id: "PRC-0001-001",              // Primary key
  auditId: "AUD-2024-0001",        // Foreign key
  processName: "Invoice Approval Process",
  triggerEvent: "New invoice received via email",
  stepA: "Download invoice from email",
  stepB: "Enter data into SAP",
  stepC: "Route to approver based on amount",
  stepD: "Send confirmation to vendor",
  endState: "Invoice marked as processed",
  avgDuration: "15 minutes",
  frequency: "50/day",
  automationNotes: "Steps A-C highly automatable",
  bottlenecks: "Approver delays",
  displayOrder: 1
}
```

### Indexes

```javascript
{
  keyPath: "id",
  indexes: [
    { name: "auditId", keyPath: "auditId" }
  ]
}
```

---

## Object Store: `useCases`

**Purpose**: Section 8 - Department-specific use cases

### Schema

```javascript
{
  id: "UC-0001-001",               // Primary key
  auditId: "AUD-2024-0001",        // Foreign key
  useCaseTitle: "Automated Journal Entries",
  useCaseDescription: "Generate standard journal entries from templates",
  currentProcess: "Manual entry in ERP",
  desiredOutcome: "Auto-generated entries with review",
  stakeholders: ["Finance Manager", "Controller"],
  estimatedImpact: "High",         // Low | Medium | High
  additionalNotes: "Already have templates defined",
  displayOrder: 1
}
```

### Indexes

```javascript
{
  keyPath: "id",
  indexes: [
    { name: "auditId", keyPath: "auditId" }
  ]
}
```

---

## Object Store: `opportunities`

**Purpose**: Section 9 - AI opportunities

### Schema

```javascript
{
  id: "OPP-0001-001",              // Primary key
  auditId: "AUD-2024-0001",        // Foreign key
  opportunityTitle: "Invoice Data Extraction",
  description: "Use OCR + NLP to extract invoice data",
  timeframe: "Quick Win",          // Quick Win | Mid-term | Long-term
  implementationEffort: "Low",     // Low | Medium | High
  businessValue: "High",           // Low | Medium | High
  prerequisites: "API access to SAP",
  risks: "Accuracy on handwritten invoices",
  priorityRank: 1,
  displayOrder: 1
}
```

### Indexes

```javascript
{
  keyPath: "id",
  indexes: [
    { name: "auditId", keyPath: "auditId" }
  ]
}
```

---

## ID Generation

### Pattern

```javascript
// Audit ID
`AUD-${year}-${sequence.padStart(4, '0')}`
// Example: AUD-2024-0001

// Task ID
`TSK-${auditSequence}-${taskSequence.padStart(3, '0')}`
// Example: TSK-0001-001

// Process ID
`PRC-${auditSequence}-${processSequence.padStart(3, '0')}`
// Example: PRC-0001-001

// Use Case ID
`UC-${auditSequence}-${useCaseSequence.padStart(3, '0')}`
// Example: UC-0001-001

// Opportunity ID
`OPP-${auditSequence}-${oppSequence.padStart(3, '0')}`
// Example: OPP-0001-001
```

### Implementation

```javascript
// js/utils/id-generator.js

const IdGenerator = {
  // Get next audit ID
  async nextAuditId() {
    const year = new Date().getFullYear();
    const audits = await Storage.getAll('audits');
    const thisYear = audits.filter(a => a.id.includes(`AUD-${year}`));
    const nextNum = thisYear.length + 1;
    return `AUD-${year}-${String(nextNum).padStart(4, '0')}`;
  },

  // Get next task ID for an audit
  async nextTaskId(auditId) {
    const auditSeq = auditId.split('-')[2]; // "0001"
    const tasks = await Storage.getByIndex('tasks', 'auditId', auditId);
    const nextNum = tasks.length + 1;
    return `TSK-${auditSeq}-${String(nextNum).padStart(3, '0')}`;
  },

  // Similar for processes, useCases, opportunities...
};
```

---

## Data Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA RELATIONSHIPS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌─────────────────┐                          │
│                    │     audits      │                          │
│                    │   (id = PK)     │                          │
│                    └────────┬────────┘                          │
│                             │                                    │
│         ┌───────────────────┼───────────────────┐               │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   tasks     │    │  processes  │    │  useCases   │         │
│  │(auditId=FK) │    │(auditId=FK) │    │(auditId=FK) │         │
│  │   1:N       │    │    1:N      │    │    1:N      │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                             │                                    │
│                             ▼                                    │
│                    ┌─────────────────┐                          │
│                    │  opportunities  │                          │
│                    │  (auditId=FK)   │                          │
│                    │      1:N        │                          │
│                    └─────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Export Format (JSON)

When exporting, all related data is included:

```javascript
{
  "exportDate": "2024-01-15T14:30:00Z",
  "version": "1.0",
  "audits": [
    {
      "id": "AUD-2024-0001",
      "status": "draft",
      // ... all audit fields ...
      "tasks": [
        { "id": "TSK-0001-001", /* ... */ },
        { "id": "TSK-0001-002", /* ... */ }
      ],
      "processes": [
        { "id": "PRC-0001-001", /* ... */ }
      ],
      "useCases": [
        { "id": "UC-0001-001", /* ... */ }
      ],
      "opportunities": [
        { "id": "OPP-0001-001", /* ... */ }
      ]
    }
  ]
}
```

---

## ROI Score Calculation

```javascript
// js/utils/roi-calculator.js

const ROICalculator = {
  calculate(audit) {
    let score = 0;

    // Time Savings (0-25)
    score += this.timeSavingsScore(audit.estimatedTimeSavedDaily);

    // Automation Potential (0-25)
    if (audit.partialAutomationPossible) score += 8;
    if (audit.humanAssistancePossible) score += 5;
    if (audit.autoPrioritizationPossible) score += 7;
    if (audit.isRepetitive) score += 5;

    // Complexity Penalty (-10 to 0)
    if (audit.decisionComplexity === 'High') score -= 10;
    else if (audit.decisionComplexity === 'Medium') score -= 5;

    // Data Readiness (0-25)
    if (audit.historicalDataAvailable) score += 10;
    if (!audit.isConfidential || !audit.requiresLocalProcessing) score += 8;
    if (audit.dataSources?.length > 0) score += 7;

    // Business Priority (0-25)
    if (audit.businessPriority === 'High') score += 25;
    else if (audit.businessPriority === 'Medium') score += 15;
    else score += 5;

    return Math.max(0, Math.min(100, score));
  },

  timeSavingsScore(timeStr) {
    if (!timeStr) return 0;
    const lower = timeStr.toLowerCase();
    if (lower.includes('4') && lower.includes('hour')) return 25;
    if (lower.includes('3') && lower.includes('hour')) return 22;
    if (lower.includes('2') && lower.includes('hour')) return 20;
    if (lower.includes('1') && lower.includes('hour')) return 15;
    if (lower.includes('30') && lower.includes('min')) return 10;
    return 5;
  },

  getReadiness(score) {
    if (score >= 70) return 'Ready';
    if (score >= 40) return 'Needs Work';
    return 'Not Ready';
  },

  isQuickWin(audit, score) {
    const lowComplexity = ['Low', 'Medium'].includes(audit.decisionComplexity);
    return score >= 60 && lowComplexity && audit.isRepetitive;
  }
};
```

---

## Lookup Values (Constants)

These are stored in the JavaScript code, not in the database:

```javascript
// js/utils/constants.js

const LOOKUP_VALUES = {
  departments: [
    'Finance', 'HR', 'IT', 'Operations', 'Sales',
    'Marketing', 'Legal', 'Customer Service', 'R&D', 'Procurement'
  ],

  seniorityLevels: [
    'Junior', 'Mid-level', 'Senior', 'Manager', 'Director', 'Executive'
  ],

  decisionComplexity: ['Low', 'Medium', 'High'],

  businessPriority: ['Low', 'Medium', 'High'],

  timeframe: ['Quick Win', 'Mid-term', 'Long-term'],

  effortLevel: ['Low', 'Medium', 'High'],

  taskCategories: [
    'Administrative', 'Analytical', 'Communication',
    'Processing', 'Decision-making', 'Review'
  ],

  statusValues: ['draft', 'validated']
};
```

---

## Validation Rules

```javascript
// js/utils/validators.js

const Validators = {
  // Required fields for validation
  requiredForValidation: [
    'department',
    'auditedPerson',
    'rolePosition',
    'auditDate'
  ],

  // Check if audit can be validated
  canValidate(audit) {
    const missing = this.requiredForValidation.filter(
      field => !audit[field]
    );

    return {
      valid: missing.length === 0,
      missingFields: missing
    };
  },

  // Field-level validation
  validateField(field, value) {
    switch (field) {
      case 'dailyVolume':
      case 'weeklyVolume':
        return typeof value === 'number' && value >= 0;

      case 'auditDate':
        return value && !isNaN(Date.parse(value));

      case 'businessPriority':
      case 'decisionComplexity':
        return ['Low', 'Medium', 'High'].includes(value);

      default:
        return true;
    }
  }
};
```

---

## Storage Wrapper

Simple IndexedDB wrapper for easy data access:

```javascript
// js/storage.js

const Storage = {
  dbName: 'PushAuditDB',
  version: 1,
  db: null,

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('audits')) {
          const audits = db.createObjectStore('audits', { keyPath: 'id' });
          audits.createIndex('status', 'status');
          audits.createIndex('department', 'department');
          audits.createIndex('createdAt', 'createdAt');
        }

        if (!db.objectStoreNames.contains('tasks')) {
          const tasks = db.createObjectStore('tasks', { keyPath: 'id' });
          tasks.createIndex('auditId', 'auditId');
        }

        if (!db.objectStoreNames.contains('processes')) {
          const processes = db.createObjectStore('processes', { keyPath: 'id' });
          processes.createIndex('auditId', 'auditId');
        }

        if (!db.objectStoreNames.contains('useCases')) {
          const useCases = db.createObjectStore('useCases', { keyPath: 'id' });
          useCases.createIndex('auditId', 'auditId');
        }

        if (!db.objectStoreNames.contains('opportunities')) {
          const opps = db.createObjectStore('opportunities', { keyPath: 'id' });
          opps.createIndex('auditId', 'auditId');
        }
      };
    });
  },

  // Get all records from a store
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Get single record by ID
  async get(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Get records by index
  async getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Save record (insert or update)
  async save(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Delete record
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Clear all data (for testing/reset)
  async clearAll() {
    const stores = ['audits', 'tasks', 'processes', 'useCases', 'opportunities'];
    for (const store of stores) {
      const tx = this.db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
    }
  }
};
```
