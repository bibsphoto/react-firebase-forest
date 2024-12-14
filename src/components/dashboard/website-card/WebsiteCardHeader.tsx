import { TrainFront } from "lucide-react";
import { useState } from "react";
import { IconEditDialog } from "./IconEditDialog";

interface WebsiteCardHeaderProps {
  url: string;
  id: string;
  icon_url?: string;
}

export const WebsiteCardHeader = ({ url, id, icon_url }: WebsiteCardHeaderProps) => {
  const [isIconEditDialogOpen, setIsIconEditDialogOpen] = useState(false);

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIconEditDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div 
          className="p-2 bg-primary-light rounded-lg group-hover:scale-110 transition-transform cursor-pointer"
          onClick={handleIconClick}
        >
          {icon_url ? (
            <img 
              src={icon_url} 
              alt="Site icon" 
              className="h-5 w-5 object-contain"
              onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const icon = document.createElement("div");
                  icon.innerHTML = '<svg class="h-5 w-5 text-pink-500"><use href="#train-front"></use></svg>';
                  parent.appendChild(icon);
                }
              }}
            />
          ) : (
            <TrainFront className="h-5 w-5 text-pink-500" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium truncate max-w-[200px]">{url}</span>
        </div>
      </div>

      <IconEditDialog
        isOpen={isIconEditDialogOpen}
        onClose={() => setIsIconEditDialogOpen(false)}
        website={{ id, icon_url }}
      />
    </>
  );
};