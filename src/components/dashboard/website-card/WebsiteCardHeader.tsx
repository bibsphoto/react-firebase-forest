import { TrainFront } from "lucide-react";

interface WebsiteCardHeaderProps {
  url: string;
}

export const WebsiteCardHeader = ({ url }: WebsiteCardHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary-light rounded-lg group-hover:scale-110 transition-transform">
        <TrainFront className="h-5 w-5 text-pink-500" />
      </div>
      <div className="flex flex-col">
        <span className="font-medium truncate max-w-[200px]">{url}</span>
      </div>
    </div>
  );
};