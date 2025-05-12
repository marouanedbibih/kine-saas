# Documentation de la Base de Données – SaaS Kinésithérapie

## Vue d’ensemble

Cette base de données modélise les entités et relations principales nécessaires au fonctionnement d’une application SaaS destinée à gérer les opérations d’un cabinet de kinésithérapie. Elle couvre la gestion des patients, des rendez-vous, des séances, des paiements, des utilisateurs, et plus encore.

---

## Tables principales

### 1. **User**
Contient les informations de base pour tous les types d’utilisateurs.

| Champ          | Type      | Description                            |
|----------------|-----------|----------------------------------------|
| id             | UUID      | Identifiant unique de l’utilisateur    |
| email          | String    | Adresse email                          |
| password       | String    | Mot de passe (hashé)                   |
| nom            | String    | Nom de l’utilisateur                   |
| prenom         | String    | Prénom                                 |
| role           | Enum      | Rôle (PATIENT, KINESITHERAPEUTE, etc.) |
| date_creation  | DateTime  | Date de création du compte             |
| actif          | Boolean   | Statut du compte                       |

---

### 2. **Patient**
Informations spécifiques aux patients.

| Champ           | Type    | Description                        |
|-----------------|---------|------------------------------------|
| numero_patient  | String  | Référence interne patient          |
| telephone       | String  | Numéro de téléphone                |
| adresse         | String  | Adresse complète                   |
| date_naissance  | Date    | Date de naissance                  |
| contact_urgence | String  | Nom + téléphone du contact urgence |
| user_id         | FK(User)| Lien avec la table `User`          |

Relations :
- 1 patient → 1 user
- 1 patient → 1 dossier médical
- 1 patient → n rendez-vous
- 1 patient → n séances
- 1 patient → n factures

---

### 3. **Kinesitherapeute**
Profil des kinés, avec licence et spécialité.

| Champ            | Type     | Description                        |
|------------------|----------|------------------------------------|
| license_number   | String   | Numéro de licence                  |
| specialisation   | String   | Spécialité                         |
| user_id          | FK(User) | Lien avec la table `User`          |

Relations :
- 1 kiné → n rendez-vous
- 1 kiné → n séances

---

### 4. **Assistant**
Utilisateurs qui assistent un kinésithérapeute.

| Champ            | Type               | Description                        |
|------------------|--------------------|------------------------------------|
| permissions      | List<String>       | Liste des permissions              |
| kine_id          | FK(Kinesitherapeute)| Kinésithérapeute référent          |
| user_id          | FK(User)           | Hérite de User                     |

---

### 5. **Admin**
Administrateurs du système.

| Champ     | Type     | Description           |
|-----------|----------|-----------------------|
| user_id   | FK(User) | Référence dans `User` |

---

### 6. **RendezVous**
Rendez-vous planifiés entre patients et kinés.

| Champ        | Type         | Description                    |
|--------------|--------------|--------------------------------|
| id           | UUID         | Identifiant                    |
| date_heure   | DateTime     | Date et heure du RDV           |
| duree        | Integer      | Durée en minutes               |
| type         | String       | Type de RDV (éval, suivi...)   |
| statut       | String       | Statut (confirmé, annulé...)   |
| notes        | Text         | Notes complémentaires          |
| patient_id   | FK(Patient)  | Patient concerné               |
| kine_id      | FK(Kinesitherapeute) | Kiné concerné           |

---

### 7. **Seance**
Séances de rééducation.

| Champ              | Type             | Description                    |
|--------------------|------------------|--------------------------------|
| id                 | UUID             | Identifiant                    |
| date               | DateTime         | Date de la séance              |
| duree              | Integer          | Durée                          |
| notes_progression  | Text             | Suivi patient                  |
| photos             | List<String>     | URLs ou noms de fichiers       |
| patient_id         | FK(Patient)      | Patient                        |
| kine_id            | FK(Kinesitherapeute) | Kiné                        |

