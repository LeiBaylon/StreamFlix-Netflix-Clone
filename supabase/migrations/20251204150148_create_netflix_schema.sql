/*
  # Netflix Clone Database Schema

  ## Overview
  Complete database schema for a Netflix-style streaming platform with user profiles,
  content library, genres, watchlists, and viewing history.

  ## New Tables
  
  ### 1. profiles
  Extends auth.users with additional profile information
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `avatar_url` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. genres
  Categories for organizing content
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `slug` (text, unique)
  - `created_at` (timestamptz)
  
  ### 3. content
  Movies and TV shows in the platform
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `thumbnail_url` (text)
  - `banner_url` (text, for hero/featured content)
  - `video_url` (text)
  - `trailer_url` (text, optional)
  - `type` (text, 'movie' or 'series')
  - `year` (integer)
  - `rating` (text, e.g., 'PG-13')
  - `duration_minutes` (integer, for movies)
  - `match_score` (integer, 0-100, simulated match percentage)
  - `is_featured` (boolean, for hero section)
  - `created_at` (timestamptz)
  
  ### 4. content_genres
  Junction table linking content to genres (many-to-many)
  - `content_id` (uuid, references content)
  - `genre_id` (uuid, references genres)
  - Primary key on (content_id, genre_id)
  
  ### 5. watchlist
  User's saved content for later viewing
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `content_id` (uuid, references content)
  - `added_at` (timestamptz)
  - Unique constraint on (user_id, content_id)
  
  ### 6. watch_history
  Tracks user viewing progress
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `content_id` (uuid, references content)
  - `progress_seconds` (integer)
  - `completed` (boolean)
  - `last_watched_at` (timestamptz)
  - Unique constraint on (user_id, content_id)

  ## Security
  - RLS enabled on all tables
  - Users can only read their own profiles, watchlist, and watch history
  - Users can update their own profile
  - Content and genres are publicly readable
  - Only authenticated users can add to watchlist and record watch history

  ## Indexes
  - Indexes on foreign keys for performance
  - Index on content.is_featured for quick hero section queries
  - Index on watch_history.last_watched_at for "Continue Watching" feature
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create genres table
CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view genres"
  ON genres FOR SELECT
  TO authenticated
  USING (true);

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text NOT NULL,
  banner_url text,
  video_url text NOT NULL,
  trailer_url text,
  type text NOT NULL CHECK (type IN ('movie', 'series')),
  year integer NOT NULL,
  rating text NOT NULL,
  duration_minutes integer,
  match_score integer DEFAULT 85 CHECK (match_score >= 0 AND match_score <= 100),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view content"
  ON content FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_content_featured ON content(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_year ON content(year DESC);

-- Create content_genres junction table
CREATE TABLE IF NOT EXISTS content_genres (
  content_id uuid REFERENCES content ON DELETE CASCADE,
  genre_id uuid REFERENCES genres ON DELETE CASCADE,
  PRIMARY KEY (content_id, genre_id)
);

ALTER TABLE content_genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view content genres"
  ON content_genres FOR SELECT
  TO authenticated
  USING (true);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content_id uuid REFERENCES content ON DELETE CASCADE NOT NULL,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own watchlist"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_added ON watchlist(added_at DESC);

-- Create watch_history table
CREATE TABLE IF NOT EXISTS watch_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content_id uuid REFERENCES content ON DELETE CASCADE NOT NULL,
  progress_seconds integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_watched_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watch history"
  ON watch_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watch history"
  ON watch_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history"
  ON watch_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_watch_history_user ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_last_watched ON watch_history(last_watched_at DESC);

-- Insert sample genres
INSERT INTO genres (name, slug) VALUES
  ('Action', 'action'),
  ('Comedy', 'comedy'),
  ('Drama', 'drama'),
  ('Thriller', 'thriller'),
  ('Horror', 'horror'),
  ('Sci-Fi', 'sci-fi'),
  ('Romance', 'romance'),
  ('Documentary', 'documentary'),
  ('Animation', 'animation'),
  ('Crime', 'crime')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample content (using placeholder images from Pexels)
INSERT INTO content (title, description, thumbnail_url, banner_url, video_url, type, year, rating, duration_minutes, match_score, is_featured) VALUES
  (
    'The Last Mission',
    'An elite team of operatives must complete one final dangerous mission before they can retire. As tensions rise and secrets emerge, they realize nothing is what it seems.',
    'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'movie',
    2024,
    'PG-13',
    142,
    98,
    true
  ),
  (
    'City Lights',
    'A heartwarming comedy about finding love in the most unexpected places. When a small-town journalist moves to the big city, her life takes an unexpected turn.',
    'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'movie',
    2023,
    'PG',
    118,
    92,
    false
  ),
  (
    'Dark Waters',
    'In the depths of the ocean, a research team discovers something that should have remained hidden. A gripping thriller that will keep you on the edge of your seat.',
    'https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'movie',
    2024,
    'R',
    128,
    89,
    false
  ),
  (
    'Beyond Tomorrow',
    'A visionary sci-fi epic about humanity''s first colony on a distant planet. When contact with Earth is lost, they must forge their own destiny.',
    'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'series',
    2024,
    'TV-14',
    NULL,
    95,
    false
  ),
  (
    'The Detective',
    'A brilliant but troubled detective returns to solve the case that has haunted her for decades. Crime drama at its finest.',
    'https://images.pexels.com/photos/2376997/pexels-photo-2376997.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2376997/pexels-photo-2376997.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'series',
    2023,
    'TV-MA',
    NULL,
    91,
    false
  ),
  (
    'Summer Dreams',
    'A nostalgic journey through a perfect summer that changed everything. Romance and coming-of-age blend in this beautiful story.',
    'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'movie',
    2023,
    'PG-13',
    105,
    87,
    false
  ),
  (
    'Midnight Protocol',
    'When a cyber-attack threatens global security, an unlikely hacker must team up with law enforcement to stop a digital apocalypse.',
    'https://images.pexels.com/photos/2102416/pexels-photo-2102416.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2102416/pexels-photo-2102416.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'movie',
    2024,
    'PG-13',
    135,
    93,
    false
  ),
  (
    'Wild Kingdom',
    'An immersive documentary exploring the hidden lives of Africa''s most magnificent creatures. Nature like you''ve never seen before.',
    'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'series',
    2024,
    'TV-G',
    NULL,
    88,
    false
  )
ON CONFLICT DO NOTHING;

-- Link content to genres (sample data)
INSERT INTO content_genres (content_id, genre_id)
SELECT c.id, g.id FROM content c, genres g
WHERE (c.title = 'The Last Mission' AND g.slug IN ('action', 'thriller'))
   OR (c.title = 'City Lights' AND g.slug IN ('comedy', 'romance'))
   OR (c.title = 'Dark Waters' AND g.slug IN ('thriller', 'horror'))
   OR (c.title = 'Beyond Tomorrow' AND g.slug IN ('sci-fi', 'drama'))
   OR (c.title = 'The Detective' AND g.slug IN ('crime', 'drama'))
   OR (c.title = 'Summer Dreams' AND g.slug IN ('romance', 'drama'))
   OR (c.title = 'Midnight Protocol' AND g.slug IN ('action', 'thriller'))
   OR (c.title = 'Wild Kingdom' AND g.slug IN ('documentary'))
ON CONFLICT DO NOTHING;