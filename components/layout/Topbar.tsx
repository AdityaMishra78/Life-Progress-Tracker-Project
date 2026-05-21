"use client";

import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Search, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Topbar({ name }: { name?: string | null }) {
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/50 bg-background/70 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div>
        <p className="text-sm text-muted">Welcome back,</p>
        <h1 className="text-xl font-black">{name || "Champion"} 👋</h1>
      </div>

      <div className="hidden w-full max-w-sm items-center rounded-2xl border border-border bg-card/70 px-3 py-2 md:flex">
        <Search className="mr-2 size-4 text-muted" />
        <input
          placeholder="Search habits, goals, skills..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
