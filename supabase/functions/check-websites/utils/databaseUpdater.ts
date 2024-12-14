import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

interface WebsiteUpdate {
  id: number;
  status: 'up' | 'down';
  responseTime: number;
  error?: string;
}

export async function updateWebsiteStatus(
  supabase: ReturnType<typeof createClient>,
  update: WebsiteUpdate
) {
  console.log(`Updating website ${update.id} status to ${update.status}`);

  const { error: updateError } = await supabase
    .from('websitesSupervision')
    .update({
      status: update.status,
      last_checked: new Date().toISOString(),
    })
    .eq('id', update.id);

  if (updateError) {
    console.error('Error updating website status:', updateError);
    throw updateError;
  }

  const { error: historyError } = await supabase
    .from('websitePingHistory')
    .insert({
      website_id: update.id,
      status: update.status,
      response_time: update.responseTime,
      checked_at: new Date().toISOString(),
    });

  if (historyError) {
    console.error('Error inserting ping history:', historyError);
    throw historyError;
  }

  console.log(`Successfully updated website ${update.id}`);
}