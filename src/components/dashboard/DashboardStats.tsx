import { ArrowUp, History, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardStatsProps {
  stats: {
    availabilityPercentage: number;
    averageResponseTime: number;
    totalSites: number;
  } | undefined;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
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
  );
};