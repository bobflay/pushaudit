/* ============================================
   PushAudit - Export/Import Module
   JSON and CSV export functionality
   ============================================ */

const Exporter = {
  // Export all audits to JSON
  async exportAllToJSON() {
    const audits = await Storage.getAll('audits');

    // Attach related data to each audit
    for (const audit of audits) {
      audit.tasks = await Storage.getByIndex('tasks', 'auditId', audit.id);
      audit.processes = await Storage.getByIndex('processes', 'auditId', audit.id);
      audit.useCases = await Storage.getByIndex('useCases', 'auditId', audit.id);
      audit.opportunities = await Storage.getByIndex('opportunities', 'auditId', audit.id);
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      auditCount: audits.length,
      audits
    };

    this.downloadJSON(exportData, `pushaudit-export-${this.getDateStamp()}.json`);
    Toast.show(`Exported ${audits.length} audit(s)`, 'success');
  },

  // Export single audit to JSON
  async exportAuditToJSON(auditId) {
    const audit = await Storage.get('audits', auditId);
    if (!audit) {
      Toast.show('Audit not found', 'error');
      return;
    }

    audit.tasks = await Storage.getByIndex('tasks', 'auditId', auditId);
    audit.processes = await Storage.getByIndex('processes', 'auditId', auditId);
    audit.useCases = await Storage.getByIndex('useCases', 'auditId', auditId);
    audit.opportunities = await Storage.getByIndex('opportunities', 'auditId', auditId);

    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      auditCount: 1,
      audits: [audit]
    };

    this.downloadJSON(exportData, `audit-${auditId}.json`);
    Toast.show('Audit exported', 'success');
  },

  // Export audit to CSV
  async exportAuditToCSV(auditId) {
    const audit = await Storage.get('audits', auditId);
    if (!audit) {
      Toast.show('Audit not found', 'error');
      return;
    }

    const rows = [
      ['Field', 'Value'],
      ['Audit ID', audit.id],
      ['Status', audit.status],
      ['Created', audit.createdAt],
      ['Last Updated', audit.updatedAt],
      [''],
      ['SECTION 1 - General Information'],
      ['Department', audit.department],
      ['Audited Person', audit.auditedPerson],
      ['Role/Position', audit.rolePosition],
      ['Seniority', audit.seniority],
      ['Audit Date', audit.auditDate],
      ['Auditors', Array.isArray(audit.auditors) ? audit.auditors.join(', ') : audit.auditors],
      ['Current Tools', Array.isArray(audit.currentTools) ? audit.currentTools.join(', ') : audit.currentTools],
      [''],
      ['SECTION 4 - Workload & Friction'],
      ['Avg Processing Time', audit.avgProcessingTime],
      ['Daily Volume', audit.dailyVolume],
      ['Weekly Volume', audit.weeklyVolume],
      ['Human Intervention Required', audit.humanIntervention ? 'Yes' : 'No'],
      ['Is Repetitive', audit.isRepetitive ? 'Yes' : 'No'],
      ['Frequent Errors', audit.frequentErrors ? 'Yes' : 'No'],
      ['Single Person Dependency', audit.singlePersonDependency ? 'Yes' : 'No'],
      ['Blocking Points', audit.blockingPoints],
      [''],
      ['SECTION 5 - Data & Constraints'],
      ['Data Used', audit.dataUsed],
      ['Data Sources', Array.isArray(audit.dataSources) ? audit.dataSources.join(', ') : audit.dataSources],
      ['Is Confidential', audit.isConfidential ? 'Yes' : 'No'],
      ['Requires Local Processing', audit.requiresLocalProcessing ? 'Yes' : 'No'],
      ['Regulatory Constraints', audit.regulatoryConstraints],
      ['Historical Data Available', audit.historicalDataAvailable ? 'Yes' : 'No'],
      [''],
      ['SECTION 6 - AI Automation Potential'],
      ['Partial Automation Possible', audit.partialAutomationPossible ? 'Yes' : 'No'],
      ['Human Assistance Possible', audit.humanAssistancePossible ? 'Yes' : 'No'],
      ['Auto Prioritization Possible', audit.autoPrioritizationPossible ? 'Yes' : 'No'],
      ['Decision Complexity', audit.decisionComplexity],
      ['Required Confidence Level', audit.requiredConfidenceLevel],
      [''],
      ['SECTION 7 - Business Impact & ROI'],
      ['Estimated Time Saved Daily', audit.estimatedTimeSavedDaily],
      ['Resources Freed', audit.resourcesFreed],
      ['Error Reduction', audit.errorReduction],
      ['SLA Improvement', audit.slaImprovement],
      ['End User Impact', audit.endUserImpact],
      ['Business Priority', audit.businessPriority],
      [''],
      ['SECTION 9 - AI Opportunities Summary'],
      ['AI Use Case 1', audit.aiUseCase1],
      ['AI Use Case 2', audit.aiUseCase2],
      ['AI Use Case 3', audit.aiUseCase3],
      [''],
      ['COMPUTED VALUES'],
      ['ROI Score', audit.roiScore],
      ['Automation Readiness', audit.automationReadiness],
      ['Quick Win', audit.quickWinFlag ? 'Yes' : 'No'],
      [''],
      ['VALIDATION'],
      ['Validated At', audit.validatedAt],
      ['Validated By', audit.validatedBy],
      ['Validator Role', audit.validatorRole]
    ];

    // Convert to CSV
    const csv = rows.map(row =>
      row.map(cell => {
        const str = String(cell ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    ).join('\n');

    this.downloadCSV(csv, `audit-${auditId}.csv`);
    Toast.show('CSV exported', 'success');
  },

  // Download JSON file
  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    this.downloadBlob(blob, filename);
  },

  // Download CSV file
  downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, filename);
  },

  // Download blob as file
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Get date stamp for filename
  getDateStamp() {
    return new Date().toISOString().split('T')[0];
  }
};

