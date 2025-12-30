/* ============================================
   Section 3 - Cartographie des Processus
   Flux de processus A → B → C → D
   ============================================ */

class Section3Process {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
    this.processes = wizard.processes;
  }

  render() {
    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">3. Cartographie des Processus</h2>
          <p class="section-description">Documentez les processus clés de votre travail sous forme de flux étape par étape.</p>
        </div>
        <div class="section-content">
          <div id="processes-container" class="processes-container">
            ${this.renderProcesses()}
          </div>
          <button type="button" class="btn btn-primary mt-4" id="add-process-btn">
            + Ajouter un Nouveau Processus
          </button>
        </div>
      </div>
    `;
  }

  renderProcesses() {
    if (this.processes.length === 0) {
      return this.renderProcessCard({
        id: 'new',
        processName: '',
        triggerEvent: '',
        stepA: '',
        stepB: '',
        stepC: '',
        stepD: '',
        endState: '',
        processNotes: ''
      });
    }

    return this.processes.map(process => this.renderProcessCard(process)).join('');
  }

  renderProcessCard(process) {
    return `
      <div class="process-card" data-process-id="${process.id}">
        <div class="process-card-header">
          <input type="text" class="process-name input input-lg"
                 value="${Helpers.escapeHtml(process.processName || '')}"
                 placeholder="Nom du Processus (ex: Traitement des Factures Fournisseurs, Validation des Congés)">
          <button type="button" class="btn-remove-process">×</button>
        </div>
        <div class="process-card-body">
          <div class="form-group">
            <label class="label">Événement Déclencheur</label>
            <p class="form-help">Qu'est-ce qui déclenche ce processus?</p>
            <textarea class="textarea trigger-event" rows="3"
                   placeholder="Décrivez ce qui initie le processus:
- Réception d'un email de...
- Demande d'un client/collègue...
- Date spécifique (fin de mois, etc.)...
- Événement dans un système...">${Helpers.escapeHtml(process.triggerEvent || '')}</textarea>
          </div>

          <div class="process-flow">
            <div class="process-step">
              <span class="step-label">A</span>
              <textarea class="textarea step-input step-a" rows="4"
                     placeholder="ÉTAPE 1: Décrivez en détail la première action...

- Que faites-vous exactement?
- Quel outil utilisez-vous?
- Combien de temps cela prend-il?
- Quelles informations sont nécessaires?">${Helpers.escapeHtml(process.stepA || '')}</textarea>
            </div>
            <div class="process-arrow">→</div>
            <div class="process-step">
              <span class="step-label">B</span>
              <textarea class="textarea step-input step-b" rows="4"
                     placeholder="ÉTAPE 2: Décrivez la deuxième action...

- Suite logique de l'étape A
- Vérifications à effectuer
- Personnes impliquées
- Décisions à prendre">${Helpers.escapeHtml(process.stepB || '')}</textarea>
            </div>
            <div class="process-arrow">→</div>
            <div class="process-step">
              <span class="step-label">C</span>
              <textarea class="textarea step-input step-c" rows="4"
                     placeholder="ÉTAPE 3: Décrivez la troisième action...

- Traitement ou validation
- Saisie dans les systèmes
- Communications nécessaires
- Contrôles qualité">${Helpers.escapeHtml(process.stepC || '')}</textarea>
            </div>
            <div class="process-arrow">→</div>
            <div class="process-step">
              <span class="step-label">D</span>
              <textarea class="textarea step-input step-d" rows="4"
                     placeholder="ÉTAPE 4: Décrivez la quatrième action...

- Finalisation du traitement
- Archivage / Classement
- Notifications envoyées
- Suivi mis en place">${Helpers.escapeHtml(process.stepD || '')}</textarea>
            </div>
          </div>

          <div class="form-group">
            <label class="label">Résultat Final / Fin du Processus</label>
            <textarea class="textarea end-state" rows="3"
                   placeholder="Décrivez l'état final quand le processus est terminé:
- Quel est le livrable ou résultat attendu?
- Comment sait-on que c'est terminé?
- Où sont stockées les informations?">${Helpers.escapeHtml(process.endState || '')}</textarea>
          </div>

          <div class="form-group">
            <label class="label">Notes sur le Processus</label>
            <p class="form-help">Ajoutez toute information complémentaire importante</p>
            <textarea class="textarea process-notes" rows="5"
                      placeholder="Informations complémentaires:

EXCEPTIONS & CAS PARTICULIERS:
- Que se passe-t-il si... ?
- Cas nécessitant une escalade...

POINTS DE FRICTION:
- Étapes problématiques...
- Goulots d'étranglement...

AMÉLIORATIONS SOUHAITÉES:
- Ce qui pourrait être automatisé...
- Ce qui prend trop de temps...">${Helpers.escapeHtml(process.processNotes || '')}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const addBtn = document.getElementById('add-process-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addProcess());
    }

    this.bindProcessCards();
  }

  bindProcessCards() {
    const container = document.getElementById('processes-container');
    if (!container) return;

    container.querySelectorAll('.process-card').forEach(card => {
      this.bindCardEvents(card);
    });
  }

  bindCardEvents(card) {
    const processId = card.dataset.processId;

    const inputs = card.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.saveProcess(card));
    });

    const removeBtn = card.querySelector('.btn-remove-process');
    if (removeBtn) {
      removeBtn.addEventListener('click', async () => {
        if (processId && processId !== 'new') {
          await this.wizard.deleteRelatedItem('processes', processId);
        }
        card.remove();

        const container = document.getElementById('processes-container');
        if (container.children.length === 0) {
          this.addProcess();
        }
      });
    }
  }

  async addProcess() {
    const container = document.getElementById('processes-container');
    if (!container) return;

    const processId = await Helpers.generateProcessId(this.wizard.auditId);

    const div = document.createElement('div');
    div.className = 'process-card';
    div.dataset.processId = processId;
    div.innerHTML = `
      <div class="process-card-header">
        <input type="text" class="process-name input input-lg" placeholder="Nom du Processus (ex: Traitement des Factures Fournisseurs, Validation des Congés)">
        <button type="button" class="btn-remove-process">×</button>
      </div>
      <div class="process-card-body">
        <div class="form-group">
          <label class="label">Événement Déclencheur</label>
          <p class="form-help">Qu'est-ce qui déclenche ce processus?</p>
          <textarea class="textarea trigger-event" rows="3" placeholder="Décrivez ce qui initie le processus:
- Réception d'un email de...
- Demande d'un client/collègue...
- Date spécifique (fin de mois, etc.)..."></textarea>
        </div>
        <div class="process-flow">
          <div class="process-step">
            <span class="step-label">A</span>
            <textarea class="textarea step-input step-a" rows="4" placeholder="ÉTAPE 1: Décrivez en détail la première action..."></textarea>
          </div>
          <div class="process-arrow">→</div>
          <div class="process-step">
            <span class="step-label">B</span>
            <textarea class="textarea step-input step-b" rows="4" placeholder="ÉTAPE 2: Décrivez la deuxième action..."></textarea>
          </div>
          <div class="process-arrow">→</div>
          <div class="process-step">
            <span class="step-label">C</span>
            <textarea class="textarea step-input step-c" rows="4" placeholder="ÉTAPE 3: Décrivez la troisième action..."></textarea>
          </div>
          <div class="process-arrow">→</div>
          <div class="process-step">
            <span class="step-label">D</span>
            <textarea class="textarea step-input step-d" rows="4" placeholder="ÉTAPE 4: Décrivez la quatrième action..."></textarea>
          </div>
        </div>
        <div class="form-group">
          <label class="label">Résultat Final / Fin du Processus</label>
          <textarea class="textarea end-state" rows="3" placeholder="Décrivez l'état final quand le processus est terminé..."></textarea>
        </div>
        <div class="form-group">
          <label class="label">Notes sur le Processus</label>
          <textarea class="textarea process-notes" rows="5" placeholder="Exceptions, cas particuliers, points de friction, améliorations souhaitées..."></textarea>
        </div>
      </div>
    `;

    container.appendChild(div);
    this.bindCardEvents(div);

    div.querySelector('.process-name').focus();
  }

  async saveProcess(card) {
    let processId = card.dataset.processId;

    const processName = card.querySelector('.process-name').value.trim();

    if (!processName) return;

    if (processId === 'new') {
      processId = await Helpers.generateProcessId(this.wizard.auditId);
      card.dataset.processId = processId;
    }

    const process = {
      id: processId,
      auditId: this.wizard.auditId,
      processName: processName,
      triggerEvent: card.querySelector('.trigger-event').value.trim(),
      stepA: card.querySelector('.step-a').value.trim(),
      stepB: card.querySelector('.step-b').value.trim(),
      stepC: card.querySelector('.step-c').value.trim(),
      stepD: card.querySelector('.step-d').value.trim(),
      endState: card.querySelector('.end-state').value.trim(),
      processNotes: card.querySelector('.process-notes').value.trim(),
      displayOrder: Array.from(card.parentElement.children).indexOf(card)
    };

    await Storage.save('processes', process);

    const index = this.wizard.processes.findIndex(p => p.id === processId);
    if (index >= 0) {
      this.wizard.processes[index] = process;
    } else {
      this.wizard.processes.push(process);
    }
  }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.Section3Process = Section3Process;
}
