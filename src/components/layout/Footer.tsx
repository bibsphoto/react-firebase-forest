import { useEffect, useState } from "react";

export const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const checkNewYear = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      if (currentYear > year) {
        setYear(currentYear);
      }
    };

    // Check every minute if we're at December 31st 23:59
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getMonth() === 11 && now.getDate() === 31 && now.getHours() === 23 && now.getMinutes() === 59) {
        checkNewYear();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [year]);

  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            © {year} Squirel. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};