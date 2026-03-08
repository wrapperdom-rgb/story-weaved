import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="flex items-center justify-between px-6 py-4 bg-background border-b border-border relative z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <h1 className="text-xl font-bold tracking-[0.3em] text-foreground">M V S T R</h1>

      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-2">
        {["HOW IT WORKS", "SIGN UP", "SIGN IN"].map((label, i) => (
          <motion.button
            key={label}
            className={
              label === "SIGN UP"
                ? "px-4 py-2 text-xs font-bold tracking-wider text-primary-foreground bg-primary"
                : label === "SIGN IN"
                ? "px-4 py-2 text-xs font-bold tracking-wider text-foreground border border-foreground"
                : "px-4 py-2 text-xs font-bold tracking-wider text-foreground border border-border"
            }
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {label}
          </motion.button>
        ))}
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
            {["HOW IT WORKS", "SIGN UP", "SIGN IN"].map((label, i) => (
              <motion.button
                key={label}
                className={
                  label === "SIGN UP"
                    ? "w-full px-4 py-3 text-xs font-bold tracking-wider text-primary-foreground bg-primary"
                    : label === "SIGN IN"
                    ? "w-full px-4 py-3 text-xs font-bold tracking-wider text-foreground border border-foreground"
                    : "w-full px-4 py-3 text-xs font-bold tracking-wider text-foreground border border-border"
                }
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                whileTap={{ scale: 0.97 }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
