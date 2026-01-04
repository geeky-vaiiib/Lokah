import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GlassButton } from "@/components/GlassButton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Loader2, Sparkles, Grid3X3, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Timeline } from "@/components/Timeline";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const SavedSelves = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  type Conversation = { id: string; messages?: unknown };
  type AltSelf = { id: string; axis?: string; divergence_summary?: string; conversations?: Conversation[] };
  const [selves, setSelves] = useState<AltSelf[]>([]);
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
        toast.error("Failed to load your alternate selves");
      } else {
        setSelves(data || []);
      }

      setIsLoading(false);
    };

    loadData();
  }, [navigate, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(30 15% 6%)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(35_35%_65%)]" />
          <span className="text-white/40 text-sm">Loading your multiverse...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[hsl(30 15% 6%)]">
      {/* Background Effects */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 30% -30%, hsl(35 35% 65% / 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 70% 120%, hsl(35 35% 65% / 0.08) 0%, transparent 50%),
            hsl(30 15% 6%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-5">
            <Logo size={36} />
            <div>
              <h1
                className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(35 35% 65%) 100%)',
                }}
              >
                Lokah
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Explore the worlds where you might have been
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <GlassButton
              onClick={() => navigate("/generator", { state: { userId } })}
              label="+ Create New"
              size="sm"
            />
            <GlassButton
              variant="secondary"
              onClick={signOut}
              label="Sign Out"
              size="sm"
            />
          </div>
        </motion.div>

        {/* Content */}
        {selves.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="p-16 text-center"
              style={{
                background: 'linear-gradient(135deg, hsl(30 12% 10% / 0.8) 0%, hsl(30 12% 7% / 0.9) 100%)',
                border: '1px solid hsl(0 0% 100% / 0.06)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(35_35%_65%/0.15)] to-[hsl(35_35%_65%/0.15)] flex items-center justify-center">
                  <Sparkles className="w-9 h-9 text-[hsl(35_35%_65%)]" />
                </div>
                <h2
                  className="text-2xl font-display font-semibold text-transparent bg-clip-text mb-3"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, hsl(35 35% 65%) 0%, hsl(35 35% 65%) 100%)',
                  }}
                >
                  Your Worlds await
                </h2>
                <p className="text-white/40 mb-8 max-w-md mx-auto">
                  Create your first Alternate Self and explore the roads not taken
                </p>
                <GlassButton
                  onClick={() => navigate("/generator", { state: { userId } })}
                  label="Step Through the Mirror"
                />
              </motion.div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="gallery" className="w-full">
              <TabsList
                className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 p-1 rounded-xl"
                style={{
                  background: 'hsl(30 12% 10% / 0.8)',
                  border: '1px solid hsl(0 0% 100% / 0.06)',
                }}
              >
                <TabsTrigger
                  value="gallery"
                  className="flex items-center gap-2 data-[state=active]:bg-[hsl(35_35%_65%/0.15)] data-[state=active]:text-[hsl(35_35%_65%)] rounded-lg transition-all"
                >
                  <Grid3X3 className="w-4 h-4" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="flex items-center gap-2 data-[state=active]:bg-[hsl(35_35%_65%/0.15)] data-[state=active]:text-[hsl(35_35%_65%)] rounded-lg transition-all"
                >
                  <Clock className="w-4 h-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="mt-8">
                <Timeline selves={selves} userId={userId || ""} />
              </TabsContent>

              <TabsContent value="gallery">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {selves.map((self, index) => {
                      const msgs = (self.conversations?.[0]?.messages as unknown) as Array<{ role: "user" | "assistant"; content: string }> | undefined;
                      const lastMessage = Array.isArray(msgs) ? msgs.slice(-1)[0] : undefined;
                      const messageCount = Array.isArray(msgs) ? msgs.length : 0;

                      return (
                        <motion.div
                          key={self.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.08 }}
                        >
                          <Card
                            className="p-6 cursor-pointer group transition-all duration-300"
                            style={{
                              background: 'linear-gradient(135deg, hsl(30 12% 10% / 0.8) 0%, hsl(30 12% 7% / 0.9) 100%)',
                              border: '1px solid hsl(0 0% 100% / 0.06)',
                            }}
                            onClick={() => navigate("/chat", { state: { alternateSelfId: self.id, userId } })}
                          >
                            {/* Card Glow on Hover */}
                            <div
                              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                boxShadow: '0 0 40px -10px hsl(35 35% 65% / 0.3)',
                              }}
                            />

                            <div className="relative space-y-4">
                              <div>
                                <span
                                  className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase mb-3"
                                  style={{
                                    background: 'linear-gradient(135deg, hsl(35 35% 65% / 0.15) 0%, hsl(35 35% 65% / 0.1) 100%)',
                                    color: 'hsl(35 35% 65%)',
                                    border: '1px solid hsl(35 35% 65% / 0.2)',
                                  }}
                                >
                                  {self.axis}
                                </span>
                                <h3 className="text-xl font-display font-semibold text-white mb-2 group-hover:text-[hsl(35_35%_65%)] transition-colors">
                                  Alternate Self
                                </h3>
                                <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
                                  {self.divergence_summary}
                                </p>
                              </div>

                              {lastMessage && (
                                <div className="pt-4 border-t border-white/[0.06]">
                                  <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Last message</p>
                                  <p className="text-sm text-white/60 line-clamp-2">
                                    <span className="text-white/40">{lastMessage.role === "user" ? "You: " : "Them: "}</span>
                                    {lastMessage.content}
                                  </p>
                                </div>
                              )}

                              <GlassButton
                                variant="secondary"
                                className="w-full gap-2"
                                label={
                                  <span className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    {messageCount > 0 ? "Continue Chat" : "Start Conversation"}
                                  </span>
                                }
                                size="sm"
                              />
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedSelves;
