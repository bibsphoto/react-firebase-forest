import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="https://www.squirel.fr/images/squirel-logo-banner.png"
                alt="Squirel by SNCF"
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-primary hover:text-primary-hover">Se connecter</Button>
            <Button className="bg-accent hover:bg-accent-hover text-white">S'inscrire</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};