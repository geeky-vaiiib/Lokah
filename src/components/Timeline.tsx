import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface TimelineProps {
  selves: any[];
  userId: string;
}

const axisColors: Record<string, string> = {
  career: "from-purple-400 to-pink-400",
  relationship: "from-rose-400 to-pink-400",
  location: "from-cyan-400 to-blue-400",
  values: "from-amber-400 to-orange-400",
  risk: "from-green-400 to-emerald-400",
};

export const Timeline = ({ selves, userId }: TimelineProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="min-w-max px-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 transform -translate-y-1/2" />

          {/* Timeline nodes */}
          <div className="flex gap-12 relative z-10">
            {selves.map((self, index) => (
              <div
                key={self.id}
                className="flex flex-col items-center cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate("/chat", { state: { alternateSelfId: self.id, userId } })}
              >
                {/* Node */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${axisColors[self.axis] || axisColors.career} p-1 shadow-lg hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-2xl">{index + 1}</div>
                  </div>
                </div>

                {/* Label card */}
                <Card className="mt-4 p-4 w-48 glass-card group-hover:shadow-xl transition-all duration-300">
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${axisColors[self.axis] || axisColors.career} text-white mb-2 capitalize`}>
                    {self.axis}
                  </div>
                  <p className="text-sm line-clamp-2">
                    {self.divergence_summary}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(self.created_at).toLocaleDateString()}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};