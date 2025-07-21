# 🏳️ Flagboard

[![CI Status](https://github.com/tomdkd/flagboard/actions/workflows/ci.yml/badge.svg)](https://github.com/ton-user/flagboard/actions/workflows/ci.yml)
[![version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./package.json)

**Flagboard** est une base de travail prête à l’emploi pour développer des applications **multi-tenant** avec :
- 🔥 Backend [Hono](https://hono.dev/) (TypeScript)
- 🐘 Base de données PostgreSQL (via Drizzle ORM)
- ⚛️ Frontend React (Vite)
- ✅ Tests unitaires avec Jest
- 🧼 Linter ESLint + Prettier
- 🚦 CI GitHub Actions (lint + tests)

---

## 🚀 Objectif

Ce projet a été conçu pour démarrer rapidement une app **multi-tenant** en isolant proprement les responsabilités :
- 🎯 Une API REST ou JSON avec logique multi-tenancy
- 🧩 Une base de données PostgreSQL
- 🧠 Des tests, un linter et une configuration CI
- 🖼️ Une UI React légère, idéale pour un dashboard ou une app SaaS

---

## 🧱 Stack technique

| Côté Backend | Côté Frontend |
|--------------|----------------|
| Hono         | React + Vite   |
| Drizzle ORM  | TypeScript     |
| PostgreSQL   |                |
| class-validator |            |

---

## 🏗 Structure multi-tenant

Ce projet repose sur une structure **multi-tenant** évolutive :

- Une **organisation** est représentée par un `Tenant`.
- Chaque `Tenant` peut avoir **plusieurs utilisateurs** (`Users`), via une relation *one-to-many*.
- Un `User` appartient **à un seul tenant** (clé étrangère `tenant_id`).
- En cas de suppression d’un `Tenant`, tous ses `Users` sont supprimés automatiquement (`ON DELETE CASCADE`).

---

## 📚 Routes

| Méthode | URL            | Description                        |
|---------|----------------|------------------------------------|
| GET     | /users         | Récupérer tous les utilisateurs    |
| GET     | /users/:id     | Récupérer un utilisateur par ID    |
| POST    | /users         | Créer un nouvel utilisateur        |
| PATCH   | /users/:id     | Mettre à jour un utilisateur       |
| DELETE  | /users/:id     | Supprimer un utilisateur           |

### 📂 Routes Tenants

| Méthode | URL         | Description                         |
|---------|-------------|-------------------------------------|
| GET     | /tenants    | Récupérer tous les tenants          |
| GET     | /tenants/:id| Récupérer un tenant par ID          |
| POST    | /tenants    | Créer un nouveau tenant             |
| PATCH   | /tenants/:id| Mettre à jour un tenant             |
| DELETE  | /tenants/:id| Supprimer un tenant                 |

## 📦 Installation

```bash
git clone https://github.com/tomdkd/flagboard.git
cd flagboard
```

Démarrez ensuite le conteneur Docker
`docker compose up -d`

Lancez les migrations
`pnpm run migration:migrate`

Et démarrez le serveur de développement : 
`pnpm run dev`

L'API expose ses endpoints sur `http://localhost:3000`