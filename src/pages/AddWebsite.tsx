import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { WebsiteCard } from "@/components/dashboard/WebsiteCard";

const AddWebsite = () => {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    if (!validateUrl(url)) {
      toast({
        variant: "destructive",
        title: "URL invalide",
        description: "Veuillez entrer une URL valide",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('websitesSupervision').insert([
        {
          url,
          description,
          status: 'up',
          last_checked: new Date().toISOString(),
        }
      ]);

      if (error) throw error;

      toast({
        title: "Site ajouté avec succès",
        description: "Le site a été ajouté à la liste de supervision",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du site",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        
        <div className="grid md:grid-cols-2 gap-8">
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
                disabled={isSubmitting}
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
                placeholder="Description du site (optionnel)"
                disabled={isSubmitting}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter le site"}
            </Button>
          </form>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Prévisualisation</h2>
            <div className="border rounded-lg p-4 bg-gray-50">
              <WebsiteCard
                id="preview"
                url={url || "votre-site.com"}
                status="up"
                lastChecked={new Date()}
                responseTime={200}
              />
            </div>
            <p className="text-sm text-gray-500 italic">
              Cette prévisualisation montre comment votre site apparaîtra dans le tableau de bord
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWebsite;