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
        
        // Essayer d'abord avec le protocole original
        let url = website.url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `https://${url}` // Par défaut, on essaie HTTPS
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 secondes timeout

        try {
          const response = await fetch(url, {
            redirect: 'follow', // Suivre les redirections
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          const endTime = Date.now()
          const responseTime = endTime - startTime

          // Si la réponse est ok ou si c'est une redirection réussie
          const isUp = response.ok || (response.status >= 300 && response.status < 400)

          // Mettre à jour le statut du site
          await supabaseClient
            .from('websitesSupervision')
            .update({
              status: isUp ? 'up' : 'down',
              last_checked: new Date().toISOString()
            })
            .eq('id', website.id)

          // Enregistrer l'historique
          await supabaseClient
            .from('websitePingHistory')
            .insert({
              website_id: website.id,
              status: isUp ? 'up' : 'down',
              response_time: responseTime,
              checked_at: new Date().toISOString()
            })

        } catch (fetchError) {
          // Si HTTPS échoue, essayer HTTP
          if (url.startsWith('https://')) {
            const httpUrl = url.replace('https://', 'http://')
            const response = await fetch(httpUrl, {
              redirect: 'follow'
            })
            
            const endTime = Date.now()
            const responseTime = endTime - startTime

            const isUp = response.ok || (response.status >= 300 && response.status < 400)

            await supabaseClient
              .from('websitesSupervision')
              .update({
                status: isUp ? 'up' : 'down',
                last_checked: new Date().toISOString()
              })
              .eq('id', website.id)

            await supabaseClient
              .from('websitePingHistory')
              .insert({
                website_id: website.id,
                status: isUp ? 'up' : 'down',
                response_time: responseTime,
                checked_at: new Date().toISOString()
              })
          } else {
            throw fetchError
          }
        }

      } catch (error) {
        console.error(`Error checking website ${website.url}:`, error)
        
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