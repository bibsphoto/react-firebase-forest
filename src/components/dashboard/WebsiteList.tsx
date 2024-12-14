import { useQuery } from "@tanstack/react-query";
import { WebsiteCard } from "./WebsiteCard";
import { supabase } from "@/lib/supabase";
import type { Website } from "@/lib/supabase";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12; // Augmenté pour mieux remplir la grille

export const WebsiteList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['websites', currentPage],
    queryFn: async () => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('websitesSupervision')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;
      
      return {
        websites: data as Website[],
        totalCount: count || 0
      };
    },
    gcTime: 5 * 60 * 1000,
    meta: {
      staleTime: 30000,
    }
  });

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.websites.map((website) => (
          <WebsiteCard
            key={website.id}
            url={website.url}
            status={website.status}
            lastChecked={new Date(website.last_checked)}
          />
        ))}
      </div>

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