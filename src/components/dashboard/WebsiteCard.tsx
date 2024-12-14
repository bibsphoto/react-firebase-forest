import { memo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { WebsiteCardHeader } from "./website-card/WebsiteCardHeader";
import { WebsiteCardActions } from "./website-card/WebsiteCardActions";
import { WebsiteCardStatus } from "./website-card/WebsiteCardStatus";
import { WebsiteEditDialog } from "./website-card/WebsiteEditDialog";

interface WebsiteCardProps {
  id: string;
  url: string;
  status: "up" | "down";
  lastChecked: Date;
  responseTime?: number;
  description?: string;
}

export const WebsiteCard = memo(({ id, url, status, lastChecked, responseTime, description }: WebsiteCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening dialog when clicking on action buttons
    if ((e.target as HTMLElement).closest('.website-card-actions')) {
      return;
    }
    setIsEditDialogOpen(true);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        className={`group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-move ${
          status === "down" ? "site-down-alert" : ""
        }`}
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <WebsiteCardHeader url={url} />
              <div className="website-card-actions">
                <WebsiteCardActions url={url} id={id} />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(lastChecked, { addSuffix: true, locale: fr })}
            </div>
            
            <WebsiteCardStatus status={status} responseTime={responseTime} />
          </div>
        </CardContent>
      </Card>

      <WebsiteEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        website={{ id, url, description }}
      />
    </div>
  );
});

WebsiteCard.displayName = "WebsiteCard";