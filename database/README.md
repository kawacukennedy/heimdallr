# Heimdallr – Database

PostgreSQL 15 + PostGIS 3.4 hosted on **Supabase**.

## Setup

1. Create a new Supabase project
2. Run migrations in order:

```bash
# Via Supabase CLI
supabase db push

# Or manually via SQL Editor in Supabase Dashboard
# Execute each file in migrations/ in numerical order
```

3. Enable Realtime for broadcast channels via the Supabase Dashboard:
   - `flights:civilian` (broadcast)
   - `flights:military` (broadcast)

## Tables

| Table | Purpose | Realtime |
|-------|---------|----------|
| `cctv_cameras` | Municipal CCTV camera locations & metadata | ✅ postgres_changes |
| `road_networks` | OSM road geometries for particle traffic | ✅ postgres_changes |
| `tle_snapshots` | Daily satellite TLE data from Celestrak | ❌ |
| `profiles` | User preferences, bookmarks, settings | ✅ postgres_changes |
| `analytics_events` | Usage analytics | ❌ |

## Extensions

- `postgis` – Spatial data types and functions
- `uuid-ossp` – UUID generation
- `pgcrypto` – Cryptographic functions
- `btree_gin` – GIN index support for composite indexes
