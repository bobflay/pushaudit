/* ============================================
   Section 1 - Informations Générales
   Département, personne, rôle, outils
   ============================================ */

class Section1General {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
  }

  render() {
    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">1. Informations Générales</h2>
          <p class="section-description">Informations de base sur le département et la personne auditée.</p>
        </div>
        <div class="section-content">
          <div class="form-row-2col">
            <div class="form-group">
              <label class="label" for="department">Département</label>
              <select class="select" id="department">
                <option value="">Sélectionner un département...</option>
                ${CONSTANTS.departments.map(dept =>
                  `<option value="${dept}" ${this.data.department === dept ? 'selected' : ''}>${dept}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="label" for="auditDate">Date de l'Audit</label>
              <input type="date" class="input" id="auditDate"
                     value="${this.data.auditDate || new Date().toISOString().split('T')[0]}">
            </div>
          </div>

          <div class="form-row-2col">
            <div class="form-group">
              <label class="label" for="personName">Nom de la Personne Auditée</label>
              <input type="text" class="input" id="personName"
                     value="${Helpers.escapeHtml(this.data.personName || '')}"
                     placeholder="Prénom et Nom">
            </div>
            <div class="form-group">
              <label class="label" for="role">Poste / Fonction</label>
              <input type="text" class="input" id="role"
                     value="${Helpers.escapeHtml(this.data.role || '')}"
                     placeholder="ex: Comptable Senior, Responsable RH">
            </div>
          </div>

          <div class="form-row-2col">
            <div class="form-group">
              <label class="label" for="seniority">Ancienneté dans le Poste</label>
              <select class="select" id="seniority">
                <option value="">Sélectionner...</option>
                ${CONSTANTS.seniorityLevels.map(level =>
                  `<option value="${level}" ${this.data.seniority === level ? 'selected' : ''}>${level}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="label" for="teamSize">Taille de l'Équipe</label>
              <input type="number" class="input" id="teamSize"
                     value="${this.data.teamSize || ''}"
                     placeholder="Nombre de personnes dans l'équipe" min="1">
            </div>
          </div>

          <div class="form-group">
            <label class="label" for="auditors">Auditeur(s)</label>
            <input type="text" class="input" id="auditors"
                   value="${Helpers.escapeHtml(this.data.auditors || '')}"
                   placeholder="Noms des personnes réalisant l'audit">
          </div>

          <div class="form-group">
            <label class="label" for="tools">Outils & Logiciels Utilisés Quotidiennement</label>
            <p class="form-help">Listez tous les outils, logiciels et systèmes utilisés dans votre travail quotidien</p>
            <textarea class="textarea textarea-large" id="tools" rows="5"
                      placeholder="Exemples:
- SAP (gestion des commandes, facturation)
- Excel (reporting, analyses)
- Outlook (emails, calendrier)
- SharePoint (documents partagés)
- Application métier interne...

Décrivez brièvement l'usage de chaque outil.">${Helpers.escapeHtml(this.data.tools || '')}</textarea>
          </div>

          <div class="form-group">
            <label class="label" for="responsibilities">Responsabilités Principales</label>
            <p class="form-help">Décrivez en détail les principales responsabilités et missions du poste</p>
            <textarea class="textarea textarea-large" id="responsibilities" rows="6"
                      placeholder="Décrivez vos responsabilités principales:
- Gestion de...
- Suivi de...
- Validation de...
- Coordination avec...
- Reporting sur...

Soyez le plus précis possible.">${Helpers.escapeHtml(this.data.responsibilities || '')}</textarea>
          </div>

          <div class="form-group">
            <label class="label" for="additionalNotes">Notes Complémentaires</label>
            <textarea class="textarea" id="additionalNotes" rows="4"
                      placeholder="Toute information supplémentaire pertinente pour comprendre le contexte du poste...">${Helpers.escapeHtml(this.data.additionalNotes || '')}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const fields = [
      'department', 'auditDate', 'personName', 'role',
      'seniority', 'teamSize', 'auditors', 'tools', 'responsibilities', 'additionalNotes'
    ];

    fields.forEach(field => {
      const el = document.getElementById(field);
      if (el) {
        el.addEventListener('change', (e) => {
          let value = e.target.value;
          if (field === 'teamSize') {
            value = value ? parseInt(value) : null;
          }
          this.wizard.updateField(field, value);
        });
      }
    });
  }
}

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.Section1General = Section1General;
}
