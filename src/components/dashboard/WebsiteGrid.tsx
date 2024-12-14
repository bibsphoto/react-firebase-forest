import { Website } from "@/lib/supabase";
import { WebsiteCard } from "./WebsiteCard";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

interface WebsiteGridProps {
  websites: Website[];
}

export const WebsiteGrid = ({ websites }: WebsiteGridProps) => {
  return (
    <SortableContext
      items={websites.map(w => w.id.toString())}
      strategy={rectSortingStrategy}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((website) => (
          <WebsiteCard
            key={website.id}
            id={website.id.toString()}
            url={website.url}
            status={website.status}
            lastChecked={new Date(website.last_checked)}
            responseTime={website.responseTime}
            description={website.description}
          />
        ))}
      </div>
    </SortableContext>
  );
};