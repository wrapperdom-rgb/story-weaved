import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import gallery9 from "@/assets/gallery-9.jpg";

interface GalleryItem {
  src: string;
  hasBadge?: boolean;
}

const items: GalleryItem[] = [
  { src: gallery1, hasBadge: true },
  { src: gallery2, hasBadge: true },
  { src: gallery3 },
  { src: gallery4 },
  { src: gallery5 },
  { src: gallery6 },
  { src: gallery7 },
  { src: gallery8 },
  { src: gallery9 },
];

const GalleryGrid = () => {
  return (
    <div className="masonry-grid p-0">
      {items.map((item, i) => (
        <div key={i} className="masonry-item relative group cursor-pointer overflow-hidden">
          {item.hasBadge && (
            <span className="absolute top-3 left-3 z-10 px-3 py-1 text-[10px] font-bold tracking-wider bg-background text-foreground border border-border">
              FREE PROMPT
            </span>
          )}
          <img
            src={item.src}
            alt="Style gallery"
            className="w-full block transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
