import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CosmicButton } from "@/components/CosmicButton";
import { DimensionCard } from "@/components/DimensionCard";
import { MultiverseBackground } from "@/components/MultiverseBackground";
import { Briefcase, MapPin, Heart, GraduationCap, Scale, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const DIVERGENCE_AXES = [
  { value: "career", label: "Career Path", description: "Diverge into a reality where you chose a different profession.", icon: Briefcase },
  { value: "location", label: "Location", description: "Wake up in a city you almost moved to, or never left.", icon: MapPin },
  { value: "relationship", label: "Relationships", description: "Explore the 'what if' of a key romantic or social bond.", icon: Heart },
  { value: "education", label: "Education", description: "Pursue the degree or field of study you left behind.", icon: GraduationCap },
  { value: "values", label: "Value System", description: "Live a life guided by a completely different moral compass.", icon: Scale },
];

const Generator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [selectedAxis, setSelectedAxis] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  interface UserRecord {
    id: string;
    name: string;
    values?: string[];
    major_choices?: string[];
    unchosen_path?: string;
  }
  const [user, setUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    if (!userId) {
      toast.error("Please complete onboarding first");
      navigate("/onboarding");
      return;
    }

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        toast.error("Failed to load user data");
        navigate("/onboarding");
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleGenerate = async () => {
    if (!selectedAxis || !user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-alternate-self", {
        body: {
          userId: user.id,
          axis: selectedAxis,
          userData: {
            name: user.name,
            values: user.values,
            major_choices: user.major_choices,
            unchosen_path: user.unchosen_path,
          },
        },
      });

      if (error) throw error;

      toast.success("Identity Matrix Synchronized.");
      navigate("/chat", { state: { alternateSelfId: data.id, userId: user.id } });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to generate Alternate Self");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220 25% 4%)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(35_35%_65%)]" />
          <span className="text-white/40 text-sm">Loading your profile...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-[Outfit] bg-[hsl(220 25% 4%)] text-white overflow-hidden pb-40">

      {/* Background Effects */}
      <MultiverseBackground />
      <div className="fixed inset-0 bg-[hsl(220 25% 4%)]/50 backdrop-blur-[2px] -z-10" />

      {/* Ambient Orbs */}
      <motion.div
        className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(35 35% 65% / 0.12) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'hsl(222 47% 3% / 0.6)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid hsl(0 0% 100% / 0.04)',
          }}
        />
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo size={24} asLink />
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(35_35%_65%)] animate-pulse" />
            <span>Welcome, {user.name}</span>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="relative z-10 pt-28 pb-12 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(35_35%_65%)]" />
            <span className="text-[hsl(35_35%_65%)] font-mono text-[10px] tracking-[0.2em] uppercase">
              Dimension Selector
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-['Clash_Display'] font-bold mb-6">
            <span className="text-white">Where did the path </span>
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, hsl(35 35% 65%) 0%, hsl(35 35% 65%) 100%)',
              }}
            >
              diverge?
            </span>
          </h1>

          <p className="text-white/40 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Select a core variable to alter. The system will extrapolate a new timeline based on this deviation.
          </p>
        </motion.div>
      </div>

      {/* Dimension Cards Grid */}
      <main className="relative z-10 px-6 max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {DIVERGENCE_AXES.map((axis, index) => (
            <motion.div
              key={axis.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
            >
              <DimensionCard
                {...axis}
                isSelected={selectedAxis === axis.value}
                onClick={() => setSelectedAxis(axis.value)}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Floating Checkout Bar */}
      <AnimatePresence>
        {selectedAxis && (
          <motion.div
            className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <div
              className="flex items-center gap-6 px-6 py-4 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(222 47% 6% / 0.95) 0%, hsl(222 47% 4% / 0.98) 100%)',
                border: '1px solid hsl(0 0% 100% / 0.08)',
                boxShadow: '0 25px 50px -12px hsl(0 0% 0% / 0.5), 0 0 40px -10px hsl(35 35% 65% / 0.15)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Selected Info */}
              <div className="hidden md:flex flex-col pl-2 text-left">
                <span className="text-[9px] text-white/30 tracking-[0.2em] uppercase">
                  Target Reality
                </span>
                <span className="text-[hsl(35_35%_65%)] font-mono text-sm font-medium">
                  {DIVERGENCE_AXES.find(a => a.value === selectedAxis)?.label || "Select..."}
                </span>
              </div>

              <div className="h-8 w-px bg-white/[0.08] hidden md:block" />

              {/* CTA Button */}
              <CosmicButton
                label={isGenerating ? "Synthesizing..." : "Initialize Timeline"}
                onClick={handleGenerate}
                disabled={isGenerating}
                loading={isGenerating}
                size="md"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(35 35% 65%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(35 35% 65%) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
};

export default Generator;
