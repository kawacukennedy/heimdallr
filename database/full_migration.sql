-- 001_initial.sql
-- Enable required extensions and create cctv_cameras table

-- Extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CCTV Cameras table
CREATE TABLE IF NOT EXISTS cctv_cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location GEOGRAPHY(Point, 4326) NOT NULL,
  source_url TEXT NOT NULL,
  heading FLOAT NOT NULL DEFAULT 0,
  pitch FLOAT NOT NULL DEFAULT 0,
  city TEXT,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Spatial index on location
CREATE INDEX idx_cctv_cameras_location ON cctv_cameras USING GIST (location);

-- Index on created_at for time-based queries
CREATE INDEX idx_cctv_cameras_created_at ON cctv_cameras (created_at);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cctv_cameras_updated_at
  BEFORE UPDATE ON cctv_cameras
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE cctv_cameras;
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
-- 003_tle_snapshots.sql
-- Satellite TLE (Two-Line Element) data from Celestrak

CREATE TABLE IF NOT EXISTS tle_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tle_data JSONB NOT NULL,
  satellite_count INTEGER GENERATED ALWAYS AS (jsonb_array_length(tle_data)) STORED
);

-- Index on fetched_at for latest snapshot retrieval
CREATE INDEX idx_tle_snapshots_fetched_at ON tle_snapshots (fetched_at DESC);

-- Partition hint: for production, partition by date range
COMMENT ON TABLE tle_snapshots IS 'Stores daily TLE snapshots from Celestrak. Consider partitioning by fetched_at for large datasets.';
-- 004_profiles.sql
-- User profiles linked to Supabase Auth

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  favorite_layers TEXT[] DEFAULT ARRAY['civilian', 'military', 'satellites', 'traffic'],
  default_shader TEXT DEFAULT 'standard',
  bookmarks JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for user-specific sync
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
-- 005_analytics.sql
-- Analytics events for usage tracking

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for event type filtering
CREATE INDEX idx_analytics_event_type ON analytics_events (event_type);

-- Index for time-range queries
CREATE INDEX idx_analytics_created_at ON analytics_events (created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_analytics_type_time ON analytics_events (event_type, created_at);
-- 006_rls_policies.sql
-- Row Level Security policies for all tables

-- Enable RLS on all tables
ALTER TABLE cctv_cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE road_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tle_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- cctv_cameras: Public read, system write
-- ==========================================
CREATE POLICY "cctv_cameras_public_read"
  ON cctv_cameras FOR SELECT
  TO public
  USING (true);

CREATE POLICY "cctv_cameras_service_insert"
  ON cctv_cameras FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "cctv_cameras_service_update"
  ON cctv_cameras FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "cctv_cameras_service_delete"
  ON cctv_cameras FOR DELETE
  TO service_role
  USING (true);

-- ==========================================
-- road_networks: Public read, system write
-- ==========================================
CREATE POLICY "road_networks_public_read"
  ON road_networks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "road_networks_service_write"
  ON road_networks FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "road_networks_service_update"
  ON road_networks FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "road_networks_service_delete"
  ON road_networks FOR DELETE
  TO service_role
  USING (true);

-- ==========================================
-- tle_snapshots: Public read, system write
-- ==========================================
CREATE POLICY "tle_snapshots_public_read"
  ON tle_snapshots FOR SELECT
  TO public
  USING (true);

CREATE POLICY "tle_snapshots_service_insert"
  ON tle_snapshots FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ==========================================
-- profiles: Users can only read/update own
-- ==========================================
CREATE POLICY "profiles_read_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- analytics_events: Insert via service role only
-- ==========================================
CREATE POLICY "analytics_service_insert"
  ON analytics_events FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "analytics_service_read"
  ON analytics_events FOR SELECT
  TO service_role
  USING (true);
-- 007_seed.sql
-- Sample data for development and testing

-- Sample CCTV cameras (Austin, TX traffic cameras)
INSERT INTO cctv_cameras (location, source_url, heading, pitch, city, label) VALUES
  (ST_SetSRID(ST_MakePoint(-97.7431, 30.2672), 4326), 'http://www.austintexas.gov/camera1.jpg', 180, -15, 'Austin', 'Congress Ave & 6th St'),
  (ST_SetSRID(ST_MakePoint(-97.7500, 30.2650), 4326), 'http://www.austintexas.gov/camera2.jpg', 90, -10, 'Austin', 'Lamar Blvd & 5th St'),
  (ST_SetSRID(ST_MakePoint(-97.7380, 30.2700), 4326), 'http://www.austintexas.gov/camera3.jpg', 270, -12, 'Austin', 'Red River & 7th St'),
  -- New York
  (ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326), 'https://webcam.example.com/nyc1.jpg', 0, -20, 'New York', 'Times Square'),
  (ST_SetSRID(ST_MakePoint(-73.9712, 40.7831), 4326), 'https://webcam.example.com/nyc2.jpg', 180, -15, 'New York', 'Central Park West'),
  -- London
  (ST_SetSRID(ST_MakePoint(-0.1276, 51.5074), 4326), 'https://webcam.example.com/london1.jpg', 90, -10, 'London', 'Trafalgar Square'),
  (ST_SetSRID(ST_MakePoint(-0.0762, 51.5081), 4326), 'https://webcam.example.com/london2.jpg', 270, -18, 'London', 'Tower Bridge'),
  -- Tokyo
  (ST_SetSRID(ST_MakePoint(139.7020, 35.6595), 4326), 'https://webcam.example.com/tokyo1.jpg', 0, -10, 'Tokyo', 'Shibuya Crossing'),
  (ST_SetSRID(ST_MakePoint(139.7671, 35.6812), 4326), 'https://webcam.example.com/tokyo2.jpg', 180, -12, 'Tokyo', 'Tokyo Station');
