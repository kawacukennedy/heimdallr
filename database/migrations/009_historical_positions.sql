-- 009_historical_positions.sql
-- Historical position data for 4D playback via CZML

CREATE TABLE IF NOT EXISTS historical_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('flight', 'military', 'ship', 'satellite')),
  entity_id TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  alt DOUBLE PRECISION NOT NULL DEFAULT 0,
  heading DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  metadata JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for time-range queries
CREATE INDEX idx_historical_recorded_at ON historical_positions (recorded_at DESC);
CREATE INDEX idx_historical_entity_type ON historical_positions (entity_type, recorded_at);
CREATE INDEX idx_historical_entity_id ON historical_positions (entity_id, recorded_at);

-- Composite index for CZML compilation
CREATE INDEX idx_historical_type_time ON historical_positions (entity_type, recorded_at, entity_id);

-- Partitioning hint
COMMENT ON TABLE historical_positions IS 'Stores periodic position snapshots for 4D CZML playback. Auto-cleaned to 24h. Consider partitioning by date for production.';

-- RLS
ALTER TABLE historical_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "historical_public_read"
  ON historical_positions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "historical_service_insert"
  ON historical_positions FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "historical_service_delete"
  ON historical_positions FOR DELETE
  TO service_role
  USING (true);
