/* ============================================
   Section 4 - Charge de Travail & Points de Friction
   Volume, erreurs, goulots d'étranglement, tâches répétitives
   ============================================ */

class Section4Workload {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
  }

  render() {
    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">4. Charge de Travail & Points de Friction</h2>
          <p class="section-description">Identifiez le volume, les erreurs et les points de douleur dans le travail quotidien.</p>
        </div>
        <div class="section-content">
          <!-- Volume de tâches -->
          <div class="form-group">
            <label class="label">Volume Quotidien Estimé des Tâches</label>
            <p class="form-help">Nombre approximatif de tâches, demandes ou éléments traités par jour</p>
            <input type="number" class="input" id="dailyVolume"
                   value="${this.data.dailyVolume || ''}"
                   placeholder="ex: 50">
          </div>

          <!-- Tâches répétitives -->
          <div class="form-group">
            <label class="label">Y a-t-il des tâches très répétitives ?</label>
            <div class="yes-no-toggle" data-field="hasRepetitiveTasks">
              <button type="button" class="toggle-btn ${this.data.hasRepetitiveTasks === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasRepetitiveTasks === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.hasRepetitiveTasks ? '' : 'hidden'}" id="repetitiveTasksGroup">
            <label class="label">Décrivez les tâches répétitives</label>
            <textarea class="textarea textarea-large" id="repetitiveTasks" rows="5"
                      placeholder="Quelles tâches sont répétées fréquemment?

Exemples:
- Saisie de données dans plusieurs systèmes
- Copier-coller entre applications
- Vérifications manuelles récurrentes
- Envoi d'emails types
- Génération de rapports standards

Précisez la fréquence et le temps passé sur chaque tâche.">${Helpers.escapeHtml(this.data.repetitiveTasks || '')}</textarea>
          </div>

          <!-- Saisie manuelle de données -->
          <div class="form-group">
            <label class="label">Y a-t-il une saisie manuelle importante de données ?</label>
            <div class="yes-no-toggle" data-field="hasManualDataEntry">
              <button type="button" class="toggle-btn ${this.data.hasManualDataEntry === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasManualDataEntry === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.hasManualDataEntry ? '' : 'hidden'}" id="manualDataEntryGroup">
            <label class="label">Décrivez la saisie manuelle de données</label>
            <textarea class="textarea textarea-large" id="manualDataEntry" rows="5"
                      placeholder="Quelles données sont saisies manuellement? D'où viennent-elles?

Exemples:
- Saisie de factures depuis des PDFs
- Transcription depuis des emails
- Recopie depuis des documents papier
- Entrée de données depuis des formulaires

Précisez les volumes et le temps passé.">${Helpers.escapeHtml(this.data.manualDataEntry || '')}</textarea>
          </div>

          <!-- Fréquence des erreurs -->
          <div class="form-group">
            <label class="label">À quelle fréquence les erreurs se produisent-elles ?</label>
            <select class="select" id="errorFrequency">
              <option value="">Sélectionner la fréquence...</option>
              <option value="rarely" ${this.data.errorFrequency === 'rarely' ? 'selected' : ''}>Rarement (moins d'une fois par semaine)</option>
              <option value="sometimes" ${this.data.errorFrequency === 'sometimes' ? 'selected' : ''}>Parfois (hebdomadaire)</option>
              <option value="often" ${this.data.errorFrequency === 'often' ? 'selected' : ''}>Souvent (quotidien)</option>
              <option value="very-often" ${this.data.errorFrequency === 'very-often' ? 'selected' : ''}>Très souvent (plusieurs fois par jour)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="label">Types d'Erreurs Courantes</label>
            <textarea class="textarea textarea-large" id="errorTypes" rows="5"
                      placeholder="Quels types d'erreurs se produisent typiquement?

Exemples:
- Erreurs de saisie (fautes de frappe, inversions)
- Erreurs de calcul
- Oublis ou omissions
- Doublons
- Erreurs de classement/affectation

Décrivez l'impact de ces erreurs et comment elles sont détectées.">${Helpers.escapeHtml(this.data.errorTypes || '')}</textarea>
          </div>

          <!-- Goulots d'étranglement -->
          <div class="form-group">
            <label class="label">Y a-t-il des goulots d'étranglement dans les processus ?</label>
            <div class="yes-no-toggle" data-field="hasBottlenecks">
              <button type="button" class="toggle-btn ${this.data.hasBottlenecks === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasBottlenecks === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.hasBottlenecks ? '' : 'hidden'}" id="bottlenecksGroup">
            <label class="label">Décrivez les goulots d'étranglement</label>
            <textarea class="textarea textarea-large" id="bottlenecks" rows="5"
                      placeholder="Où les choses ralentissent-elles ou se bloquent-elles?

Exemples:
- Attente de validations
- Système lent ou indisponible
- Manque de ressources
- Dépendance à une personne clé
- Processus séquentiel non parallélisable

Décrivez l'impact sur le travail.">${Helpers.escapeHtml(this.data.bottlenecks || '')}</textarea>
          </div>

          <!-- Temps d'attente -->
          <div class="form-group">
            <label class="label">Y a-t-il un temps d'attente significatif ?</label>
            <div class="yes-no-toggle" data-field="hasWaitingTime">
              <button type="button" class="toggle-btn ${this.data.hasWaitingTime === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasWaitingTime === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.hasWaitingTime ? '' : 'hidden'}" id="waitingTimeGroup">
            <label class="label">Qu'est-ce qui cause l'attente ?</label>
            <textarea class="textarea textarea-large" id="waitingTime" rows="5"
                      placeholder="Qu'attendez-vous? Validations, systèmes, personnes?

Exemples:
- Attente de validation hiérarchique
- Attente de réponse client/fournisseur
- Attente de traitement système
- Synchronisation avec autres équipes

Estimez le temps d'attente quotidien/hebdomadaire.">${Helpers.escapeHtml(this.data.waitingTime || '')}</textarea>
          </div>

          <!-- Périodes de pointe -->
          <div class="form-group">
            <label class="label">Y a-t-il des périodes de pointe de charge de travail ?</label>
            <div class="yes-no-toggle" data-field="hasPeakPeriods">
              <button type="button" class="toggle-btn ${this.data.hasPeakPeriods === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasPeakPeriods === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.hasPeakPeriods ? '' : 'hidden'}" id="peakPeriodsGroup">
            <label class="label">Quand sont les périodes de pointe ?</label>
            <textarea class="textarea textarea-large" id="peakPeriods" rows="5"
                      placeholder="Fin de mois? Saisonnier? Avant les échéances?

Exemples:
- Clôture mensuelle/trimestrielle/annuelle
- Période de paie
- Saison haute (précisez)
- Avant les audits
- Rentrée/fin d'année

Décrivez l'impact sur votre travail.">${Helpers.escapeHtml(this.data.peakPeriods || '')}</textarea>
          </div>

          <!-- Frustrations principales -->
          <div class="form-group">
            <label class="label">Principales Frustrations</label>
            <p class="form-help">Quels sont les aspects les plus frustrants du workflow actuel?</p>
            <textarea class="textarea textarea-xl" id="topFrustrations" rows="8"
                      placeholder="Listez les principaux points de douleur...

Pensez à:
- Ce qui vous fait perdre du temps inutilement
- Ce qui est source de stress
- Ce qui pourrait être évité
- Ce qui vous empêche de faire un travail de qualité
- Ce qui crée de la frustration au quotidien

Soyez aussi spécifique que possible.">${Helpers.escapeHtml(this.data.topFrustrations || '')}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Inputs réguliers
    const inputs = ['dailyVolume', 'repetitiveTasks', 'manualDataEntry',
                    'errorFrequency', 'errorTypes', 'bottlenecks',
                    'waitingTime', 'peakPeriods', 'topFrustrations'];

    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          let value = e.target.value;
          if (id === 'dailyVolume') {
            value = value ? parseInt(value) : null;
          }
          this.wizard.updateField(id, value);
        });
      }
    });

    // Boutons Oui/Non
    const toggles = document.querySelectorAll('.yes-no-toggle');
    toggles.forEach(toggle => {
      const field = toggle.dataset.field;
      const buttons = toggle.querySelectorAll('.toggle-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const value = btn.dataset.value === 'true';

          // Mise à jour UI
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Mise à jour données
          this.wizard.updateField(field, value);

          // Afficher/masquer groupe conditionnel
          this.toggleConditionalGroup(field, value);
        });
      });
    });
  }

  toggleConditionalGroup(field, value) {
    const groupMap = {
      'hasRepetitiveTasks': 'repetitiveTasksGroup',
      'hasManualDataEntry': 'manualDataEntryGroup',
      'hasBottlenecks': 'bottlenecksGroup',
      'hasWaitingTime': 'waitingTimeGroup',
      'hasPeakPeriods': 'peakPeriodsGroup'
    };

    const groupId = groupMap[field];
    if (groupId) {
      const group = document.getElementById(groupId);
      if (group) {
        if (value) {
          group.classList.remove('hidden');
        } else {
          group.classList.add('hidden');
        }
      }
    }
  }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.Section4Workload = Section4Workload;
}
