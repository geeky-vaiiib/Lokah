import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MessageCircle, Loader2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Timeline } from "@/components/Timeline";
import logo from "@/assets/logo.png";

const SavedSelves = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selves, setSelves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const { data: users } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", user.id)
        .limit(1);
      
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
  }, [navigate, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logo} alt="ParallelSelf" className="h-12" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Your Multiverse</h1>
              <p className="text-muted-foreground/80">
                All your parallel realities in one place
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/generator", { state: { userId } })}
              className="gradient-primary text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New
            </Button>
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tabs: Gallery vs Timeline */}
        {selves.length === 0 ? (
          <Card className="p-12 text-center glass-card">
            <p className="text-xl gradient-text mb-4">
              Your multiverse awaits
            </p>
            <p className="text-muted-foreground/80 mb-6">
              Create your first parallel self and explore the roads not taken
            </p>
            <Button
              onClick={() => navigate("/generator", { state: { userId } })}
              className="gradient-primary text-white"
            >
              Step Through the Mirror
            </Button>
          </Card>
        ) : (
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="gallery">Gallery View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-8">
              <Timeline selves={selves} userId={userId || ""} />
            </TabsContent>

            <TabsContent value="gallery">
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
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default SavedSelves;
