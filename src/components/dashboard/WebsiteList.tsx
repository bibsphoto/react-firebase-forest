import { useQuery } from "@tanstack/react-query";
import { WebsiteCard } from "./WebsiteCard";
import { supabase } from "@/lib/supabase";
import type { Website } from "@/lib/supabase";

export const WebsiteList = () => {
  const { data: websites, isLoading, error } = useQuery({
    queryKey: ['websites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Website[];
    },
  });

  if (isLoading) {
    return <div className="text-center">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur lors du chargement des sites</div>;
  }

  if (!websites?.length) {
    return <div className="text-center text-gray-500">Aucun site à afficher</div>;
  }

  return (
    <div className="space-y-4">
      {websites.map((website) => (
        <WebsiteCard
          key={website.id}
          url={website.url}
          status={website.status}
          lastChecked={new Date(website.last_checked)}
        />
      ))}
    </div>
  );
};