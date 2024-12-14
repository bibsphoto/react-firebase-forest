import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              MonApp
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Se connecter</Button>
            <Button>S'inscrire</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};