import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Enter your email");
      return;
    }
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for reset link");
      setShowForgot(false);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-sm border border-border bg-background p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-sm font-bold tracking-[0.3em] text-foreground text-center mb-8">
            RESET PASSWORD
          </h1>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-muted-foreground">EMAIL</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="mt-1 w-full px-3 py-3 text-xs bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors font-mono"
                placeholder="you@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full py-3 text-xs font-bold tracking-[0.3em] bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {forgotLoading ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </form>

          <button
            onClick={() => setShowForgot(false)}
            className="block mt-4 w-full text-center text-[10px] tracking-wider text-muted-foreground hover:text-foreground"
          >
            ← BACK TO SIGN IN
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm border border-border bg-background p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-sm font-bold tracking-[0.3em] text-foreground text-center mb-8">
          SIGN IN
        </h1>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold tracking-wider text-muted-foreground">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-3 text-xs bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors font-mono"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-wider text-muted-foreground">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-3 text-xs bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors font-mono"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold tracking-[0.3em] bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <button
          onClick={() => setShowForgot(true)}
          className="block mt-3 w-full text-center text-[10px] tracking-wider text-muted-foreground hover:text-foreground"
        >
          FORGOT PASSWORD?
        </button>

        <p className="mt-4 text-center text-[10px] tracking-wider text-muted-foreground">
          DON'T HAVE AN ACCOUNT?{" "}
          <Link to="/sign-up" className="text-foreground underline">SIGN UP</Link>
        </p>

        <Link to="/" className="block mt-4 text-center text-[10px] tracking-wider text-muted-foreground hover:text-foreground">
          ← BACK TO GALLERY
        </Link>
      </motion.div>
    </div>
  );
};

export default SignIn;
