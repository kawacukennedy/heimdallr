-- 001_initial.sql
-- Enable required extensions and create cctv_cameras table

-- Extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

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
