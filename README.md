# Cinescope (moovie_app)

Application streaming-like fullstack (frontend React + backend NestJS) pour explorer films, series et animes avec une UI moderne inspiree des plateformes VOD.

## Ce que j'ai fait

- Rebrand complet en **Cinescope**.
- Refonte UI globale (home, details, catalogues, footer, cards hover, top sections).
- Header/navigation enrichis: Accueil, Catalogues, Films, Series, Animes, Watchlist.
- **Top films** et **top series** integres dans la Home (sections dediees).
- Page **Catalogues** rework:
  - filtres categories (all/movie/tv/anime),
  - tri (all/recent/rating),
  - filtre provider (Netflix, Prime Video, Apple TV+, Disney+, Max),
  - recherche sur place,
  - affichage des resultats sans changer de page.
- Classement visuel style "Top" (numerotation) dans Catalogues pour Films/Series/Animes.
- Classement "global" base sur TMDB (`vote_count.desc`) plutot que simple tendance hebdo.
- Gestion detail TV: saisons/episodes, dropdown saison, UX nettoyee.
- Hover cards enrichies: infos, metadata, actions watchlist.
- Backend NestJS + Prisma connecte au frontend:
  - auth JWT + refresh,
  - profils utilisateur,
  - my-list/watchlist,
  - historique/continue watching,
  - interactions & recommandations.

## Stack

- Frontend: React 18, TypeScript, Vite, Tailwind, Swiper, RTK Query, Axios.
- Backend: NestJS 11, Prisma, PostgreSQL, JWT.
- Data externe: TMDB API.

## Prerequis

- Node.js 18+
- npm
- PostgreSQL local
- Cle TMDB API

## Installation

```bash
git clone https://github.com/mohfofana/moovie_app.git
cd moovie_app
npm install
cd server
npm install
```

## Configuration des variables d'environnement

### Frontend (`.env` a la racine)

```env
VITE_API_KEY=your_tmdb_api_key
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_API_URL=http://localhost:3000/api
```

### Backend (`server/.env`)

Copier `server/.env.example` puis remplir:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tmovies
JWT_SECRET=replace-with-secure-value
JWT_REFRESH_SECRET=replace-with-secure-refresh-value
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_BASE_URL=https://api.themoviedb.org/3
```

## Demarrage

### 1) Base de donnees + backend

```bash
cd server
npm run prisma:migrate
npm run prisma:generate
npm run start:dev
```

### 2) Frontend

```bash
# a la racine du projet
npm run dev
```

## Scripts utiles

### Frontend

- `npm run dev` : lancer le front
- `npm run build` : build production
- `npm run preview` : previsualiser le build

### Backend

- `npm run start:dev` : lancer l'API en dev
- `npm run build` : build backend
- `npm run prisma:migrate` : migrations Prisma
- `npm run prisma:generate` : regen client Prisma
- `npm run prisma:studio` : interface Prisma Studio

## Endpoints backend (principaux)

- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/me`
- Profils: `/api/profiles` (GET/POST/PATCH/DELETE)
- Titres: `/api/titles/trending`, `/api/titles/search`, `/api/titles/:tmdbId`
- Engagement: `/api/my-list`, `/api/watch/continue`, `/api/watch/progress`, `/api/interactions`, `/api/recommendations`

## Notes

- L'app utilise TMDB pour les metadonnees (titres, posters, providers, saisons/episodes).
- Les tops providers peuvent etre configures en logique hebdo (rotation) selon les sections.

---

Projet personnalise et maintenu par **Moh Fofana**.
