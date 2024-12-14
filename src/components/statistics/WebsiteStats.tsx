import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpCircle, Clock } from "lucide-react";

interface WebsiteStatsProps {
  url: string;
  availability: number;
  downtime: number;
}

export const WebsiteStats = ({ url, availability, downtime }: WebsiteStatsProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-medium">{url}</h3>
          
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Disponibilité</p>
                <p className="font-semibold">{availability}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Interruptions</p>
                <p className="font-semibold">{downtime} fois</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};