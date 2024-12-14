import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface IconEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  website: {
    id: string;
    icon_url?: string;
  };
}

export const IconEditDialog = ({ isOpen, onClose, website }: IconEditDialogProps) => {
  const [iconUrl, setIconUrl] = useState(website.icon_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("websitesSupervision")
        .update({ icon_url: iconUrl })
        .eq("id", website.id);

      if (error) throw error;

      toast.success("Icône mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['websites'] });
      onClose();
    } catch (error) {
      console.error("Error updating icon:", error);
      toast.error("Erreur lors de la mise à jour de l'icône");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'icône</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="icon_url" className="text-sm font-medium">
              URL de l'image
            </label>
            <Input
              id="icon_url"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://example.com/icon.png"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};