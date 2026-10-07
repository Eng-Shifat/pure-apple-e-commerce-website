"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";

export function useAuth() {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          id:    data.user.id,
          email: data.user.email!,
          name:  data.user.user_metadata?.name,
          role:  data.user.user_metadata?.role ?? "customer",
        });
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser({
          id:    session.user.id,
          email: session.user.email!,
          name:  session.user.user_metadata?.name,
          role:  session.user.user_metadata?.role ?? "customer",
        });
      } else {
        setUser(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return { user, loading, logout };
}
