/* ============================================
   PushAudit - Main Application Entry Point
   Initializes the app and handles routing
   ============================================ */

const App = {
  // Current page context
  currentPage: null,
  wizard: null,

  // Initialize the application
  async init() {
    console.log('PushAudit initializing...');

    // Initialize storage first
    await Storage.init();

    // Determine current page and initialize accordingly
    const path = window.location.pathname;

    if (path.includes('audit.html')) {
      this.currentPage = 'audit';
      await this.initAuditPage();
    } else if (path.includes('view.html')) {
      this.currentPage = 'view';
      await this.initViewPage();
    } else {
      this.currentPage = 'home';
      await this.initHomePage();
    }

    console.log('PushAudit initialized');
  },

  // Initialize home page (audit list)
  async initHomePage() {
    await this.renderAuditList();
    this.bindHomeEvents();
  },

  // Render the audit list
  async renderAuditList() {
    const container = document.getElementById('audit-list');
    if (!container) return;

    const audits = await Storage.getAll('audits');

    if (audits.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>No Audits Yet</h3>
          <p class="text-muted">Create your first operational audit to get started.</p>
          <button type="button" class="btn btn-primary btn-lg mt-4" id="create-first-audit">
            Create New Audit
          </button>
        </div>
      `;

      document.getElementById('create-first-audit')?.addEventListener('click', () => {
        this.createNewAudit();
      });
      return;
    }

    // Sort by updated date, newest first
    audits.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    container.innerHTML = audits.map(audit => this.renderAuditCard(audit)).join('');

    // Bind card events
    container.querySelectorAll('.audit-card').forEach(card => {
      const auditId = card.dataset.auditId;

      card.querySelector('.btn-edit')?.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `audit.html?id=${auditId}`;
      });

      card.querySelector('.btn-view')?.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `view.html?id=${auditId}`;
      });

      card.querySelector('.btn-delete')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this audit? This cannot be undone.')) {
          await this.deleteAudit(auditId);
        }
      });

      // Click anywhere on card to edit
      card.addEventListener('click', () => {
        window.location.href = `audit.html?id=${auditId}`;
      });
    });
  },

  renderAuditCard(audit) {
    const roiScore = audit.roiScore || 0;
    const statusBadge = this.getStatusBadge(audit.status);
    const updatedDate = Helpers.formatDate(audit.updatedAt);

    return `
      <div class="audit-card card" data-audit-id="${audit.id}">
        <div class="audit-card-main">
          <div class="audit-card-header">
            <span class="audit-card-id">${audit.id}</span>
            ${statusBadge}
          </div>
          <div class="audit-card-info">
            <span>${Helpers.escapeHtml(audit.department || 'No department')}</span>
            <span class="separator">•</span>
            <span>${Helpers.escapeHtml(audit.personName || 'No name')}</span>
          </div>
          <div class="audit-card-meta">
            Updated ${updatedDate}
          </div>
        </div>
        <div class="audit-card-roi">
          <div class="audit-card-roi-label">ROI Score</div>
          <div class="roi-score-badge ${this.getROIScoreClass(roiScore)}">${roiScore}</div>
        </div>
        <div class="audit-card-actions">
          <button type="button" class="btn btn-sm btn-outline btn-edit">Edit</button>
          <button type="button" class="btn btn-sm btn-outline btn-view">View</button>
          <button type="button" class="btn btn-sm btn-ghost btn-delete">Delete</button>
        </div>
      </div>
    `;
  },

  getStatusBadge(status) {
    const badges = {
      'draft': '<span class="badge badge-neutral">Draft</span>',
      'in-progress': '<span class="badge badge-warning">In Progress</span>',
      'completed': '<span class="badge badge-success">Completed</span>'
    };
    return badges[status] || badges['draft'];
  },

  getROIScoreClass(score) {
    if (score >= 70) return 'roi-high';
    if (score >= 40) return 'roi-medium';
    return 'roi-low';
  },

  bindHomeEvents() {
    // New audit button
    document.getElementById('new-audit-btn')?.addEventListener('click', () => {
      this.createNewAudit();
    });

    // Export all button
    document.getElementById('export-all-btn')?.addEventListener('click', async () => {
      await ExportUtils.exportAllToJSON();
    });

    // Import button
    document.getElementById('import-btn')?.addEventListener('click', () => {
      document.getElementById('import-file')?.click();
    });

    // Import file input
    document.getElementById('import-file')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        await Importer.importFromJSON(file);
        await this.renderAuditList();
        e.target.value = ''; // Reset input
      }
    });

    // Search
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      this.filterAudits(e.target.value);
    });

    // Status filter
    document.getElementById('status-filter')?.addEventListener('change', (e) => {
      this.filterByStatus(e.target.value);
    });
  },

  async createNewAudit() {
    const auditId = await Helpers.generateAuditId();

    const newAudit = {
      id: auditId,
      status: 'draft',
      department: '',
      personName: '',
      role: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roiScore: 0
    };

    await Storage.save('audits', newAudit);
    window.location.href = `audit.html?id=${auditId}`;
  },

  async deleteAudit(auditId) {
    // Delete related items first
    const stores = ['tasks', 'processes', 'useCases', 'opportunities'];

    for (const store of stores) {
      const items = await Storage.getByIndex(store, 'auditId', auditId);
      for (const item of items) {
        await Storage.delete(store, item.id);
      }
    }

    // Delete the audit
    await Storage.delete('audits', auditId);

    // Refresh list
    await this.renderAuditList();
    Toast.show('Audit deleted', 'success');
  },

  filterAudits(searchTerm) {
    const cards = document.querySelectorAll('.audit-card');
    const term = searchTerm.toLowerCase();

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? '' : 'none';
    });
  },

  filterByStatus(status) {
    const cards = document.querySelectorAll('.audit-card');

    cards.forEach(card => {
      if (!status) {
        card.style.display = '';
        return;
      }

      const badge = card.querySelector('.badge');
      const cardStatus = badge?.textContent.toLowerCase().replace(' ', '-');
      card.style.display = cardStatus === status ? '' : 'none';
    });
  },

  // Initialize audit wizard page
  async initAuditPage() {
    const params = new URLSearchParams(window.location.search);
    const auditId = params.get('id');

    if (!auditId) {
      Toast.show('No audit ID provided', 'error');
      window.location.href = 'index.html';
      return;
    }

    // Update header with audit ID
    const auditIdEl = document.getElementById('current-audit-id');
    if (auditIdEl) {
      auditIdEl.textContent = auditId;
    }

    // Initialize wizard
    this.wizard = new AuditWizard(auditId);
    await this.wizard.init();
  },

  // Initialize view page (read-only)
  async initViewPage() {
    const params = new URLSearchParams(window.location.search);
    const auditId = params.get('id');

    if (!auditId) {
      Toast.show('No audit ID provided', 'error');
      window.location.href = 'index.html';
      return;
    }

    await this.renderViewPage(auditId);
  },

  async renderViewPage(auditId) {
    const audit = await Storage.get('audits', auditId);

    if (!audit) {
      Toast.show('Audit not found', 'error');
      window.location.href = 'index.html';
      return;
    }

    // Load related data
    const tasks = await Storage.getByIndex('tasks', 'auditId', auditId);
    const processes = await Storage.getByIndex('processes', 'auditId', auditId);
    const useCases = await Storage.getByIndex('useCases', 'auditId', auditId);
    const opportunities = await Storage.getByIndex('opportunities', 'auditId', auditId);

    const container = document.getElementById('view-content');
    if (!container) return;

    const roiScore = audit.roiScore || Helpers.calculateROIScore({ data: audit, tasks, processes, useCases, opportunities });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title">
          <h1>Audit: ${auditId}</h1>
          <span class="badge ${this.getStatusBadgeClass(audit.status)}">${audit.status || 'draft'}</span>
        </div>
        <div class="view-roi">
          <span class="roi-label">ROI Score</span>
          <span class="roi-value ${this.getROIScoreClass(roiScore)}">${roiScore}</span>
        </div>
      </div>

      <div class="view-sections">
        ${this.renderViewSection('General Information', [
          { label: 'Department', value: audit.department },
          { label: 'Person Name', value: audit.personName },
          { label: 'Role', value: audit.role },
          { label: 'Seniority', value: audit.seniority },
          { label: 'Tools Used', value: audit.tools }
        ])}

        ${this.renderViewSection('Workday Tasks', null, this.renderTasksList(tasks))}

        ${this.renderViewSection('Processes', null, this.renderProcessesList(processes))}

        ${this.renderViewSection('Workload & Friction', [
          { label: 'Daily Volume', value: audit.dailyVolume },
          { label: 'Repetitive Tasks', value: audit.hasRepetitiveTasks ? 'Yes' : 'No' },
          { label: 'Manual Data Entry', value: audit.hasManualDataEntry ? 'Yes' : 'No' },
          { label: 'Error Frequency', value: audit.errorFrequency },
          { label: 'Bottlenecks', value: audit.hasBottlenecks ? audit.bottlenecks : 'None identified' }
        ])}

        ${this.renderViewSection('Data & Constraints', [
          { label: 'Data Sources', value: audit.dataSources },
          { label: 'Systems Used', value: audit.systemsUsed },
          { label: 'Data Quality', value: audit.dataQuality },
          { label: 'Confidential Data', value: audit.hasConfidentialData ? 'Yes' : 'No' },
          { label: 'Regulatory Requirements', value: audit.hasRegulatoryRequirements ? audit.regulatoryRequirements : 'None' }
        ])}

        ${this.renderViewSection('Automation Potential', [
          { label: 'Existing Automation', value: audit.hasExistingAutomation ? audit.existingAutomation : 'None' },
          { label: 'Rules-Based %', value: audit.rulesBasedPercentage ? `${audit.rulesBasedPercentage}%` : '-' },
          { label: 'Decision Complexity', value: audit.decisionComplexity },
          { label: 'Automation Readiness', value: audit.automationReadiness }
        ])}

        ${this.renderViewSection('Business Impact', [
          { label: 'Hours/Week', value: audit.currentHoursPerWeek },
          { label: 'People Involved', value: audit.peopleInvolved },
          { label: 'Est. Time Savings', value: audit.estimatedTimeSavings ? `${audit.estimatedTimeSavings}%` : '-' },
          { label: 'Cost Impact', value: audit.costImpact },
          { label: 'Business Priority', value: audit.businessPriority }
        ])}

        ${this.renderViewSection('Use Cases', null, this.renderUseCasesList(useCases))}

        ${this.renderViewSection('Opportunities', null, this.renderOpportunitiesList(opportunities))}

        ${audit.auditorNotes ? this.renderViewSection('Auditor Notes', [
          { label: 'Notes', value: audit.auditorNotes }
        ]) : ''}
      </div>

      <div class="view-actions">
        <button type="button" class="btn btn-outline" id="view-export-json">Export JSON</button>
        <button type="button" class="btn btn-outline" id="view-export-csv">Export CSV</button>
        <button type="button" class="btn btn-primary" id="view-edit">Edit Audit</button>
      </div>
    `;

    // Bind view page events
    document.getElementById('view-export-json')?.addEventListener('click', () => {
      ExportUtils.exportAuditToJSON(auditId);
    });

    document.getElementById('view-export-csv')?.addEventListener('click', () => {
      ExportUtils.exportAuditToCSV(auditId);
    });

    document.getElementById('view-edit')?.addEventListener('click', () => {
      window.location.href = `audit.html?id=${auditId}`;
    });
  },

  getStatusBadgeClass(status) {
    const classes = {
      'draft': 'badge-neutral',
      'in-progress': 'badge-warning',
      'completed': 'badge-success'
    };
    return classes[status] || 'badge-neutral';
  },

  renderViewSection(title, fields, customContent = null) {
    return `
      <div class="view-section card">
        <div class="card-header">
          <h3>${title}</h3>
        </div>
        <div class="card-body">
          ${customContent || fields.map(f => `
            <div class="view-field">
              <span class="view-field-label">${f.label}</span>
              <span class="view-field-value">${Helpers.escapeHtml(f.value || '-')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderTasksList(tasks) {
    if (!tasks.length) return '<p class="text-muted">No tasks recorded</p>';

    return `
      <div class="tasks-list">
        ${tasks.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map(task => `
          <div class="task-item">
            <span class="task-time">${Helpers.escapeHtml(task.timeSlot || '')}</span>
            <span class="task-name">${Helpers.escapeHtml(task.task || '')}</span>
            <span class="task-duration">${Helpers.escapeHtml(task.duration || '')} min</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderProcessesList(processes) {
    if (!processes.length) return '<p class="text-muted">No processes recorded</p>';

    return `
      <div class="processes-list">
        ${processes.map(p => `
          <div class="process-item">
            <div class="process-name">${Helpers.escapeHtml(p.processName || '')}</div>
            <div class="process-flow-view">
              <span>${Helpers.escapeHtml(p.triggerEvent || 'Start')}</span>
              → <span>${Helpers.escapeHtml(p.stepA || '-')}</span>
              → <span>${Helpers.escapeHtml(p.stepB || '-')}</span>
              → <span>${Helpers.escapeHtml(p.stepC || '-')}</span>
              → <span>${Helpers.escapeHtml(p.stepD || '-')}</span>
              → <span>${Helpers.escapeHtml(p.endState || 'End')}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderUseCasesList(useCases) {
    if (!useCases.length) return '<p class="text-muted">No use cases recorded</p>';

    return `
      <div class="usecases-list">
        ${useCases.map(uc => `
          <div class="usecase-item">
            <div class="usecase-header">
              <span class="usecase-title">${Helpers.escapeHtml(uc.title || '')}</span>
              <span class="badge ${uc.impact === 'high' ? 'badge-error' : uc.impact === 'medium' ? 'badge-warning' : 'badge-neutral'}">${uc.impact || 'Unknown'} Impact</span>
            </div>
            <p class="usecase-description">${Helpers.escapeHtml(uc.description || '')}</p>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderOpportunitiesList(opportunities) {
    if (!opportunities.length) return '<p class="text-muted">No opportunities recorded</p>';

    const quickWins = opportunities.filter(o => o.type === 'quickwin');
    const structural = opportunities.filter(o => o.type === 'structural');

    let html = '';

    if (quickWins.length) {
      html += `
        <div class="opportunities-group">
          <h4>Quick Wins</h4>
          ${quickWins.map(o => `
            <div class="opportunity-item">
              <span class="opportunity-title">${Helpers.escapeHtml(o.title || '')}</span>
              <span class="badge badge-success">${o.priority || 'Medium'}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (structural.length) {
      html += `
        <div class="opportunities-group mt-4">
          <h4>Structural Cases</h4>
          ${structural.map(o => `
            <div class="opportunity-item">
              <span class="opportunity-title">${Helpers.escapeHtml(o.title || '')}</span>
              <span class="badge badge-primary">${o.priority || 'Medium'}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    return html;
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init().catch(err => {
    console.error('Failed to initialize app:', err);
    Toast.show('Failed to initialize application', 'error');
  });
});

// Make available globally
if (typeof window !== 'undefined') {
  window.App = App;
}
