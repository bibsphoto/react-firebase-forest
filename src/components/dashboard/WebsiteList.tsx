import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WebsiteCard } from "./WebsiteCard";
import { supabase } from "@/lib/supabase";
import type { Website } from "@/lib/supabase";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

export const WebsiteList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['websites', currentPage],
    queryFn: async () => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      // Récupérer les positions des sites web
      const { data: positions } = await supabase
        .from('website_positions')
        .select('website_id, position')
        .order('position', { ascending: true });

      // Récupérer les sites web et leur dernier ping
      const { data: websites, error, count } = await supabase
        .from('websitesSupervision')
        .select('*, websitePingHistory!inner(*)', { count: 'exact' })
        .order('websitePingHistory.checked_at', { ascending: false })
        .limit(1, { foreignTable: 'websitePingHistory' })
        .range(start, end);

      if (error) throw error;

      // Trier les sites web selon leurs positions
      const sortedWebsites = websites?.sort((a, b) => {
        const posA = positions?.find(p => p.website_id === a.id)?.position || Number.MAX_SAFE_INTEGER;
        const posB = positions?.find(p => p.website_id === b.id)?.position || Number.MAX_SAFE_INTEGER;
        return posA - posB;
      });

      // Transformer les données pour inclure le temps de réponse
      const websitesWithResponseTime = sortedWebsites?.map(website => ({
        ...website,
        responseTime: website.websitePingHistory?.[0]?.response_time
      }));
      
      return {
        websites: websitesWithResponseTime as Website[],
        totalCount: count || 0
      };
    },
    gcTime: 5 * 60 * 1000,
    meta: {
      staleTime: 30000,
    }
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || !data?.websites) {
      return;
    }

    const oldIndex = data.websites.findIndex(item => item.id.toString() === active.id);
    const newIndex = data.websites.findIndex(item => item.id.toString() === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;

    const newWebsites = arrayMove(data.websites, oldIndex, newIndex);
    
    // Optimistic update
    queryClient.setQueryData(['websites', currentPage], {
      ...data,
      websites: newWebsites
    });

    // Mettre à jour les positions dans la base de données
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user?.id) return;

    const userId = session.session.user.id;
    
    // Mettre à jour les positions pour tous les sites affectés
    const updates = newWebsites.map((website, index) => ({
      user_id: userId,
      website_id: website.id,
      position: index
    }));

    const { error } = await supabase
      .from('website_positions')
      .upsert(updates, { onConflict: 'user_id,website_id' });

    if (error) {
      console.error('Error updating positions:', error);
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Erreur lors du chargement des sites</div>;
  }

  if (!data?.websites?.length) {
    return <div className="text-center text-gray-500">Aucun site à afficher</div>;
  }

  const totalPages = Math.ceil(data.totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.websites.map(w => w.id.toString())}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.websites.map((website) => (
              <WebsiteCard
                key={website.id}
                id={website.id.toString()}
                url={website.url}
                status={website.status}
                lastChecked={new Date(website.last_checked)}
                responseTime={website.responseTime}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};