import { motion } from "framer-motion";

const Banner = () => {
  return (
    <motion.div
      className="w-full py-2 bg-primary text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.span
        className="text-xs font-bold tracking-[0.2em] text-primary-foreground inline-block"
        initial={{ letterSpacing: "0.5em", opacity: 0 }}
        animate={{ letterSpacing: "0.2em", opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      >
        FREE PROMPT ACTIVE
      </motion.span>
    </motion.div>
  );
};

export default Banner;
