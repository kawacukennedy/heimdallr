# Heimdallr 👁️

> **The All-Seeing Real-Time Geospatial Intelligence Dashboard**

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.0-blue?logo=react)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Fastify](https://img.shields.io/badge/Fastify-4-black?logo=fastify)
![Cesium](https://img.shields.io/badge/CesiumJS-3D-blue?logo=cesium)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)

Heimdallr is an ultra-high-performance, cinematic 3D geospatial intelligence dashboard. Named after the all-seeing Norse god, it fuses live aviation telemetry, real-time satellite orbital propagation, municipal CCTV camera feeds, and simulated traffic into a seamless, photorealistic global picture. 

Built with WebGL, Web Workers, and state-of-the-art web architectures, Heimdallr handles tens of thousands of real-time entities effortlessly in the browser.

---

## 🌟 Key Features

### 🌍 Global Photorealistic 3D Rendering
- **Google Photorealistic 3D Tiles**: Render the entire globe with sub-meter 3D meshes natively in CesiumJS.
- **Topographic Terrain**: Native integration with depth-tested topography so valleys and mountains obstruct entities realistically.
- **Custom Post-Processing**: Apply immersive, cinematic shaders at runtime:
  - 🌙 **Night Vision**: Phosphor green tint with film grain.
  - 🌡️ **Thermal (FLIR)**: Ironbow temperature heatmaps parsing luminance.
  - 📺 **CRT Monitor**: Retro scanlines and chromatic aberration.
  - 🧊 **Edge Detection**: Matrix-style wireframe extrusion.

### ✈️ Live Global Aviation
- **Civilian Aircraft**: Tracks 10,000+ commercial flights in real-time using OpenSky and ADSB.lol APIs.
- **Military Aircraft**: Dedicated ADS-B Exchange pipelines for tracking defense assets with specific 3D models (F-16s, Su-57s).
- **Dead-Reckoning Extrapolation**: Web Workers compute 60fps velocity-based interpolation so aircraft glide smoothly across the map between 15-second data pings.

### 🛰️ Orbital Mechanics (SGP4)
- Parses bulk TLE (Two-Line Element) data from Celestrak.
- Uses a dedicated Web Worker to run SGP4 orbital propagation algorithms natively in JavaScript.
- Projects live satellite positions over the Earth without lagging the main UI thread.

### 📹 Edge-Proxied CCTV & Traffic Particles
- Maps live municipal CCTV cameras, proxying images securely through the backend.
- Projects live traffic flows using Cesium Particle Systems mapped onto OpenStreetMap road networks.

### 🎨 Next-Generation UI
- **iOS 26 "Glassmorphism" Design**: Ultra-heavy backdrop blurs, subtle borders, and spring-based animations.
- **Global Search Engine**: Instantly fly the camera to cities, flights, or satellites.

---

## 🏗️ Architecture

Heimdallr follows an edge-optimized microservice architecture:

| Tier | Stack | Responsibility | Deployment |
|---|---|---|---|
| **Frontend** | React, Next.js 14, CesiumJS, TailwindCSS, Web Workers | Map rendering, spatial extrapolation, shader pipelines, UI/UX | Vercel Edge |
| **Backend** | Node.js 20, Fastify, Pino | Rate-limited Rest APIs, Cron job scheduling, Real-time broadcasting | Render / Docker |
| **Database** | Supabase, PostgreSQL 15, PostGIS, Realtime | High-throughput broadcast WebSockets, geospatial queries | Supabase |

---

## 🚀 Getting Started

Heimdallr is designed to be fully open-source and deployable by anyone. 

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com/) Account (Free tier works perfectly)
- A [Google Maps API Key](https://developers.google.com/maps/documentation/tile/3d-tiles) (For Photorealistic 3D Tiles)
- OpenSky/Celestrak API access (Optional, defaults to free tiers)

### 1. Database Setup
1. Create a new Supabase project.
2. Open the SQL Editor and run the migrations found in the `database/` folder sequentially (`001_initial.sql` to `007_seed.sql`). Or run the consolidated `database/full_migration.sql`.
3. Enable Realtime on the Supabase dashboard for the `cctv_cameras` and `tle_snapshots` tables.

### 2. Backend Setup
The backend orchestrates the real-time cron jobs and proxies external APIs.

```bash
cd backend
cp .env.example .env
npm install
npm run build
npm start
```
*Note: Make sure your `.env` contains your `DATABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.*

### 3. Frontend Setup
The Next.js framework serves the UI and connects to both the backend APIs and Supabase WebSockets.

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
*Note: Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.*

Open `http://localhost:3000` to view the dashboard.

---

## 📚 Documentation Handbooks

For deep dives into the intricate systems powering Heimdallr, read the dedicated module documentation:

- 🖥️ **[Frontend Architecture & Map Rendering](./frontend/README.md)**: Explore the Web Worker IPC pipelines, CesiumJS rendering optimizations, and Custom Shaders.
- ⚙️ **[Backend Systems & Extrapolators](./backend/README.md)**: Explore the Fastify proxy, cron scheduling architecture, and Supabase integration.

---

## 🤝 Contributing

We welcome contributions from the open-source community! Whether you're a WebGL shade wizard, a backend systems engineer, or a data scientist interested in orbital mechanics, there's a place for you here.

Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started on submitting pull requests.

---

## 📄 License

Heimdallr is released under the MIT License. See [LICENSE](LICENSE) for details.

*Powered by CesiumJS, Supabase, and Next.js.*
