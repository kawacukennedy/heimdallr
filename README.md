# Heimdallr

> **Real-Time Geospatial Intelligence Dashboard**

A cinematic 3D geospatial intelligence dashboard that fuses live aviation telemetry, satellite tracking, CCTV feeds, and simulated urban traffic into a single high-performance web application. Named after the all-seeing Norse god.

![License](https://img.shields.io/badge/license-Proprietary-red)
![Node](https://img.shields.io/badge/node-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/typescript-5.5-blue)

---

## Architecture

```
heimdallr/
├── frontend/      # Next.js 14 + CesiumJS + TailwindCSS
├── backend/       # Node.js 20 + Fastify
└── database/      # PostgreSQL + PostGIS (Supabase)
```

| Component | Platform | Purpose |
|-----------|----------|---------|
| **Frontend** | Vercel | WebGL rendering, UI, real-time subscriptions |
| **Backend** | Render | API aggregation, CORS proxying, data broadcasting |
| **Database** | Supabase | Spatial data, config, real-time message bus |

## Tech Stack

- **Frontend**: Next.js 14, React 18, CesiumJS, Zustand, Framer Motion, TailwindCSS, lucide-react
- **Backend**: Fastify, node-cron, Axios, Zod, Pino, Prometheus
- **Database**: PostgreSQL 15 + PostGIS 3.4, Supabase Realtime
- **Shaders**: Custom GLSL (Night Vision, Thermal FLIR, CRT, Edge Detection)
- **Workers**: SGP4 satellite propagation, dead-reckoning interpolation

## Quick Start

### 1. Database
```bash
# Set up Supabase project, then run migrations:
cd database/
# Execute migrations/001_initial.sql through 007_seed.sql
```
> **Note on Production Deployment:** When deploying the backend to Render, ensure your `DATABASE_URL` points to the Supabase IPv4 Transaction Pooler (port `6543`). The backend migrator will automatically append the `?pgbouncer=true` flag.

### 2. Backend
```bash
cd backend/
cp .env.example .env    # Configure your API keys
npm install
npm run dev             # http://localhost:3001
```

### 3. Frontend
```bash
cd frontend/
cp .env.example .env    # Configure Supabase + Google Maps keys
npm install
npm run dev             # http://localhost:3000
```

## Features

- 🌍 **3D Photorealistic Globe** – Google Photorealistic 3D Tiles via CesiumJS
- ✈️ **Live Civilian Flights** – OpenSky Network real-time telemetry
- 🎯 **Military Aircraft Tracking** – ADS-B Exchange data
- 🛰️ **Satellite Visualization** – SGP4 orbit propagation from TLE data
- 📸 **CCTV Integration** – Proxied municipal camera feeds with projective texturing
- 🚗 **Road Traffic Simulation** – Particle systems along OSM road networks
- 🔭 **Custom Shaders** – Night Vision, Thermal FLIR, CRT, Edge Detection
- 🎨 **iOS 26 Glassmorphic UI** – Frosted glass panels with spring animations
- ⌨️ **Full Keyboard Control** – 16+ keyboard shortcuts
- 🔍 **Global Search** – Locations, flights, and satellites via Nominatim
- ⚡ **High Performance** – Web Workers, request render mode, frustum culling

## Environment Variables

See `frontend/.env.example` and `backend/.env.example` for all required variables.

## License

Proprietary – © 2025 KAWACU RUGIRANEZA Arnaud Kennedy
