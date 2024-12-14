import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';
import { checkWebsite } from './utils/websiteChecker.ts';
import { updateWebsiteStatus } from './utils/databaseUpdater.ts';

console.log("Hello from check-websites!");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    const { data: websites, error: fetchError } = await supabaseClient
      .from('websitesSupervision')
      .select('*');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${websites?.length} websites to check`);

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