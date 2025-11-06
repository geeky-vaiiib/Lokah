import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LokahBackground from "@/components/LokahBackground";
import TopNav from "@/components/TopNav";
import { GlassButton } from "@/components/GlassButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <LokahBackground className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <TopNav />
        <div className="flex min-h-[70vh] items-center justify-center text-center">
          <div>
            <h1 className="mb-4 text-6xl font-[ClashDisplay] tracking-[0.25em]">404</h1>
            <p className="mb-6 text-[#A6CFFF]">Oops — that world doesn’t exist.</p>
            <GlassButton label="Return Home" onClick={() => navigate("/")} />
          </div>
        </div>
      </div>
    </LokahBackground>
  );
};

export default NotFound;
