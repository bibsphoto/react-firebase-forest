import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WebsiteStats } from "./WebsiteStats";
import { AvailabilityChart } from "./AvailabilityChart";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const MemoizedWebsiteStats = memo(WebsiteStats);
const MemoizedAvailabilityChart = memo(AvailabilityChart);

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
          id: website.id.toString(), // Convert id to string for chart compatibility
          url: website.url || "",
          availability: Math.round(availability * 100) / 100,
          downtime,
          history: website.websitePingHistory
        };
      });
    },
    gcTime: 5 * 60 * 1000,
    meta: {
      staleTime: 60000,
    }
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Statistiques de disponibilité</h1>
      </div>
      
      {stats && stats.length > 0 ? (
        <>
          <div className="grid gap-6 mb-8">
            {stats.map((stat) => (
              <MemoizedWebsiteStats key={stat.id} {...stat} />
            ))}
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Graphique de disponibilité</h2>
            <MemoizedAvailabilityChart data={stats} />
          </div>
        </>
      ) : (
        <p className="text-gray-500">Aucune donnée disponible</p>
      )}
    </div>
  );
};