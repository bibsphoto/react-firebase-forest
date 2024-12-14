import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface WebsiteCardStatusProps {
  status: "up" | "down";
  responseTime?: number;
}

export const WebsiteCardStatus = ({ status, responseTime }: WebsiteCardStatusProps) => {
  return (
    <div className="flex items-center justify-between">
      <Badge 
        variant={status === "up" ? "success" : "destructive"} 
        className="capitalize transition-transform group-hover:scale-105"
      >
        {status === "up" ? (
          <CheckCircle className="mr-1 h-3 w-3" />
        ) : (
          <XCircle className="mr-1 h-3 w-3" />
        )}
        {status === "up" ? "En ligne" : "Hors ligne"}
      </Badge>
      
      <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1 rounded-full">
        <Clock className="h-4 w-4 text-gray-400" />
        <span className="font-medium">{responseTime || '---'}ms</span>
      </div>
    </div>
  );
};