# Deployment Guide

This repository contains two deployable apps:

- `backend/` — Node.js + Express API
- `Frontend/` — React + Vite frontend

## What was updated

- `Frontend/src/api/axios.js` now uses `import.meta.env.VITE_API_URL || "/api"`
- This allows the frontend to use local development API URL locally and the deployed backend URL in production

## Deployment option 1: Deploy separately on Vercel

### Backend
1. In Vercel, create a new project and select the `backend/` folder.
2. Use the existing `backend/vercel.json` config.
3. Add these required environment variables in Vercel:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GMAIL_USER`
   - `GMAIL_PASSWORD`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `FRONTEND_URL` (set to your deployed frontend URL)
4. Deploy.

### Frontend
1. In Vercel, create a new project and select the `Frontend/` folder.
2. Use the existing `Frontend/vercel.json` config.
3. Add this required environment variable in Vercel:
   - `VITE_API_URL` → your deployed backend URL + `/api`
4. Deploy.

## Deployment option 2: Deploy with Vercel CLI

From each folder run:

```bash
cd backend
vercel --prod
```

```bash
cd Frontend
vercel --prod
```

Then set environment variables in the Vercel dashboard for each project.

## Local development

- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd Frontend && npm install && npm run dev`

## Environment file templates

- Backend: use `backend/.env.example`
- Frontend: use `Frontend/.env.example`

## Notes

- The backend is already configured to skip `app.listen()` when running on Vercel.
- If you deploy the frontend first, set `FRONTEND_URL` in the backend project to the frontend deployment URL.
- If you deploy the backend first, set `VITE_API_URL` in the frontend project to the backend deployment URL.
