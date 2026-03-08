import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

const GalleryImage = ({ item, index }: { item: GalleryItem; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
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
    >
      {item.hasBadge && (
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
  );
};

const GalleryGrid = () => {
  return (
    <div className="masonry-grid p-0">
      {items.map((item, i) => (
        <GalleryImage key={i} item={item} index={i} />
      ))}
    </div>
  );
};

export default GalleryGrid;
