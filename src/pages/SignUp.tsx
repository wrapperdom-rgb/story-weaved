import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email to confirm your account!");
      navigate("/sign-in");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm border border-border bg-background p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-sm font-bold tracking-[0.3em] text-foreground text-center mb-8">
          CREATE ACCOUNT
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4">
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
              minLength={6}
              className="mt-1 w-full px-3 py-3 text-xs bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors font-mono"
              placeholder="Min 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold tracking-[0.3em] bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "CREATING..." : "SIGN UP"}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] tracking-wider text-muted-foreground">
          ALREADY HAVE AN ACCOUNT?{" "}
          <Link to="/sign-in" className="text-foreground underline">SIGN IN</Link>
        </p>

        <Link to="/" className="block mt-4 text-center text-[10px] tracking-wider text-muted-foreground hover:text-foreground">
          ← BACK TO GALLERY
        </Link>
      </motion.div>
    </div>
  );
};

export default SignUp;
