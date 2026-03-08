import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Download, Copy, Camera } from "lucide-react";

interface HowItWorksModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Sparkles,
    title: "PICK A STYLE",
    description: "Browse the gallery and find a look you love. Free prompts are marked — premium ones require a subscription.",
  },
  {
    icon: Download,
    title: "DOWNLOAD & COPY",
    description: "Click on the image to view it. Download the reference image and copy the AI prompt to your clipboard.",
  },
  {
    icon: Camera,
    title: "ADD YOUR FACE",
    description: "Open an AI image tool (like Gemini, Midjourney, or similar). Upload your face photo alongside the reference image.",
  },
  {
    icon: Copy,
    title: "PASTE & GENERATE",
    description: "Paste the prompt you copied and hit generate. The AI will recreate the style with your face. See the magic happen.",
  },
];

const HowItWorksModal = ({ open, onClose }: HowItWorksModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-foreground/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-background border border-border max-w-md w-full max-h-[90vh] overflow-y-auto z-10"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-sm font-bold tracking-[0.2em] text-foreground">HOW IT WORKS</h2>
              <button
                onClick={onClose}
                className="p-1 text-foreground hover:bg-accent transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground">
                    <step.icon size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold tracking-wider text-foreground">
                      {`${i + 1}. ${step.title}`}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              <div className="pt-4 border-t border-border">
                <p className="text-[10px] text-muted-foreground text-center tracking-wider">
                  WORKS WITH GEMINI • MIDJOURNEY • FLUX • AND MORE
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HowItWorksModal;
