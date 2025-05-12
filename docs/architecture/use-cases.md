# Use Cases & Actors – SaaS de Gestion pour Cabinet de Kinésithérapie

### Acteurs

* Patient
* Kinésithérapeute
* Assistant
* Admin
* Comptable

---

### Module 1 : Gestion des Patients

| Use Case                   | Acteurs concernés           |
| -------------------------- | --------------------------- |
| Créer une fiche patient    | Kinésithérapeute, Assistant |
| Consulter l’historique     | Kinésithérapeute, Assistant |
| Importer documents/images  | Kinésithérapeute            |
| Ajouter des notes privées  | Kinésithérapeute            |
| Gérer les contacts urgents | Kinésithérapeute            |
| Exporter le dossier en PDF | Kinésithérapeute            |

---

### Module 2 : Gestion des Rendez-vous

| Use Case                         | Acteurs concernés                    |
| -------------------------------- | ------------------------------------ |
| Afficher le calendrier           | Kinésithérapeute, Assistant          |
| Prendre un rendez-vous en ligne  | Patient, Kinésithérapeute, Assistant |
| Bloquer des créneaux             | Kinésithérapeute                     |
| Gérer les séances (groupe/solo)  | Kinésithérapeute, Assistant          |
| Envoyer des rappels automatiques | Système (automatisé)                 |
| Gérer les annulations et reports | Assistant                            |
| Gérer la liste d’attente         | Patient, Assistant                   |

---

### Module 3 : Suivi des Séances

| Use Case                           | Acteurs concernés |
| ---------------------------------- | ----------------- |
| Enregistrer une séance             | Kinésithérapeute  |
| Documenter les exercices           | Kinésithérapeute  |
| Ajouter des photos avant/après     | Kinésithérapeute  |
| Saisir des notes de progression    | Kinésithérapeute  |
| Consulter l’historique des séances | Kinésithérapeute  |
| Planifier les séances suivantes    | Kinésithérapeute  |
| Prescrire des exercices à domicile | Kinésithérapeute  |

---

### Module 4 : Paiements et Reçus

| Use Case                                | Acteurs concernés           |
| --------------------------------------- | --------------------------- |
| Générer une facturation automatique     | Kinésithérapeute, Comptable |
| Gérer les modes de paiement             | Assistant, Comptable        |
| Éditer des reçus/factures               | Assistant, Comptable        |
| Suivre les impayés                      | Assistant, Comptable        |
| Consulter les statistiques de revenus   | Comptable                   |
| Exporter les données comptables         | Comptable                   |
| Gérer l’intégration avec les assurances | Comptable                   |

---

### Module 5 : Statistiques et Rapports

| Use Case                             | Acteurs concernés                  |
| ------------------------------------ | ---------------------------------- |
| Afficher un tableau de bord          | Kinésithérapeute, Admin, Comptable |
| Statistiques de fréquentation        | Admin                              |
| Analyse des revenus par période      | Comptable                          |
| Suivre le taux d’occupation          | Kinésithérapeute                   |
| Identifier les patients actifs       | Kinésithérapeute                   |
| Générer un rapport mensuel           | Kinésithérapeute, Admin            |
| Analyser les tendances pathologiques | Kinésithérapeute                   |

---

### Module 6 : Gestion Multi-utilisateurs

| Use Case                        | Acteurs concernés                  |
| ------------------------------- | ---------------------------------- |
| Créer des comptes               | Admin                              |
| Définir les permissions         | Admin                              |
| Partager l’agenda               | Kinésithérapeute, Assistant, Admin |
| Gérer les congés/absences       | Kinésithérapeute, Admin            |
| Consulter le journal d’activité | Admin                              |

