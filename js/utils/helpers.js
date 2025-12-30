/* ============================================
   PushAudit - Helper Utilities
   ID generation, formatting, validation
   ============================================ */

const Helpers = {
  // ============================================
  // ID GENERATION
  // ============================================

  // Generate audit ID
  async generateAuditId() {
    const year = new Date().getFullYear();
    const audits = await Storage.getAll('audits');
    const thisYear = audits.filter(a => a.id && a.id.includes(`AUD-${year}`));
    const nextNum = thisYear.length + 1;
    return `AUD-${year}-${String(nextNum).padStart(4, '0')}`;
  },

  // Generate task ID
  async generateTaskId(auditId) {
    const auditSeq = auditId.split('-')[2] || '0001';
    const tasks = await Storage.getByIndex('tasks', 'auditId', auditId);
    const nextNum = tasks.length + 1;
    return `TSK-${auditSeq}-${String(nextNum).padStart(3, '0')}`;
  },

  // Generate process ID
  async generateProcessId(auditId) {
    const auditSeq = auditId.split('-')[2] || '0001';
    const processes = await Storage.getByIndex('processes', 'auditId', auditId);
    const nextNum = processes.length + 1;
    return `PRC-${auditSeq}-${String(nextNum).padStart(3, '0')}`;
  },

  // Generate use case ID
  async generateUseCaseId(auditId) {
    const auditSeq = auditId.split('-')[2] || '0001';
    const useCases = await Storage.getByIndex('useCases', 'auditId', auditId);
    const nextNum = useCases.length + 1;
    return `UC-${auditSeq}-${String(nextNum).padStart(3, '0')}`;
  },

  // Generate opportunity ID
  async generateOpportunityId(auditId) {
    const auditSeq = auditId.split('-')[2] || '0001';
    const opportunities = await Storage.getByIndex('opportunities', 'auditId', auditId);
    const nextNum = opportunities.length + 1;
    return `OPP-${auditSeq}-${String(nextNum).padStart(3, '0')}`;
  },

  // ============================================
  // DATE FORMATTING
  // ============================================

  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatRelativeTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return this.formatDate(dateString);
  },

  // ============================================
  // VALIDATION
  // ============================================

  requiredFields: [
    'department',
    'auditedPerson',
    'rolePosition',
    'auditDate'
  ],

  validateAudit(audit) {
    const missing = this.requiredFields.filter(field => !audit[field]);
    return {
      valid: missing.length === 0,
      missingFields: missing
    };
  },

  // ============================================
  // ROI CALCULATION
  // ============================================

  calculateROI(audit) {
    let score = 0;

    // Time Savings Score (0-25)
    score += this.getTimeSavingsScore(audit.estimatedTimeSavedDaily);

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
    if (audit.dataSources && audit.dataSources.length > 0) score += 7;

    // Business Priority (0-25)
    if (audit.businessPriority === 'High') score += 25;
    else if (audit.businessPriority === 'Medium') score += 15;
    else if (audit.businessPriority === 'Low') score += 5;

    return Math.max(0, Math.min(100, score));
  },

  getTimeSavingsScore(timeStr) {
    if (!timeStr) return 0;
    const lower = timeStr.toLowerCase();
    if (lower.includes('4') && lower.includes('hour')) return 25;
    if (lower.includes('3') && lower.includes('hour')) return 22;
    if (lower.includes('2') && lower.includes('hour')) return 20;
    if (lower.includes('1') && lower.includes('hour')) return 15;
    if (lower.includes('30') && lower.includes('min')) return 10;
    if (lower.includes('min')) return 5;
    return 0;
  },

  getReadinessLevel(score) {
    if (score >= 70) return 'Ready';
    if (score >= 40) return 'Needs Work';
    return 'Not Ready';
  },

  // Calculate ROI Score for wizard data structure
  calculateROIScore(wizard) {
    const data = wizard.data || wizard;
    let score = 0;

    // Time Savings Score (0-25)
    const timeSavings = data.estimatedTimeSavings || 0;
    if (timeSavings >= 70) score += 25;
    else if (timeSavings >= 50) score += 20;
    else if (timeSavings >= 30) score += 15;
    else if (timeSavings >= 10) score += 10;
    else score += 5;

    // Automation Feasibility (0-25)
    const rulesBasedPct = data.rulesBasedPercentage || 50;
    score += Math.round(rulesBasedPct / 4); // 0-25 based on percentage

    // Decision Complexity Penalty (-10 to 0)
    const complexity = data.decisionComplexity;
    if (complexity === 'very-complex') score -= 10;
    else if (complexity === 'complex') score -= 7;
    else if (complexity === 'moderate') score -= 3;
    // 'simple' = no penalty

    // Data Readiness (0-25)
    const dataQuality = data.dataQuality;
    if (dataQuality === 'excellent') score += 25;
    else if (dataQuality === 'good') score += 20;
    else if (dataQuality === 'fair') score += 12;
    else if (dataQuality === 'poor') score += 5;
    else score += 10; // default

    // Automation readiness bonus
    const readiness = data.automationReadiness;
    if (readiness === 'ready') score += 5;
    else if (readiness === 'mostly-ready') score += 3;
    else if (readiness === 'needs-work') score += 0;
    else if (readiness === 'not-ready') score -= 5;

    // Business Priority (0-25)
    const priority = data.businessPriority;
    if (priority === 'high') score += 25;
    else if (priority === 'medium') score += 15;
    else if (priority === 'low') score += 5;
    else score += 10; // default

    // Clamp to 0-100
    return Math.max(0, Math.min(100, score));
  },

  isQuickWin(audit, score) {
    const lowComplexity = ['Low', 'Medium'].includes(audit.decisionComplexity);
    return score >= 60 && lowComplexity && audit.isRepetitive;
  },

  // ============================================
  // URL HELPERS
  // ============================================

  getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  // ============================================
  // DOM HELPERS
  // ============================================

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.Helpers = Helpers;
}
