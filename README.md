# MERN Pharmacy Boilerplate

## Prerequisites
- Node.js (>=18)
- Docker & docker-compose (recommended)

## Local with Docker
1. Copy `.env.example` to `.env` and edit as needed.
2. In `backend/` run: `docker-compose up --build`
3. Backend: http://localhost:5000
4. Frontend: if using separate dev server, run `npm start` in frontend.

## Local without Docker
- Backend:
  - cd backend
  - npm install
  - copy `.env.example` to `.env` and set values
  - npm run dev

- Frontend:
  - cd frontend
  - npm install
  - npm start

## Notes
- Default registration is open for convenience. In production restrict user creation to admins.
- Seed an admin user or create one via `/api/auth/register` then change role.
