import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useGalleryStore } from "@/store/galleryStore";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import PromptModal from "@/components/PromptModal";
import type { GalleryItem } from "@/store/galleryStore";

const GalleryImage = ({
  item,
  index,
  hasPremium,
  isLoggedIn,
}: {
  item: GalleryItem;
  index: number;
  hasPremium: boolean;
  isLoggedIn: boolean;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const imgSrc = retryCount > 0
    ? `${item.src}${item.src.includes('?') ? '&' : '?'}retry=${retryCount}`
    : item.src;

  const handleImageError = () => {
    if (retryCount < 2) {
      setTimeout(() => setRetryCount((c) => c + 1), 1000 * (retryCount + 1));
    } else {
      setImageError(true);
    }
  };

  const aspectClass = item.aspectRatio === '1:1' ? 'aspect-square'
    : item.aspectRatio === '4:5' ? 'aspect-[4/5]'
    : item.aspectRatio === '3:4' ? 'aspect-[3/4]'
    : item.aspectRatio === '9:16' ? 'aspect-[9/16]'
    : 'aspect-[3/4]';

  return (
    <div className="relative break-inside-avoid mb-1">
      <div
        className="relative group cursor-pointer overflow-hidden gallery-item-enter"
        style={{ animationDelay: `${(index % 6) * 80}ms` }}
        onClick={() => setShowModal(true)}
      >
        {item.isFree && (
          <span className="absolute top-3 left-3 z-10 px-3 py-1 text-[10px] font-bold tracking-wider bg-background text-foreground border border-border">
            FREE PROMPT
          </span>
        )}
        <div className="overflow-hidden">
          {imageError ? (
            <div className={`w-full bg-muted flex items-center justify-center ${aspectClass}`}>
              <span className="text-[10px] tracking-wider text-muted-foreground">FAILED TO LOAD</span>
            </div>
          ) : (
            <img
              src={imgSrc}
              alt="Style gallery"
              className={`w-full block transition-all duration-500 group-hover:scale-[1.05] ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${item.aspectRatio !== 'original' ? `object-cover ${aspectClass}` : ''}`}
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          )}
          {!imageLoaded && !imageError && (
            <div className={`w-full bg-muted animate-pulse ${aspectClass}`} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <PromptModal
            item={item}
            onClose={() => setShowModal(false)}
            hasPremium={hasPremium}
            isLoggedIn={isLoggedIn}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const GalleryGrid = () => {
  const { items, loading, fetchItems } = useGalleryStore();
  const { user } = useAuth();
  const { hasPremium } = usePremiumAccess();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs tracking-wider text-muted-foreground animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="masonry-grid p-0 relative">
      {items.map((item, i) => (
        <GalleryImage
          key={item.id}
          item={item}
          index={i}
          hasPremium={hasPremium}
          isLoggedIn={!!user}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
