import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import HowItWorksModal from "@/components/HowItWorksModal";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <>
      <motion.header
        className="flex items-center justify-between px-6 py-4 bg-background border-b border-border relative z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h1 className="text-xl font-bold tracking-[0.3em] text-foreground">P O O L A B S</h1>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2">
          <motion.button
            className="px-4 py-2 text-xs font-bold tracking-wider text-foreground border border-border hover:bg-accent transition-colors"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowHowItWorks(true)}
          >
            HOW IT WORKS
          </motion.button>
          <motion.button
            className="px-4 py-2 text-xs font-bold tracking-wider text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            SIGN UP
          </motion.button>
          <motion.button
            className="px-4 py-2 text-xs font-bold tracking-wider text-foreground border border-foreground hover:bg-accent transition-colors"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            SIGN IN
          </motion.button>
        </nav>

        {/* Mobile hamburger */}
        <motion.button
          className="sm:hidden text-foreground"
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.9 }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-background border-b border-border flex flex-col p-4 gap-2 z-50 sm:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.button
                className="w-full px-4 py-3 text-xs font-bold tracking-wider text-foreground border border-border hover:bg-accent transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setOpen(false); setShowHowItWorks(true); }}
              >
                HOW IT WORKS
              </motion.button>
              <motion.button
                className="w-full px-4 py-3 text-xs font-bold tracking-wider text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                whileTap={{ scale: 0.97 }}
              >
                SIGN UP
              </motion.button>
              <motion.button
                className="w-full px-4 py-3 text-xs font-bold tracking-wider text-foreground border border-foreground hover:bg-accent transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.16 }}
                whileTap={{ scale: 0.97 }}
              >
                SIGN IN
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <HowItWorksModal open={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </>
  );
};

export default Navbar;
