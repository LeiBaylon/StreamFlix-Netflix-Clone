import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Content = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  banner_url: string | null;
  video_url: string;
  trailer_url: string | null;
  type: 'movie' | 'series';
  year: number;
  rating: string;
  duration_minutes: number | null;
  match_score: number;
  is_featured: boolean;
  created_at: string;
};

export type Genre = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type WatchlistItem = {
  id: string;
  user_id: string;
  content_id: string;
  added_at: string;
};

export type WatchHistory = {
  id: string;
  user_id: string;
  content_id: string;
  progress_seconds: number;
  completed: boolean;
  last_watched_at: string;
};
