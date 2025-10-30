import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SavedSelves = () => {
  const navigate = useNavigate();
  const [selves, setSelves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: users } = await supabase.from("users").select("*").limit(1);
      
      if (!users || users.length === 0) {
        navigate("/onboarding");
        return;
      }

      const currentUserId = users[0].id;
      setUserId(currentUserId);

      const { data, error } = await supabase
        .from("alternate_selves")
        .select("*, conversations(id, messages)")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load your parallel selves");
      } else {
        setSelves(data || []);
      }

      setIsLoading(false);
    };

    loadData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Parallel Selves</h1>
            <p className="text-muted-foreground">
              Explore the different versions of you across alternate realities
            </p>
          </div>
          <Button
            onClick={() => navigate("/generator", { state: { userId } })}
            className="gradient-primary text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Self
          </Button>
        </div>

        {/* Grid of selves */}
        {selves.length === 0 ? (
          <Card className="p-12 text-center shadow-card border-primary/20">
            <p className="text-xl text-muted-foreground mb-4">
              You haven't created any parallel selves yet
            </p>
            <Button
              onClick={() => navigate("/generator", { state: { userId } })}
              className="gradient-primary text-white"
            >
              Create Your First Parallel Self
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selves.map((self) => {
              const lastMessage = self.conversations?.[0]?.messages?.slice(-1)[0];
              const messageCount = self.conversations?.[0]?.messages?.length || 0;

              return (
                <Card
                  key={self.id}
                  className="p-6 shadow-card border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() =>
                    navigate("/chat", { state: { alternateSelfId: self.id, userId } })
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-medium gradient-accent text-white mb-3 capitalize">
                        {self.axis}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Parallel Self</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {self.divergence_summary}
                      </p>
                    </div>

                    {lastMessage && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Last message:</p>
                        <p className="text-sm line-clamp-2">
                          {lastMessage.role === "user" ? "You: " : "Them: "}
                          {lastMessage.content}
                        </p>
                      </div>
                    )}

                    <Button variant="outline" className="w-full gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {messageCount > 0 ? "Continue Chat" : "Start Conversation"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSelves;
