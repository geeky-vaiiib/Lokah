import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import LokahBackground from "@/components/LokahBackground";
import TopNav from "@/components/TopNav";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/saved");
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <LokahBackground className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <TopNav />
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    </LokahBackground>
  );
};

export default Index;
