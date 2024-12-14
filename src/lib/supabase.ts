import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ddbudopwefbhjrdqssma.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnVkb3B3ZWZiaGpyZHFzc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxNDMwODMsImV4cCI6MjA0OTcxOTA4M30.4pwr-xRa5A35tAn2jUky1tEsPhZQOfv4KKI8VAxRrCg";

export const supabase = createClient(supabaseUrl, supabaseKey);

export type WebsitePingHistory = {
  response_time: number;
  checked_at: string;
};

export type Website = {
  id: string;
  url: string;
  description: string;
  status: 'up' | 'down';
  last_checked: Date;
  created_at: Date;
  responseTime?: number;
  websitePingHistory?: WebsitePingHistory[];
};