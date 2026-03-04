-- 010_gps_jamming_zones.sql
-- GPS jamming/spoofing zones derived from ADS-B NIC/NACp analysis

CREATE TABLE IF NOT EXISTS gps_jamming_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounds JSONB NOT NULL,
  severity DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (severity >= 0 AND severity <= 1),
  affected_aircraft INTEGER NOT NULL DEFAULT 0,
  avg_nacp DOUBLE PRECISION NOT NULL DEFAULT 0,
  avg_nic DOUBLE PRECISION NOT NULL DEFAULT 0,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_jamming_active ON gps_jamming_zones (active) WHERE active = true;
CREATE INDEX idx_jamming_detected_at ON gps_jamming_zones (detected_at DESC);
CREATE INDEX idx_jamming_expires_at ON gps_jamming_zones (expires_at) WHERE active = true;

-- Auto-update updated_at
CREATE TRIGGER update_gps_jamming_updated_at
  BEFORE UPDATE ON gps_jamming_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE gps_jamming_zones;

-- RLS
ALTER TABLE gps_jamming_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jamming_public_read"
  ON gps_jamming_zones FOR SELECT
  TO public
  USING (true);

CREATE POLICY "jamming_service_insert"
  ON gps_jamming_zones FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "jamming_service_update"
  ON gps_jamming_zones FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "jamming_service_delete"
  ON gps_jamming_zones FOR DELETE
  TO service_role
  USING (true);
