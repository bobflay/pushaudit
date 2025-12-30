/* ============================================
   Section 2 - Journée Type
   Éditeur de timeline pour les tâches quotidiennes
   ============================================ */

class Section2Workday {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
    this.tasks = wizard.tasks;
  }

  render() {
    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">2. Journée Type</h2>
          <p class="section-description">Cartographiez les tâches d'une journée typique et leur durée.</p>
        </div>
        <div class="section-content">
          <div class="timeline-editor">
            <div class="timeline-header">
              <span>Début</span>
              <span>Fin</span>
              <span>Description de la Tâche</span>
              <span>Durée</span>
              <span></span>
            </div>
            <div id="timeline-items" class="timeline-items">
              ${this.renderTimelineItems()}
            </div>
            <button type="button" class="btn btn-outline btn-add-timeline" id="add-task-btn">
              + Ajouter une Tâche
            </button>
          </div>

          <div class="form-group mt-6">
            <label class="label">Notes sur la Journée Type</label>
            <p class="form-help">Décrivez en détail votre journée type, les variations possibles, et tout contexte important</p>
            <textarea class="textarea textarea-xl" id="workdayNotes" rows="10"
                      placeholder="Décrivez en détail votre journée type:

MATIN (8h-12h):
- Arrivée et premières tâches (emails, revue des urgences)
- Réunions récurrentes (lesquelles? fréquence?)
- Tâches de traitement principales

APRÈS-MIDI (14h-18h):
- Activités de l'après-midi
- Interactions avec d'autres équipes
- Tâches de clôture de journée

VARIATIONS:
- Différences entre début/milieu/fin de mois
- Pics d'activité saisonniers
- Journées exceptionnelles (clôtures, audits, etc.)

INTERRUPTIONS FRÉQUENTES:
- Types d'interruptions courantes
- Impact sur le travail planifié">${Helpers.escapeHtml(this.data.workdayNotes || '')}</textarea>
          </div>

          <div class="timeline-summary" id="timeline-summary">
            ${this.renderSummary()}
          </div>
        </div>
      </div>
    `;
  }

  renderTimelineItems() {
    if (this.tasks.length === 0) {
      return `
        <div class="timeline-item" data-task-id="new">
          <input type="time" class="input task-start" value="09:00">
          <input type="time" class="input task-end" value="10:00">
          <input type="text" class="input input-wide task-description" placeholder="Quelle tâche est effectuée? Décrivez en détail...">
          <span class="task-duration">1h</span>
          <button type="button" class="btn-remove-item" disabled>×</button>
        </div>
      `;
    }

    return this.tasks.map(task => `
      <div class="timeline-item" data-task-id="${task.id}">
        <input type="time" class="input task-start" value="${task.timeSlot || '09:00'}">
        <input type="time" class="input task-end" value="${task.endTime || '10:00'}">
        <input type="text" class="input input-wide task-description"
               value="${Helpers.escapeHtml(task.taskDescription || '')}"
               placeholder="Quelle tâche est effectuée? Décrivez en détail...">
        <span class="task-duration">${this.calculateDuration(task.timeSlot, task.endTime)}</span>
        <button type="button" class="btn-remove-item">×</button>
      </div>
    `).join('');
  }

  renderSummary() {
    const totalMinutes = this.tasks.reduce((sum, task) => {
      return sum + (task.durationMinutes || 0);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let timeStr = '';
    if (hours > 0) timeStr += `${hours}h `;
    if (minutes > 0 || hours === 0) timeStr += `${minutes}m`;

    return `Temps total cartographié : <strong>${timeStr.trim() || '0m'}</strong>`;
  }

  calculateDuration(start, end) {
    if (!start || !end) return '-';

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let minutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (minutes < 0) minutes += 24 * 60; // Gestion nuit

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  }

  getDurationMinutes(start, end) {
    if (!start || !end) return 0;

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let minutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (minutes < 0) minutes += 24 * 60;

    return minutes;
  }

  bindEvents() {
    // Bouton ajouter tâche
    const addBtn = document.getElementById('add-task-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addTask());
    }

    // Notes sur la journée
    const notesEl = document.getElementById('workdayNotes');
    if (notesEl) {
      notesEl.addEventListener('change', (e) => {
        this.wizard.updateField('workdayNotes', e.target.value);
      });
    }

    // Lier les éléments existants
    this.bindTimelineEvents();
  }

  bindTimelineEvents() {
    const container = document.getElementById('timeline-items');
    if (!container) return;

    container.querySelectorAll('.timeline-item').forEach(item => {
      this.bindItemEvents(item);
    });
  }

  bindItemEvents(item) {
    const taskId = item.dataset.taskId;
    const startInput = item.querySelector('.task-start');
    const endInput = item.querySelector('.task-end');
    const descInput = item.querySelector('.task-description');
    const durationSpan = item.querySelector('.task-duration');
    const removeBtn = item.querySelector('.btn-remove-item');

    // Mise à jour durée lors du changement d'heure
    const updateDuration = () => {
      const duration = this.calculateDuration(startInput.value, endInput.value);
      durationSpan.textContent = duration;
    };

    startInput.addEventListener('change', updateDuration);
    endInput.addEventListener('change', updateDuration);

    // Sauvegarde sur blur
    const saveTask = async () => {
      await this.saveTask(item);
    };

    startInput.addEventListener('blur', saveTask);
    endInput.addEventListener('blur', saveTask);
    descInput.addEventListener('blur', saveTask);

    // Bouton supprimer
    if (removeBtn) {
      removeBtn.addEventListener('click', async () => {
        if (taskId && taskId !== 'new') {
          await this.wizard.deleteRelatedItem('tasks', taskId);
        }
        item.remove();
        this.updateSummary();

        // Désactiver le bouton supprimer s'il ne reste qu'un élément
        const container = document.getElementById('timeline-items');
        const items = container.querySelectorAll('.timeline-item');
        if (items.length === 1) {
          items[0].querySelector('.btn-remove-item').disabled = true;
        }
      });
    }
  }

  async addTask() {
    const container = document.getElementById('timeline-items');
    if (!container) return;

    // Activer tous les boutons supprimer
    container.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.disabled = false;
    });

    // Générer un nouvel ID de tâche
    const taskId = await Helpers.generateTaskId(this.wizard.auditId);

    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.dataset.taskId = taskId;
    div.innerHTML = `
      <input type="time" class="input task-start" value="09:00">
      <input type="time" class="input task-end" value="10:00">
      <input type="text" class="input input-wide task-description" placeholder="Quelle tâche est effectuée? Décrivez en détail...">
      <span class="task-duration">1h</span>
      <button type="button" class="btn-remove-item">×</button>
    `;

    container.appendChild(div);
    this.bindItemEvents(div);

    // Focus sur la description
    div.querySelector('.task-description').focus();
  }

  async saveTask(item) {
    let taskId = item.dataset.taskId;
    const startInput = item.querySelector('.task-start');
    const endInput = item.querySelector('.task-end');
    const descInput = item.querySelector('.task-description');

    // Ignorer si vide
    if (!descInput.value.trim()) return;

    // Générer ID si nouveau
    if (taskId === 'new') {
      taskId = await Helpers.generateTaskId(this.wizard.auditId);
      item.dataset.taskId = taskId;
    }

    const task = {
      id: taskId,
      auditId: this.wizard.auditId,
      timeSlot: startInput.value,
      endTime: endInput.value,
      durationMinutes: this.getDurationMinutes(startInput.value, endInput.value),
      taskDescription: descInput.value.trim(),
      displayOrder: Array.from(item.parentElement.children).indexOf(item)
    };

    await Storage.save('tasks', task);

    // Mettre à jour le tableau local
    const index = this.wizard.tasks.findIndex(t => t.id === taskId);
    if (index >= 0) {
      this.wizard.tasks[index] = task;
    } else {
      this.wizard.tasks.push(task);
    }

    this.updateSummary();
  }

  updateSummary() {
    const container = document.getElementById('timeline-items');
    const summaryEl = document.getElementById('timeline-summary');
    if (!container || !summaryEl) return;

    let totalMinutes = 0;
    container.querySelectorAll('.timeline-item').forEach(item => {
      const start = item.querySelector('.task-start').value;
      const end = item.querySelector('.task-end').value;
      totalMinutes += this.getDurationMinutes(start, end);
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let timeStr = '';
    if (hours > 0) timeStr += `${hours}h `;
    if (minutes > 0 || hours === 0) timeStr += `${minutes}m`;

    summaryEl.innerHTML = `Temps total cartographié : <strong>${timeStr.trim() || '0m'}</strong>`;
  }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.Section2Workday = Section2Workday;
}
