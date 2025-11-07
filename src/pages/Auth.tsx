import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import LogoWordmark from "@/components/LogoWordmark";
import { GlassButton } from "@/components/GlassButton";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/");
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name }, emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Welcome to Lokah! Sign in to continue.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back to Lokah.");
        navigate("/");
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#0B0C10] overflow-hidden font-[Inter]">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#0B0C10] via-[#0E1A2E] to-[#13213A]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Starfield */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/40 rounded-full"
            initial={{
              opacity: Math.random() * 0.5,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{ y: [Math.random() * 100, Math.random() * window.innerHeight], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 20 + Math.random() * 20, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Auth Card */}
      <motion.div
        className="relative z-20 w-[90%] sm:w-[420px] rounded-3xl p-8 backdrop-blur-md border border-white/10 shadow-[0_0_25px_rgba(113,208,227,0.2)] bg-[#141E32]/70 before:absolute before:inset-0 before:rounded-3xl before:p-[1px] before:bg-gradient-to-r before:from-[#B693FF]/30 before:to-[#71D0E3]/30 before:blur-[2px] before:-z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Logo Wordmark */}
        <div className="flex justify-center items-center mb-6">
          <LogoWordmark size={28} />
        </div>

        {/* Heading */}
        <h2 className="text-2xl text-white font-[ClashDisplay] text-center mb-2">
          {isSignUp ? "Join Lokah" : "Welcome Back"}
        </h2>
        <p className="text-sm text-[#A0AEC0] text-center mb-8">
          {isSignUp ? "Create an account to meet your alternate selves" : "Sign in to continue your exploration."}
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleAuth}>
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-[#F5F7FA]">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1B2436]/70 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71D0E3]/40 transition"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-[#F5F7FA]">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-[#1B2436]/70 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71D0E3]/40 transition"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-[#F5F7FA]">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-[#1B2436]/70 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71D0E3]/40 transition"
            />
          </div>

          <GlassButton type="submit" label={loading ? (isSignUp ? "Creating..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")} disabled={loading} />
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-sm text-[#A0AEC0]">or</div>

        {/* Secondary Actions */}
        <div className="text-center text-sm text-[#A6CFFF]">
          {isSignUp ? "Already have an account? " : "Don’t have an account? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#B693FF] to-[#71D0E3] hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </motion.div>

      {/* Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(113,208,227,0.15)_0%,transparent_80%)] blur-3xl" />
    </div>
  );
};

export default Auth;
