-- 007_seed.sql
-- Sample data for development and testing

-- Sample CCTV cameras (using placeholder images for demo - replace with actual camera URLs)
INSERT INTO cctv_cameras (location, source_url, heading, pitch, city, label) VALUES
  (ST_SetSRID(ST_MakePoint(-97.7431, 30.2672), 4326), 'https://picsum.photos/640/480?random=1', 180, -15, 'Austin', 'Congress Ave & 6th St'),
  (ST_SetSRID(ST_MakePoint(-97.7500, 30.2650), 4326), 'https://picsum.photos/640/480?random=2', 90, -10, 'Austin', 'Lamar Blvd & 5th St'),
  (ST_SetSRID(ST_MakePoint(-97.7380, 30.2700), 4326), 'https://picsum.photos/640/480?random=3', 270, -12, 'Austin', 'Red River & 7th St'),
  (ST_SetSRID(ST_MakePoint(-97.7210, 30.2840), 4326), 'https://picsum.photos/640/480?random=4', 0, -20, 'Austin', 'I-35 & 51st St'),
  (ST_SetSRID(ST_MakePoint(-97.7550, 30.2550), 4326), 'https://picsum.photos/640/480?random=5', 180, -10, 'Austin', 'Mopac & 2222'),
  -- New York
  (ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326), 'https://picsum.photos/640/480?random=10', 0, -20, 'New York', 'Times Square'),
  (ST_SetSRID(ST_MakePoint(-73.9712, 40.7831), 4326), 'https://picsum.photos/640/480?random=11', 180, -15, 'New York', 'Central Park West'),
  (ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326), 'https://picsum.photos/640/480?random=12', 90, -10, 'New York', 'Wall Street'),
  -- London
  (ST_SetSRID(ST_MakePoint(-0.1276, 51.5074), 4326), 'https://picsum.photos/640/480?random=20', 90, -10, 'London', 'Trafalgar Square'),
  (ST_SetSRID(ST_MakePoint(-0.0762, 51.5081), 4326), 'https://picsum.photos/640/480?random=21', 270, -18, 'London', 'Tower Bridge'),
  (ST_SetSRID(ST_MakePoint(-0.1426, 51.5014), 4326), 'https://picsum.photos/640/480?random=22', 0, -15, 'London', 'Buckingham Palace'),
  -- Tokyo
  (ST_SetSRID(ST_MakePoint(139.7020, 35.6595), 4326), 'https://picsum.photos/640/480?random=30', 0, -10, 'Tokyo', 'Shibuya Crossing'),
  (ST_SetSRID(ST_MakePoint(139.7671, 35.6812), 4326), 'https://picsum.photos/640/480?random=31', 180, -12, 'Tokyo', 'Tokyo Station'),
  (ST_SetSRID(ST_MakePoint(139.7968, 35.7149), 4326), 'https://picsum.photos/640/480?random=32', 270, -15, 'Tokyo', 'Asakusa'),
  -- Paris
  (ST_SetSRID(ST_MakePoint(2.2945, 48.8584), 4326), 'https://picsum.photos/640/480?random=40', 0, -10, 'Paris', 'Eiffel Tower'),
  (ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326), 'https://picsum.photos/640/480?random=41', 90, -15, 'Paris', 'Notre Dame');
