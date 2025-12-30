# PushAudit - Save Flow (Client-Side)

## Overview

All data is saved directly to the browser's **IndexedDB**. No server calls needed!

---

## Auto-Save Flow

```
User Types/Clicks
       │
       ▼
┌──────────────────┐
│  Input Event     │ ──▶ onchange, oninput
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Update Local    │ ──▶ wizard.data[field] = value
│  State           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Debounce 500ms  │ ──▶ Prevents saves while typing
└────────┬─────────┘
         │
         ▼ (after 500ms of no input)
┌──────────────────┐
│  Save to         │ ──▶ Storage.save('audits', data)
│  IndexedDB       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Show "Saved"    │ ──▶ Green checkmark indicator
└──────────────────┘
```

---

## Auto-Save Implementation

```javascript
// js/wizard/autosave.js

class AutoSave {
  constructor(wizard) {
    this.wizard = wizard;
    this.debounceMs = 500;
    this.timeoutId = null;
    this.indicator = document.getElementById('autosave-indicator');
  }

  // Called whenever a field changes
  trigger() {
    this.showStatus('pending');

    // Clear existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set new debounced timeout
    this.timeoutId = setTimeout(() => {
      this.save();
    }, this.debounceMs);
  }

  // Save to IndexedDB
  async save() {
    this.showStatus('saving');

    try {
      // Update timestamp
      this.wizard.data.updatedAt = new Date().toISOString();

      // Calculate ROI score
      this.wizard.data.roiScore = ROICalculator.calculate(this.wizard.data);
      this.wizard.data.automationReadiness = ROICalculator.getReadiness(this.wizard.data.roiScore);
      this.wizard.data.quickWinFlag = ROICalculator.isQuickWin(this.wizard.data, this.wizard.data.roiScore);

      // Save to IndexedDB
      await Storage.save('audits', this.wizard.data);

      this.showStatus('saved');
    } catch (error) {
      console.error('Save failed:', error);
      this.showStatus('error');
    }
  }

  // Update UI indicator
  showStatus(status) {
    const config = {
      pending: { text: 'Unsaved', class: 'pending', icon: '○' },
      saving: { text: 'Saving...', class: 'saving', icon: '◐' },
      saved: { text: 'Saved', class: 'saved', icon: '✓' },
      error: { text: 'Error', class: 'error', icon: '✗' }
    };

    const { text, class: cls, icon } = config[status];
    this.indicator.innerHTML = `<span class="icon">${icon}</span> ${text}`;
    this.indicator.className = `autosave-indicator ${cls}`;

    // Auto-hide "saved" after 2 seconds
    if (status === 'saved') {
      setTimeout(() => {
        this.indicator.classList.add('fade');
      }, 2000);
    }
  }

  // Force save immediately (for navigation)
  async forceSave() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    await this.save();
  }
}
```

---

