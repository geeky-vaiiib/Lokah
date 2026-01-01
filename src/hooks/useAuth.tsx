import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for demo mode
    const isDemo = import.meta.env.VITE_SUPABASE_URL?.includes("xawscxdrwzjzghshudpx");
    const demoSession = localStorage.getItem("lokah_demo_session");

    if (isDemo && demoSession) {
      // Mock user for demo mode
      const mockUser = {
        id: "demo-user-123",
        email: "traveler@lokah.cosmos",
        user_metadata: { name: "Cosmic Traveler" },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString()
      } as unknown as User;
      setUser(mockUser);
      setSession({ user: mockUser, access_token: "mock", refresh_token: "mock", expires_in: 3600, token_type: "bearer" });
      setLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (localStorage.getItem("lokah_demo_session")) {
      localStorage.removeItem("lokah_demo_session");
      setUser(null);
      setSession(null);
      navigate("/auth");
      return;
    }
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return { user, session, loading, signOut };
};