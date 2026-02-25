-- 002_road_networks.sql
-- Road network data from OpenStreetMap Overpass API

CREATE TABLE IF NOT EXISTS road_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  way GEOMETRY(LineString, 4326) NOT NULL,
  highway_type TEXT,
  name TEXT,
  interpolated_points JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Spatial index on way geometry
CREATE INDEX idx_road_networks_way ON road_networks USING GIST (way);

-- Index on city for filtered queries
CREATE INDEX idx_road_networks_city ON road_networks (city);

-- Composite index for city + highway_type
CREATE INDEX idx_road_networks_city_type ON road_networks (city, highway_type);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE road_networks;
