import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MotionWrapper } from "@/components/MotionWrapper";
import { Logo } from "@/components/Logo";

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
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
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
        .insert({
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

      toast.success("Your journey begins now");
      navigate("/generator", { state: { userId: data.id } });
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "Failed to complete onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MotionWrapper animation="fadeUp" className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base">What's your name?</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your full name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-base">How old are you?</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => updateField("age", e.target.value)}
                placeholder="Your age"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="pronouns" className="text-base">What are your pronouns? (optional)</Label>
              <Input
                id="pronouns"
                value={formData.pronouns}
                onChange={(e) => updateField("pronouns", e.target.value)}
                placeholder="e.g., she/her, he/him, they/them"
                className="mt-2"
              />
            </div>
          </MotionWrapper>
        );

      case 2:
        return (
          <MotionWrapper animation="fadeUp" className="space-y-4">
            <div>
              <Label htmlFor="country" className="text-base">Where in the world are you?</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="Country"
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state" className="text-base">State/Region</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="State or region"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-base">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Your city"
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="languages" className="text-base">What languages do you speak?</Label>
              <Input
                id="languages"
                value={formData.languages}
                onChange={(e) => updateField("languages", e.target.value)}
                placeholder="e.g., English, Spanish, Mandarin"
                className="mt-2"
              />
            </div>
          </MotionWrapper>
        );

      case 3:
        return (
          <MotionWrapper animation="fadeUp" className="space-y-4">
            <div>
              <Label htmlFor="education" className="text-base">Highest level of education</Label>
              <Select value={formData.education} onValueChange={(value) => updateField("education", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="fieldOfStudy" className="text-base">What did you study? (optional)</Label>
              <Input
                id="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={(e) => updateField("fieldOfStudy", e.target.value)}
                placeholder="Your field of study"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="occupation" className="text-base">What do you do for work?</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => updateField("occupation", e.target.value)}
                placeholder="Current occupation or aspiration"
                className="mt-2"
              />
            </div>
          </MotionWrapper>
        );

      case 4:
        return (
          <MotionWrapper animation="fadeUp" className="space-y-4">
            <div>
              <Label htmlFor="familyStatus" className="text-base">What's your family situation?</Label>
              <Select value={formData.familyStatus} onValueChange={(value) => updateField("familyStatus", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select family status" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="familyBackground" className="text-base">How would you describe your family background?</Label>
              <Select value={formData.familyBackground} onValueChange={(value) => updateField("familyBackground", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select background" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supportive">Very supportive</SelectItem>
                  <SelectItem value="traditional">Traditional/conservative</SelectItem>
                  <SelectItem value="liberal">Progressive/liberal</SelectItem>
                  <SelectItem value="strict">Strict/demanding</SelectItem>
                  <SelectItem value="distant">Emotionally distant</SelectItem>
                  <SelectItem value="complicated">Complicated dynamics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </MotionWrapper>
        );

      case 5:
        return (
          <MotionWrapper animation="fadeUp" className="space-y-4">
            <div>
              <Label htmlFor="economicStatus" className="text-base">Current economic situation</Label>
              <Select value={formData.economicStatus} onValueChange={(value) => updateField("economicStatus", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="struggling">Financial hardship</SelectItem>
                  <SelectItem value="modest">Getting by</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="affluent">Affluent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="employmentSecurity" className="text-base">How secure is your employment?</Label>
              <Select value={formData.employmentSecurity} onValueChange={(value) => updateField("employmentSecurity", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select security level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_secure">Very secure</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="uncertain">Uncertain</SelectItem>
                  <SelectItem value="precarious">Precarious</SelectItem>
                  <SelectItem value="not_applicable">Not applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </MotionWrapper>
        );

      case 6:
        return (
          <MotionWrapper animation="fadeUp" className="space-y-4">
            <div>
              <Label htmlFor="personalityType" className="text-base">How would you describe yourself?</Label>
              <Select value={formData.personalityType} onValueChange={(value) => updateField("personalityType", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select personality type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="introvert">Introvert</SelectItem>
                  <SelectItem value="extrovert">Extrovert</SelectItem>
                  <SelectItem value="ambivert">Ambivert (both)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="values" className="text-base">What are your core values?</Label>
              <p className="text-sm text-muted-foreground mb-2">
                List 3-5 values that guide your life (e.g., family, creativity, freedom, growth)
              </p>
              <Textarea
                id="values"
                value={formData.values}
                onChange={(e) => updateField("values", e.target.value)}
                placeholder="family, creativity, authenticity..."
                className="mt-2"
                rows={3}
              />
            </div>
          </MotionWrapper>
        );

      case 7:
        return (
          <MotionWrapper animation="fadeUp" className="space-y-4">
            <div>
              <Label htmlFor="majorChoice" className="text-base">Tell me about a major life choice you've made</Label>
              <p className="text-sm text-muted-foreground mb-2">
                This could be about career, education, relationships, or where you live
              </p>
              <Textarea
                id="majorChoice"
                value={formData.majorChoice}
                onChange={(e) => updateField("majorChoice", e.target.value)}
                placeholder="I chose to study engineering instead of pursuing art..."
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="unchosenPath" className="text-base">What's a path you didn't take but wonder about?</Label>
              <p className="text-sm text-muted-foreground mb-2">
                A dream, choice, or version of life that almost happened
              </p>
              <Textarea
                id="unchosenPath"
                value={formData.unchosenPath}
                onChange={(e) => updateField("unchosenPath", e.target.value)}
                placeholder="I always wondered what life would be like if I had moved abroad..."
                className="mt-2"
                rows={4}
              />
            </div>
          </MotionWrapper>
        );

      case 8:
        return (
          <MotionWrapper animation="fadeUp" className="space-y-4">
            <div>
              <Label htmlFor="lifeRegret" className="text-base">Is there something you deeply regret? (optional)</Label>
              <Textarea
                id="lifeRegret"
                value={formData.lifeRegret}
                onChange={(e) => updateField("lifeRegret", e.target.value)}
                placeholder="This is a safe space..."
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="lifeChallenges" className="text-base">What challenges have shaped you? (optional)</Label>
              <Textarea
                id="lifeChallenges"
                value={formData.lifeChallenges}
                onChange={(e) => updateField("lifeChallenges", e.target.value)}
                placeholder="Loss, hardship, obstacles you've faced..."
                className="mt-2"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2 p-4 rounded-lg bg-muted/30">
              <Checkbox
                id="allowDataUsage"
                checked={formData.allowDataUsage}
                onCheckedChange={(checked) => updateField("allowDataUsage", !!checked)}
              />
              <label
                htmlFor="allowDataUsage"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I consent to Lokah using my data to create meaningful parallel self experiences
              </label>
            </div>
          </MotionWrapper>
        );

      default:
        return null;
    }
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <MotionWrapper animation="fadeUp" className="text-center">
          <Logo variant="mark" size="md" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Building your parallel self</p>
        </MotionWrapper>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main card */}
        <Card className="p-8 glass-card">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold gradient-text mb-2">
                {getStepTitle()}
              </h2>
              <p className="text-muted-foreground/80">
                {getStepDescription()}
              </p>
            </div>

            {renderStep()}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="transition-smooth"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gradient-primary text-white transition-smooth"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={!canProceed() || isLoading}
                  className="gradient-primary text-white transition-smooth"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating your parallel self...
                    </>
                  ) : (
                    <>
                      Begin Your Journey
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
