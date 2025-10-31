import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TOTAL_STEPS = 5;

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    values: "",
    majorChoice: "",
    unchosenPath: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
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
          location: formData.location || null,
          values: formData.values.split(",").map((v) => v.trim()),
          major_choices: [formData.majorChoice],
          unchosen_path: formData.unchosenPath,
          auth_user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Your story has been captured");
      navigate("/generator", { state: { userId: data.id } });
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <Label htmlFor="name">What's your name?</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="age">How old are you? (optional)</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => updateField("age", e.target.value)}
                placeholder="Your age"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <Label htmlFor="gender">Gender (optional)</Label>
              <Input
                id="gender"
                value={formData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                placeholder="How do you identify?"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="location">Where are you from? (optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="City or country"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <Label htmlFor="values">What are your top 3 personal values?</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Separate with commas (e.g., creativity, family, adventure)
              </p>
              <Textarea
                id="values"
                value={formData.values}
                onChange={(e) => updateField("values", e.target.value)}
                placeholder="creativity, family, adventure"
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <Label htmlFor="majorChoice">
                What's one big life choice you've made?
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                This could be about career, relationships, location, education, etc.
              </p>
              <Textarea
                id="majorChoice"
                value={formData.majorChoice}
                onChange={(e) => updateField("majorChoice", e.target.value)}
                placeholder="I chose to study engineering instead of art..."
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <Label htmlFor="unchosenPath">
                What's one dream or path you didn't take?
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Think about a version of life that almost happened, but didn't.
              </p>
              <Textarea
                id="unchosenPath"
                value={formData.unchosenPath}
                onChange={(e) => updateField("unchosenPath", e.target.value)}
                placeholder="I always wondered what life would be like if I had moved to Paris..."
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== "";
      case 3:
        return formData.values.trim() !== "";
      case 4:
        return formData.majorChoice.trim() !== "";
      case 5:
        return formData.unchosenPath.trim() !== "";
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main card */}
        <Card className="p-8 glass-card animate-scale-in">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold gradient-text mb-2">
                {currentStep === 1 && "Let's get to know you"}
                {currentStep === 2 && "A bit more about you"}
                {currentStep === 3 && "What matters most to you?"}
                {currentStep === 4 && "Your life's turning points"}
                {currentStep === 5 && "The road not taken"}
              </h2>
              <p className="text-muted-foreground/80">
                {currentStep === 1 && "Share your name so your parallel self knows who you are."}
                {currentStep === 2 && "These details help create an authentic connection."}
                {currentStep === 3 && "Your values remain constant across all realities."}
                {currentStep === 4 && "Every choice creates a new branch in the multiverse."}
                {currentStep === 5 && "Here is where your parallel self begins to diverge."}
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
                  {isLoading ? "Weaving the threads..." : "Enter the Multiverse"}
                  <ArrowRight className="ml-2 h-4 w-4" />
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
