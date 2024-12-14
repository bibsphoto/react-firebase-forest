import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lovable.dev';
const supabaseKey = 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Website = {
  id: string;
  url: string;
  description: string;
  status: 'up' | 'down';
  last_checked: Date;
  created_at: Date;
};