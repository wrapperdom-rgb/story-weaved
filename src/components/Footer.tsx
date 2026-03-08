import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="border-t border-border bg-background px-6 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h3 className="text-sm font-bold tracking-[0.3em] text-foreground">M V S T R</h3>
          <p className="mt-1 text-[10px] tracking-wider text-muted-foreground">
            AI STYLE PROMPTS · CURATED FOR YOU
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-[10px] tracking-wider text-muted-foreground hover:text-foreground transition-colors">
            TERMS
          </a>
          <a href="#" className="text-[10px] tracking-wider text-muted-foreground hover:text-foreground transition-colors">
            PRIVACY
          </a>
          <a href="#" className="text-[10px] tracking-wider text-muted-foreground hover:text-foreground transition-colors">
            CONTACT
          </a>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[9px] tracking-wider text-muted-foreground">
          © {new Date().getFullYear()} MVSTR. ALL RIGHTS RESERVED.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
