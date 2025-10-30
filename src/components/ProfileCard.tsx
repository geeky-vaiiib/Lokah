import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

interface ProfileCardProps {
  alternateSelf: {
    id: string;
    axis: string;
    divergence_summary: string;
    backstory: string;
    shared_traits: string[];
    different_traits: string[];
  };
  userName: string;
}

const ProfileCard = ({ alternateSelf, userName }: ProfileCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-6 shadow-card border-primary/20 space-y-6 h-full">
      {/* Avatar and name */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24 gradient-primary">
            <AvatarFallback className="text-white text-2xl font-semibold">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full gradient-accent flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{userName}</h2>
          <p className="text-sm text-primary font-medium capitalize">{alternateSelf.axis} Path</p>
        </div>
      </div>

      {/* Divergence summary */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          The Divergence
        </h3>
        <p className="text-sm leading-relaxed">{alternateSelf.divergence_summary}</p>
      </div>

      {/* Backstory */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Their Story
        </h3>
        <p className="text-sm leading-relaxed line-clamp-6">{alternateSelf.backstory}</p>
      </div>

      {/* Traits */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Shared Traits
          </h3>
          <div className="flex flex-wrap gap-2">
            {alternateSelf.shared_traits.map((trait, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Different Traits
          </h3>
          <div className="flex flex-wrap gap-2">
            {alternateSelf.different_traits.map((trait, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
