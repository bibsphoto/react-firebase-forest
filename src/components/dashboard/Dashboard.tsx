import { Button } from "@/components/ui/button";
import { WebsiteList } from "./WebsiteList";
import { Plus, History, BarChart, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { DashboardStats } from "./DashboardStats";

export const Dashboard = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up real-time subscription for dashboard stats...');
    
    const channel = supabase
      .channel('dashboard-stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'websitesSupervision'
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          // Force immediate refetch when data changes
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.refetchQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        }
      });

    return () => {
      console.log('Cleaning up real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: stats, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log('Fetching dashboard stats...');
      
      const { data: websites, error } = await supabase
        .from('websitesSupervision')
        .select(`
          status,
          websitePingHistory!inner(response_time)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching stats:', error);
        throw error;
      }

      console.log('Fetched websites for stats:', websites);

      const totalSites = websites?.length || 0;
      const onlineSites = websites?.filter(site => site.status === 'up').length || 0;
      const availabilityPercentage = totalSites > 0 
        ? Math.round((onlineSites / totalSites) * 100) 
        : 0;

      const averageResponseTime = websites?.reduce((acc, site) => {
        const latestPing = site.websitePingHistory[0];
        return acc + (latestPing?.response_time || 0);
      }, 0) / totalSites || 0;

      return {
        totalSites,
        availabilityPercentage,
        averageResponseTime: Math.round(averageResponseTime)
      };
    },
    gcTime: 0,
    staleTime: 0,
    refetchInterval: 10000,
  });

  if (isError) {
    toast.error('Erreur lors du chargement des statistiques');
  }

  const handleManualPing = async () => {
    try {
      const response = await fetch('https://ddbudopwefbhjrdqssma.supabase.co/functions/v1/check-websites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnVkb3B3ZWZiaGpyZHFzc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxNDMwODMsImV4cCI6MjA0OTcxOTA4M30.4pwr-xRa5A35tAn2jUky1tEsPhZQOfv4KKI8VAxRrCg`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger manual ping');
      }
      
      toast.success('Vérification manuelle des sites en cours...');
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['websites'] });
        queryClient.refetchQueries({ queryKey: ['dashboard-stats'] });
        queryClient.refetchQueries({ queryKey: ['websites'] });
      }, 2000);
    } catch (error) {
      console.error('Error triggering manual ping:', error);
      toast.error('Erreur lors de la vérification manuelle');
    }
  };

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

        <DashboardStats stats={stats} />
      </div>

      <WebsiteList />

      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={handleManualPing}
          className="flex items-center gap-2 bg-gradient-to-r from-gradient-start to-gradient-end text-white opacity-50 hover:opacity-100 transition-opacity border-none shadow-lg hover:shadow-xl"
        >
          <RefreshCw className="h-4 w-4" />
          Vérifier manuellement tous les sites
        </Button>
      </div>
    </div>
  );
};
