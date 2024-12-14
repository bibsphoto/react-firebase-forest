import { Button } from "@/components/ui/button";
import { WebsiteList } from "./WebsiteList";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Link to="/add-website">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un site
          </Button>
        </Link>
      </div>
      <WebsiteList />
    </div>
  );
};