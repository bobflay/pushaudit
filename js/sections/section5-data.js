/* ============================================
   Section 5 - Données & Contraintes
   Sources de données, confidentialité, systèmes
   ============================================ */

class Section5Data {
  constructor(wizard) {
    this.wizard = wizard;
    this.data = wizard.data;
  }

  render() {
    return `
      <div class="wizard-section">
        <div class="section-header">
          <h2 class="section-title">5. Données & Contraintes</h2>
          <p class="section-description">Documentez les sources de données, les systèmes et les exigences de sécurité.</p>
        </div>
        <div class="section-content">
          <!-- Sources de données principales -->
          <div class="form-group">
            <label class="label">Sources de Données Principales</label>
            <p class="form-help">D'où proviennent les données avec lesquelles vous travaillez?</p>
            <textarea class="textarea textarea-large" id="dataSources" rows="5"
                      placeholder="Exemples:
- ERP (SAP, Oracle, etc.) - précisez les modules utilisés
- Fichiers Excel - décrivez leur origine et contenu
- Emails - types de données extraites
- Formulaires papier - volume et fréquence
- API externes - lesquelles et pour quoi
- Bases de données - lesquelles

Décrivez le volume de données traité quotidiennement.">${Helpers.escapeHtml(this.data.dataSources || '')}</textarea>
          </div>

          <!-- Systèmes utilisés -->
          <div class="form-group">
            <label class="label">Systèmes & Applications Utilisés</label>
            <p class="form-help">Listez tous les logiciels, outils et systèmes utilisés dans votre travail</p>
            <textarea class="textarea textarea-large" id="systemsUsed" rows="5"
                      placeholder="Exemples:
- SAP (modules: FI, MM, SD, etc.)
- Microsoft Excel (macros? versions?)
- Outlook (emails, calendrier)
- SharePoint (documents partagés)
- Applications métier internes (noms)
- Outils de BI (Power BI, Tableau, etc.)

Précisez votre niveau de maîtrise de chaque outil.">${Helpers.escapeHtml(this.data.systemsUsed || '')}</textarea>
          </div>

          <!-- Format des données -->
          <div class="form-group">
            <label class="label">Formats de Données</label>
            <div class="checkbox-group" id="dataFormats">
              ${this.renderDataFormatCheckboxes()}
            </div>
          </div>

          <!-- Qualité des données -->
          <div class="form-group">
            <label class="label">Comment évaluez-vous la qualité des données ?</label>
            <select class="select" id="dataQuality">
              <option value="">Sélectionner une évaluation...</option>
              <option value="excellent" ${this.data.dataQuality === 'excellent' ? 'selected' : ''}>Excellente - Propres et cohérentes</option>
              <option value="good" ${this.data.dataQuality === 'good' ? 'selected' : ''}>Bonne - Généralement fiables</option>
              <option value="fair" ${this.data.dataQuality === 'fair' ? 'selected' : ''}>Moyenne - Quelques incohérences</option>
              <option value="poor" ${this.data.dataQuality === 'poor' ? 'selected' : ''}>Mauvaise - Nombreux problèmes</option>
            </select>
          </div>

          <div class="form-group">
            <label class="label">Problèmes de Qualité des Données</label>
            <textarea class="textarea textarea-large" id="dataQualityIssues" rows="4"
                      placeholder="Quels problèmes existent avec la qualité des données?

Exemples:
- Données manquantes
- Doublons
- Formats incohérents
- Données obsolètes
- Erreurs de saisie fréquentes">${Helpers.escapeHtml(this.data.dataQualityIssues || '')}</textarea>
          </div>

          <!-- Confidentialité -->
          <div class="form-group">
            <label class="label">Le travail implique-t-il des données confidentielles ?</label>
            <div class="yes-no-toggle" data-field="hasConfidentialData">
              <button type="button" class="toggle-btn ${this.data.hasConfidentialData === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasConfidentialData === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.hasConfidentialData ? '' : 'hidden'}" id="confidentialDataGroup">
            <label class="label">Niveau de Confidentialité</label>
            <select class="select" id="confidentialityLevel">
              <option value="">Sélectionner le niveau...</option>
              <option value="internal" ${this.data.confidentialityLevel === 'internal' ? 'selected' : ''}>Usage Interne Uniquement</option>
              <option value="confidential" ${this.data.confidentialityLevel === 'confidential' ? 'selected' : ''}>Confidentiel</option>
              <option value="highly-confidential" ${this.data.confidentialityLevel === 'highly-confidential' ? 'selected' : ''}>Hautement Confidentiel</option>
              <option value="restricted" ${this.data.confidentialityLevel === 'restricted' ? 'selected' : ''}>Accès Restreint</option>
            </select>
          </div>

          <!-- Données personnelles -->
          <div class="form-group">
            <label class="label">Le travail implique-t-il des données personnelles/PII ?</label>
            <div class="yes-no-toggle" data-field="hasPersonalData">
              <button type="button" class="toggle-btn ${this.data.hasPersonalData === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasPersonalData === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.hasPersonalData ? '' : 'hidden'}" id="personalDataGroup">
            <label class="label">Types de Données Personnelles</label>
            <textarea class="textarea textarea-large" id="personalDataTypes" rows="4"
                      placeholder="Exemples:
- Noms et coordonnées
- Numéros d'identification (CNI, SS, etc.)
- Informations financières
- Données de santé
- Données RH (salaires, évaluations)">${Helpers.escapeHtml(this.data.personalDataTypes || '')}</textarea>
          </div>

          <!-- Exigences réglementaires -->
          <div class="form-group">
            <label class="label">Y a-t-il des exigences réglementaires/conformité ?</label>
            <div class="yes-no-toggle" data-field="hasRegulatoryRequirements">
              <button type="button" class="toggle-btn ${this.data.hasRegulatoryRequirements === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.hasRegulatoryRequirements === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.hasRegulatoryRequirements ? '' : 'hidden'}" id="regulatoryGroup">
            <label class="label">Exigences Réglementaires</label>
            <textarea class="textarea textarea-large" id="regulatoryRequirements" rows="4"
                      placeholder="Exemples:
- RGPD (protection des données personnelles)
- SOX (Sarbanes-Oxley)
- Réglementations sectorielles
- Normes ISO
- Exigences d'audit">${Helpers.escapeHtml(this.data.regulatoryRequirements || '')}</textarea>
          </div>

          <!-- Intégrations systèmes -->
          <div class="form-group">
            <label class="label">Des intégrations entre systèmes sont-elles nécessaires ?</label>
            <div class="yes-no-toggle" data-field="needsIntegrations">
              <button type="button" class="toggle-btn ${this.data.needsIntegrations === true ? 'active' : ''}" data-value="true">Oui</button>
              <button type="button" class="toggle-btn ${this.data.needsIntegrations === false ? 'active' : ''}" data-value="false">Non</button>
            </div>
          </div>

          <div class="form-group ${this.data.needsIntegrations ? '' : 'hidden'}" id="integrationsGroup">
            <label class="label">Intégrations Souhaitées</label>
            <textarea class="textarea textarea-large" id="desiredIntegrations" rows="4"
                      placeholder="Quels systèmes devraient être connectés?

Décrivez:
- Les systèmes source et destination
- Le type de données à échanger
- La fréquence souhaitée (temps réel, batch, etc.)">${Helpers.escapeHtml(this.data.desiredIntegrations || '')}</textarea>
          </div>

          <!-- Contraintes d'accès -->
          <div class="form-group">
            <label class="label">Contraintes d'Accès ou Techniques</label>
            <textarea class="textarea textarea-xl" id="accessConstraints" rows="6"
                      placeholder="Toute limitation d'accès système, restrictions réseau, politiques IT...

Exemples:
- Accès limité à certains systèmes
- Restrictions VPN
- Politiques de sécurité strictes
- Limitations techniques (versions logicielles, etc.)
- Processus d'approbation pour nouveaux outils">${Helpers.escapeHtml(this.data.accessConstraints || '')}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  renderDataFormatCheckboxes() {
    const formats = [
      { value: 'excel', label: 'Excel/Tableurs' },
      { value: 'pdf', label: 'Documents PDF' },
      { value: 'email', label: 'Emails' },
      { value: 'database', label: 'Base de données/SQL' },
      { value: 'api', label: 'API/Services Web' },
      { value: 'paper', label: 'Papier/Scanné' },
      { value: 'images', label: 'Images' },
      { value: 'other', label: 'Autre' }
    ];

    const selected = this.data.dataFormats || [];

    return formats.map(f => `
      <label class="checkbox-label">
        <input type="checkbox" value="${f.value}"
               ${selected.includes(f.value) ? 'checked' : ''}>
        <span>${f.label}</span>
      </label>
    `).join('');
  }

  bindEvents() {
    // Inputs texte et selects
    const inputs = ['dataSources', 'systemsUsed', 'dataQuality', 'dataQualityIssues',
                    'confidentialityLevel', 'personalDataTypes', 'regulatoryRequirements',
                    'desiredIntegrations', 'accessConstraints'];

    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          this.wizard.updateField(id, e.target.value);
        });
      }
    });

    // Cases à cocher formats de données
    const formatContainer = document.getElementById('dataFormats');
    if (formatContainer) {
      formatContainer.addEventListener('change', () => {
        const checked = Array.from(formatContainer.querySelectorAll('input:checked'))
                            .map(cb => cb.value);
        this.wizard.updateField('dataFormats', checked);
      });
    }

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

  toggleConditionalGroup(field, value) {
    const groupMap = {
      'hasConfidentialData': 'confidentialDataGroup',
      'hasPersonalData': 'personalDataGroup',
      'hasRegulatoryRequirements': 'regulatoryGroup',
      'needsIntegrations': 'integrationsGroup'
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
  window.Section5Data = Section5Data;
}
