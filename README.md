# 🏳️ Flagboard

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
- 🧩 Une base de données PostgreSQL bien structurée
- 🧠 Des tests, un linter et une configuration CI prêts à l’emploi
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

## 📦 Installation

```bash
git clone https://github.com/ton-user/flagboard.git
cd flagboard
npm install