import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, Loader2, Home, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileCard from "@/components/ProfileCard";
import { MemorySnippetBadge } from "@/components/MemorySnippetBadge";
import { ReflectionCard } from "@/components/ReflectionCard";
import { analyzeSentiment, getResponseTone } from "@/lib/sentimentAnalysis";
import { motion } from "framer-motion";
import LogoWordmark from "@/components/LogoWordmark";
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

      // Create or load conversation
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

  // Analyze sentiment of user input for dynamic UI effects
  useEffect(() => {
    if (input.trim()) {
      const sentiment = analyzeSentiment(input);
      setCurrentSentiment(sentiment);
    } else {
      setCurrentSentiment(null);
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId || !alternateSelf) return;

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

      // Extract memory snippet for this message
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

      // Supabase expects Json serializable structure
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

      // Save reflection to database
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        await supabase.from("reflections").insert({
          user_id: authData.user.id,
          alternate_self_id: alternateSelf.id,
          conversation_id: conversationId,
          title: reflectionData.reflection.title,
          insights: reflectionData.reflection.insights,
        });

        // Save memory snippets to database
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
      <div className="min-h-screen flex items-center justify-center" aria-busy="true" aria-live="polite">
        <div role="status" aria-label="Loading">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-6 bg-[#0B0C10] overflow-hidden">
      <MoodBackground toneTags={toneTags} />
      {/* Brand animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0B0C10] via-[#0E1A2E] to-[#13213A]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <div className="max-w-7xl mx-auto">
  {/* Header with wordmark */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center justify-center md:justify-start">
            <LogoWordmark size={22} />
          </div>
          <div className="flex gap-2 justify-center md:justify-end">
            <GlassButton
              variant="secondary"
              onClick={handleGenerateReflection}
              disabled={isGeneratingReflection || messages.length < 2}
              label={isGeneratingReflection ? "Reflecting..." : "Save & Reflect"}
              className="gap-2"
            />
            <GlassButton
              variant="secondary"
              onClick={() => navigate("/saved")}
              label="My Selves"
              className="gap-2"
            />
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1">
            <ProfileCard alternateSelf={alternateSelf} userName={user.name} />
          </div>

          {/* Chat area */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-[0_0_25px_rgba(113,208,227,0.1)] border-white/10 bg-[#0F1623]/60 backdrop-blur-md h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
          <p className="text-lg mb-2">Start a conversation with your Alternate Self</p>
                    <p className="text-sm">Ask them about their life, choices, or perspectives</p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "gradient-primary text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.memorySnippet && (
                      <MemorySnippetBadge
                        text={message.memorySnippet.content}
                        emotionalTone={message.memorySnippet.emotional_tone}
                      />
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 items-center">
                <div className="hidden sm:block">
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="px-3 py-2 rounded-md bg-muted text-foreground text-sm"
                  >
                    <option value="exploratory">Exploratory</option>
                    <option value="therapy">Therapy</option>
                    <option value="concise">Concise</option>
                  </select>
                </div>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                  style={{
                    boxShadow: currentSentiment ? `0 0 20px ${currentSentiment.colorTone}40` : undefined,
                    borderColor: currentSentiment ? currentSentiment.colorTone : undefined,
                  }}
                />
                <GlassButton
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  label={isLoading ? "..." : "Send"}
                  className="min-w-[96px]"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Subtle radial glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(113,208,227,0.08)_0%,transparent_80%)]" />

      {/* Reflection Modal */}
      <Dialog open={showReflectionModal} onOpenChange={setShowReflectionModal}>
        <DialogContent className="max-w-2xl glass-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Reflections</DialogTitle>
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
