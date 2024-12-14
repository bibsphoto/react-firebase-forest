import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer tous les sites
    const { data: websites, error: websitesError } = await supabaseClient
      .from('websitesSupervision')
      .select('*')

    if (websitesError) throw websitesError

    // Vérifier chaque site
    for (const website of websites) {
      try {
        const startTime = Date.now()
        const response = await fetch(website.url.startsWith('http') ? website.url : `https://${website.url}`)
        const endTime = Date.now()
        const responseTime = endTime - startTime

        // Mettre à jour le statut du site
        await supabaseClient
          .from('websitesSupervision')
          .update({
            status: response.ok ? 'up' : 'down',
            last_checked: new Date().toISOString()
          })
          .eq('id', website.id)

        // Enregistrer l'historique
        await supabaseClient
          .from('websitePingHistory')
          .insert({
            website_id: website.id,
            status: response.ok ? 'up' : 'down',
            response_time: responseTime,
            checked_at: new Date().toISOString()
          })

      } catch (error) {
        // En cas d'erreur, marquer le site comme down
        await supabaseClient
          .from('websitesSupervision')
          .update({
            status: 'down',
            last_checked: new Date().toISOString()
          })
          .eq('id', website.id)

        await supabaseClient
          .from('websitePingHistory')
          .insert({
            website_id: website.id,
            status: 'down',
            checked_at: new Date().toISOString()
          })
      }
    }

    return new Response(
      JSON.stringify({ message: 'Sites checked successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})