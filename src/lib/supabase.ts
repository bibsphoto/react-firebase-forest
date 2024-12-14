import { FullDatabase } from "@/integrations/supabase/types";
import { supabase as supabaseClient } from "@/integrations/supabase/client";

export type Website = FullDatabase['public']['Tables']['websitesSupervision']['Row'];
export type WebsiteInsert = FullDatabase['public']['Tables']['websitesSupervision']['Insert'];
export type WebsiteUpdate = FullDatabase['public']['Tables']['websitesSupervision']['Update'];

export const supabase = supabaseClient;