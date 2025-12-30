/* ============================================
   Section 10 - Validation & Synthèse
   Revue des données, calcul du score ROI, finalisation
   ============================================ */

class Section10Validation {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
  }

  render() {
    const roiScore = Helpers.calculateROIScore(this.wizard);
    const completeness = this.calculateCompleteness();
    const readiness = this.getReadinessLevel(roiScore);

    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">10. Validation & Synthèse</h2>
          <p class="section-description">Revoyez les données de l'audit et finalisez.</p>
        </div>
        <div class="section-content">
          <!-- Carte Score ROI -->
          <div class="roi-card ${readiness.class}">
            <div class="roi-score-display">
              <span class="roi-score-value">${roiScore}</span>
              <span class="roi-score-label">Score ROI</span>
            </div>
            <div class="roi-readiness">
              <span class="readiness-badge ${readiness.class}">${readiness.label}</span>
              <p class="readiness-description">${readiness.description}</p>
            </div>
          </div>

          <!-- Complétude -->
          <div class="completeness-card card mt-4">
            <div class="card-header">
              <h3>Complétude de l'Audit</h3>
              <span class="completeness-percentage">${completeness.percentage}%</span>
            </div>
            <div class="card-body">
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${completeness.percentage}%"></div>
              </div>
              ${completeness.missing.length > 0 ? `
                <div class="missing-fields mt-3">
                  <p class="text-muted text-sm">Manquant ou incomplet :</p>
                  <ul class="missing-list">
                    ${completeness.missing.map(m => `<li>${m}</li>`).join('')}
                  </ul>
                </div>
              ` : '<p class="text-success mt-3">Tous les champs requis sont remplis !</p>'}
            </div>
          </div>

          <!-- Grille de Synthèse -->
          <div class="summary-grid mt-6">
            ${this.renderSummaryCard('Infos Générales', [
              { label: 'Département', value: this.data.department },
              { label: 'Personne', value: this.data.personName },
              { label: 'Poste', value: this.data.role }
            ])}

            ${this.renderSummaryCard('Charge de Travail', [
              { label: 'Volume Quotidien', value: this.data.dailyVolume },
              { label: 'Tâches Répétitives', value: this.data.hasRepetitiveTasks ? 'Oui' : 'Non' },
              { label: 'Fréquence Erreurs', value: this.translateErrorFrequency(this.data.errorFrequency) }
            ])}

            ${this.renderSummaryCard('Automatisation', [
              { label: 'Basé sur Règles', value: this.data.rulesBasedPercentage ? `${this.data.rulesBasedPercentage}%` : '-' },
              { label: 'Complexité Décisions', value: this.translateComplexity(this.data.decisionComplexity) },
              { label: 'Niveau de Préparation', value: this.translateReadiness(this.data.automationReadiness) }
            ])}

            ${this.renderSummaryCard('Impact Métier', [
              { label: 'Heures/Semaine', value: this.data.currentHoursPerWeek },
              { label: 'Gains de Temps', value: this.data.estimatedTimeSavings ? `${this.data.estimatedTimeSavings}%` : '-' },
              { label: 'Priorité', value: this.translatePriority(this.data.businessPriority) }
            ])}
          </div>

          <!-- Compteur d'éléments liés -->
          <div class="related-items-summary mt-6">
            <h3 class="mb-3">Éléments Liés</h3>
            <div class="items-count-grid">
              <div class="item-count">
                <span class="count-number">${this.wizard.tasks.length}</span>
                <span class="count-label">Tâches Journée</span>
              </div>
              <div class="item-count">
                <span class="count-number">${this.wizard.processes.length}</span>
                <span class="count-label">Processus</span>
              </div>
              <div class="item-count">
                <span class="count-number">${this.wizard.useCases.length}</span>
                <span class="count-label">Cas d'Usage</span>
              </div>
              <div class="item-count">
                <span class="count-number">${this.wizard.opportunities.length}</span>
                <span class="count-label">Opportunités</span>
              </div>
            </div>
          </div>

          <!-- Notes de l'Auditeur -->
          <div class="form-group mt-6">
            <label class="label">Notes de l'Auditeur</label>
            <textarea class="textarea textarea-xl" id="auditorNotes" rows="6"
                      placeholder="Ajoutez vos observations, recommandations et notes additionnelles...

Pensez à inclure:
- Vos recommandations principales
- Les points d'attention
- Les prochaines étapes suggérées
- Les questions en suspens">${Helpers.escapeHtml(this.data.auditorNotes || '')}</textarea>
          </div>

          <!-- Statut -->
          <div class="form-group mt-4">
            <label class="label">Statut de l'Audit</label>
            <select class="select" id="auditStatus">
              <option value="draft" ${this.data.status === 'draft' ? 'selected' : ''}>Brouillon</option>
              <option value="in-progress" ${this.data.status === 'in-progress' ? 'selected' : ''}>En cours</option>
              <option value="completed" ${this.data.status === 'completed' ? 'selected' : ''}>Terminé</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="validation-actions mt-6">
            <button type="button" class="btn btn-outline" id="export-json-btn">
              Exporter JSON
            </button>
            <button type="button" class="btn btn-outline" id="export-csv-btn">
              Exporter CSV
            </button>
            <button type="button" class="btn btn-primary" id="save-complete-btn">
              Sauvegarder & Terminer
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderSummaryCard(title, items) {
    return `
      <div class="summary-card card">
        <div class="card-header">
          <h4>${title}</h4>
        </div>
        <div class="card-body">
          ${items.map(item => `
            <div class="summary-item">
              <span class="summary-label">${item.label}</span>
              <span class="summary-value">${item.value || '-'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  translateErrorFrequency(value) {
    const translations = {
      'rarely': 'Rarement',
      'sometimes': 'Parfois',
      'often': 'Souvent',
      'very-often': 'Très souvent'
    };
    return translations[value] || value || '-';
  }

  translateComplexity(value) {
    const translations = {
      'simple': 'Simple',
      'moderate': 'Modérée',
      'complex': 'Complexe',
      'very-complex': 'Très complexe'
    };
    return translations[value] || value || '-';
  }

  translateReadiness(value) {
    const translations = {
      'ready': 'Prêt',
      'mostly-ready': 'Presque prêt',
      'needs-work': 'Nécessite travail',
      'not-ready': 'Pas prêt'
    };
    return translations[value] || value || '-';
  }

  translatePriority(value) {
    const translations = {
      'low': 'Faible',
      'medium': 'Moyenne',
      'high': 'Élevée'
    };
    return translations[value] || value || '-';
  }

  calculateCompleteness() {
    const requiredFields = [
      { field: 'department', label: 'Département' },
      { field: 'personName', label: 'Nom de la personne' },
      { field: 'role', label: 'Poste' },
      { field: 'dailyVolume', label: 'Volume quotidien' },
      { field: 'decisionComplexity', label: 'Complexité des décisions' },
      { field: 'businessPriority', label: 'Priorité métier' }
    ];

    const missing = [];
    let filled = 0;

    requiredFields.forEach(({ field, label }) => {
      if (this.data[field]) {
        filled++;
      } else {
        missing.push(label);
      }
    });

    // Vérifier les éléments liés
    if (this.wizard.tasks.length === 0) {
      missing.push('Tâches de la journée (Section 2)');
    } else {
      filled++;
    }

    if (this.wizard.processes.length === 0) {
      missing.push('Processus (Section 3)');
    } else {
      filled++;
    }

    const total = requiredFields.length + 2; // +2 pour tâches et processus
    const percentage = Math.round((filled / total) * 100);

    return { percentage, missing };
  }

  getReadinessLevel(score) {
    if (score >= 70) {
      return {
        label: 'Prêt pour l\'Automatisation',
        class: 'readiness-high',
        description: 'Ce domaine montre un fort potentiel pour l\'automatisation IA avec un ROI clair.'
      };
    } else if (score >= 40) {
      return {
        label: 'Nécessite une Préparation',
        class: 'readiness-medium',
        description: 'Un travail préparatoire est nécessaire avant que l\'automatisation puisse être efficacement mise en œuvre.'
      };
    } else {
      return {
        label: 'Pas Prêt',
        class: 'readiness-low',
        description: 'Une préparation significative est requise. Envisagez d\'abord de résoudre les goulots d\'étranglement.'
      };
    }
  }

  bindEvents() {
    // Notes de l'auditeur
    const notesEl = document.getElementById('auditorNotes');
    if (notesEl) {
      notesEl.addEventListener('change', (e) => {
        this.wizard.updateField('auditorNotes', e.target.value);
      });
    }

    // Statut
    const statusEl = document.getElementById('auditStatus');
    if (statusEl) {
      statusEl.addEventListener('change', (e) => {
        this.wizard.updateField('status', e.target.value);
      });
    }

    // Boutons d'export
    const exportJsonBtn = document.getElementById('export-json-btn');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', async () => {
        await ExportUtils.exportAuditToJSON(this.wizard.auditId);
      });
    }

    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', async () => {
        await ExportUtils.exportAuditToCSV(this.wizard.auditId);
      });
    }

    // Sauvegarder & Terminer
    const saveCompleteBtn = document.getElementById('save-complete-btn');
    if (saveCompleteBtn) {
      saveCompleteBtn.addEventListener('click', async () => {
        await this.saveAndComplete();
      });
    }
  }

  async saveAndComplete() {
    // Mettre à jour le statut à terminé
    this.wizard.updateField('status', 'completed');
    this.wizard.updateField('completedAt', new Date().toISOString());

    // Calculer et sauvegarder le score ROI final
    const roiScore = Helpers.calculateROIScore(this.wizard);
    this.wizard.updateField('roiScore', roiScore);

    // Forcer la sauvegarde
    if (this.wizard.autoSave) {
      await this.wizard.autoSave.forceSave();
    }

    // Afficher le succès
    Toast.show('Audit terminé avec succès !', 'success');

    // Rediriger vers l'accueil après un court délai
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.Section10Validation = Section10Validation;
}
