import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileCard from "@/components/ProfileCard";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { alternateSelfId, userId } = location.state || {};

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alternateSelf, setAlternateSelf] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        setMessages(existingConv.messages || []);
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
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      await supabase
        .from("conversations")
        .update({ messages: finalMessages })
        .eq("id", conversationId);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!alternateSelf || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Chat with Your Parallel Self</h1>
          <Button variant="outline" onClick={() => navigate("/saved")} className="gap-2">
            <Home className="h-4 w-4" />
            My Parallel Selves
          </Button>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1">
            <ProfileCard alternateSelf={alternateSelf} userName={user.name} />
          </div>

          {/* Chat area */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-card border-primary/20 h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <p className="text-lg mb-2">Start a conversation with your parallel self</p>
                    <p className="text-sm">Ask them about their life, choices, or perspectives</p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="gradient-primary text-white"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
