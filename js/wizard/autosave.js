/* ============================================
   PushAudit - Auto-save Module
   Debounced saving to IndexedDB
   ============================================ */

class AutoSave {
  constructor(wizard) {
    this.wizard = wizard;
    this.debounceMs = 500;
    this.timeoutId = null;
    this.indicator = document.getElementById('autosave-indicator');
    this.lastSavedData = null;
  }

  // Trigger save (debounced)
  trigger() {
    this.showStatus('pending');

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.save();
    }, this.debounceMs);
  }

  // Perform save
  async save() {
    // Check if data actually changed
    const currentData = JSON.stringify(this.wizard.data);
    if (currentData === this.lastSavedData) {
      this.showStatus('saved');
      return;
    }

    this.showStatus('saving');

    try {
      // Update timestamp
      this.wizard.data.updatedAt = new Date().toISOString();

      // Calculate ROI score
      const roiScore = Helpers.calculateROI(this.wizard.data);
      this.wizard.data.roiScore = roiScore;
      this.wizard.data.automationReadiness = Helpers.getReadinessLevel(roiScore);
      this.wizard.data.quickWinFlag = Helpers.isQuickWin(this.wizard.data, roiScore);

      // Save to IndexedDB
      await Storage.save('audits', this.wizard.data);

      this.lastSavedData = currentData;
      this.showStatus('saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      this.showStatus('error');
    }
  }

  // Force immediate save
  async forceSave() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    await this.save();
  }

  // Update status indicator
  showStatus(status) {
    if (!this.indicator) return;

    const config = {
      pending: { text: 'Unsaved', class: 'pending', icon: '○' },
      saving: { text: 'Saving...', class: 'saving', icon: '◐' },
      saved: { text: 'Saved', class: 'saved', icon: '✓' },
      error: { text: 'Error', class: 'error', icon: '✗' }
    };

    const { text, class: cls, icon } = config[status];
    this.indicator.innerHTML = `<span class="icon">${icon}</span> ${text}`;
    this.indicator.className = `autosave-indicator ${cls}`;
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.AutoSave = AutoSave;
}
