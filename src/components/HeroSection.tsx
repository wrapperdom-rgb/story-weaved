import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 px-4 bg-background overflow-hidden">
      {/* Decorative grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <motion.p
        className="text-[10px] font-bold tracking-[0.5em] text-muted-foreground mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        AI-POWERED STYLE PROMPTS
      </motion.p>

      <motion.h2
        className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground text-center max-w-xl leading-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        Your face.
        <br />
        <span className="text-muted-foreground">Their style.</span>
      </motion.h2>

      <motion.p
        className="mt-6 text-xs tracking-wider text-muted-foreground text-center max-w-sm leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Browse curated AI prompts. Copy. Paste into your favorite AI tool.
        Generate editorial-quality images of yourself in seconds.
      </motion.p>

      <motion.div
        className="mt-10 flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <button
          onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
          className="px-6 py-3 text-xs font-bold tracking-[0.2em] bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          BROWSE GALLERY
        </button>
        <button
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          className="px-6 py-3 text-xs font-bold tracking-[0.2em] text-foreground border border-foreground hover:bg-accent transition-colors"
        >
          SEE PRICING
        </button>
      </motion.div>

      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
