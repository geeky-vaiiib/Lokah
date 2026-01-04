import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles, User, MapPin, GraduationCap, Heart, Compass, Brain, CheckCircle2 } from "lucide-react";
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

const stepIcons = [User, MapPin, GraduationCap, Heart, Heart, Compass, Brain, CheckCircle2];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(1);

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
    // Check for demo mode first
    const isDemo = import.meta.env.VITE_SUPABASE_URL?.includes("xawscxdrwzjzghshudpx");

    if (isDemo) {
      // Demo mode - skip Supabase, save to localStorage
      setIsLoading(true);
      setTimeout(() => {
        localStorage.setItem("lokah_onboarding_data", JSON.stringify(formData));
        toast.success("Demo Mode: Onboarding complete!");
        navigate("/generator", { state: { userId: "demo-user", formData } });
        setIsLoading(false);
      }, 1000);
      return;
    }

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

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
  };

  const inputClassName = `
    bg-[hsl(30_12%_8%)] border-[hsl(35_20%_18%)] rounded-lg
    focus:border-[hsl(35_35%_65%/0.5)] focus:ring-1 focus:ring-[hsl(35_35%_65%/0.2)]
    transition-all duration-200 text-[hsl(38_30%_90%)] placeholder:text-[hsl(30_15%_40%)]
    hover:border-[hsl(35_25%_25%)] h-11
  `;

  const labelClassName = "text-sm font-medium text-[hsl(38_30%_85%)] mb-1.5 block";

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
                  className={inputClassName}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className={labelClassName}>Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    placeholder="e.g. 25"
                    className={inputClassName}
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className={labelClassName}>Gender</Label>
                  <Select value={formData.gender} onValueChange={(val) => updateField("gender", val)}>
                    <SelectTrigger className={inputClassName}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(30_12%_10%)] border-[hsl(35_20%_18%)]">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="pronouns" className={labelClassName}>Preferred Pronouns</Label>
                <Input
                  id="pronouns"
                  value={formData.pronouns}
                  onChange={(e) => updateField("pronouns", e.target.value)}
                  placeholder="e.g. they/them, he/him, she/her"
                  className={inputClassName}
                />
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="country" className={labelClassName}>Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  placeholder="e.g. United States"
                  className={inputClassName}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state" className={labelClassName}>State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="e.g. California"
                    className={inputClassName}
                  />
                </div>
                <div>
                  <Label htmlFor="city" className={labelClassName}>City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="e.g. San Francisco"
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="education" className={labelClassName}>Highest Education</Label>
                <Select value={formData.education} onValueChange={(val) => updateField("education", val)}>
                  <SelectTrigger className={inputClassName}>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(30_12%_10%)] border-[hsl(35_20%_18%)]">
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD or Doctorate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fieldOfStudy" className={labelClassName}>Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={(e) => updateField("fieldOfStudy", e.target.value)}
                  placeholder="e.g. Computer Science"
                  className={inputClassName}
                />
              </div>
              <div>
                <Label htmlFor="occupation" className={labelClassName}>Current Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className={inputClassName}
                />
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="familyStatus" className={labelClassName}>Family Status</Label>
                <Select value={formData.familyStatus} onValueChange={(val) => updateField("familyStatus", val)}>
                  <SelectTrigger className={inputClassName}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(30_12%_10%)] border-[hsl(35_20%_18%)]">
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="in-relationship">In a Relationship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="familyBackground" className={labelClassName}>Family Economic Background</Label>
                <Select value={formData.familyBackground} onValueChange={(val) => updateField("familyBackground", val)}>
                  <SelectTrigger className={inputClassName}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(30_12%_10%)] border-[hsl(35_20%_18%)]">
                    <SelectItem value="low-income">Low Income</SelectItem>
                    <SelectItem value="middle-class">Middle Class</SelectItem>
                    <SelectItem value="upper-middle">Upper Middle Class</SelectItem>
                    <SelectItem value="affluent">Affluent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        case 5:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="religion" className={labelClassName}>Religion or Spirituality</Label>
                <Input
                  id="religion"
                  value={formData.religion}
                  onChange={(e) => updateField("religion", e.target.value)}
                  placeholder="e.g. Buddhist, Agnostic, Christian"
                  className={inputClassName}
                />
              </div>
              <div>
                <Label htmlFor="ethnicity" className={labelClassName}>Ethnicity</Label>
                <Input
                  id="ethnicity"
                  value={formData.ethnicity}
                  onChange={(e) => updateField("ethnicity", e.target.value)}
                  placeholder="e.g. Asian, Hispanic"
                  className={inputClassName}
                />
              </div>
              <div>
                <Label htmlFor="languages" className={labelClassName}>Languages Spoken</Label>
                <Input
                  id="languages"
                  value={formData.languages}
                  onChange={(e) => updateField("languages", e.target.value)}
                  placeholder="e.g. English, Spanish, Mandarin"
                  className={inputClassName}
                />
              </div>
            </div>
          );
        case 6:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="majorChoice" className={labelClassName}>A Major Life Choice You Made</Label>
                <Textarea
                  id="majorChoice"
                  value={formData.majorChoice}
                  onChange={(e) => updateField("majorChoice", e.target.value)}
                  placeholder="Describe a significant decision that shaped your life..."
                  className={`${inputClassName} min-h-[100px] resize-none`}
                />
              </div>
              <div>
                <Label htmlFor="unchosenPath" className={labelClassName}>The Path You Didn't Take</Label>
                <Textarea
                  id="unchosenPath"
                  value={formData.unchosenPath}
                  onChange={(e) => updateField("unchosenPath", e.target.value)}
                  placeholder="What alternative path did you not pursue?"
                  className={`${inputClassName} min-h-[100px] resize-none`}
                />
              </div>
            </div>
          );
        case 7:
          return (
            <div className="space-y-5">
              <div>
                <Label htmlFor="personalityType" className={labelClassName}>Personality Type</Label>
                <Input
                  id="personalityType"
                  value={formData.personalityType}
                  onChange={(e) => updateField("personalityType", e.target.value)}
                  placeholder="e.g. INTJ, Type 4, Introvert"
                  className={inputClassName}
                />
              </div>
              <div>
                <Label htmlFor="values" className={labelClassName}>Core Values</Label>
                <Input
                  id="values"
                  value={formData.values}
                  onChange={(e) => updateField("values", e.target.value)}
                  placeholder="e.g. Honesty, Growth, Family"
                  className={inputClassName}
                />
              </div>
              <div>
                <Label htmlFor="lifeRegret" className={labelClassName}>A Life Regret (Optional)</Label>
                <Textarea
                  id="lifeRegret"
                  value={formData.lifeRegret}
                  onChange={(e) => updateField("lifeRegret", e.target.value)}
                  placeholder="Something you wish you had done differently..."
                  className={`${inputClassName} min-h-[80px] resize-none`}
                />
              </div>
            </div>
          );
        case 8:
          return (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[hsl(35_35%_65%/0.08)] border border-[hsl(35_35%_65%/0.15)]">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[hsl(35_35%_65%)] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[hsl(38_40%_85%)] mb-1">You're ready to explore</h4>
                    <p className="text-sm text-[hsl(30_15%_55%)]">
                      Your alternate self will be created using this information to provide meaningful,
                      personalized conversations.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[hsl(30_12%_8%)] border border-[hsl(35_20%_15%)]">
                <Checkbox
                  id="allowDataUsage"
                  checked={formData.allowDataUsage}
                  onCheckedChange={(checked) => updateField("allowDataUsage", !!checked)}
                  className="mt-0.5 border-[hsl(35_20%_30%)] data-[state=checked]:bg-[hsl(35_35%_65%)] data-[state=checked]:border-[hsl(35_35%_65%)]"
                />
                <label htmlFor="allowDataUsage" className="text-sm text-[hsl(30_15%_60%)] leading-relaxed cursor-pointer">
                  I allow Lokah to use my data to create personalized alternate self experiences.
                  My information will be handled securely and never shared with third parties.
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
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() !== "";
      case 6: return formData.majorChoice.trim() !== "" && formData.unchosenPath.trim() !== "";
      case 8: return formData.allowDataUsage;
      default: return true;
    }
  };

  const getStepTitle = () => {
    const titles = ["Identity", "Location", "Education", "Family", "Background", "Choices", "Personality", "Ready"];
    return titles[currentStep - 1] || "";
  };

  const StepIcon = stepIcons[currentStep - 1];

  return (
    <div className="relative min-h-screen flex bg-[hsl(30_15%_6%)]">
      {/* Left Panel - Progress */}
      <div className="hidden lg:flex w-80 flex-col justify-between p-8 border-r border-[hsl(35_20%_12%)]">
        <div>
          <Logo size={28} />
          <div className="mt-12 space-y-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const Icon = stepIcons[i];
              const isComplete = i + 1 < currentStep;
              const isCurrent = i + 1 === currentStep;
              return (
                <motion.div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isCurrent
                    ? 'bg-[hsl(35_35%_65%/0.1)] border border-[hsl(35_35%_65%/0.2)]'
                    : isComplete
                      ? 'opacity-60'
                      : 'opacity-30'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCurrent
                    ? 'bg-[hsl(35_35%_65%)] text-[hsl(30_15%_6%)]'
                    : isComplete
                      ? 'bg-[hsl(35_35%_65%/0.3)] text-[hsl(35_35%_65%)]'
                      : 'bg-[hsl(30_12%_15%)] text-[hsl(30_15%_40%)]'
                    }`}>
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isCurrent ? 'text-[hsl(38_40%_85%)]' : 'text-[hsl(30_15%_50%)]'}`}>
                    Step {i + 1}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[hsl(30_15%_45%)]">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-[hsl(30_12%_12%)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[hsl(35_35%_65%)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-[hsl(35_20%_12%)]">
          <div className="flex items-center justify-between">
            <Logo size={24} />
            <span className="text-xs text-[hsl(30_15%_50%)]">Step {currentStep} of {TOTAL_STEPS}</span>
          </div>
          {/* Mobile Progress Bar */}
          <div className="mt-3 h-1 bg-[hsl(30_12%_12%)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[hsl(35_35%_65%)] rounded-full"
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Step Header */}
            <div className="mb-8">
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(35_35%_65%/0.1)] border border-[hsl(35_35%_65%/0.2)] mb-4"
                key={`badge-${currentStep}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <StepIcon className="w-3.5 h-3.5 text-[hsl(35_35%_65%)]" />
                <span className="text-xs font-medium text-[hsl(35_35%_65%)] uppercase tracking-wider">{getStepTitle()}</span>
              </motion.div>
              <motion.h1
                className="text-3xl font-display font-semibold text-[hsl(38_40%_90%)]"
                key={`title-${currentStep}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Tell us about yourself
              </motion.h1>
              <motion.p
                className="mt-2 text-[hsl(30_15%_55%)]"
                key={`desc-${currentStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                This helps create a more personalized experience
              </motion.p>
            </div>

            {/* Form Content */}
            <div className="min-h-[280px]">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8 gap-4">
              <GlassButton
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 1}
                label="Back"
                size="md"
              />
              {currentStep < TOTAL_STEPS ? (
                <GlassButton
                  onClick={handleNext}
                  disabled={!canProceed()}
                  label="Continue"
                  size="md"
                />
              ) : (
                <GlassButton
                  onClick={handleComplete}
                  disabled={!canProceed() || isLoading}
                  label={
                    isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Begin with Lokah"
                    )
                  }
                  size="md"
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
