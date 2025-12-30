/* ============================================
   Section 6 - Potentiel d'Automatisation IA
   Vue métier des opportunités d'automatisation
   ============================================ */

class Section6Automation {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
  }

  render() {
    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">6. Potentiel d'Automatisation IA</h2>
          <p class="section-description">Évaluez le potentiel d'automatisation par l'IA dans ce domaine.</p>
        </div>
        <div class="section-content">
          <!-- Automatisation existante -->
          <div class="form-group">
            <label class="label">Y a-t-il déjà une automatisation en place ?</label>
            <div class="yes-no-toggle" data-field="hasExistingAutomation">
              <button type="button" class="toggle-btn ${this.data.hasExistingAutomation === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasExistingAutomation === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.hasExistingAutomation ? '' : 'hidden'}" id="existingAutomationGroup">
            <label class="label">Décrivez l'automatisation existante</label>
            <textarea class="textarea textarea-large" id="existingAutomation" rows="5"
                      placeholder="Qu'est-ce qui est déjà automatisé? Comment ça fonctionne?

Exemples:
- Macros Excel
- Scripts ou programmes
- Workflows automatisés
- Intégrations système

Comment évaluez-vous leur efficacité?">${Helpers.escapeHtml(this.data.existingAutomation || '')}</textarea>
          </div>

          <!-- Tâches basées sur des règles -->
          <div class="form-group">
            <label class="label">Quel pourcentage des tâches suit des règles claires ?</label>
            <p class="form-help">Tâches qui peuvent être décrites avec une logique si/alors</p>
            <div class="range-with-value">
              <input type="range" class="range-input" id="rulesBasedPercentage"
                     min="0" max="100" step="5"
                     value="${this.data.rulesBasedPercentage || 50}">
              <span class="range-value" id="rulesBasedValue">${this.data.rulesBasedPercentage || 50}%</span>
            </div>
          </div>

          <!-- Complexité des décisions -->
          <div class="form-group">
            <label class="label">Complexité des Décisions</label>
            <p class="form-help">Quelle est la complexité des décisions prises dans ce travail?</p>
            <select class="select" id="decisionComplexity">
              <option value="">Sélectionner la complexité...</option>
              <option value="simple" ${this.data.decisionComplexity === 'simple' ? 'selected' : ''}>Simple - Réponses clairement justes/fausses</option>
              <option value="moderate" ${this.data.decisionComplexity === 'moderate' ? 'selected' : ''}>Modérée - Un certain jugement requis</option>
              <option value="complex" ${this.data.decisionComplexity === 'complex' ? 'selected' : ''}>Complexe - Expertise significative nécessaire</option>
              <option value="very-complex" ${this.data.decisionComplexity === 'very-complex' ? 'selected' : ''}>Très Complexe - Décisions hautement nuancées</option>
            </select>
          </div>

          <!-- Gestion des exceptions -->
          <div class="form-group">
            <label class="label">À quelle fréquence les exceptions se produisent-elles ?</label>
            <select class="select" id="exceptionFrequency">
              <option value="">Sélectionner la fréquence...</option>
              <option value="rarely" ${this.data.exceptionFrequency === 'rarely' ? 'selected' : ''}>Rarement (moins de 5%)</option>
              <option value="sometimes" ${this.data.exceptionFrequency === 'sometimes' ? 'selected' : ''}>Parfois (5-20%)</option>
              <option value="often" ${this.data.exceptionFrequency === 'often' ? 'selected' : ''}>Souvent (20-40%)</option>
              <option value="very-often" ${this.data.exceptionFrequency === 'very-often' ? 'selected' : ''}>Très Souvent (plus de 40%)</option>
            </select>
          </div>

          <!-- Jugement humain -->
          <div class="form-group">
            <label class="label">Le travail nécessite-t-il un jugement humain ?</label>
            <div class="yes-no-toggle" data-field="requiresHumanJudgment">
              <button type="button" class="toggle-btn ${this.data.requiresHumanJudgment === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.requiresHumanJudgment === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.requiresHumanJudgment ? '' : 'hidden'}" id="humanJudgmentGroup">
            <label class="label">Où le jugement humain est-il critique ?</label>
            <textarea class="textarea textarea-large" id="humanJudgmentAreas" rows="5"
                      placeholder="Quelles décisions nécessitent absolument une intervention humaine?

Exemples:
- Validation finale de montants importants
- Gestion de situations exceptionnelles
- Négociations complexes
- Décisions stratégiques
- Cas sensibles ou litigieux">${Helpers.escapeHtml(this.data.humanJudgmentAreas || '')}</textarea>
          </div>

          <!-- Évaluation de l'adéquation IA -->
          <div class="form-group">
            <label class="label">Adéquation pour l'Automatisation IA</label>
            <p class="form-help">Selon la nature de ce travail, quels types d'IA pourraient aider?</p>
            <div class="checkbox-group" id="aiSuitability">
              ${this.renderAISuitabilityCheckboxes()}
            </div>
          </div>

          <!-- Objectifs d'automatisation -->
          <div class="form-group">
            <label class="label">Objectifs Principaux de l'Automatisation</label>
            <p class="form-help">Que devrait accomplir l'automatisation?</p>
            <div class="checkbox-group" id="automationGoals">
              ${this.renderAutomationGoalsCheckboxes()}
            </div>
          </div>

          <!-- Préoccupations sur l'automatisation -->
          <div class="form-group">
            <label class="label">Préoccupations concernant l'Automatisation</label>
            <textarea class="textarea textarea-large" id="automationConcerns" rows="5"
                      placeholder="Y a-t-il des préoccupations ou risques liés à l'automatisation de ce travail?

Exemples:
- Perte de contrôle sur le processus
- Risque d'erreurs non détectées
- Résistance au changement
- Coût de mise en œuvre
- Complexité technique
- Impact sur l'emploi">${Helpers.escapeHtml(this.data.automationConcerns || '')}</textarea>
          </div>

          <!-- Niveau de préparation -->
          <div class="form-group">
            <label class="label">Ce domaine est-il prêt pour l'automatisation ?</label>
            <select class="select" id="automationReadiness">
              <option value="">Sélectionner le niveau de préparation...</option>
              <option value="ready" ${this.data.automationReadiness === 'ready' ? 'selected' : ''}>Prêt - Données et processus bien définis</option>
              <option value="mostly-ready" ${this.data.automationReadiness === 'mostly-ready' ? 'selected' : ''}>Presque Prêt - Préparation mineure nécessaire</option>
              <option value="needs-work" ${this.data.automationReadiness === 'needs-work' ? 'selected' : ''}>Nécessite du Travail - Préparation significative requise</option>
              <option value="not-ready" ${this.data.automationReadiness === 'not-ready' ? 'selected' : ''}>Pas Prêt - Changements majeurs nécessaires d'abord</option>
            </select>
          </div>

          <!-- Notes additionnelles -->
          <div class="form-group">
            <label class="label">Notes Additionnelles sur le Potentiel d'Automatisation</label>
            <textarea class="textarea textarea-large" id="automationNotes" rows="5"
                      placeholder="Toute autre réflexion sur les possibilités d'automatisation?

Considérez:
- Quick wins potentiels
- Projets structurels plus importants
- Prérequis à mettre en place
- Ordre de priorité suggéré">${Helpers.escapeHtml(this.data.automationNotes || '')}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  renderAISuitabilityCheckboxes() {
    const options = [
      { value: 'document-processing', label: 'Traitement de Documents (OCR, extraction)' },
      { value: 'data-entry', label: 'Automatisation de Saisie de Données' },
      { value: 'classification', label: 'Classification & Catégorisation' },
      { value: 'summarization', label: 'Résumé de Texte' },
      { value: 'prediction', label: 'Prédictions & Prévisions' },
      { value: 'chatbot', label: 'Chatbot / Assistant Virtuel' },
      { value: 'workflow', label: 'Automatisation de Workflow' },
      { value: 'analytics', label: 'Analytics & Insights' }
    ];

    const selected = this.data.aiSuitability || [];

    return options.map(opt => `
      <label class="checkbox-label">
        <input type="checkbox" value="${opt.value}"
               ${selected.includes(opt.value) ? 'checked' : ''}>
        <span>${opt.label}</span>
      </label>
    `).join('');
  }

  renderAutomationGoalsCheckboxes() {
    const options = [
      { value: 'reduce-time', label: 'Réduire le Temps de Traitement' },
      { value: 'reduce-errors', label: 'Réduire les Erreurs' },
      { value: 'increase-capacity', label: 'Augmenter la Capacité' },
      { value: 'improve-consistency', label: 'Améliorer la Cohérence' },
      { value: 'reduce-cost', label: 'Réduire les Coûts' },
      { value: 'improve-experience', label: 'Améliorer l\'Expérience Utilisateur/Client' },
      { value: 'enable-scaling', label: 'Permettre la Montée en Charge' },
      { value: 'free-up-time', label: 'Libérer du Temps pour des Tâches à Plus Forte Valeur' }
    ];

    const selected = this.data.automationGoals || [];

    return options.map(opt => `
      <label class="checkbox-label">
        <input type="checkbox" value="${opt.value}"
               ${selected.includes(opt.value) ? 'checked' : ''}>
        <span>${opt.label}</span>
      </label>
    `).join('');
  }

  bindEvents() {
    // Inputs texte et selects
    const inputs = ['existingAutomation', 'decisionComplexity', 'exceptionFrequency',
                    'humanJudgmentAreas', 'automationConcerns', 'automationReadiness',
                    'automationNotes'];

    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          this.wizard.updateField(id, e.target.value);
        });
      }
    });

    // Curseur
    const rangeInput = document.getElementById('rulesBasedPercentage');
    const rangeValue = document.getElementById('rulesBasedValue');
    if (rangeInput && rangeValue) {
      rangeInput.addEventListener('input', (e) => {
        rangeValue.textContent = e.target.value + '%';
      });
      rangeInput.addEventListener('change', (e) => {
        this.wizard.updateField('rulesBasedPercentage', parseInt(e.target.value));
      });
    }

    // Groupes de cases à cocher
    this.bindCheckboxGroup('aiSuitability');
    this.bindCheckboxGroup('automationGoals');

    // Boutons Oui/Non
    const toggles = document.querySelectorAll('.yes-no-toggle');
    toggles.forEach(toggle => {
      const field = toggle.dataset.field;
      const buttons = toggle.querySelectorAll('.toggle-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const value = btn.dataset.value === 'true';

          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          this.wizard.updateField(field, value);
          this.toggleConditionalGroup(field, value);
        });
      });
    });
  }

  bindCheckboxGroup(groupId) {
    const container = document.getElementById(groupId);
    if (container) {
      container.addEventListener('change', () => {
        const checked = Array.from(container.querySelectorAll('input:checked'))
                            .map(cb => cb.value);
        this.wizard.updateField(groupId, checked);
      });
    }
  }

  toggleConditionalGroup(field, value) {
    const groupMap = {
      'hasExistingAutomation': 'existingAutomationGroup',
      'requiresHumanJudgment': 'humanJudgmentGroup'
    };

    const groupId = groupMap[field];
    if (groupId) {
      const group = document.getElementById(groupId);
      if (group) {
        group.classList.toggle('hidden', !value);
      }
    }
  }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.Section6Automation = Section6Automation;
}
