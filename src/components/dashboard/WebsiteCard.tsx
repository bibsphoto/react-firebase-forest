import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, ExternalLink, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface WebsiteCardProps {
  url: string;
  status: "up" | "down";
  lastChecked: Date;
}

export const WebsiteCard = memo(({ url, status, lastChecked }: WebsiteCardProps) => {
  const getStatusColor = (status: "up" | "down") => {
    return status === "up" ? "bg-green-500" : "bg-red-500";
  };

  const getResponseTime = () => {
    return Math.floor(Math.random() * 500) + 100;
  };

  return (
    <Card className={`group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
      status === "down" ? "site-down-alert" : ""
    }`}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light rounded-lg group-hover:scale-110 transition-transform">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate max-w-[150px]">{url}</span>
                  <a 
                    href={url.startsWith('http') ? url : `https://${url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(lastChecked, { addSuffix: true, locale: fr })}
                </span>
              </div>
            </div>
          </div>
          
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
              <span className="font-medium">{getResponseTime()}ms</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

WebsiteCard.displayName = "WebsiteCard";