import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Website = {
  id: string;
  url: string;
  description: string;
  status: 'up' | 'down';
  last_checked: Date;
  created_at: Date;
};