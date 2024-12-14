import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WebsiteStats } from "./WebsiteStats";
import { AvailabilityChart } from "./AvailabilityChart";

export const StatisticsContent = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['website-stats'],
    queryFn: async () => {
      const { data: websites } = await supabase
        .from('websitesSupervision')
        .select(`
          id,
          url,
          websitePingHistory (
            status,
            checked_at
          )
        `);

      if (!websites) return [];

      return websites.map(website => {
        const totalPings = website.websitePingHistory.length;
        const upPings = website.websitePingHistory.filter(ping => ping.status === 'up').length;
        const availability = totalPings > 0 ? (upPings / totalPings) * 100 : 0;
        const downtime = totalPings - upPings;

        return {
          id: website.id,
          url: website.url,
          availability: Math.round(availability * 100) / 100,
          downtime,
          history: website.websitePingHistory
        };
      });
    }
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Statistiques de disponibilité</h1>
      
      {stats && stats.length > 0 ? (
        <>
          <div className="grid gap-6 mb-8">
            {stats.map((stat) => (
              <WebsiteStats key={stat.id} {...stat} />
            ))}
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Graphique de disponibilité</h2>
            <AvailabilityChart data={stats} />
          </div>
        </>
      ) : (
        <p className="text-gray-500">Aucune donnée disponible</p>
      )}
    </div>
  );
};