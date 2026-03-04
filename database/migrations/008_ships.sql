-- 008_ships.sql
-- Maritime ship tracking data from AIS (Automatic Identification System)

CREATE TABLE IF NOT EXISTS ships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mmsi TEXT UNIQUE NOT NULL,
  name TEXT,
  ship_type TEXT,
  lat DOUBLE PRECISION NOT NULL DEFAULT 0,
  lon DOUBLE PRECISION NOT NULL DEFAULT 0,
  heading DOUBLE PRECISION DEFAULT 0,
  speed DOUBLE PRECISION DEFAULT 0,
  course DOUBLE PRECISION DEFAULT 0,
  destination TEXT,
  eta TEXT,
  flag TEXT,
  length DOUBLE PRECISION DEFAULT 0,
  width DOUBLE PRECISION DEFAULT 0,
  draught DOUBLE PRECISION DEFAULT 0,
  ais_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_ships_mmsi ON ships (mmsi);
CREATE INDEX idx_ships_location ON ships (lat, lon);
CREATE INDEX idx_ships_updated_at ON ships (updated_at DESC);

-- Auto-update updated_at
CREATE TRIGGER update_ships_updated_at
  BEFORE UPDATE ON ships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE ships;

-- RLS
ALTER TABLE ships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ships_public_read"
  ON ships FOR SELECT
  TO public
  USING (true);

CREATE POLICY "ships_service_insert"
  ON ships FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "ships_service_update"
  ON ships FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "ships_service_delete"
  ON ships FOR DELETE
  TO service_role
  USING (true);
