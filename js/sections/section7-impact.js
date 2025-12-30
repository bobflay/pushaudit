/* ============================================
   Section 7 - Impact Métier & ROI
   Gains de temps, priorité, valeur métier
   ============================================ */

class Section7Impact {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
  }

  render() {
    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">7. Impact Métier & ROI</h2>
          <p class="section-description">Évaluez la valeur métier potentielle et le retour sur investissement.</p>
        </div>
        <div class="section-content">
          <!-- Temps actuellement passé -->
          <div class="form-group">
            <label class="label">Temps Actuellement Consacré à ce Travail (par semaine)</label>
            <div class="form-row-2col">
              <div>
                <label class="label-small">Heures</label>
                <input type="number" class="input" id="currentHoursPerWeek"
                       value="${this.data.currentHoursPerWeek || ''}"
                       placeholder="Heures par semaine" min="0" max="168">
              </div>
              <div>
                <label class="label-small">Personnes Impliquées</label>
                <input type="number" class="input" id="peopleInvolved"
                       value="${this.data.peopleInvolved || ''}"
                       placeholder="Nombre de personnes" min="1">
              </div>
            </div>
          </div>

          <!-- Gains de temps estimés -->
          <div class="form-group">
            <label class="label">Gains de Temps Estimés avec l'Automatisation</label>
            <p class="form-help">Quel pourcentage de temps pourrait être économisé?</p>
            <div class="range-with-value">
              <input type="range" class="range-input" id="estimatedTimeSavings"
                     min="0" max="100" step="5"
                     value="${this.data.estimatedTimeSavings || 30}">
              <span class="range-value" id="timeSavingsValue">${this.data.estimatedTimeSavings || 30}%</span>
            </div>
          </div>

          <!-- Impact sur les coûts -->
          <div class="form-group">
            <label class="label">Impact Potentiel sur les Coûts</label>
            <select class="select" id="costImpact">
              <option value="">Sélectionner le niveau d'impact...</option>
              <option value="minimal" ${this.data.costImpact === 'minimal' ? 'selected' : ''}>Minimal (moins de 10k€/an)</option>
              <option value="moderate" ${this.data.costImpact === 'moderate' ? 'selected' : ''}>Modéré (10k-50k€/an)</option>
              <option value="significant" ${this.data.costImpact === 'significant' ? 'selected' : ''}>Significatif (50k-200k€/an)</option>
              <option value="major" ${this.data.costImpact === 'major' ? 'selected' : ''}>Majeur (plus de 200k€/an)</option>
            </select>
          </div>

          <!-- Impact sur la qualité -->
          <div class="form-group">
            <label class="label">Amélioration de Qualité Attendue</label>
            <select class="select" id="qualityImpact">
              <option value="">Sélectionner le niveau d'amélioration...</option>
              <option value="minimal" ${this.data.qualityImpact === 'minimal' ? 'selected' : ''}>Minimale - Légère amélioration</option>
              <option value="moderate" ${this.data.qualityImpact === 'moderate' ? 'selected' : ''}>Modérée - Amélioration notable</option>
              <option value="significant" ${this.data.qualityImpact === 'significant' ? 'selected' : ''}>Significative - Amélioration majeure</option>
              <option value="transformative" ${this.data.qualityImpact === 'transformative' ? 'selected' : ''}>Transformatrice - Changement complet</option>
            </select>
          </div>

          <!-- Priorité métier -->
          <div class="form-group">
            <label class="label">Priorité Métier</label>
            <p class="form-help">Quelle est l'importance d'améliorer ce domaine?</p>
            <div class="priority-selector" data-field="businessPriority">
              <button type="button" class="priority-btn priority-low ${this.data.businessPriority === 'low' ? 'active' : ''}" data-value="low">Faible</button>
              <button type="button" class="priority-btn priority-medium ${this.data.businessPriority === 'medium' ? 'active' : ''}" data-value="medium">Moyenne</button>
              <button type="button" class="priority-btn priority-high ${this.data.businessPriority === 'high' ? 'active' : ''}" data-value="high">Élevée</button>
            </div>
          </div>

          <!-- Urgence de mise en œuvre -->
          <div class="form-group">
            <label class="label">Urgence de Mise en Œuvre</label>
            <select class="select" id="implementationUrgency">
              <option value="">Sélectionner l'urgence...</option>
              <option value="immediate" ${this.data.implementationUrgency === 'immediate' ? 'selected' : ''}>Immédiate - Besoin critique maintenant</option>
              <option value="short-term" ${this.data.implementationUrgency === 'short-term' ? 'selected' : ''}>Court terme - Dans les 3 mois</option>
              <option value="medium-term" ${this.data.implementationUrgency === 'medium-term' ? 'selected' : ''}>Moyen terme - Dans les 6 mois</option>
              <option value="long-term" ${this.data.implementationUrgency === 'long-term' ? 'selected' : ''}>Long terme - Dans les 12 mois</option>
            </select>
          </div>

          <!-- Risque de l'inaction -->
          <div class="form-group">
            <label class="label">Risque de Ne Pas Automatiser</label>
            <textarea class="textarea textarea-large" id="riskOfInaction" rows="5"
                      placeholder="Que se passe-t-il si ce domaine n'est pas amélioré?

Exemples:
- Perte de compétitivité
- Risques d'erreurs coûteuses
- Surcharge des équipes
- Non-conformité réglementaire
- Perte de clients">${Helpers.escapeHtml(this.data.riskOfInaction || '')}</textarea>
          </div>

          <!-- Indicateurs de succès -->
          <div class="form-group">
            <label class="label">Comment le succès serait-il mesuré ?</label>
            <textarea class="textarea textarea-large" id="successMetrics" rows="5"
                      placeholder="Quels KPIs ou métriques indiqueraient le succès?

Exemples:
- Temps de traitement réduit de X%
- Taux d'erreur réduit de X%
- Nombre de dossiers traités par jour
- Satisfaction client améliorée
- Coûts opérationnels réduits">${Helpers.escapeHtml(this.data.successMetrics || '')}</textarea>
          </div>

          <!-- Soutien des parties prenantes -->
          <div class="form-group">
            <label class="label">Y a-t-il un soutien des parties prenantes pour l'automatisation ?</label>
            <div class="yes-no-toggle" data-field="hasStakeholderSupport">
              <button type="button" class="toggle-btn ${this.data.hasStakeholderSupport === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasStakeholderSupport === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <!-- Budget disponible -->
          <div class="form-group">
            <label class="label">Un budget est-il disponible pour l'automatisation ?</label>
            <div class="yes-no-toggle" data-field="hasBudget">
              <button type="button" class="toggle-btn ${this.data.hasBudget === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasBudget === false ? 'active' : ''}" data-value="false">Non</button>
              <button type="button" class="toggle-btn ${this.data.hasBudget === 'unknown' ? 'active' : ''}" data-value="unknown">Inconnu</button>
            </div>
          </div>

          <!-- Délai de ROI attendu -->
          <div class="form-group">
            <label class="label">Délai de Retour sur Investissement Attendu</label>
            <select class="select" id="roiTimeframe">
              <option value="">Sélectionner le délai...</option>
              <option value="immediate" ${this.data.roiTimeframe === 'immediate' ? 'selected' : ''}>Immédiat - Moins de 3 mois</option>
              <option value="short" ${this.data.roiTimeframe === 'short' ? 'selected' : ''}>Court - 3-6 mois</option>
              <option value="medium" ${this.data.roiTimeframe === 'medium' ? 'selected' : ''}>Moyen - 6-12 mois</option>
              <option value="long" ${this.data.roiTimeframe === 'long' ? 'selected' : ''}>Long - Plus de 12 mois</option>
            </select>
          </div>

          <!-- Bénéfices additionnels -->
          <div class="form-group">
            <label class="label">Bénéfices Additionnels</label>
            <textarea class="textarea textarea-large" id="additionalBenefits" rows="5"
                      placeholder="D'autres bénéfices de l'automatisation (satisfaction employés, conformité, etc.)?

Exemples:
- Amélioration du moral des équipes
- Meilleure conformité réglementaire
- Réduction du stress
- Meilleure rétention des talents
- Image d'innovation">${Helpers.escapeHtml(this.data.additionalBenefits || '')}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Inputs numériques
    ['currentHoursPerWeek', 'peopleInvolved'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          const value = e.target.value ? parseInt(e.target.value) : null;
          this.wizard.updateField(id, value);
        });
      }
    });

    // Inputs select
    ['costImpact', 'qualityImpact', 'implementationUrgency', 'roiTimeframe'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          this.wizard.updateField(id, e.target.value);
        });
      }
    });

    // Inputs texte
    ['riskOfInaction', 'successMetrics', 'additionalBenefits'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          this.wizard.updateField(id, e.target.value);
        });
      }
    });

    // Curseur
    const rangeInput = document.getElementById('estimatedTimeSavings');
    const rangeValue = document.getElementById('timeSavingsValue');
    if (rangeInput && rangeValue) {
      rangeInput.addEventListener('input', (e) => {
        rangeValue.textContent = e.target.value + '%';
      });
      rangeInput.addEventListener('change', (e) => {
        this.wizard.updateField('estimatedTimeSavings', parseInt(e.target.value));
      });
    }

    // Sélecteur de priorité
    const prioritySelector = document.querySelector('.priority-selector');
    if (prioritySelector) {
      const buttons = prioritySelector.querySelectorAll('.priority-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.wizard.updateField('businessPriority', btn.dataset.value);
        });
      });
    }

    // Boutons Oui/Non (incluant trois options pour le budget)
    const toggles = document.querySelectorAll('.yes-no-toggle');
    toggles.forEach(toggle => {
      const field = toggle.dataset.field;
      const buttons = toggle.querySelectorAll('.toggle-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          let value = btn.dataset.value;
          if (value === 'true') value = true;
          else if (value === 'false') value = false;
          // 'unknown' reste comme chaîne

          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          this.wizard.updateField(field, value);
        });
      });
    });
  }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.Section7Impact = Section7Impact;
}
