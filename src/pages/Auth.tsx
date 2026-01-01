import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { GlassButton } from "@/components/GlassButton";
import { Loader2 } from "lucide-react";

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

    // Check for Demo Mode
    const isDemo = import.meta.env.VITE_SUPABASE_URL?.includes("xawscxdrwzjzghshudpx");

    if (isDemo) {
      setTimeout(() => {
        localStorage.setItem("lokah_demo_session", "true");
        toast.success("Demo Mode: Signed in successfully");
        navigate("/onboarding");
        window.location.reload();
      }, 1500);
      return;
    }

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
      if (err?.message?.includes("Failed to fetch") && isDemo) {
        localStorage.setItem("lokah_demo_session", "true");
        toast.success("Network error: Switching to Demo Mode");
        navigate("/onboarding");
        window.location.reload();
        return;
      }
      toast.error(err?.message || "An error occurred");
    } finally {
      if (!isDemo) setLoading(false);
    }
  };

  const inputClassName = `
    w-full px-4 py-3.5 rounded-xl 
    bg-white/[0.03] border border-white/[0.08]
    text-white placeholder-white/25
    focus:outline-none focus:border-[hsl(35_35%_65%/0.5)] 
    focus:ring-1 focus:ring-[hsl(35_35%_65%/0.3)]
    hover:border-white/15 hover:bg-white/[0.04]
    transition-all duration-300
  `;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[hsl(220 25% 4%)] font-[Outfit]">

      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -20%, hsl(35 35% 65% / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 100%, hsl(35 35% 65% / 0.1) 0%, transparent 50%),
            hsl(222 47% 3%)
          `,
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: i % 2 === 0 ? 'hsl(35 35% 65%)' : 'hsl(35 35% 65%)',
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Auth Card */}
      <motion.div
        className="relative z-20 w-full max-w-md p-8 md:p-10 mx-4 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(222 47% 6% / 0.9) 0%, hsl(222 47% 4% / 0.95) 100%)',
          border: '1px solid hsl(0 0% 100% / 0.06)',
          boxShadow: '0 25px 50px -12px hsl(0 0% 0% / 0.5), 0 0 40px -10px hsl(35 35% 65% / 0.1)',
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Card Glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'hsl(35 35% 65%)' }}
        />

        {/* Logo */}
        <motion.div
          className="flex justify-center items-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Logo size={48} />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2
            className="text-3xl font-['Clash_Display'] text-center mb-2 font-semibold text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(35 35% 65%) 100%)',
            }}
          >
            {isSignUp ? "Begin Journey" : "Welcome Back"}
          </h2>
          <p className="text-base text-white/40 text-center mb-8 font-light">
            {isSignUp ? "Connect with your multiverse self." : "The cosmos awaits your return."}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          className="space-y-5"
          onSubmit={handleAuth}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] uppercase tracking-[0.15em] text-white/50 ml-1">
                Traveler Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClassName}
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] uppercase tracking-[0.15em] text-white/50 ml-1">
              Email Coordinates
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] uppercase tracking-[0.15em] text-white/50 ml-1">
              Secret Key
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={6}
              className={inputClassName}
            />
          </div>

          <div className="pt-4">
            <GlassButton
              type="submit"
              variant="primary"
              label={
                loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isSignUp ? "Initiating..." : "Authenticating..."}
                  </span>
                ) : (
                  isSignUp ? "Create Identity" : "Enter Portal"
                )
              }
              disabled={loading}
              className="w-full text-base py-4"
            />
          </div>
        </motion.form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4 text-[10px] text-white/20 uppercase tracking-[0.2em]">
          <div className="h-px bg-white/[0.06] flex-1" />
          <span>OR</span>
          <div className="h-px bg-white/[0.06] flex-1" />
        </div>

        {/* Toggle */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white/50 hover:text-[hsl(35_35%_65%)] transition-colors text-sm tracking-wide"
          >
            {isSignUp ? "Already have an account? Sign In" : "New to the multiverse? Create Account"}
          </button>
        </div>
      </motion.div>

      {/* Footer Text */}
      <motion.p
        className="absolute bottom-6 text-[10px] text-white/20 tracking-[0.15em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Lokah • Many Worlds, One You
      </motion.p>
    </div>
  );
};

export default Auth;
