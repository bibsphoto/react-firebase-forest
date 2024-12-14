import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const StatusNotification = () => {
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'websitesSupervision',
          filter: 'status=eq.down'
        },
        (payload) => {
          const website = payload.new as { url: string; status: string };
          // Ajouter la classe d'animation au body
          document.body.classList.add('site-down-alert');
          
          toast({
            title: "Site indisponible !",
            description: `Le site ${website.url} est actuellement inaccessible.`,
            variant: "destructive",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'websitesSupervision',
          filter: 'status=eq.up'
        },
        (payload) => {
          const website = payload.new as { url: string; status: string };
          // Retirer la classe d'animation du body
          document.body.classList.remove('site-down-alert');
          
          toast({
            title: "Site rétabli",
            description: `Le site ${website.url} est à nouveau accessible.`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return null;
};