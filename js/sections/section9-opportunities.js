/* ============================================
   Section 9 - Opportunités IA
   Quick wins et cas structurels d'automatisation
   ============================================ */

class Section9Opportunities {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
    this.opportunities = wizard.opportunities;
  }

  render() {
    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">9. Opportunités IA</h2>
          <p class="section-description">Identifiez les quick wins et les opportunités structurelles d'automatisation IA.</p>
        </div>
        <div class="section-content">
          <!-- Section Quick Wins -->
          <div class="subsection">
            <h3 class="subsection-title">Quick Wins</h3>
            <p class="subsection-description">Petites améliorations pouvant être implémentées rapidement avec un impact immédiat.</p>

            <div id="quickwins-container" class="opportunities-grid">
              ${this.renderOpportunities('quickwin')}
            </div>
            <button type="button" class="btn btn-outline mt-3" id="add-quickwin-btn">
              + Ajouter un Quick Win
            </button>
          </div>

          <!-- Section Cas Structurels -->
          <div class="subsection mt-6">
            <h3 class="subsection-title">Cas Structurels</h3>
            <p class="subsection-description">Projets d'automatisation plus importants nécessitant plus de planification et de ressources.</p>

            <div id="structural-container" class="opportunities-grid">
              ${this.renderOpportunities('structural')}
            </div>
            <button type="button" class="btn btn-outline mt-3" id="add-structural-btn">
              + Ajouter un Cas Structurel
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderOpportunities(type) {
    const filtered = this.opportunities.filter(o => o.type === type);

    if (filtered.length === 0) {
      return this.renderOpportunityCard({
        id: 'new',
        type: type,
        title: '',
        description: '',
        expectedBenefit: '',
        effort: '',
        priority: ''
      });
    }

    return filtered.map(opp => this.renderOpportunityCard(opp)).join('');
  }

  renderOpportunityCard(opportunity) {
    const isQuickWin = opportunity.type === 'quickwin';

    return `
      <div class="opportunity-card card" data-opportunity-id="${opportunity.id}" data-type="${opportunity.type}">
        <div class="card-header">
          <span class="badge ${isQuickWin ? 'badge-success' : 'badge-primary'}">${isQuickWin ? 'Quick Win' : 'Structurel'}</span>
          <button type="button" class="btn-remove-opportunity">×</button>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="label">Titre</label>
            <input type="text" class="input opportunity-title"
                   value="${Helpers.escapeHtml(opportunity.title || '')}"
                   placeholder="${isQuickWin ? 'Titre du quick win' : 'Titre du projet'}">
          </div>

          <div class="form-group">
            <label class="label">Description</label>
            <textarea class="textarea textarea-large opportunity-description" rows="4"
                      placeholder="Qu'est-ce qui serait automatisé?

Décrivez:
- La tâche ou le processus concerné
- Comment l'automatisation fonctionnerait
- Les prérequis éventuels">${Helpers.escapeHtml(opportunity.description || '')}</textarea>
          </div>

          <div class="form-group">
            <label class="label">Bénéfice Attendu</label>
            <textarea class="textarea textarea-large opportunity-benefit" rows="4"
                      placeholder="Quelle amélioration cela apporterait-il?

Exemples:
- Gain de temps (heures/semaine)
- Réduction d'erreurs
- Amélioration de la qualité
- Satisfaction utilisateur">${Helpers.escapeHtml(opportunity.expectedBenefit || '')}</textarea>
          </div>

          <div class="form-row-2col">
            <div class="form-group">
              <label class="label">Effort Requis</label>
              <select class="select opportunity-effort">
                <option value="">Sélectionner l'effort...</option>
                <option value="minimal" ${opportunity.effort === 'minimal' ? 'selected' : ''}>Minimal (heures)</option>
                <option value="low" ${opportunity.effort === 'low' ? 'selected' : ''}>Faible (jours)</option>
                <option value="medium" ${opportunity.effort === 'medium' ? 'selected' : ''}>Moyen (semaines)</option>
                <option value="high" ${opportunity.effort === 'high' ? 'selected' : ''}>Élevé (mois)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">Priorité</label>
              <select class="select opportunity-priority">
                <option value="">Sélectionner la priorité...</option>
                <option value="low" ${opportunity.priority === 'low' ? 'selected' : ''}>Faible</option>
                <option value="medium" ${opportunity.priority === 'medium' ? 'selected' : ''}>Moyenne</option>
                <option value="high" ${opportunity.priority === 'high' ? 'selected' : ''}>Élevée</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Boutons ajouter
    const addQuickWinBtn = document.getElementById('add-quickwin-btn');
    if (addQuickWinBtn) {
      addQuickWinBtn.addEventListener('click', () => this.addOpportunity('quickwin'));
    }

    const addStructuralBtn = document.getElementById('add-structural-btn');
    if (addStructuralBtn) {
      addStructuralBtn.addEventListener('click', () => this.addOpportunity('structural'));
    }

    // Lier les cartes existantes
    this.bindOpportunityCards();
  }

  bindOpportunityCards() {
    document.querySelectorAll('.opportunity-card').forEach(card => {
      this.bindCardEvents(card);
    });
  }

  bindCardEvents(card) {
    const opportunityId = card.dataset.opportunityId;

    // Champs de saisie
    const inputs = card.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.saveOpportunity(card));
      input.addEventListener('change', () => this.saveOpportunity(card));
    });

    // Bouton supprimer
    const removeBtn = card.querySelector('.btn-remove-opportunity');
    if (removeBtn) {
      removeBtn.addEventListener('click', async () => {
        const type = card.dataset.type;

        if (opportunityId && opportunityId !== 'new') {
          await this.wizard.deleteRelatedItem('opportunities', opportunityId);
        }
        card.remove();

        // Si aucune opportunité de ce type restante, en ajouter une vide
        const containerId = type === 'quickwin' ? 'quickwins-container' : 'structural-container';
        const container = document.getElementById(containerId);
        if (container && container.children.length === 0) {
          this.addOpportunity(type);
        }
      });
    }
  }

  async addOpportunity(type) {
    const containerId = type === 'quickwin' ? 'quickwins-container' : 'structural-container';
    const container = document.getElementById(containerId);
    if (!container) return;

    const opportunityId = await Helpers.generateOpportunityId(this.wizard.auditId);
    const isQuickWin = type === 'quickwin';

    const div = document.createElement('div');
    div.className = 'opportunity-card card';
    div.dataset.opportunityId = opportunityId;
    div.dataset.type = type;
    div.innerHTML = `
      <div class="card-header">
        <span class="badge ${isQuickWin ? 'badge-success' : 'badge-primary'}">${isQuickWin ? 'Quick Win' : 'Structurel'}</span>
        <button type="button" class="btn-remove-opportunity">×</button>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="label">Titre</label>
          <input type="text" class="input opportunity-title"
                 placeholder="${isQuickWin ? 'Titre du quick win' : 'Titre du projet'}">
        </div>

        <div class="form-group">
          <label class="label">Description</label>
          <textarea class="textarea textarea-large opportunity-description" rows="4"
                    placeholder="Qu'est-ce qui serait automatisé?

Décrivez:
- La tâche ou le processus concerné
- Comment l'automatisation fonctionnerait
- Les prérequis éventuels"></textarea>
        </div>

        <div class="form-group">
          <label class="label">Bénéfice Attendu</label>
          <textarea class="textarea textarea-large opportunity-benefit" rows="4"
                    placeholder="Quelle amélioration cela apporterait-il?

Exemples:
- Gain de temps (heures/semaine)
- Réduction d'erreurs
- Amélioration de la qualité
- Satisfaction utilisateur"></textarea>
        </div>

        <div class="form-row-2col">
          <div class="form-group">
            <label class="label">Effort Requis</label>
            <select class="select opportunity-effort">
              <option value="">Sélectionner l'effort...</option>
              <option value="minimal">Minimal (heures)</option>
              <option value="low">Faible (jours)</option>
              <option value="medium">Moyen (semaines)</option>
              <option value="high">Élevé (mois)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="label">Priorité</label>
            <select class="select opportunity-priority">
              <option value="">Sélectionner la priorité...</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>
          </div>
        </div>
      </div>
    `;

    container.appendChild(div);
    this.bindCardEvents(div);

    // Focus sur le titre
    div.querySelector('.opportunity-title').focus();
  }

  async saveOpportunity(card) {
    let opportunityId = card.dataset.opportunityId;
    const type = card.dataset.type;

    const title = card.querySelector('.opportunity-title').value.trim();

    // Ignorer si pas de titre
    if (!title) return;

    // Générer ID si nouveau
    if (opportunityId === 'new') {
      opportunityId = await Helpers.generateOpportunityId(this.wizard.auditId);
      card.dataset.opportunityId = opportunityId;
    }

    const opportunity = {
      id: opportunityId,
      auditId: this.wizard.auditId,
      type: type,
      title: title,
      description: card.querySelector('.opportunity-description').value.trim(),
      expectedBenefit: card.querySelector('.opportunity-benefit').value.trim(),
      effort: card.querySelector('.opportunity-effort').value,
      priority: card.querySelector('.opportunity-priority').value,
      displayOrder: Array.from(card.parentElement.children).indexOf(card)
    };

    await Storage.save('opportunities', opportunity);

    // Mettre à jour le tableau local
    const index = this.wizard.opportunities.findIndex(o => o.id === opportunityId);
    if (index >= 0) {
      this.wizard.opportunities[index] = opportunity;
    } else {
      this.wizard.opportunities.push(opportunity);
    }
  }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.Section9Opportunities = Section9Opportunities;
}
