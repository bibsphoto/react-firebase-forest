import { Button } from "@/components/ui/button";
import { WebsiteList } from "./WebsiteList";
import { Plus, History, BarChart, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: websites, error } = await supabase
        .from('websitesSupervision')
        .select('status');
      
      if (error) throw error;

      const totalSites = websites?.length || 0;
      const onlineSites = websites?.filter(site => site.status === 'up').length || 0;
      const availabilityPercentage = totalSites > 0 
        ? Math.round((onlineSites / totalSites) * 100) 
        : 0;

      const { data: pingHistory } = await supabase
        .from('websitePingHistory')
        .select('response_time')
        .order('created_at', { ascending: false })
        .limit(100);

      const averageResponseTime = pingHistory?.length 
        ? Math.round(pingHistory.reduce((acc, curr) => acc + (curr.response_time || 0), 0) / pingHistory.length)
        : 0;

      return {
        totalSites,
        availabilityPercentage,
        averageResponseTime
      };
    },
    gcTime: 5 * 60 * 1000,
    meta: {
      staleTime: 30000,
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-statsHover bg-clip-text text-transparent">
              Tableau de bord
            </h1>
            <p className="text-gray-600 mt-2">
              Surveillez vos sites web en temps réel
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/statistics">
              <Button 
                variant="outline"
                className="bg-primary-stats text-white hover:bg-primary-statsHover border-none shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Statistiques
              </Button>
            </Link>
            <Link to="/history">
              <Button 
                variant="outline"
                className="bg-primary-stats text-white hover:bg-primary-statsHover border-none shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <History className="mr-2 h-4 w-4" />
                Historique
              </Button>
            </Link>
            <Link to="/add-website">
              <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un site
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-800">Sites en ligne</h3>
              <ArrowUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats?.availabilityPercentage || 0}%
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-800">Temps moyen</h3>
              <History className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats?.averageResponseTime || 0}ms
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-800">Sites surveillés</h3>
              <BarChart className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats?.totalSites || 0}
            </p>
          </div>
        </div>
      </div>
      <WebsiteList />
    </div>
  );
};