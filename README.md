# Suryakiran P J — Engineering Portfolio

AI-Integrated Full Stack & Forward Deployed Engineer (Python / Django / React).

## Architecture

- **`frontend/`**: React 19 + Vite SPA with Evidence-Based Tech Matrix, Live Interactive Sandboxes (`FinSight AI`, `PayMatch AI`, `FinSim`), Under-the-Hood Architecture Inspector, `Ctrl+K` Command Palette, and static edge fallback for Vercel.
- **`backend/`**: Django REST API with signed Bearer admin authentication, SQLite/PostgreSQL (`DATABASE_URL`) persistence, deterministic Python sandbox engines, Gmail SMTP contact delivery, and Google Gemini 3.8 Flash (`google-genai` Interactions API) Jarvis agent + JD Fit Analyzer.

## Local Development

```powershell
.\start_portfolio.ps1
```

Or manually:
1. Copy `backend/.env.example` to `backend/.env` and set `GEMINI_API_KEY` (optional; falls back to grounded local mode).
2. Run Django backend: `cd backend && .\venv\Scripts\python.exe manage.py runserver`
3. Run Vite frontend: `cd frontend && npm run dev`
4. Open Private Admin Console via `Ctrl+Shift+A` or `/admin` (authenticates against Django staff users or `PORTFOLIO_ADMIN_*` env vars).

## Production Deployment

- **Frontend (Vercel `skiran.vercel.app`)**: With Vercel Project **Root Directory** set to `frontend`, `vercel.json` uses the Vite preset (`npm install`, `npm run build`, output `dist`). Set `VITE_API_BASE=https://<your-backend-host>/api` in Vercel environment variables.
- **Backend (Render / Railway / Fly.io)**: Deploy `backend/` with `pip install -r requirements-prod.txt`, start command from `backend/Procfile`, `DJANGO_DEBUG=False`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS=https://skiran.vercel.app`, `DATABASE_URL` (PostgreSQL), and `GEMINI_API_KEY`.