Relation avec `Exercice` : n:m

---

### 8. **Exercice**
Exercices prescrits.

| Champ            | Type    | Description                        |
|------------------|---------|------------------------------------|
| id               | UUID    | Identifiant                        |
| nom              | String  | Nom de l’exercice                  |
| description      | Text    | Description                        |
| type_exercice    | String  | Type (renforcement, mobilité...)   |
| repetitions      | Int     | Nombre de répétitions              |
| series           | Int     | Séries                             |
| niveau_difficulte| String  | Niveau (débutant, avancé...)       |
| image            | String  | Illustration                       |
| video            | String  | Lien vidéo                         |

---

### 9. **Facture**
Données de facturation liées au patient.

| Champ            | Type       | Description                        |
|------------------|------------|------------------------------------|
| id               | UUID       | Identifiant                        |
| numero           | String     | Référence facture                  |
| date_facture     | Date       | Date d’émission                    |
| montant_total    | Double     | Montant total                      |
| montant_paye     | Double     | Total déjà réglé                   |
| statut           | String     | Statut (payée, en attente...)      |
| patient_id       | FK(Patient)| Destinataire                       |

---

### 10. **Paiement**
Paiements associés à une facture.

| Champ            | Type        | Description                     |
|------------------|-------------|---------------------------------|
| id               | UUID        | Identifiant                     |
| montant          | Double      | Montant payé                    |
| date_paiement    | DateTime    | Date du paiement                |
| mode_paiement    | String      | Espèces, carte, etc.            |
| statut           | String      | Validé, remboursé, etc.         |
| transaction_id   | String      | ID de transaction (si existant) |
| facture_id       | FK(Facture) | Lien facture                    |

---

### 11. **DossierMedical**
Dossier de suivi complet du patient.

| Champ           | Type          | Description                    |
|-----------------|---------------|--------------------------------|
| id              | UUID          | Identifiant                    |
| patient_id      | FK(Patient)   | Propriétaire du dossier        |
| date_creation   | Date          | Création                       |
| diagnostics     | List<String>  | Diagnostics                    |
| traitements     | List<String>  | Traitements prescrits          |
| documents       | Map<String,String> | Documents scannés        |

---

### 12. **Statistique**
Données analytiques du système.

| Champ           | Type         | Description                     |
|-----------------|--------------|---------------------------------|
| id              | UUID         | Identifiant                     |
| periode_de      | Date         | Début de la période             |
| periode_a       | Date         | Fin de la période               |
| type            | String       | Type de statistique             |
| donnees         | JSON/Object  | Données agrégées (clé-valeur)   |

---

## Enums

### Role
Définit les types d'utilisateurs possibles.

- `PATIENT`
- `KINESITHERAPEUTE`
- `ASSISTANT`
- `ADMIN`

---

## Principales relations

| Relation                                 | Type     |
|------------------------------------------|----------|
| Un `User` peut être un `Patient`, `Kiné`, `Assistant`, ou `Admin` | Inheritance (composition via `user_id`) |
| Un `Patient` possède un `DossierMedical` | 1:1      |
| Un `Patient` a plusieurs `RendezVous`, `Seances`, `Factures` | 1:N |
| Un `Kinesitherapeute` dirige plusieurs `Seances` et `RendezVous` | 1:N |
| Une `Seance` contient plusieurs `Exercices` | N:M |
| Une `Facture` est liée à plusieurs `Paiements` | 1:N |
| Une `Statistique` peut regrouper plusieurs `Seances` | 1:N |

---

## Notes de conception

- Le champ `user_id` est utilisé comme clé étrangère pour représenter l’héritage métier.
- Des index seront ajoutés sur les colonnes `email`, `date_paiement`, `statut` pour optimiser les requêtes fréquentes.
- Le système peut évoluer avec l’ajout d’un module `Notification`, `Audit`, ou `Assurance`.

---

## Prêt à être implémenté dans PostgreSQL, MySQL ou autre SGBD relationnel.

