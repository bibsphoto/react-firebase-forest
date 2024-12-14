import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://www.squirel.fr/images/squirel-logo-banner.png"
                alt="Squirel by SNCF"
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold text-primary">EYES</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-primary hover:text-primary-hover"
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};