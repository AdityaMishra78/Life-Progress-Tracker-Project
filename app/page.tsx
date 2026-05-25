"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Compass, Flame, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { toast } from "sonner";

export default function WelcomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStartJourney(e: React.FormEvent) {
    e.preventDefault();
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      toast.error("Please enter a username to continue!");
      return;
    }

    if (cleanUsername.length < 2) {
      toast.error("Username must be at least 2 characters long!");
      return;
    }

    setLoading(true);

    try {
      // 1. Always save in local storage for instant access & offline support
      localStorage.setItem("local_username", cleanUsername);

      // 2. Try signing in anonymously via Supabase
      const supabase = createClient();
      const { data: auth, error: authError } = await supabase.auth.signInAnonymously();

      if (authError) {
        console.warn("Supabase anonymous auth failed, proceeding in local offline mode:", authError.message);
        toast.success(`Welcome, ${cleanUsername}! Running in offline mode.`);
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // 3. Update Supabase profile display name
      if (auth.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ display_name: cleanUsername })
          .eq("id", auth.user.id);

        if (profileError) {
          console.error("Failed to update profile display name in Supabase:", profileError.message);
        }
      }

      toast.success(`Welcome, ${cleanUsername}! Your journey has begun.`);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Error during onboarding:", err);
      // Fallback grace
      toast.success(`Welcome, ${cleanUsername}! Running in local offline mode.`);
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Dynamic colorful blur blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-600/25 blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px] animate-pulse [animation-delay:2s]" />

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl md:p-10"
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

          {/* Top visual accents */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20">
              <Compass className="h-6 w-6" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-amber-500">
              <Flame className="h-6 w-6" />
            </div>
          </div>

          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-white via-indigo-100 to-violet-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl"
            >
              Apex Life
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-sm text-slate-400"
            >
              Forge habits, master skills, and conquer your goals. Start tracking your life progress today.
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleStartJourney}
            className="mt-8 space-y-5"
          >
            <div>
              <label 
                htmlFor="username" 
                className="block text-xs font-semibold tracking-wider text-slate-400 uppercase"
              >
                Choose a Username
              </label>
              <div className="relative mt-2">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ZenMaster"
                  disabled={loading}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none ring-offset-slate-950 transition hover:bg-white/[0.07] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  maxLength={25}
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Sparkles className="h-4 w-4 text-violet-400/80" />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/35 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Start Your Journey
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer visual indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 border-t border-white/5 pt-6 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
            <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-violet-500" /> Instant Access</span>
            <span className="flex items-center gap-1.5"><Compass className="h-3 w-3 text-indigo-500" /> Offline Capable</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
