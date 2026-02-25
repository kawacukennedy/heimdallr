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
