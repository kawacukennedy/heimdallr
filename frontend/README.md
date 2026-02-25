# Heimdallr Frontend 🌐

> **Cinematic WebGL, iOS 26 UI, and Real-Time Web Workers**

The frontend of Heimdallr is an ultra-high-performance React application built on Next.js 14 and CesiumJS. It handles rendering tens of thousands of real-time geospatial entities over a 3D photorealistic globe, using Web Workers for heavy mathematical offloading and custom GLSL shaders for immersive post-processing.

---

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── app/            # Next.js 14 App Router APIs
│   ├── components/
│   │   ├── map/        # CesiumJS primitives, layers, UI shaders
│   │   ├── ui/         # Glassmorphic "iOS 26" overlay panels
│   ├── hooks/          # React hooks for state, math, and realtime
│   ├── lib/            # Deep utilities for Cesium, formatting, math
│   ├── pages/          # Next.js Pages Router (Main Application)
│   ├── shaders/        # Custom GLSL (.vert, .frag, .glsl) files
│   ├── store/          # Zustand global state management
│   ├── types/          # Strict TypeScript interfaces
│   └── workers/        # Dedicated off-thread Web Workers
```

---

## 🖥️ The Map Engine (`components/map/`)

The core of Heimdallr is the **CesiumViewer**. It strips out default Cesium UI widgets and builds a pure WebGL canvas optimized for performance.

- **`EntityLayers.tsx`**: Connects to the Supabase WebSocket channels. Retrieves live flight, satellite, and CCTV coordinates. Uses React `refs` to imperatively mutate Cesium `Entity` objects to avoid React re-rendering bottlenecks.
- **`CustomShaderManager.tsx`**: Injects raw GLSL code into the render pipeline:
  - **Night Vision / Thermal FLIR / CRT**: Applied as `Cesium.PostProcessStage` over the entire screen.
  - **Projective Texturing**: Mapped dynamically onto 3D buildings to "project" live CCTV images like a flashlight.
- **`CesiumViewer.tsx`**: Initializes the global context. Uses `Cesium.Cesium3DTileset` integrated with Google Maps API for photorealistic 3D cities.

---

## ⚡ Web Workers (`/workers/`)

To prevent the React thread from dropping frames, all heavy mathematics run in background threads:

1. **`sgp4.worker.ts`**: Converts Celestrak Two-Line Element (TLE) satellite data into XYZ geodetic coordinates 60 times a second using `satellite.js`.
2. **`deadReckoning.worker.ts`**: Interpolates the exact physical location of 10,000+ aircraft during the 15-second gap between ADS-B and OpenSky network pings. It calculates great-circle movement using velocity and heading vectors.

*Note: For Next.js/Webpack compilation to work on Vercel, the Web Workers must be initialized using `new URL('...', import.meta.url)` and standard `Array.from()` iteration over Maps.*

---

## 💧 Styling and UI (`components/ui/`)

The UI follows an **"iOS 26"** fictional design language heavily reliant on glassmorphism.
- Powered by TailwindCSS and the `ios26.css` custom tokens.
- **`GlassPanel.tsx`**: Reusable component providing heavy backdrop blur, subtle white borders, and spring-based drop shadows.
- Framer Motion is used for 60fps buttery smooth modal slide-ins and panel resizing.
- Zustand (`store/`) acts as the state machine separating the React UI state from the mutable Cesium Map state.

---

## 🔌 Realtime WebSockets (`lib/realtime/`)

The application establishes a continuous `WebSocket` connection to Supabase on mount. Using the `@supabase/supabase-js` Realtime client:
1. Listens for Postgres Changes (e.g., a new CCTV camera added to the DB).
2. Listens for Broadcast Channels (`flights:civilian` and `flights:military`).
3. Hands off the event payload to the React `useLayoutEffect` hooks to push coordinates to the `deadReckoning.worker.ts`.

---

## 🚀 Development Setup

Make sure you have an active Supabase project and Google Maps API token.

```bash
# Provide environment variables
cp .env.example .env.local

# Install dependencies (Cesium requires special webpack configuration, this takes a moment)
npm install

# Start development server
npm run dev
```

### Next.js API Routes (Proxy)
The `src/app/api/` folder contains serverless proxy routes for `roads`, `cctv`, and `satellites/tle`. These proxy calls back to the Render Backend to avoid CORS errors when fetching data from the client side.
