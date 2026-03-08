import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GalleryGrid from "@/components/GalleryGrid";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="gallery">
        <GalleryGrid />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
