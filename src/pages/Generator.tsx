import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DIVERGENCE_AXES = [
  { value: "career", label: "Career Path", description: "What if you chose a different profession?" },
  { value: "location", label: "Location", description: "What if you lived somewhere else?" },
  { value: "relationship", label: "Relationships", description: "What if key relationships were different?" },
  { value: "education", label: "Education", description: "What if you studied something else?" },
  { value: "values", label: "Value System", description: "What if you prioritized differently?" },
];

const Generator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [selectedAxis, setSelectedAxis] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  toast.success("Your Alternate Self has been created!");
      navigate("/chat", { state: { alternateSelfId: data.id, userId: user.id } });
    } catch (error: any) {
  toast.error(error.message || "Failed to generate Alternate Self");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10] via-[#0E1A2E] to-[#13213A] animate-[lokahGradientShift_50s_linear_infinite] bg-[length:200%_200%]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(113,208,227,0.12)_0%,transparent_80%)] blur-3xl" />
      <div className="w-full max-w-3xl space-y-8 animate-fade-up">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-accent shadow-card">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <span className="gradient-text">Step Through the Mirror</span>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Select the axis where your life could have taken a different turn. 
            Your Alternate Self will emerge from this choice.
          </p>
        </div>

        {/* Axis selection */}
        <Card className="p-8 shadow-card border-primary/20">
          <RadioGroup value={selectedAxis} onValueChange={setSelectedAxis} className="space-y-4">
            {DIVERGENCE_AXES.map((axis) => (
              <Card
                key={axis.value}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  selectedAxis === axis.value
                    ? "border-primary bg-primary/5 shadow-soft"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedAxis(axis.value)}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={axis.value} id={axis.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={axis.value} className="text-base font-semibold cursor-pointer">
                      {axis.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{axis.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </RadioGroup>
        </Card>

        {/* Generate button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!selectedAxis || isGenerating}
            className="gradient-primary text-white shadow-card hover:shadow-lg transition-all duration-300 hover:scale-105 px-8 py-6 rounded-full"
          >
      {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Creating Your Alternate Self...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
        Create My Alternate Self
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Generator;
