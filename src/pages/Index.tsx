import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import GalleryGrid from "@/components/GalleryGrid";
import PricingSection from "@/components/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Banner />
      <GalleryGrid />
      <PricingSection />
    </div>
  );
};

export default Index;