const Importer = {
  // Import from JSON file
  async importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (!data.audits || !Array.isArray(data.audits)) {
            throw new Error('Invalid file format: missing audits array');
          }

          let imported = 0;
          let skipped = 0;

          for (const audit of data.audits) {
            // Check for duplicate
            const existing = await Storage.get('audits', audit.id);
            let auditId = audit.id;

            if (existing) {
              // Generate new ID for import
              auditId = await Helpers.generateAuditId();
              skipped++;
            }

            // Extract related data
            const { tasks, processes, useCases, opportunities, ...auditData } = audit;

            // Update audit ID
            auditData.id = auditId;
            auditData.importedAt = new Date().toISOString();

            // Save audit
            await Storage.save('audits', auditData);

            // Save related data with updated auditId
            if (tasks && tasks.length > 0) {
              for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                task.auditId = auditId;
                task.id = await Helpers.generateTaskId(auditId);
                await Storage.save('tasks', task);
              }
            }

            if (processes && processes.length > 0) {
              for (let i = 0; i < processes.length; i++) {
                const process = processes[i];
                process.auditId = auditId;
                process.id = await Helpers.generateProcessId(auditId);
                await Storage.save('processes', process);
              }
            }

            if (useCases && useCases.length > 0) {
              for (let i = 0; i < useCases.length; i++) {
                const useCase = useCases[i];
                useCase.auditId = auditId;
                useCase.id = await Helpers.generateUseCaseId(auditId);
                await Storage.save('useCases', useCase);
              }
            }

            if (opportunities && opportunities.length > 0) {
              for (let i = 0; i < opportunities.length; i++) {
                const opp = opportunities[i];
                opp.auditId = auditId;
                opp.id = await Helpers.generateOpportunityId(auditId);
                await Storage.save('opportunities', opp);
              }
            }

            imported++;
          }

          let message = `Imported ${imported} audit(s)`;
          if (skipped > 0) {
            message += ` (${skipped} with new IDs due to conflicts)`;
          }

          Toast.show(message, 'success');
          resolve(imported);
        } catch (error) {
          console.error('Import error:', error);
          Toast.show('Import failed: ' + error.message, 'error');
          reject(error);
        }
      };

      reader.onerror = () => {
        Toast.show('Failed to read file', 'error');
        reject(reader.error);
      };

      reader.readAsText(file);
    });
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.Exporter = Exporter;
  window.Importer = Importer;
}
