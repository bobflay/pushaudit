/* ============================================
   Section 8 - Cas d'Usage Département
   Workflows personnalisés et cas d'usage spécifiques
   ============================================ */

class Section8UseCases {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
    this.useCases = wizard.useCases;
  }

  render() {
    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">8. Cas d'Usage Département</h2>
          <p class="section-description">Documentez les cas d'usage et workflows spécifiques qui pourraient bénéficier de l'IA.</p>
        </div>
        <div class="section-content">
          <div id="usecases-container" class="usecases-container">
            ${this.renderUseCases()}
          </div>
          <button type="button" class="btn btn-primary mt-4" id="add-usecase-btn">
            + Ajouter un Cas d'Usage
          </button>
        </div>
      </div>
    `;
  }

  renderUseCases() {
    if (this.useCases.length === 0) {
      return this.renderUseCaseCard({
        id: 'new',
        title: '',
        description: '',
        currentProcess: '',
        desiredOutcome: '',
        frequency: '',
        impact: ''
      });
    }

    return this.useCases.map(uc => this.renderUseCaseCard(uc)).join('');
  }

  renderUseCaseCard(useCase) {
    return `
      <div class="usecase-card card" data-usecase-id="${useCase.id}">
        <div class="card-header">
          <input type="text" class="input usecase-title"
                 value="${Helpers.escapeHtml(useCase.title || '')}"
                 placeholder="Titre du Cas d'Usage">
          <button type="button" class="btn-remove-usecase">×</button>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="label">Description</label>
            <textarea class="textarea textarea-large usecase-description" rows="4"
                      placeholder="De quoi s'agit-il?

Décrivez le contexte, le besoin métier, et pourquoi ce cas est important.">${Helpers.escapeHtml(useCase.description || '')}</textarea>
          </div>

          <div class="form-group">
            <label class="label">Processus Actuel</label>
            <textarea class="textarea textarea-large usecase-current-process" rows="4"
                      placeholder="Comment est-ce géré actuellement?

Décrivez:
- Les étapes actuelles
- Les outils utilisés
- Le temps passé
- Les difficultés rencontrées">${Helpers.escapeHtml(useCase.currentProcess || '')}</textarea>
          </div>

          <div class="form-group">
            <label class="label">Résultat Souhaité</label>
            <textarea class="textarea textarea-large usecase-desired-outcome" rows="4"
                      placeholder="À quoi ressemblerait la solution idéale?

Décrivez:
- L'état cible
- Les bénéfices attendus
- Les critères de succès">${Helpers.escapeHtml(useCase.desiredOutcome || '')}</textarea>
          </div>

          <div class="form-row-2col">
            <div class="form-group">
              <label class="label">Fréquence</label>
              <select class="select usecase-frequency">
                <option value="">Sélectionner la fréquence...</option>
                <option value="multiple-daily" ${useCase.frequency === 'multiple-daily' ? 'selected' : ''}>Plusieurs fois par jour</option>
                <option value="daily" ${useCase.frequency === 'daily' ? 'selected' : ''}>Quotidien</option>
                <option value="weekly" ${useCase.frequency === 'weekly' ? 'selected' : ''}>Hebdomadaire</option>
                <option value="monthly" ${useCase.frequency === 'monthly' ? 'selected' : ''}>Mensuel</option>
                <option value="quarterly" ${useCase.frequency === 'quarterly' ? 'selected' : ''}>Trimestriel</option>
                <option value="adhoc" ${useCase.frequency === 'adhoc' ? 'selected' : ''}>Ponctuel</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">Impact Métier</label>
              <select class="select usecase-impact">
                <option value="">Sélectionner l'impact...</option>
                <option value="low" ${useCase.impact === 'low' ? 'selected' : ''}>Faible</option>
                <option value="medium" ${useCase.impact === 'medium' ? 'selected' : ''}>Moyen</option>
                <option value="high" ${useCase.impact === 'high' ? 'selected' : ''}>Élevé</option>
                <option value="critical" ${useCase.impact === 'critical' ? 'selected' : ''}>Critique</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Bouton ajouter cas d'usage
    const addBtn = document.getElementById('add-usecase-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addUseCase());
    }

    // Lier les cartes existantes
    this.bindUseCaseCards();
  }

  bindUseCaseCards() {
    const container = document.getElementById('usecases-container');
    if (!container) return;

    container.querySelectorAll('.usecase-card').forEach(card => {
      this.bindCardEvents(card);
    });
  }

  bindCardEvents(card) {
    const useCaseId = card.dataset.usecaseId;

    // Champs de saisie
    const inputs = card.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.saveUseCase(card));
      input.addEventListener('change', () => this.saveUseCase(card));
    });

    // Bouton supprimer
    const removeBtn = card.querySelector('.btn-remove-usecase');
    if (removeBtn) {
      removeBtn.addEventListener('click', async () => {
        if (useCaseId && useCaseId !== 'new') {
          await this.wizard.deleteRelatedItem('useCases', useCaseId);
        }
        card.remove();

        // Si aucun cas d'usage restant, en ajouter un vide
        const container = document.getElementById('usecases-container');
        if (container.children.length === 0) {
          this.addUseCase();
        }
      });
    }
  }

  async addUseCase() {
    const container = document.getElementById('usecases-container');
    if (!container) return;

    const useCaseId = await Helpers.generateUseCaseId(this.wizard.auditId);

    const div = document.createElement('div');
    div.className = 'usecase-card card';
    div.dataset.usecaseId = useCaseId;
    div.innerHTML = `
      <div class="card-header">
        <input type="text" class="input usecase-title" placeholder="Titre du Cas d'Usage">
        <button type="button" class="btn-remove-usecase">×</button>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="label">Description</label>
          <textarea class="textarea textarea-large usecase-description" rows="4"
                    placeholder="De quoi s'agit-il?

Décrivez le contexte, le besoin métier, et pourquoi ce cas est important."></textarea>
        </div>

        <div class="form-group">
          <label class="label">Processus Actuel</label>
          <textarea class="textarea textarea-large usecase-current-process" rows="4"
                    placeholder="Comment est-ce géré actuellement?

Décrivez:
- Les étapes actuelles
- Les outils utilisés
- Le temps passé
- Les difficultés rencontrées"></textarea>
        </div>

        <div class="form-group">
          <label class="label">Résultat Souhaité</label>
          <textarea class="textarea textarea-large usecase-desired-outcome" rows="4"
                    placeholder="À quoi ressemblerait la solution idéale?

Décrivez:
- L'état cible
- Les bénéfices attendus
- Les critères de succès"></textarea>
        </div>

        <div class="form-row-2col">
          <div class="form-group">
            <label class="label">Fréquence</label>
            <select class="select usecase-frequency">
              <option value="">Sélectionner la fréquence...</option>
              <option value="multiple-daily">Plusieurs fois par jour</option>
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
              <option value="adhoc">Ponctuel</option>
            </select>
          </div>

          <div class="form-group">
            <label class="label">Impact Métier</label>
            <select class="select usecase-impact">
              <option value="">Sélectionner l'impact...</option>
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="high">Élevé</option>
              <option value="critical">Critique</option>
            </select>
          </div>
        </div>
      </div>
    `;

    container.appendChild(div);
    this.bindCardEvents(div);

    // Focus sur le titre
    div.querySelector('.usecase-title').focus();
  }

  async saveUseCase(card) {
    let useCaseId = card.dataset.usecaseId;

    const title = card.querySelector('.usecase-title').value.trim();

    // Ignorer si pas de titre
    if (!title) return;

    // Générer ID si nouveau
    if (useCaseId === 'new') {
      useCaseId = await Helpers.generateUseCaseId(this.wizard.auditId);
      card.dataset.usecaseId = useCaseId;
    }

    const useCase = {
      id: useCaseId,
      auditId: this.wizard.auditId,
      title: title,
      description: card.querySelector('.usecase-description').value.trim(),
      currentProcess: card.querySelector('.usecase-current-process').value.trim(),
      desiredOutcome: card.querySelector('.usecase-desired-outcome').value.trim(),
      frequency: card.querySelector('.usecase-frequency').value,
      impact: card.querySelector('.usecase-impact').value,
      displayOrder: Array.from(card.parentElement.children).indexOf(card)
    };

    await Storage.save('useCases', useCase);

    // Mettre à jour le tableau local
    const index = this.wizard.useCases.findIndex(uc => uc.id === useCaseId);
    if (index >= 0) {
      this.wizard.useCases[index] = useCase;
    } else {
      this.wizard.useCases.push(useCase);
    }
  }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.Section8UseCases = Section8UseCases;
}
