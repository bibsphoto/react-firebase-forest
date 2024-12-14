import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { corsHeaders } from '../_shared/cors.ts';
import { checkWebsite } from './utils/websiteChecker.ts';
import { updateWebsiteStatus } from './utils/databaseUpdater.ts';

console.log("Hello from check-websites!");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    );

    // Récupérer les sites qui n'ont pas été vérifiés depuis plus de 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: websites, error: fetchError } = await supabaseClient
      .from('websitesSupervision')
      .select('*')
      .or(`last_checked.is.null,last_checked.lt.${fiveMinutesAgo}`);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${websites?.length} websites to check (not checked in the last 5 minutes)`);

    const checkPromises = websites?.map(async (website) => {
      try {
        const result = await checkWebsite(website.url);
        await updateWebsiteStatus(supabaseClient, {
          id: website.id,
          ...result
        });
      } catch (error) {
        console.error(`Failed to process website ${website.url}:`, error);
      }
    });

    await Promise.all(checkPromises || []);

    return new Response(
      JSON.stringify({ message: 'Websites checked successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in check-websites function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});