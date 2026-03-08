import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import GalleryGrid from "@/components/GalleryGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Banner />
      <GalleryGrid />
    </div>
  );
};

export default Index;
