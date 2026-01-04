import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CosmicButton } from "@/components/CosmicButton";
import { DimensionCard } from "@/components/DimensionCard";
import { MultiverseBackground } from "@/components/MultiverseBackground";
import { Briefcase, MapPin, Heart, GraduationCap, Scale, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { Textarea } from "@/components/ui/textarea";

const DIVERGENCE_AXES = [
  { value: "career", label: "Career Path", description: "What if you chose a different profession?", icon: Briefcase, prompt: "What career path did you almost take? What job or field were you considering but didn't pursue?" },
  { value: "location", label: "Location", description: "What if you moved somewhere else?", icon: MapPin, prompt: "What city or country did you almost move to? Or where did you wish you had stayed?" },
  { value: "relationship", label: "Relationships", description: "What if a key relationship went differently?", icon: Heart, prompt: "Describe a relationship (romantic, family, or friendship) that could have gone differently. What happened and what might have been?" },
  { value: "education", label: "Education", description: "What if you studied something else?", icon: GraduationCap, prompt: "What degree, field, or skill did you consider pursuing but didn't? What school or path did you almost take?" },
  { value: "values", label: "Value System", description: "What if you had different priorities?", icon: Scale, prompt: "What different values or beliefs might have shaped your life? What priorities could have changed everything?" },
];

interface UserRecord {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  country?: string;
  city?: string;
  highest_education?: string;
  field_of_study?: string;
  current_occupation?: string;
  family_status?: string;
  religion_or_spirituality?: string;
  personality_vector?: { type?: string };
  values?: string[];
  major_choices?: string[];
  unchosen_path?: string;
  life_regret?: string;
  life_challenges?: string;
}

const Generator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAxis, setSelectedAxis] = useState("");
  const [divergencePoint, setDivergencePoint] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<UserRecord | null>(null);
  const isDemo = userId === "demo-user" || import.meta.env.VITE_SUPABASE_URL?.includes("xawscxdrwzjzghshudpx");

  useEffect(() => {
    if (isDemo || userId === "demo-user") {
      const demoData = localStorage.getItem("lokah_onboarding_data");
      const parsed = demoData ? JSON.parse(demoData) : {};
      setUser({
        id: "demo-user",
        name: parsed.name || "Demo User",
        age: parsed.age ? parseInt(parsed.age) : undefined,
        gender: parsed.gender,
        country: parsed.country,
        city: parsed.city,
        highest_education: parsed.education,
        field_of_study: parsed.fieldOfStudy,
        current_occupation: parsed.occupation,
        family_status: parsed.familyStatus,
        religion_or_spirituality: parsed.religion,
        personality_vector: { type: parsed.personalityType },
        values: parsed.values ? parsed.values.split(",").map((v: string) => v.trim()) : ["curiosity", "growth"],
        major_choices: [parsed.majorChoice || "Taking a different path"],
        unchosen_path: parsed.unchosenPath || "The road not taken",
        life_regret: parsed.lifeRegret,
        life_challenges: parsed.lifeChallenges,
      });
      return;
    }

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
  }, [userId, navigate, isDemo]);

  const handleAxisSelect = (axis: string) => {
    setSelectedAxis(axis);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setDivergencePoint("");
  };

  const handleGenerate = async () => {
    if (!selectedAxis || !user || !divergencePoint.trim()) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-alternate-self", {
        body: {
          userId: user.id,
          axis: selectedAxis,
          divergencePoint: divergencePoint,
          userData: {
            name: user.name,
            age: user.age,
            gender: user.gender,
            country: user.country,
            city: user.city,
            education: user.highest_education,
            fieldOfStudy: user.field_of_study,
            occupation: user.current_occupation,
            familyStatus: user.family_status,
            religion: user.religion_or_spirituality,
            personalityType: user.personality_vector?.type,
            values: user.values,
            major_choices: user.major_choices,
            unchosen_path: user.unchosen_path,
            life_regret: user.life_regret,
            life_challenges: user.life_challenges,
          },
        },
      });

      if (error) throw error;

      toast.success("Your parallel self has been created!");
      navigate("/chat", { state: { alternateSelfId: data.id, userId: user.id } });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to generate Alternate Self");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedAxisData = DIVERGENCE_AXES.find(a => a.value === selectedAxis);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(30 15% 6%)]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(35_35%_65%)]" />
          <span className="text-white/40 text-sm">Loading your profile...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-display bg-[hsl(30 15% 6%)] text-white overflow-hidden pb-40">
      <MultiverseBackground />
      <div className="fixed inset-0 bg-[hsl(30 15% 6%)]/50 backdrop-blur-[2px] -z-10" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="absolute inset-0 -z-10" style={{ background: 'hsl(30 15% 6% / 0.6)', backdropFilter: 'blur(16px)', borderBottom: '1px solid hsl(0 0% 100% / 0.04)' }} />
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo size={24} asLink />
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(35_35%_65%)] animate-pulse" />
            <span>Welcome, {user.name}</span>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {/* Step 1: Axis Selection */}
            <div className="relative z-10 pt-28 pb-12 px-6 text-center max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(35_35%_65%)]" />
                  <span className="text-[hsl(35_35%_65%)] font-mono text-[10px] tracking-[0.2em] uppercase">Step 1 of 2</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-white">Where did the path </span>
                  <span className="text-[hsl(35_35%_65%)]">diverge?</span>
                </h1>
                <p className="text-white/40 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                  Select how your parallel self's life differs from yours.
                </p>
              </motion.div>
            </div>

            <main className="relative z-10 px-6 max-w-6xl mx-auto">
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {DIVERGENCE_AXES.map((axis, index) => (
                  <motion.div key={axis.value} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                    <DimensionCard {...axis} isSelected={selectedAxis === axis.value} onClick={() => handleAxisSelect(axis.value)} />
                  </motion.div>
                ))}
              </motion.div>
            </main>
          </motion.div>
        ) : (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {/* Step 2: Divergence Point Input */}
            <div className="relative z-10 pt-28 pb-8 px-6 max-w-2xl mx-auto">
              <button onClick={handleBack} className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to selection</span>
              </button>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(35_35%_65%)]" />
                  <span className="text-[hsl(35_35%_65%)] font-mono text-[10px] tracking-[0.2em] uppercase">Step 2 of 2 • {selectedAxisData?.label}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-white">Tell us about this </span>
                  <span className="text-[hsl(35_35%_65%)]">divergence</span>
                </h2>
                <p className="text-white/40 text-base max-w-xl mx-auto">
                  {selectedAxisData?.prompt}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                <div className="p-6 rounded-2xl bg-[hsl(30_12%_8%)] border border-[hsl(35_20%_15%)]">
                  <Textarea
                    value={divergencePoint}
                    onChange={(e) => setDivergencePoint(e.target.value)}
                    placeholder="Describe the path you didn't take, the decision you almost made, or the life you wonder about..."
                    className="min-h-[150px] bg-transparent border-none text-white placeholder:text-white/30 resize-none focus:ring-0 text-base leading-relaxed"
                  />
                </div>

                {/* User context preview */}
                <div className="p-4 rounded-xl bg-[hsl(35_35%_65%/0.05)] border border-[hsl(35_35%_65%/0.1)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[hsl(35_35%_65%)]" />
                    <span className="text-xs text-[hsl(35_35%_65%)] font-medium uppercase tracking-wider">Using your profile</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Your parallel self will be based on your profile: {user.name}, {user.age && `${user.age} years old, `}
                    {user.current_occupation && `working as ${user.current_occupation}, `}
                    {user.city && user.country && `living in ${user.city}, ${user.country}. `}
                    {user.values && user.values.length > 0 && `Values: ${user.values.join(", ")}.`}
                  </p>
                </div>

                <CosmicButton
                  label={isGenerating ? "Creating your parallel self..." : "Create Parallel Self"}
                  onClick={handleGenerate}
                  disabled={isGenerating || !divergencePoint.trim()}
                  loading={isGenerating}
                  size="lg"
                  className="w-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Generator;
