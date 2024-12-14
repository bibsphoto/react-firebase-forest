import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AddWebsite = () => {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      toast({
        variant: "destructive",
        title: "URL invalide",
        description: "Veuillez entrer une URL valide",
      });
      return;
    }

    // TODO: Intégrer avec Supabase pour sauvegarder les données
    toast({
      title: "Site ajouté avec succès",
      description: "Le site a été ajouté à la liste de supervision",
    });
    
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Ajouter un nouveau site</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="url" className="block text-sm font-medium">
              URL du site
            </label>
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du site"
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Ajouter le site
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddWebsite;