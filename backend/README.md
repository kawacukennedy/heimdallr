# Heimdallr Backend ⚙️

> **Fastify Proxies, Polling Cron Jobs, and Realtime Broadcasts**

The Heimdallr backend is a Node.js microservice running on Fastify. It acts as the orchestration layer between external third-party data providers (OpenSky, ADS-B Exchange, Celestrak) and the Supabase database. It normalizes messy third-party APIs into clean JSON, and pushes payloads out to the frontend via Supabase Realtime Channels.

---

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/       # Environment variables, Supabase client auth
│   ├── db/           # Initial database seeding scripts
│   ├── jobs/         # node-cron scheduled pollers
│   ├── routes/       # Fastify REST endpoints proxying external APIs
│   ├── services/     # External API connectors and data normalizers
│   └── index.ts      # Fastify server entrypoint
```

---

## 🔄 Cron Jobs & Real-Time Extrapolators (`jobs/`)

The backend does not store telemetry directly in the database to prevent database bloat. Instead, it uses `node-cron` to continuously fetch telemetry into server memory and broadcast it instantly via WebSockets to the frontend.

- **`opensky.ts`**: Polls the OpenSky Network every 15 seconds. Given API rate limits, this script falls back to scraping `api.adsb.lol` if the OpenSky servers block the IP. It transforms the arrays into `FlightData` interface and broadcasts it over the `flights:civilian` Supabase channel.
- **`adsbx.ts`**: Polls the ADS-B Exchange for military hex codes every 15 seconds. Broadcasts these specific aircraft over the `flights:military` channel.
- **`celestrak.ts`**: Runs once every 12 hours. Downloads the massive `.txt` file of live Two-Line Elements (TLEs) for all operational satellites via Celestrak, converts them into JSON, and caches them in the `tle_snapshots` table for frontend retrieval.

---

## 🌐 Fastify API Routes (`routes/`)

To prevent CORS issues and IP blocks on the client browser, the Fastify server proxies several services that the Next.js API endpoints call:

- **`/api/cctv`**: Queries the Supabase PostGIS `location` column to retrieve live camera nodes.
- **`/api/satellites/tle`**: Fetches the latest cached TLE payload.
- **`/api/roads/:city`**: Dynamically builds an Overpass API query for OpenStreetMap, downloading entire road networks as GeoJSON coordinates for the frontend Particle Systems.

*Security*: The backend binds to `0.0.0.0` for Docker/Render deployments and handles all CORS policies internally via the `@fastify/cors` plugin.

---

## 🗄️ Database Syncing (`db/`)

The `./src/db/seed.ts` script runs conditionally on startup if the database needs initializing. 
For production deployments on hosting providers like **Render** that do not support IPv6 natively, the script forces connection pooling via PostgreSQL port `6543` using the `?pgbouncer=true` query parameter natively required by Supabase's transaction poolers.

---

## 🚀 Development Setup

We recommend running the backend locally alongside the Next.js frontend to verify real-time data flows.

```bash
# Provide environment variables
cp .env.example .env

# Install backend dependencies
npm install

# Start the Node.js Fastify server
npm run dev
```

### Environment Notes
You must explicitly provide your `SUPABASE_SERVICE_ROLE_KEY` in the `.env` file since the cron jobs bypass Row Level Security (RLS) policies to push data to the database and broadcast channels. Never expose this key to the frontend.
