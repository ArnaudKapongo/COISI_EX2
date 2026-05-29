# Exercice 2 — Gestion de tâches en équipe

## Objectif

Ce projet implémente une API REST simple de gestion de tâches en équipe.

L’API permet de :

* créer une tâche ;
* lister les tâches en cours ;
* marquer une tâche comme terminée ;
* consulter l’historique des tâches terminées.

Le périmètre reste volontairement centré sur les fonctionnalités demandées dans l’exercice.

---

## Stack technique

* **Backend** : NestJS + TypeScript
* **Base de données** : PostgreSQL
* **ORM** : Prisma
* **Documentation API** : Swagger / OpenAPI
* **Environnement local** : Docker Compose
* **Package manager** : pnpm

---

## Livrables de l’exercice

Les livrables demandés sont disponibles dans ce projet :

1. **Schéma d’architecture**
   Voir : [`docs/schema-architecture-exercice2.pdf`](./docs/schema-architecture-exercice2.pdf)

2. **Liste des endpoints API**
   Voir la section [Liste des endpoints API](#liste-des-endpoints-api)

3. **Schéma de base de données**
   Voir : [`docs/schema-base-de-donnees.pdf`](./docs/schema-base-de-donnees.pdf)

---

## Prérequis

Avant de lancer le projet, il faut avoir installé :

* Node.js
* pnpm
* Docker
* Docker Compose

---

## Installation

Installer les dépendances :

```bash
pnpm install
```

---

## Configuration de la base de données

Créer le fichier d’environnement à partir de l’exemple :

```bash
cp .env.example .env
```

La base PostgreSQL est lancée avec Docker Compose.

Démarrer PostgreSQL :

```bash
docker compose up -d
```

La base est exposée localement sur le port `5433`.

Exemple de variable d’environnement :

```env
DATABASE_URL="postgresql://todo_user:todo_password@127.0.0.1:5433/team_todo?schema=public"
```

---

## Migrations Prisma

Appliquer les migrations :

```bash
pnpm exec prisma migrate dev
```

---

## Génération du client Prisma

Générer le client Prisma :

```bash
pnpm exec prisma generate
```

Cette commande génère le dossier `generated/prisma`, utilisé par l’application pour accéder au client Prisma et aux enums.

---

## Seed de démonstration

Exécuter le seed :

```bash
pnpm exec prisma db seed
```

Le seed crée une équipe et un utilisateur de démonstration.

```txt
teamId:      550e8400-e29b-41d4-a716-446655440000
createdById: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
```

Ces identifiants peuvent être utilisés pour tester les endpoints.

---

## Lancer l’API

Démarrer le serveur en mode développement :

```bash
pnpm start:dev
```

L’API est disponible sur :

```txt
http://localhost:3000
```

---

## Documentation Swagger

La documentation Swagger UI est disponible à l’adresse :

```txt
http://localhost:3000/docs
```

Swagger permet de visualiser et tester directement les endpoints de l’API depuis le navigateur.

---

## Liste des endpoints API

```txt
POST   /tasks                  → Crée une nouvelle tâche
GET    /tasks                  → Liste les tâches en cours de l’équipe
PATCH  /tasks/:id/complete     → Marque une tâche comme terminée
GET    /tasks/completed        → Liste l’historique des tâches terminées
```

---

## Détail des endpoints

### `POST /tasks`

Crée une nouvelle tâche.

Exemple de body :

```json
{
  "title": "Préparer la réunion",
  "description": "Préparer les points à présenter",
  "priority": "HIGH",
  "teamId": "550e8400-e29b-41d4-a716-446655440000",
  "createdById": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

Réponse attendue :

```json
{
  "id": "090fc6c4-0e2d-4885-86d8-ec478aa32d2e",
  "teamId": "550e8400-e29b-41d4-a716-446655440000",
  "createdById": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "assignedToId": null,
  "title": "Préparer la réunion",
  "description": "Préparer les points à présenter",
  "priority": "HIGH",
  "status": "ACTIVE",
  "completedAt": null,
  "createdAt": "2026-05-27T22:32:43.308Z",
  "updatedAt": "2026-05-27T22:32:43.308Z"
}
```

Une tâche créée démarre avec le statut `ACTIVE`.

---

### `GET /tasks`

Liste les tâches en cours d’une équipe.

Exemple :

```txt
GET /tasks?teamId=550e8400-e29b-41d4-a716-446655440000
```

Réponse attendue :

```json
[
  {
    "id": "090fc6c4-0e2d-4885-86d8-ec478aa32d2e",
    "title": "Préparer la réunion",
    "priority": "HIGH",
    "status": "ACTIVE"
  }
]
```

Seules les tâches ayant le statut `ACTIVE` sont retournées.

---

### `PATCH /tasks/:id/complete`

Marque une tâche comme terminée.

Exemple :

```txt
PATCH /tasks/090fc6c4-0e2d-4885-86d8-ec478aa32d2e/complete
```

Réponse attendue :

```json
{
  "id": "090fc6c4-0e2d-4885-86d8-ec478aa32d2e",
  "title": "Préparer la réunion",
  "status": "COMPLETED",
  "completedAt": "2026-05-27T22:34:12.426Z"
}
```

Lorsqu’une tâche est terminée :

* son statut passe de `ACTIVE` à `COMPLETED` ;
* le champ `completedAt` est renseigné ;
* elle n’apparaît plus dans la liste des tâches en cours.

---

### `GET /tasks/completed`

Liste l’historique des tâches terminées d’une équipe.

Exemple :

```txt
GET /tasks/completed?teamId=550e8400-e29b-41d4-a716-446655440000
```

Réponse attendue :

```json
[
  {
    "id": "090fc6c4-0e2d-4885-86d8-ec478aa32d2e",
    "title": "Préparer la réunion",
    "priority": "HIGH",
    "status": "COMPLETED",
    "completedAt": "2026-05-27T22:34:12.426Z"
  }
]
```

Seules les tâches ayant le statut `COMPLETED` sont retournées.

---

## Règles métier principales

* Une tâche créée démarre avec le statut `ACTIVE`.
* Une tâche terminée passe au statut `COMPLETED`.
* Une tâche terminée reçoit une date `completedAt`.
* Une tâche terminée n’apparaît plus dans la liste des tâches en cours.
* Une tâche déjà terminée ne peut pas être terminée une seconde fois.
* Une priorité doit être `LOW`, `MEDIUM` ou `HIGH`.

---

## Gestion des erreurs

| Cas                 |         Code HTTP | Description                                  |
| ------------------- | ----------------: | -------------------------------------------- |
| Payload invalide    | `400 Bad Request` | Champs manquants ou invalides                |
| `teamId` invalide   | `400 Bad Request` | Le paramètre n’est pas un UUID valide        |
| Tâche inexistante   |   `404 Not Found` | La tâche demandée n’existe pas               |
| Tâche déjà terminée |    `409 Conflict` | La tâche ne peut pas être terminée deux fois |

---

## Commandes utiles

### Première installation

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm exec prisma migrate dev
pnpm exec prisma generate
pnpm exec prisma db seed
pnpm start:dev
```

### Lancement quotidien

```bash
docker compose up -d
pnpm start:dev
```

### Réinitialiser la base

```bash
pnpm exec prisma migrate reset
```

### Après modification du schema Prisma

```bash
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

### Visualiser la base avec Prisma Studio

```bash
pnpm exec prisma studio
```

---

## Notes

L’API se concentre uniquement sur le périmètre demandé :

* création d’une tâche ;
* liste des tâches en cours ;
* passage d’une tâche en terminée ;
* historique des tâches terminées.

Les routes complémentaires comme la modification, la suppression ou le détail d’une tâche ne sont pas incluses afin de rester aligné avec l’énoncé.
