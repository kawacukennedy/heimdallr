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
CREATE INDEX idx_analytics_type_time ON analytics_events USING btree_gin (event_type, created_at);
