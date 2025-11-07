import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileCardProps {
  alternateSelf: {
    id: string;
    axis: string;
    divergence_summary: string;
    backstory: string;
    shared_traits?: string[];
    different_traits?: string[];
  };
  userName: string;
}

const ProfileCard = ({ alternateSelf, userName }: ProfileCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 glass-elevated border-primary/20 sticky top-6">
        <div className="space-y-4">
          <div className="text-center space-y-3">
            <motion.div 
              className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-soft"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {userName?.charAt(0) || "Y"}
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg">Parallel {userName || "You"}</h3>
              <Badge className="gradient-accent text-white mt-2">{alternateSelf.axis}</Badge>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="font-medium text-muted-foreground mb-1.5">Divergence Point</p>
              <p className="text-foreground leading-relaxed">{alternateSelf.divergence_summary}</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/30">
              <p className="font-medium text-muted-foreground mb-1.5">Their Story</p>
              <p className="text-foreground leading-relaxed">{alternateSelf.backstory}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
