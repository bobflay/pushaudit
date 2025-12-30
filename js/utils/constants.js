/* ============================================
   PushAudit - Constantes
   Valeurs de référence et configuration
   ============================================ */

const CONSTANTS = {
  // Départements
  departments: [
    'Finance',
    'Ressources Humaines',
    'Informatique / IT',
    'Opérations',
    'Commercial / Ventes',
    'Marketing',
    'Juridique',
    'Service Client',
    'R&D',
    'Achats',
    'Supply Chain / Logistique',
    'Qualité',
    'Production',
    'Administration',
    'Direction Générale'
  ],

  // Niveaux d'ancienneté
  seniorityLevels: [
    'Junior (0-2 ans)',
    'Confirmé (2-5 ans)',
    'Senior (5-10 ans)',
    'Expert (10+ ans)',
    'Chef d\'équipe',
    'Manager',
    'Directeur',
    'Direction Générale'
  ],

  // Complexité des décisions
  decisionComplexity: ['Faible', 'Moyenne', 'Élevée'],

  // Priorité métier
  businessPriority: ['Faible', 'Moyenne', 'Élevée'],

  // Horizon temporel
  timeframe: ['Quick Win', 'Moyen terme', 'Long terme'],

  // Niveau d'effort
  effortLevel: ['Faible', 'Moyen', 'Élevé'],

  // Catégories de tâches
  taskCategories: [
    'Administratif',
    'Analytique',
    'Communication',
    'Traitement',
    'Prise de décision',
    'Revue / Validation',
    'Saisie de données',
    'Reporting',
    'Coordination'
  ],

  // Valeurs de statut
  statusValues: ['brouillon', 'validé'],

  // Définition des sections
  sections: [
    { id: 1, name: 'Informations Générales', description: 'Informations de base sur l\'audit et la personne auditée' },
    { id: 2, name: 'Journée Type', description: 'Cartographie des tâches et activités quotidiennes' },
    { id: 3, name: 'Cartographie des Processus', description: 'Documentation des processus clés étape par étape' },
    { id: 4, name: 'Charge de Travail & Frictions', description: 'Quantification de la charge et identification des points de friction' },
    { id: 5, name: 'Données & Contraintes', description: 'Sources de données, sensibilité et contraintes' },
    { id: 6, name: 'Potentiel d\'Automatisation IA', description: 'Perspective métier sur les possibilités d\'automatisation' },
    { id: 7, name: 'Impact Métier & ROI', description: 'Estimation de la valeur métier de l\'automatisation' },
    { id: 8, name: 'Cas d\'Usage Département', description: 'Workflows spécifiques au département' },
    { id: 9, name: 'Opportunités IA', description: 'Synthèse des opportunités d\'automatisation identifiées' },
    { id: 10, name: 'Validation', description: 'Revue et finalisation de l\'audit' }
  ]
};

// Rendre disponible globalement
if (typeof window !== 'undefined') {
  window.CONSTANTS = CONSTANTS;
}
