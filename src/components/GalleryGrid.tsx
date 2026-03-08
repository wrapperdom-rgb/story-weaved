import { useRef, useEffect, forwardRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useGalleryStore, type GalleryItem } from "@/store/galleryStore";
import { useState } from "react";
import { X, Copy, Download, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useNavigate } from "react-router-dom";

const PromptModal = ({
  item,
  onClose,
  hasPremium,
  isLoggedIn,
}: {
  item: GalleryItem;
  onClose: () => void;
  hasPremium: boolean;
  isLoggedIn: boolean;
}) => {
  const navigate = useNavigate();
  const canAccess = item.isFree || hasPremium;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = item.src;
    link.download = `mvstr-${item.id}.jpg`;
    link.click();
    toast.success("Image downloading...");
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-foreground/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-background border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto z-10"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1 bg-background text-foreground border border-border hover:bg-accent transition-colors"
        >
          <X size={16} />
        </button>

        <img src={item.src} alt="Style" className="w-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

        <div className="p-6 space-y-4">
          {canAccess ? (
            <>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-[10px] font-bold tracking-wider bg-primary text-primary-foreground">
                  {item.isFree ? "FREE PROMPT" : "PREMIUM PROMPT"}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-foreground font-mono">
                {item.prompt}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Copy size={14} />
                  COPY PROMPT
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold tracking-wider text-foreground border border-foreground hover:bg-accent transition-colors"
                >
                  <Download size={14} />
                  DOWNLOAD
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <Lock size={24} className="mx-auto text-muted-foreground" />
              <p className="text-xs font-bold tracking-wider text-muted-foreground">
                {isLoggedIn
                  ? "GET ACCESS TO UNLOCK PREMIUM PROMPTS"
                  : "SIGN UP TO UNLOCK THIS PROMPT"}
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (isLoggedIn) {
                    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/signup");
                  }
                }}
                className="w-full px-4 py-3 text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {isLoggedIn ? "GET ACCESS — $1" : "SIGN UP"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        ref={ref}
        className="masonry-item relative group cursor-pointer overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.7,
          delay: (index % 3) * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        onClick={() => setShowModal(true)}
      >
        {item.isFree && (
          <motion.span
            className="absolute top-3 left-3 z-10 px-3 py-1 text-[10px] font-bold tracking-wider bg-background text-foreground border border-border"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            FREE PROMPT
          </motion.span>
        )}
        <motion.div style={{ y, scale }} className="overflow-hidden">
          <motion.img
            src={item.src}
            alt="Style gallery"
            className="w-full block"
            loading="lazy"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </motion.div>
      </motion.div>

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
    </>
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
    <div className="masonry-grid p-0">
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
