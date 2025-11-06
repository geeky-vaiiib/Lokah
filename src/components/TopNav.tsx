import { Button } from "@/components/ui/button";
import LogoWordmark from "@/components/LogoWordmark";
import { useNavigate } from "react-router-dom";
import React from "react";

export const TopNav: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();
  return (
    <div className={`w-full flex items-center justify-between py-4 ${className ?? ""}`}>
  <LogoWordmark size={20} />
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => navigate("/saved")}>My Selves</Button>
        <Button variant="secondary" onClick={() => navigate("/generator")} className="px-6 py-2">
          + Create New
        </Button>
      </div>
    </div>
  );
};

export default TopNav;
