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
        
        // Fonction pour vérifier une URL avec un protocole donné
        const checkUrl = async (url: string) => {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000)
          
          try {
            const response = await fetch(url, {
              redirect: 'follow',
              signal: controller.signal,
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; WebsiteMonitor/1.0)'
              }
            })
            clearTimeout(timeoutId)
            return response
          } catch (error) {
            clearTimeout(timeoutId)
            throw error
          }
        }

        // Préparer l'URL pour les tests
        let baseUrl = website.url
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          baseUrl = `https://${baseUrl}`
        }

        // Essayer d'abord avec l'URL originale
        let isUp = false
        let responseTime = 0
        let finalResponse = null

        try {
          const response = await checkUrl(baseUrl)
          finalResponse = response
          isUp = response.ok || (response.status >= 300 && response.status < 400)
        } catch (error) {
          // Si l'URL originale échoue et commence par https://, essayer avec http://
          if (baseUrl.startsWith('https://')) {
            try {
              const httpUrl = baseUrl.replace('https://', 'http://')
              const response = await checkUrl(httpUrl)
              finalResponse = response
              isUp = response.ok || (response.status >= 300 && response.status < 400)
            } catch (httpError) {
              console.error(`Both HTTPS and HTTP failed for ${website.url}:`, httpError)
              isUp = false
            }
          }
        }

        // Calculer le temps de réponse
        const endTime = Date.now()
        responseTime = endTime - startTime

        // Mettre à jour le statut du site
        await supabaseClient
          .from('websitesSupervision')
          .update({
            status: isUp ? 'up' : 'down',
            last_checked: new Date().toISOString()
          })
          .eq('id', website.id)

        // Enregistrer l'historique avec le code de statut
        await supabaseClient
          .from('websitePingHistory')
          .insert({
            website_id: website.id,
            status: isUp ? 'up' : 'down',
            response_time: responseTime,
            checked_at: new Date().toISOString()
          })

        // Log pour le débogage
        console.log(`Check completed for ${website.url}:`, {
          isUp,
          responseTime,
          statusCode: finalResponse?.status,
          redirected: finalResponse?.redirected
        })

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