import { Database } from "@/integrations/supabase/types";

export type Website = Database['public']['Tables']['websitesSupervision']['Row'];
export type WebsiteInsert = Database['public']['Tables']['websitesSupervision']['Insert'];
export type WebsiteUpdate = Database['public']['Tables']['websitesSupervision']['Update'];