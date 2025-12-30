/* ============================================
   PushAudit - Wizard Controller
   Main wizard logic and navigation
   ============================================ */

class AuditWizard {
  constructor(auditId) {
    this.auditId = auditId;
    this.data = null;
    this.tasks = [];
    this.processes = [];
    this.useCases = [];
    this.opportunities = [];
    this.currentStep = 1;
    this.totalSteps = 10;
    this.autoSave = null;
  }

  // Initialize wizard
  async init() {
    try {
      await this.loadData();
      this.autoSave = new AutoSave(this);
      this.renderProgress();
      this.renderSection();
      this.bindNavigation();
      this.updateAuditIdDisplay();
    } catch (error) {
      console.error('Failed to initialize wizard:', error);
      Toast.error('Failed to load audit');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }
  }

  // Load audit data
  async loadData() {
    this.data = await Storage.get('audits', this.auditId);

    if (!this.data) {
      throw new Error('Audit not found');
    }

    // Load related data
    this.tasks = await Storage.getByIndex('tasks', 'auditId', this.auditId);
    this.processes = await Storage.getByIndex('processes', 'auditId', this.auditId);
    this.useCases = await Storage.getByIndex('useCases', 'auditId', this.auditId);
    this.opportunities = await Storage.getByIndex('opportunities', 'auditId', this.auditId);

    // Sort by display order
    this.tasks.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    this.processes.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    this.useCases.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    this.opportunities.sort((a, b) => (a.priorityRank || 0) - (b.priorityRank || 0));
  }

  // Update audit ID in header
  updateAuditIdDisplay() {
    const el = document.getElementById('audit-id');
    if (el) {
      el.textContent = this.auditId;
    }
  }

  // Render progress bar
  renderProgress() {
    const container = document.getElementById('progress-steps');
    const sectionName = document.getElementById('section-name');
    const stepCounter = document.getElementById('step-counter');

    if (!container) return;

    // Calculate progress line width
    const progressPercent = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;

    let html = `<div class="progress-line" style="width: ${progressPercent}%"></div>`;

    for (let i = 1; i <= this.totalSteps; i++) {
      let className = 'progress-step';
      if (i < this.currentStep) className += ' completed';
      if (i === this.currentStep) className += ' current';

      html += `
        <div class="${className}" data-step="${i}" title="${CONSTANTS.sections[i - 1].name}">
          ${i}
        </div>
      `;
    }

    container.innerHTML = html;

    // Update section info
    if (sectionName) {
      sectionName.textContent = CONSTANTS.sections[this.currentStep - 1].name;
    }
    if (stepCounter) {
      stepCounter.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }

    // Bind click events on steps
    container.querySelectorAll('.progress-step').forEach(step => {
      step.addEventListener('click', (e) => {
        const stepNum = parseInt(e.target.dataset.step);
        this.goToStep(stepNum);
      });
    });
  }

  // Render current section
  renderSection() {
    const container = document.getElementById('wizard-content');
    if (!container) return;

    // Get section renderer
    const sectionRenderers = {
      1: Section1General,
      2: Section2Workday,
      3: Section3Process,
      4: Section4Workload,
      5: Section5Data,
      6: Section6Automation,
      7: Section7Impact,
      8: Section8UseCases,
      9: Section9Opportunities,
      10: Section10Validation
    };

    const SectionClass = sectionRenderers[this.currentStep];
    if (SectionClass) {
      const section = new SectionClass(this);
      container.innerHTML = section.render();
      section.bindEvents();
    }

    // Update navigation buttons
    this.updateNavigation();
  }

  // Update navigation buttons
  updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.disabled = this.currentStep === 1;
    }

    if (nextBtn) {
      if (this.currentStep === this.totalSteps) {
        nextBtn.textContent = 'Finish';
        nextBtn.innerHTML = 'Finish';
      } else {
        nextBtn.innerHTML = 'Next <span class="icon">→</span>';
      }
    }
  }

  // Bind navigation events
  bindNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previous());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' && this.currentStep > 1) {
        this.previous();
      } else if (e.key === 'ArrowRight' && this.currentStep < this.totalSteps) {
        this.next();
      }
    });
  }

  // Go to specific step
  async goToStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    if (step === this.currentStep) return;

    // Save current data first
    if (this.autoSave) {
      await this.autoSave.forceSave();
    }

    this.currentStep = step;
    this.renderProgress();
    this.renderSection();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Next step
  async next() {
    if (this.currentStep < this.totalSteps) {
      await this.goToStep(this.currentStep + 1);
    } else {
      // On last step, go to home
      await this.autoSave.forceSave();
      window.location.href = 'index.html';
    }
  }

  // Previous step
  async previous() {
    if (this.currentStep > 1) {
      await this.goToStep(this.currentStep - 1);
    }
  }

  // Update field value
  updateField(field, value) {
    this.data[field] = value;
    if (this.autoSave) {
      this.autoSave.trigger();
    }
  }

  // Save related data (tasks, processes, etc.)
  async saveRelatedItem(storeName, item) {
    await Storage.save(storeName, item);
    if (this.autoSave) {
      this.autoSave.trigger();
    }
  }

  // Delete related item
  async deleteRelatedItem(storeName, itemId) {
    await Storage.delete(storeName, itemId);

    // Update local array
    switch (storeName) {
      case 'tasks':
        this.tasks = this.tasks.filter(t => t.id !== itemId);
        break;
      case 'processes':
        this.processes = this.processes.filter(p => p.id !== itemId);
        break;
      case 'useCases':
        this.useCases = this.useCases.filter(u => u.id !== itemId);
        break;
      case 'opportunities':
        this.opportunities = this.opportunities.filter(o => o.id !== itemId);
        break;
    }
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.AuditWizard = AuditWizard;
}
