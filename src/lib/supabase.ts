import { Database } from "@/integrations/supabase/types";
import { supabase as supabaseClient } from "@/integrations/supabase/client";

export type Website = Database['public']['Tables']['websitesSupervision']['Row'];
export type WebsiteInsert = Database['public']['Tables']['websitesSupervision']['Insert'];
export type WebsiteUpdate = Database['public']['Tables']['websitesSupervision']['Update'];

export const supabase = supabaseClient;