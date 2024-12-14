import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, XCircle } from "lucide-react";

const PingHistory = () => {
  const [selectedWebsite, setSelectedWebsite] = useState<string>("all");

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

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Historique des vérifications</h1>

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
  );
};

export default PingHistory;