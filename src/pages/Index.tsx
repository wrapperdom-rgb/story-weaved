import Navbar from "@/components/Navbar";
import GalleryGrid from "@/components/GalleryGrid";
import PricingSection from "@/components/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GalleryGrid />
      <PricingSection />
    </div>
  );
};

export default Index;
