import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, ExternalLink, TrainFront, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WebsiteCardProps {
  id: string;
  url: string;
  status: "up" | "down";
  lastChecked: Date;
  responseTime?: number;
}

export const WebsiteCard = memo(({ id, url, status, lastChecked, responseTime }: WebsiteCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    try {
      const numericId = parseInt(id);
      
      // First delete ping history
      const { error: historyError } = await supabase
        .from('websitePingHistory')
        .delete()
        .eq('website_id', numericId);

      if (historyError) {
        console.error('Error deleting ping history:', historyError);
        throw historyError;
      }

      // Then delete website positions
      const { error: positionsError } = await supabase
        .from('website_positions')
        .delete()
        .eq('website_id', numericId);

      if (positionsError) {
        console.error('Error deleting positions:', positionsError);
        throw positionsError;
      }

      // Finally delete the website
      const { error: websiteError } = await supabase
        .from('websitesSupervision')
        .delete()
        .eq('id', numericId);

      if (websiteError) {
        console.error('Error deleting website:', websiteError);
        throw websiteError;
      }

      toast.success('Site supprimé avec succès');
    } catch (error) {
      console.error('Error deleting website:', error);
      toast.error('Erreur lors de la suppression du site');
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-move ${
        status === "down" ? "site-down-alert" : ""
      }`}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-light rounded-lg group-hover:scale-110 transition-transform">
                  <TrainFront className="h-5 w-5 text-pink-500" />
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-medium truncate max-w-[200px]">{url}</span>
                    <div className="flex items-center gap-2">
                      <a 
                        href={url.startsWith('http') ? url : `https://${url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                <span className="font-medium">{responseTime || '---'}ms</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

WebsiteCard.displayName = "WebsiteCard";