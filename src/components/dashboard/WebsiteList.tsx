import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Website } from "@/lib/supabase";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { WebsiteGrid } from "./WebsiteGrid";
import { WebsitePagination } from "./WebsitePagination";

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

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('website-list-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'websitesSupervision'
        },
        () => {
          // Invalidate and refetch when data changes
          queryClient.invalidateQueries({ queryKey: ['websites'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['websites', currentPage],
    queryFn: async () => {
      console.log('Fetching websites...');
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data: positions } = await supabase
        .from('website_positions')
        .select('website_id, position')
        .order('position', { ascending: true });

      const { data: websites, error, count } = await supabase
        .from('websitesSupervision')
        .select(`
          *,
          websitePingHistory (
            response_time,
            checked_at,
            status
          )
        `, { count: 'exact' })
        .order('last_checked', { ascending: false })
        .range(start, end);

      if (error) {
        console.error('Error fetching websites:', error);
        throw error;
      }

      console.log('Fetched websites:', websites);

      const sortedWebsites = websites?.sort((a, b) => {
        const posA = positions?.find(p => p.website_id === a.id)?.position || Number.MAX_SAFE_INTEGER;
        const posB = positions?.find(p => p.website_id === b.id)?.position || Number.MAX_SAFE_INTEGER;
        return posA - posB;
      });

      const websitesWithResponseTime = sortedWebsites?.map(website => ({
        ...website,
        responseTime: website.websitePingHistory?.[0]?.response_time,
        status: website.websitePingHistory?.[0]?.status || website.status
      }));
      
      return {
        websites: websitesWithResponseTime as Website[],
        totalCount: count || 0
      };
    },
    gcTime: 0, // Disable garbage collection
    staleTime: 0, // Always consider data stale
    refetchInterval: 10000, // Refetch every 10 seconds
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
    
    queryClient.setQueryData(['websites', currentPage], {
      ...data,
      websites: newWebsites
    });

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user?.id) return;

    const userId = session.session.user.id;
    
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
        <WebsiteGrid websites={data.websites} />
      </DndContext>

      <WebsitePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};