// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ddbudopwefbhjrdqssma.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnVkb3B3ZWZiaGpyZHFzc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxNDMwODMsImV4cCI6MjA0OTcxOTA4M30.4pwr-xRa5A35tAn2jUky1tEsPhZQOfv4KKI8VAxRrCg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);