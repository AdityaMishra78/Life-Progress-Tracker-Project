"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, Sparkles } from "lucide-react";

interface QuickAuthProps {
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export function QuickAuth({ 
  onSuccess,
  title = "Activate your tracking profile",
  description = "Create a secure workspace to start logging sessions, workouts, and habits."
}: QuickAuthProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      if (isSignUp) {
        // Attempt sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password
        });
        
        if (signUpError) throw signUpError;
        
        // If email confirmation is enabled, guide them
        if (data.user && !data.session) {
          setError("Account created! Please check your email inbox to confirm your registration.");
          setLoading(false);
          return;
        }
      } else {
        // Attempt sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        
        if (signInError) throw signInError;
      }

      router.refresh();
      if (onSuccess) onSuccess();
      // Force page refresh to establish all auth contexts
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center text-center py-6 px-4 space-y-4 max-w-sm mx-auto animate-fadeIn">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-foreground border border-border/40 shadow-sm">
        <Sparkles size={22} />
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-lg font-black tracking-tight">{isSignUp ? title : "Welcome back"}</h3>
        <p className="text-xs text-muted leading-relaxed max-w-xs">{description}</p>
      </div>

      <form onSubmit={handleAuth} className="w-full space-y-3 pt-2 text-left">
        {error && (
          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 text-xs text-foreground font-semibold">
            {error}
          </div>
        )}
        
        <div className="relative flex items-center">
          <Mail className="absolute left-4 size-4 text-muted" />
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-border bg-card/60 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-800"
          />
        </div>

        <div className="relative flex items-center">
          <KeyRound className="absolute left-4 size-4 text-muted" />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-border bg-card/60 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-800"
          />
        </div>

        <Button className="w-full py-3 mt-1 font-bold" type="submit" disabled={loading}>
          {loading ? "Processing..." : isSignUp ? "Create Workspace" : "Access Workspace"}
        </Button>
      </form>

      <div className="pt-2">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          disabled={loading}
          className="text-xs text-muted hover:text-foreground font-semibold transition"
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
