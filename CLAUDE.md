# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hasard 2026 is a classroom question management system for tracking student responses during class Q&A sessions. Teachers can randomly select students, record responses, and view statistics. Students have a read-only view.

## Architecture (Dual: Twig legacy + React SPA)

The project has two frontends coexisting during migration:
- **Legacy Twig** (templates/) — original server-rendered pages, still functional
- **React SPA** (frontend/) — new client-side app consuming the REST API

**Backend:** PHP 8.2+ OOP with FastRoute, PDO (MySQL), session-based auth.

## Development Setup

```bash
# Backend
composer install
cp .env.example .env   # Configure DB_HOST, DB_PORT, DB_NAME, DB_LOGIN, DB_PWD
php -S localhost:8000 -t public/

# Frontend (React)
cd frontend
npm install
npm run dev     # Dev server on :5173, proxies /api to :8000
npm run build   # Builds to ../public/app/
```

## Backend API

**Two API layers exist:**
- `/api/` — Legacy AJAX endpoints (HTML + JSON mix, kept during transition)
- `/api/v1/` — New REST API (pure JSON, used by React SPA)

**Key API v1 endpoints:**
- `GET /api/v1/csrf` — Get CSRF token
- `POST /api/v1/login` / `POST /api/v1/logout` / `GET /api/v1/me` — Auth
- `POST /api/v1/classes/{id}/select` — Select a class
- `GET /api/v1/dashboard[/temps/{key}]` — Dashboard data (JSON)
- `GET /api/v1/dashboard/logs?page=N` — Paginated logs
- `GET /api/v1/student[/temps/{key}]` — Student view data
- `POST /api/v1/responses` — Record a response (requires X-CSRF-Token header)
- `GET /api/v1/random-student` — Get random student
- `GET /api/v1/chart/pie/{id}` / `GET /api/v1/chart/bar/{id}` — Chart data

**API response format:**
```json
{"success": true, "data": {...}}
{"success": false, "error": "message"}
```

**Controllers:** All extend `AbstractController` which provides:
- Twig methods: `render()`, `redirect()`, `requireAuth()`, `requireClass()`
- API methods: `jsonSuccess()`, `jsonError()`, `requireApiAuth()`, `requireApiClass()`, `getJsonBody()`
- Shared: `$this->db`, `$this->timeSlot`, `getTimeFilter()`, `calculatePercent()`

## Frontend (React SPA)

```
frontend/src/
├── api/client.js          # Fetch wrapper with CSRF handling
├── context/AuthContext.jsx # Global auth state (user, classes, selectedClass)
├── hooks/useApi.js        # Generic data fetching hook
├── pages/                 # One page per route
│   ├── LoginPage.jsx
│   ├── ChoicePage.jsx
│   ├── DashboardPage.jsx
│   ├── DashboardLogsPage.jsx
│   ├── StudentPage.jsx
│   └── StudentLogsPage.jsx
└── components/            # Reusable UI components
    ├── Navbar.jsx, ProtectedRoute.jsx
    ├── StatsCard.jsx, StudentTable.jsx
    ├── RandomStudent.jsx, ResponseButtons.jsx
    ├── PieChart.jsx, BarChart.jsx
    ├── LogsTable.jsx, Pagination.jsx
```

**Vite config:** Proxies `/api` to PHP backend in dev. Builds to `public/app/`.

**SPA fallback:** Router.php serves `public/app/index.html` for non-API 404s.

## Key Files

| File | Role |
|------|------|
| `public/index.php` | PHP entry point |
| `src/Core/Router.php` | All route definitions (Twig + API v1) |
| `src/Controller/AbstractController.php` | Base controller (Twig + API helpers) |
| `frontend/src/api/client.js` | React API client with CSRF |
| `frontend/src/context/AuthContext.jsx` | React auth state management |
| `frontend/src/App.jsx` | React Router configuration |
| `frontend/vite.config.js` | Vite dev proxy + build output |

## Conventions

- Routes use path segments, not query parameters (e.g., `/dashboard/logs` not `?logs`)
- API v1 methods are prefixed `api*()` in controllers (e.g., `apiIndex()`, `apiLogs()`)
- All API responses use `jsonSuccess()` / `jsonError()` wrappers
- CORS is configured for `localhost:5173` (Vite dev server)
- All database queries use prepared statements
- Documentation lives in `documentation/` folder
