import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Crown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PricingSection = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetAccess = async () => {
    if (!user) {
      toast.info("Please sign in first to purchase");
      navigate("/signin");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          customer_email: user.email,
          return_url: window.location.origin,
        },
      });

      if (error) throw error;
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 border-t border-border bg-secondary/30">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto text-center"
      >
        <span className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground">
          PRICING
        </span>

        <div className="mt-8 border border-border bg-background p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-foreground" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
          <Crown size={12} className="absolute top-2 right-2 text-background" />

          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-bold tracking-tighter text-foreground">$1</span>
          </div>

          <p className="text-xs tracking-[0.3em] font-bold text-foreground mb-6">
            10 PREMIUM PROMPTS
          </p>

          <div className="space-y-3 text-left mb-8">
            {[
              { icon: Sparkles, text: "Access any 10 premium AI prompts" },
              { icon: Zap, text: "High-quality editorial & cinematic styles" },
              { icon: Crown, text: "Instant copy & download" },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <Icon size={14} className="text-foreground flex-shrink-0" />
                <span className="text-[11px] tracking-wider text-muted-foreground">{text}</span>
              </motion.div>
            ))}
          </div>

          <button
            onClick={handleGetAccess}
            disabled={loading}
            className="w-full py-3 text-xs font-bold tracking-[0.3em] bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                PROCESSING...
              </>
            ) : (
              "GET ACCESS"
            )}
          </button>

          <p className="mt-4 text-[9px] tracking-wider text-muted-foreground">
            ONE-TIME PAYMENT · NO SUBSCRIPTION
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default PricingSection;
