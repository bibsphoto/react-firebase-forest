import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatisticsContent } from "@/components/statistics/StatisticsContent";

const Statistics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <StatisticsContent />
      </main>
      <Footer />
    </div>
  );
};

export default Statistics;