import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const PingHistory = () => {
  const [selectedWebsite, setSelectedWebsite] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: websites } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("websitesSupervision")
        .select("id, url");
      if (error) throw error;
      return data;
    },
  });

  const { data: history, isLoading } = useQuery({
    queryKey: ["history", selectedWebsite],
    queryFn: async () => {
      let query = supabase
        .from("websitePingHistory")
        .select(
          `
          id,
          status,
          checked_at,
          response_time,
          websitesSupervision (
            url
          )
        `
        )
        .order("checked_at", { ascending: false });

      if (selectedWebsite !== "all") {
        query = query.eq("website_id", selectedWebsite);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleClearHistory = async () => {
    try {
      let query = supabase.from("websitePingHistory").delete();
      
      if (selectedWebsite !== "all") {
        query = query.eq("website_id", selectedWebsite);
      } else {
        // When "all" is selected, we need to delete with a condition that's always true
        query = query.gte("id", 0);
      }

      const { error } = await query;

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["history"] });
      toast.success("L'historique a été effacé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'historique:", error);
      toast.error("Une erreur est survenue lors de la suppression de l'historique");
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="gradient">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Historique des vérifications</h1>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleClearHistory}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Effacer l'historique
            </Button>
          </div>

          <div className="mb-6">
            <Select
              value={selectedWebsite}
              onValueChange={(value) => setSelectedWebsite(value)}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Sélectionner un site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les sites</SelectItem>
                {websites?.map((website) => (
                  <SelectItem key={website.id} value={website.id.toString()}>
                    {website.url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date et heure</TableHead>
                  <TableHead>Temps de réponse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.websitesSupervision.url}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {entry.status === "up" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        {entry.status === "up" ? "En ligne" : "Hors ligne"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(entry.checked_at), "PPpp", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {entry.response_time ? `${entry.response_time}ms` : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PingHistory;