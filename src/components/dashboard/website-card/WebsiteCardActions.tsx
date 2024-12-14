import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WebsiteCardActionsProps {
  url: string;
  id: string;
}

export const WebsiteCardActions = ({ url, id }: WebsiteCardActionsProps) => {
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
  );
};