import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";


const TOTAL_STEPS = 8;

interface FormData {
  name: string;
  age: string;
  gender: string;
  pronouns: string;
  country: string;
  state: string;
  city: string;
  education: string;
  fieldOfStudy: string;
  occupation: string;
  familyStatus: string;
  familyBackground: string;
  economicStatus: string;
  employmentSecurity: string;
  familyIssues: string[];
  religion: string;
  ethnicity: string;
  languages: string;
  personalityType: string;
  values: string;
  lifeRegret: string;
  lifeChallenges: string;
  definingMoments: string;
  majorChoice: string;
  unchosenPath: string;
  allowDataUsage: boolean;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for back

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    pronouns: "",
    country: "",
    state: "",
    city: "",
    education: "",
    fieldOfStudy: "",
    occupation: "",
    familyStatus: "",
    familyBackground: "",
    economicStatus: "",
    employmentSecurity: "",
    familyIssues: [],
    religion: "",
    ethnicity: "",
    languages: "",
    personalityType: "",
    values: "",
    lifeRegret: "",
    lifeChallenges: "",
    definingMoments: "",
    majorChoice: "",
    unchosenPath: "",
    allowDataUsage: true,
  });

  const updateField = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS && canProceed()) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .upsert({
          name: formData.name,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || null,
          pronouns: formData.pronouns || null,
          country: formData.country || null,
          state: formData.state || null,
          city: formData.city || null,
          highest_education: formData.education || null,
          field_of_study: formData.fieldOfStudy || null,
          current_occupation: formData.occupation || null,
          family_status: formData.familyStatus || null,
          family_economic_background: formData.familyBackground || null,
          current_economic_status: formData.economicStatus || null,
          employment_security: formData.employmentSecurity || null,
          family_issues: formData.familyIssues,
          religion_or_spirituality: formData.religion || null,
          ethnicity: formData.ethnicity || null,
          languages_spoken: formData.languages ? formData.languages.split(",").map((l) => l.trim()) : [],
          personality_vector: { type: formData.personalityType },
          values: formData.values.split(",").map((v) => v.trim()).filter(Boolean),
          life_regret: formData.lifeRegret || null,
          life_challenges: formData.lifeChallenges || null,
          defining_moments: formData.definingMoments ? formData.definingMoments.split("\n").filter(Boolean) : [],
          major_choices: [formData.majorChoice],
          unchosen_path: formData.unchosenPath,
          allow_data_usage: formData.allowDataUsage,
          completed_at: new Date().toISOString(),
          auth_user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("You're all set — let's start exploring.");
      navigate("/generator", { state: { userId: data.id } });
    } catch (error: unknown) {
      console.error("Onboarding error:", error);
      const message = error instanceof Error ? error.message : "Failed to complete onboarding";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for step transitions
  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  // Input styling
  const inputClassName = `
    bg-white/[0.03] border-white/[0.08] rounded-xl
    focus:border-[hsl(35_35%_65%/0.5)] focus:ring-1 focus:ring-[hsl(35_35%_65%/0.3)]
    transition-all duration-300 text-white placeholder:text-white/30
    hover:border-white/15 hover:bg-white/[0.04]
  `;

  const labelClassName = "text-base font-medium text-white/90";

  const renderStep = () => {
    const content = (() => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className={labelClassName}>What's your name?</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={`mt-2 ${inputClassName}`}
                />
              </div>
              <div>
                <Label htmlFor="age" className={labelClassName}>How old are you?</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  placeholder="Your age"
                  className={`mt-2 ${inputClassName}`}
                />
              </div>
              <div>
                <Label htmlFor="pronouns" className={labelClassName}>What are your pronouns? (optional)</Label>
                <Input
                  id="pronouns"
                  value={formData.pronouns}
                  onChange={(e) => updateField("pronouns", e.target.value)}
                  placeholder="e.g., she/her, he/him, they/them"
                  className={`mt-2 ${inputClassName}`}
                />
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="country" className={labelClassName}>Where in the world are you?</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  placeholder="Country"
                  className={`mt-2 ${inputClassName}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state" className={labelClassName}>State/Region</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="State or region"
                    className={`mt-2 ${inputClassName}`}
                  />
                </div>
                <div>
                  <Label htmlFor="city" className={labelClassName}>City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Your city"
                    className={`mt-2 ${inputClassName}`}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="languages" className={labelClassName}>What languages do you speak?</Label>
                <Input
                  id="languages"
                  value={formData.languages}
                  onChange={(e) => updateField("languages", e.target.value)}
                  placeholder="e.g., English, Spanish, Mandarin"
                  className={`mt-2 ${inputClassName}`}
                />
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="education" className={labelClassName}>Highest level of education</Label>
                <Select value={formData.education} onValueChange={(value) => updateField("education", value)}>
                  <SelectTrigger className={`mt-2 ${inputClassName}`}>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0e14] border-white/10">
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fieldOfStudy" className={labelClassName}>What did you study? (optional)</Label>
                <Input
                  id="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={(e) => updateField("fieldOfStudy", e.target.value)}
                  placeholder="Your field of study"
                  className={`mt-2 ${inputClassName}`}
                />
              </div>
              <div>
                <Label htmlFor="occupation" className={labelClassName}>What do you do for work?</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  placeholder="Current occupation or aspiration"
                  className={`mt-2 ${inputClassName}`}
                />
              </div>
            </div>
          );

        case 4:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="familyStatus" className={labelClassName}>What's your family situation?</Label>
                <Select value={formData.familyStatus} onValueChange={(value) => updateField("familyStatus", value)}>
                  <SelectTrigger className={`mt-2 ${inputClassName}`}>
                    <SelectValue placeholder="Select family status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0e14] border-white/10">
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="relationship">In a relationship</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="complicated">It's complicated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="familyBackground" className={labelClassName}>How would you describe your family background?</Label>
                <Select value={formData.familyBackground} onValueChange={(value) => updateField("familyBackground", value)}>
                  <SelectTrigger className={`mt-2 ${inputClassName}`}>
                    <SelectValue placeholder="Select background" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0e14] border-white/10">
                    <SelectItem value="supportive">Very supportive</SelectItem>
                    <SelectItem value="traditional">Traditional/conservative</SelectItem>
                    <SelectItem value="liberal">Progressive/liberal</SelectItem>
                    <SelectItem value="strict">Strict/demanding</SelectItem>
                    <SelectItem value="distant">Emotionally distant</SelectItem>
                    <SelectItem value="complicated">Complicated dynamics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );

        case 5:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="economicStatus" className={labelClassName}>Current economic situation</Label>
                <Select value={formData.economicStatus} onValueChange={(value) => updateField("economicStatus", value)}>
                  <SelectTrigger className={`mt-2 ${inputClassName}`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0e14] border-white/10">
                    <SelectItem value="struggling">Financial hardship</SelectItem>
                    <SelectItem value="modest">Getting by</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="affluent">Affluent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="employmentSecurity" className={labelClassName}>How secure is your employment?</Label>
                <Select value={formData.employmentSecurity} onValueChange={(value) => updateField("employmentSecurity", value)}>
                  <SelectTrigger className={`mt-2 ${inputClassName}`}>
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0e14] border-white/10">
                    <SelectItem value="very_secure">Very secure</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="uncertain">Uncertain</SelectItem>
                    <SelectItem value="precarious">Precarious</SelectItem>
                    <SelectItem value="not_applicable">Not applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );

        case 6:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="personalityType" className={labelClassName}>How would you describe yourself?</Label>
                <Select value={formData.personalityType} onValueChange={(value) => updateField("personalityType", value)}>
                  <SelectTrigger className={`mt-2 ${inputClassName}`}>
                    <SelectValue placeholder="Select personality type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0e14] border-white/10">
                    <SelectItem value="introvert">Introvert</SelectItem>
                    <SelectItem value="extrovert">Extrovert</SelectItem>
                    <SelectItem value="ambivert">Ambivert (both)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="values" className={labelClassName}>What are your core values?</Label>
                <p className="text-sm text-white/40 mt-1 mb-2">
                  List 3-5 values that guide your life
                </p>
                <Textarea
                  id="values"
                  value={formData.values}
                  onChange={(e) => updateField("values", e.target.value)}
                  placeholder="family, creativity, authenticity..."
                  className={inputClassName}
                  rows={3}
                />
              </div>
            </div>
          );

        case 7:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="majorChoice" className={labelClassName}>Tell me about a major life choice you've made</Label>
                <p className="text-sm text-white/40 mt-1 mb-2">
                  This could be about career, education, relationships, or where you live
                </p>
                <Textarea
                  id="majorChoice"
                  value={formData.majorChoice}
                  onChange={(e) => updateField("majorChoice", e.target.value)}
                  placeholder="I chose to study engineering instead of pursuing art..."
                  className={inputClassName}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="unchosenPath" className={labelClassName}>What's a path you didn't take but wonder about?</Label>
                <p className="text-sm text-white/40 mt-1 mb-2">
                  A dream, choice, or version of life that almost happened
                </p>
                <Textarea
                  id="unchosenPath"
                  value={formData.unchosenPath}
                  onChange={(e) => updateField("unchosenPath", e.target.value)}
                  placeholder="I always wondered what life would be like if I had moved abroad..."
                  className={inputClassName}
                  rows={4}
                />
              </div>
            </div>
          );

        case 8:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="lifeRegret" className={labelClassName}>Is there something you deeply regret? (optional)</Label>
                <Textarea
                  id="lifeRegret"
                  value={formData.lifeRegret}
                  onChange={(e) => updateField("lifeRegret", e.target.value)}
                  placeholder="This is a safe space..."
                  className={inputClassName}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="lifeChallenges" className={labelClassName}>What challenges have shaped you? (optional)</Label>
                <Textarea
                  id="lifeChallenges"
                  value={formData.lifeChallenges}
                  onChange={(e) => updateField("lifeChallenges", e.target.value)}
                  placeholder="Loss, hardship, obstacles you've faced..."
                  className={inputClassName}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <Checkbox
                  id="allowDataUsage"
                  checked={formData.allowDataUsage}
                  onCheckedChange={(checked) => updateField("allowDataUsage", !!checked)}
                  className="border-white/20 data-[state=checked]:bg-[hsl(35_35%_65%)] data-[state=checked]:border-[hsl(35_35%_65%)]"
                />
                <label
                  htmlFor="allowDataUsage"
                  className="text-sm text-white/60 leading-relaxed cursor-pointer"
                >
                  I consent to Lokah using my data to create meaningful Alternate Self experiences
                </label>
              </div>
            </div>
          );

        default:
          return null;
      }
    })();

    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== "" && formData.age.trim() !== "";
      case 2:
        return formData.country.trim() !== "";
      case 3:
        return formData.occupation.trim() !== "";
      case 6:
        return formData.values.trim() !== "";
      case 7:
        return formData.majorChoice.trim() !== "" && formData.unchosenPath.trim() !== "";
      default:
        return true;
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Let's start with you",
      "Where are you from?",
      "Your education & work",
      "About your family",
      "Your economic landscape",
      "Your inner world",
      "Your life choices",
      "Reflections & consent"
    ];
    return titles[currentStep - 1] || "";
  };

  const getStepDescription = () => {
    const descriptions = [
      "Tell me your name and a bit about yourself",
      "Understanding your cultural and geographical context",
      "Your professional and educational journey",
      "The people and relationships that matter",
      "Your financial situation and work stability",
      "What drives you and what you value most",
      "The paths you took and those you didn't",
      "Final thoughts and your permission"
    ];
    return descriptions[currentStep - 1] || "";
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[hsl(220 25% 4%)]" />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% -20%, hsl(35 35% 65% / 0.12) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 70% 120%, hsl(35 35% 65% / 0.1) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative z-10 w-full max-w-2xl space-y-6">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-4">
            <Logo size={28} />
          </div>
          <p className="text-white/40 text-sm">Preparing your Alternate Self</p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between text-sm text-white/50">
            <span>Step {currentStep} of {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>

          {/* Custom Progress Bar */}
          <div className="relative h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, hsl(35 35% 65%), hsl(35 35% 65%))',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Glow effect */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full blur-sm"
              style={{
                background: 'linear-gradient(90deg, hsl(35 35% 65%), hsl(35 35% 65%))',
                opacity: 0.5,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between px-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i + 1 <= currentStep
                    ? 'bg-[hsl(35_35%_65%)]'
                    : 'bg-white/10'
                  }`}
                animate={{
                  scale: i + 1 === currentStep ? [1, 1.3, 1] : 1,
                }}
                transition={{ duration: 1, repeat: i + 1 === currentStep ? Infinity : 0 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="relative overflow-hidden rounded-2xl p-8 md:p-10"
          style={{
            background: 'linear-gradient(135deg, hsl(222 47% 6% / 0.9) 0%, hsl(222 47% 4% / 0.95) 100%)',
            border: '1px solid hsl(0 0% 100% / 0.06)',
            boxShadow: '0 25px 50px -12px hsl(0 0% 0% / 0.5), 0 0 40px -10px hsl(35 35% 65% / 0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Card glow effect */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: 'hsl(35 35% 65%)' }}
          />

          <div className="relative z-10 space-y-6">
            {/* Step Header */}
            <div>
              <motion.h2
                className="text-2xl font-['Clash_Display'] font-semibold text-transparent bg-clip-text mb-2"
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(42 90% 60%) 0%, hsl(35 35% 65%) 100%)',
                }}
                key={`title-${currentStep}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {getStepTitle()}
              </motion.h2>
              <motion.p
                className="text-white/40"
                key={`desc-${currentStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {getStepDescription()}
              </motion.p>
            </div>

            {/* Form Content */}
            <div className="min-h-[280px]">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 gap-4">
              <GlassButton
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 1}
                label="Back"
                size="md"
                className="min-w-[120px]"
              />

              {currentStep < TOTAL_STEPS ? (
                <GlassButton
                  onClick={handleNext}
                  disabled={!canProceed()}
                  label="Continue"
                  size="md"
                  className="min-w-[140px]"
                />
              ) : (
                <GlassButton
                  onClick={handleComplete}
                  disabled={!canProceed() || isLoading}
                  label={isLoading ? "Creating..." : "Begin with Lokah"}
                  size="md"
                  className="min-w-[180px]"
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
