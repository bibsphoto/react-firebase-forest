import { createClient } from '@supabase/supabase-js';
import type { FullDatabase } from './types';

const SUPABASE_URL = "https://ddbudopwefbhjrdqssma.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnVkb3B3ZWZiaGpyZHFzc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxNDMwODMsImV4cCI6MjA0OTcxOTA4M30.4pwr-xRa5A35tAn2jUky1tEsPhZQOfv4KKI8VAxRrCg";

export const supabase = createClient<FullDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);