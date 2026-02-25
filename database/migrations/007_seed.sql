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