## Storage Operations

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
        this.createStores(db);
      };
    });
  },

  createStores(db) {
    // Audits
    if (!db.objectStoreNames.contains('audits')) {
      const audits = db.createObjectStore('audits', { keyPath: 'id' });
      audits.createIndex('status', 'status');
      audits.createIndex('department', 'department');
      audits.createIndex('createdAt', 'createdAt');
    }

    // Tasks (Section 2)
    if (!db.objectStoreNames.contains('tasks')) {
      const tasks = db.createObjectStore('tasks', { keyPath: 'id' });
      tasks.createIndex('auditId', 'auditId');
    }

    // Processes (Section 3)
    if (!db.objectStoreNames.contains('processes')) {
      const processes = db.createObjectStore('processes', { keyPath: 'id' });
      processes.createIndex('auditId', 'auditId');
    }

    // Use Cases (Section 8)
    if (!db.objectStoreNames.contains('useCases')) {
      const useCases = db.createObjectStore('useCases', { keyPath: 'id' });
      useCases.createIndex('auditId', 'auditId');
    }

    // Opportunities (Section 9)
    if (!db.objectStoreNames.contains('opportunities')) {
      const opps = db.createObjectStore('opportunities', { keyPath: 'id' });
      opps.createIndex('auditId', 'auditId');
    }
  },

  // Save (insert or update)
  async save(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Get by ID
  async get(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Get all
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Get by index
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

  // Delete
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
```

---

## Create New Audit

```javascript
// js/pages/home.js

async function createNewAudit() {
  const id = await IdGenerator.nextAuditId();
  const now = new Date().toISOString();

  const audit = {
    id,
    status: 'draft',
    createdAt: now,
    updatedAt: now,

    // Initialize all fields as empty
    department: '',
    auditedPerson: '',
    rolePosition: '',
    seniority: '',
    auditDate: new Date().toISOString().split('T')[0],
    auditors: [],
    currentTools: [],

    avgProcessingTime: '',
    dailyVolume: 0,
    weeklyVolume: 0,
    humanIntervention: null,
    isRepetitive: null,
    frequentErrors: null,
    singlePersonDependency: null,
    blockingPoints: '',

    dataUsed: '',
    dataSources: [],
    isConfidential: null,
    requiresLocalProcessing: null,
    regulatoryConstraints: '',
    historicalDataAvailable: null,

    partialAutomationPossible: null,
    humanAssistancePossible: null,
    autoPrioritizationPossible: null,
    decisionComplexity: '',
    requiredConfidenceLevel: '',

    estimatedTimeSavedDaily: '',
    resourcesFreed: '',
    errorReduction: '',
    slaImprovement: '',
    endUserImpact: '',
    businessPriority: '',

    aiUseCase1: '',
    aiUseCase2: '',
    aiUseCase3: '',

    roiScore: 0,
    automationReadiness: 'Not Ready',
    quickWinFlag: false,

    validatedAt: null,
    validatedBy: null,
    validatorRole: null
  };

  await Storage.save('audits', audit);

  // Navigate to wizard
  window.location.href = `audit.html?id=${id}`;
}
```

---

## Load Audit with Related Data

```javascript
// js/wizard/wizard.js

class AuditWizard {
  constructor(auditId) {
    this.auditId = auditId;
    this.data = null;
    this.tasks = [];
    this.processes = [];
    this.useCases = [];
    this.opportunities = [];
    this.currentStep = 1;
    this.autoSave = new AutoSave(this);
  }

  async init() {
    await this.loadData();
    this.renderProgress();
    this.renderSection();
    this.bindNavigation();
  }

  async loadData() {
    // Load main audit
    this.data = await Storage.get('audits', this.auditId);

    if (!this.data) {
      Toast.show('Audit not found', 'error');
      window.location.href = 'index.html';
      return;
    }

    // Load related data
    this.tasks = await Storage.getByIndex('tasks', 'auditId', this.auditId);
    this.processes = await Storage.getByIndex('processes', 'auditId', this.auditId);
    this.useCases = await Storage.getByIndex('useCases', 'auditId', this.auditId);
    this.opportunities = await Storage.getByIndex('opportunities', 'auditId', this.auditId);

    // Sort by display order
    this.tasks.sort((a, b) => a.displayOrder - b.displayOrder);
    this.processes.sort((a, b) => a.displayOrder - b.displayOrder);
    this.useCases.sort((a, b) => a.displayOrder - b.displayOrder);
    this.opportunities.sort((a, b) => a.priorityRank - b.priorityRank);
  }

  // Handle field changes
  onFieldChange(field, value) {
    this.data[field] = value;
    this.autoSave.trigger();
  }

  // Save related data (tasks, processes, etc.)
  async saveRelatedData(storeName, items) {
    for (const item of items) {
      await Storage.save(storeName, item);
    }
  }
}
```

---

## Export to JSON

```javascript
// js/utils/export.js

const Exporter = {
  async exportToJSON() {
    // Get all data
    const audits = await Storage.getAll('audits');

    // For each audit, attach related data
    for (const audit of audits) {
      audit.tasks = await Storage.getByIndex('tasks', 'auditId', audit.id);
      audit.processes = await Storage.getByIndex('processes', 'auditId', audit.id);
      audit.useCases = await Storage.getByIndex('useCases', 'auditId', audit.id);
      audit.opportunities = await Storage.getByIndex('opportunities', 'auditId', audit.id);
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      audits
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `pushaudit-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    Toast.show('Export complete!', 'success');
  },

  async exportSingleAudit(auditId) {
    const audit = await Storage.get('audits', auditId);
    audit.tasks = await Storage.getByIndex('tasks', 'auditId', auditId);
    audit.processes = await Storage.getByIndex('processes', 'auditId', auditId);
    audit.useCases = await Storage.getByIndex('useCases', 'auditId', auditId);
    audit.opportunities = await Storage.getByIndex('opportunities', 'auditId', auditId);

    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      audits: [audit]
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${auditId}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }
};
```

---

## Import from JSON

```javascript
// js/utils/import.js

const Importer = {
  async importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (!data.audits || !Array.isArray(data.audits)) {
            throw new Error('Invalid file format');
          }

          let imported = 0;

          for (const audit of data.audits) {
            // Check for duplicate
            const existing = await Storage.get('audits', audit.id);
            if (existing) {
              // Generate new ID for import
              audit.id = await IdGenerator.nextAuditId();
            }

            // Save audit
            const { tasks, processes, useCases, opportunities, ...auditData } = audit;
            await Storage.save('audits', auditData);

            // Save related data with updated auditId
            if (tasks) {
              for (const task of tasks) {
                task.auditId = audit.id;
                task.id = await IdGenerator.nextTaskId(audit.id);
                await Storage.save('tasks', task);
              }
            }

            if (processes) {
              for (const process of processes) {
                process.auditId = audit.id;
                process.id = await IdGenerator.nextProcessId(audit.id);
                await Storage.save('processes', process);
              }
            }

            if (useCases) {
              for (const useCase of useCases) {
                useCase.auditId = audit.id;
                useCase.id = await IdGenerator.nextUseCaseId(audit.id);
                await Storage.save('useCases', useCase);
              }
            }

            if (opportunities) {
              for (const opp of opportunities) {
                opp.auditId = audit.id;
                opp.id = await IdGenerator.nextOpportunityId(audit.id);
                await Storage.save('opportunities', opp);
              }
            }

            imported++;
          }

          Toast.show(`Imported ${imported} audit(s)`, 'success');
          resolve(imported);
        } catch (error) {
          Toast.show('Import failed: ' + error.message, 'error');
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
};
```

---

## Export to Excel (CSV)

```javascript
// js/utils/export.js

const Exporter = {
  // ... existing methods ...

  async exportToCSV(auditId) {
    const audit = await Storage.get('audits', auditId);

    // Convert to flat structure
    const rows = [
      ['Field', 'Value'],
      ['Audit ID', audit.id],
      ['Status', audit.status],
      ['Department', audit.department],
      ['Audited Person', audit.auditedPerson],
      ['Role/Position', audit.rolePosition],
      ['Seniority', audit.seniority],
      ['Audit Date', audit.auditDate],
      ['Auditors', audit.auditors?.join(', ') || ''],
      ['Current Tools', audit.currentTools?.join(', ') || ''],
      ['Avg Processing Time', audit.avgProcessingTime],
      ['Daily Volume', audit.dailyVolume],
      ['Weekly Volume', audit.weeklyVolume],
      ['Human Intervention', audit.humanIntervention ? 'Yes' : 'No'],
      ['Is Repetitive', audit.isRepetitive ? 'Yes' : 'No'],
      ['Frequent Errors', audit.frequentErrors ? 'Yes' : 'No'],
      ['Single Person Dependency', audit.singlePersonDependency ? 'Yes' : 'No'],
      ['Blocking Points', audit.blockingPoints],
      ['Data Used', audit.dataUsed],
      ['Data Sources', audit.dataSources?.join(', ') || ''],
      ['Is Confidential', audit.isConfidential ? 'Yes' : 'No'],
      ['Requires Local Processing', audit.requiresLocalProcessing ? 'Yes' : 'No'],
      ['Regulatory Constraints', audit.regulatoryConstraints],
      ['Historical Data Available', audit.historicalDataAvailable ? 'Yes' : 'No'],
      ['Partial Automation Possible', audit.partialAutomationPossible ? 'Yes' : 'No'],
      ['Human Assistance Possible', audit.humanAssistancePossible ? 'Yes' : 'No'],
      ['Auto Prioritization Possible', audit.autoPrioritizationPossible ? 'Yes' : 'No'],
      ['Decision Complexity', audit.decisionComplexity],
      ['Required Confidence Level', audit.requiredConfidenceLevel],
      ['Estimated Time Saved Daily', audit.estimatedTimeSavedDaily],
      ['Resources Freed', audit.resourcesFreed],
      ['Error Reduction', audit.errorReduction],
      ['SLA Improvement', audit.slaImprovement],
      ['End User Impact', audit.endUserImpact],
      ['Business Priority', audit.businessPriority],
      ['AI Use Case 1', audit.aiUseCase1],
      ['AI Use Case 2', audit.aiUseCase2],
      ['AI Use Case 3', audit.aiUseCase3],
      ['ROI Score', audit.roiScore],
      ['Automation Readiness', audit.automationReadiness],
      ['Quick Win', audit.quickWinFlag ? 'Yes' : 'No']
    ];

    // Convert to CSV string
    const csv = rows.map(row =>
      row.map(cell =>
        typeof cell === 'string' && cell.includes(',')
          ? `"${cell}"`
          : cell
      ).join(',')
    ).join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${auditId}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }
};
```

---

## Delete Audit

```javascript
// js/pages/home.js

async function deleteAudit(auditId) {
  if (!confirm('Delete this audit? This cannot be undone.')) {
    return;
  }

  try {
    // Delete related data first
    const tasks = await Storage.getByIndex('tasks', 'auditId', auditId);
    for (const task of tasks) {
      await Storage.delete('tasks', task.id);
    }

    const processes = await Storage.getByIndex('processes', 'auditId', auditId);
    for (const process of processes) {
      await Storage.delete('processes', process.id);
    }

    const useCases = await Storage.getByIndex('useCases', 'auditId', auditId);
    for (const useCase of useCases) {
      await Storage.delete('useCases', useCase.id);
    }

    const opportunities = await Storage.getByIndex('opportunities', 'auditId', auditId);
    for (const opp of opportunities) {
      await Storage.delete('opportunities', opp.id);
    }

    // Delete audit
    await Storage.delete('audits', auditId);

    Toast.show('Audit deleted', 'success');
    loadAuditList(); // Refresh the list
  } catch (error) {
    Toast.show('Delete failed', 'error');
    console.error(error);
  }
}
```

---

## Validate Audit

```javascript
// js/sections/section10-validation.js

async function validateAudit() {
  const wizard = window.wizard; // Global reference
  const { data } = wizard;

  // Check required fields
  const validation = Validators.canValidate(data);

  if (!validation.valid) {
    Toast.show(`Missing: ${validation.missingFields.join(', ')}`, 'error');
    return;
  }

  // Get validator info
  const validatorName = document.getElementById('validator-name').value;
  const validatorRole = document.getElementById('validator-role').value;

  if (!validatorName || !validatorRole) {
    Toast.show('Please enter your name and role', 'error');
    return;
  }

  // Update audit
  data.status = 'validated';
  data.validatedAt = new Date().toISOString();
  data.validatedBy = validatorName;
  data.validatorRole = validatorRole;

  await Storage.save('audits', data);

  Toast.show('Audit validated!', 'success');

  // Redirect to view page
  setTimeout(() => {
    window.location.href = `view.html?id=${data.id}`;
  }, 1500);
}
```
