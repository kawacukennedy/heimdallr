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
