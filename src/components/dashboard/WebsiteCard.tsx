import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface WebsiteCardProps {
  url: string;
  status: "up" | "down";
  lastChecked: Date;
}

export const WebsiteCard = ({ url, status, lastChecked }: WebsiteCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {status === "up" ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
          <span className="font-medium">{url}</span>
        </div>
        <span className="text-sm text-gray-500">
          Vérifié {formatDistanceToNow(lastChecked, { addSuffix: true, locale: fr })}
        </span>
      </CardContent>
    </Card>
  );
};