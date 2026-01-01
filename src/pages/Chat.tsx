import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileCard from "@/components/ProfileCard";
import { MemorySnippetBadge } from "@/components/MemorySnippetBadge";
import { ReflectionCard } from "@/components/ReflectionCard";
import { analyzeSentiment } from "@/lib/sentimentAnalysis";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import MoodBackground from "@/components/MoodBackground";

interface MemorySnippet {
  content: string;
  emotional_tone: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  memorySnippet?: MemorySnippet;
}

interface AlternateSelfRecord {
  id: string;
  axis: string;
  divergence_summary: string;
  backstory: string;
  shared_traits?: string[];
  different_traits?: string[];
  created_at?: string;
}

interface UserRecord {
  id: string;
  name: string;
  email?: string;
  created_at?: string;
}

interface Reflection {
  title: string;
  insights: string[];
  emotional_tone: string;
}

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { alternateSelfId, userId } = location.state || {};

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<string>("exploratory");
  const [isLoading, setIsLoading] = useState(false);
  const [alternateSelf, setAlternateSelf] = useState<AlternateSelfRecord | null>(null);
  const [user, setUser] = useState<UserRecord | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState<ReturnType<typeof analyzeSentiment> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [toneTags, setToneTags] = useState<string[]>([]);

  useEffect(() => {
    if (!alternateSelfId || !userId) {
      toast.error("Invalid session");
      navigate("/");
      return;
    }

    const loadData = async () => {
      const [selfResult, userResult] = await Promise.all([
        supabase.from("alternate_selves").select("*").eq("id", alternateSelfId).single(),
        supabase.from("users").select("*").eq("id", userId).single(),
      ]);

      if (selfResult.error || userResult.error) {
        toast.error("Failed to load data");
        navigate("/");
        return;
      }

      setAlternateSelf(selfResult.data);
      setUser(userResult.data);

      const { data: existingConv } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .eq("alternate_self_id", alternateSelfId)
        .single();

      if (existingConv) {
        setConversationId(existingConv.id);
        type RawMessage = { role: string; content: string; timestamp: string; memorySnippet?: { content: string; emotional_tone: string } | null };
        const rawMessages: unknown = existingConv.messages;
        const loadedMessages: Message[] = Array.isArray(rawMessages)
          ? (rawMessages as RawMessage[]).map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
            timestamp: m.timestamp,
            memorySnippet: m.memorySnippet && m.memorySnippet.content ? {
              content: m.memorySnippet.content,
              emotional_tone: m.memorySnippet.emotional_tone,
            } : undefined,
          }))
          : [];
        setMessages(loadedMessages);
      } else {
        const { data: newConv, error } = await supabase
          .from("conversations")
          .insert({
            user_id: userId,
            alternate_self_id: alternateSelfId,
            messages: [],
          })
          .select()
          .single();

        if (!error && newConv) {
          setConversationId(newConv.id);
        }
      }
    };

    loadData();
  }, [alternateSelfId, userId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (input.trim()) {
      const sentiment = analyzeSentiment(input);
      setCurrentSentiment(sentiment);
    } else {
      setCurrentSentiment(null);
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId || !alternateSelf || !user) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-with-parallel-self", {
        body: {
          conversationId,
          messages: updatedMessages,
          alternateSelf,
          userName: user.name,
          mode,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      try {
        const { data: memoryData } = await supabase.functions.invoke("extract-memory", {
          body: { messageContent: data.reply },
        });

        if (memoryData?.memory?.content) {
          assistantMessage.memorySnippet = memoryData.memory;
        }
      } catch (_memoryError) {
        console.log("Memory extraction skipped:", _memoryError);
      }

      const finalMessages = [...updatedMessages, assistantMessage];
      if (data?.structured?.tone_tags && Array.isArray(data.structured.tone_tags)) {
        setToneTags(data.structured.tone_tags as string[]);
      }
      setMessages(finalMessages);

      const jsonMessages = finalMessages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        memorySnippet: m.memorySnippet
          ? {
            content: m.memorySnippet.content,
            emotional_tone: m.memorySnippet.emotional_tone,
          }
          : null,
      }));

      await supabase
        .from("conversations")
        .update({ messages: jsonMessages })
        .eq("id", conversationId);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReflection = async () => {
    if (!conversationId || !alternateSelf || messages.length < 2) {
      toast.error("Have a longer conversation before generating a reflection");
      return;
    }

    setIsGeneratingReflection(true);

    try {
      const { data: reflectionData, error: reflectionError } = await supabase.functions.invoke(
        "generate-reflection",
        {
          body: {
            messages,
            alternateSelfData: {
              axis: alternateSelf.axis,
              divergence_summary: alternateSelf.divergence_summary,
              backstory: alternateSelf.backstory,
            },
          },
        }
      );

      if (reflectionError) throw reflectionError;

      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        await supabase.from("reflections").insert({
          user_id: authData.user.id,
          alternate_self_id: alternateSelf.id,
          conversation_id: conversationId,
          title: reflectionData.reflection.title,
          insights: reflectionData.reflection.insights,
        });

        const memorySnippets = messages
          .filter((m) => m.role === "assistant" && m.memorySnippet)
          .map((m) => ({
            user_id: authData.user.id,
            alternate_self_id: alternateSelf.id,
            conversation_id: conversationId,
            content: m.memorySnippet!.content,
            emotional_tone: m.memorySnippet!.emotional_tone,
          }));

        if (memorySnippets.length > 0) {
          await supabase.from("memory_snippets").insert(memorySnippets);
        }
      }

      setReflection(reflectionData.reflection);
      setShowReflectionModal(true);
      toast.success("✨ Reflection generated");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to generate reflection");
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  if (!alternateSelf || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220 25% 4%)]" aria-busy="true" aria-live="polite">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(35_35%_65%)]" />
          <span className="text-white/40 text-sm">Connecting to your Alternate Self...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 md:p-6 bg-[hsl(220 25% 4%)] overflow-hidden">
      <MoodBackground toneTags={toneTags} />

      {/* Gradient Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% -20%, hsl(35 35% 65% / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 0%, hsl(35 35% 65% / 0.06) 0%, transparent 50%),
            hsl(222 47% 3%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center md:justify-start">
            <Logo size={22} asLink />
          </div>
          <div className="flex gap-2 justify-center md:justify-end">
            <GlassButton
              variant="secondary"
              onClick={handleGenerateReflection}
              disabled={isGeneratingReflection || messages.length < 2}
              label={isGeneratingReflection ? "Reflecting..." : "Save & Reflect"}
              size="sm"
            />
            <GlassButton
              variant="secondary"
              onClick={() => navigate("/saved")}
              label="My Selves"
              size="sm"
            />
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProfileCard alternateSelf={alternateSelf} userName={user.name} />
          </motion.div>

          {/* Chat Area */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className="p-5 md:p-6 h-[600px] flex flex-col overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(222 47% 6% / 0.8) 0%, hsl(222 47% 4% / 0.9) 100%)',
                border: '1px solid hsl(0 0% 100% / 0.06)',
                boxShadow: '0 25px 50px -12px hsl(0 0% 0% / 0.4), 0 0 30px -10px hsl(35 35% 65% / 0.08)',
              }}
            >
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin">
                {messages.length === 0 && (
                  <div className="text-center py-16">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(35_35%_65%/0.2)] to-[hsl(35_35%_65%/0.2)] flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-[hsl(35_35%_65%)]" />
                      </div>
                      <p className="text-white/60 text-lg font-medium mb-2">Start a conversation</p>
                      <p className="text-white/30 text-sm max-w-sm mx-auto">
                        Ask your Alternate Self about their life, choices, or perspectives
                      </p>
                    </motion.div>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === "user"
                            ? "bg-gradient-to-r from-[hsl(35_35%_65%/0.15)] to-[hsl(35_35%_65%/0.1)] border border-[hsl(35_35%_65%/0.2)] text-white"
                            : "bg-white/[0.04] border border-white/[0.06] text-white/90"
                          }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.memorySnippet && (
                        <MemorySnippetBadge
                          text={message.memorySnippet.content}
                          emotionalTone={message.memorySnippet.emotional_tone}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-5 py-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-[hsl(35_35%_65%)]"
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-3 items-center pt-4 border-t border-white/[0.06]">
                <div className="hidden sm:block">
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 text-sm focus:border-[hsl(35_35%_65%/0.4)] focus:outline-none transition-colors"
                  >
                    <option value="exploratory">Exploratory</option>
                    <option value="therapy">Therapy</option>
                    <option value="concise">Concise</option>
                  </select>
                </div>

                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="bg-white/[0.03] border-white/[0.08] rounded-xl pr-12 text-white placeholder:text-white/30 focus:border-[hsl(35_35%_65%/0.4)] transition-all"
                    style={{
                      boxShadow: currentSentiment ? `0 0 20px -5px ${currentSentiment.colorTone}40` : undefined,
                    }}
                  />
                </div>

                <GlassButton
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  label={<Send className="w-4 h-4" />}
                  className="!px-4"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Reflection Modal */}
      <Dialog open={showReflectionModal} onOpenChange={setShowReflectionModal}>
        <DialogContent
          className="max-w-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(222 47% 6%) 0%, hsl(222 47% 4%) 100%)',
            border: '1px solid hsl(35 35% 65% / 0.2)',
            boxShadow: '0 25px 50px -12px hsl(0 0% 0% / 0.5), 0 0 40px -10px hsl(35 35% 65% / 0.2)',
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-2xl font-['Clash_Display'] text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, hsl(35 35% 65%) 0%, hsl(35 35% 65%) 100%)',
              }}
            >
              Reflections
            </DialogTitle>
          </DialogHeader>
          {reflection && <ReflectionCard reflection={reflection} />}
          <GlassButton
            onClick={() => setShowReflectionModal(false)}
            label="Return"
            variant="secondary"
            className="mt-4"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
