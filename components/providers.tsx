"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import { createClient } from "@/lib/supabase/browser";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  resolvedTheme: "light" | "dark";
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme: Theme = storedTheme ?? "system";
    const resolvedTheme = initialTheme === "system" ? getSystemTheme() : initialTheme;

    setThemeState(initialTheme);
    applyTheme(resolvedTheme);

    const supabase = createClient();
    async function authenticateGuest() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // 1. Try anonymous sign-in first (no verification, no passwords needed!)
          const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
          
          if (!anonError && anonData.user) {
            window.location.reload();
            return;
          }

          // 2. Fallback to pre-registered guest credentials if anonymous is disabled
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: "guest@lifetrack.com",
            password: "guestpassword123"
          });
          
          if (signInError) {
            const { error: signUpError } = await supabase.auth.signUp({
              email: "guest@lifetrack.com",
              password: "guestpassword123"
            });
            if (!signUpError) {
              window.location.reload();
            } else {
              console.error("Auto-authentication could not be completed:", signUpError);
            }
          } else {
            window.location.reload();
          }
        }
      } catch (err) {
        console.error("Auto-authentication error:", err);
      }
    }
    authenticateGuest();
  }, []);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = (event: MediaQueryListEvent) => {
      applyTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", onMediaChange);
    return () => mediaQuery.removeEventListener("change", onMediaChange);
  }, [theme]);

  const resolvedTheme = useMemo<"light" | "dark">(() => {
    if (theme === "system") {
      if (typeof window === "undefined") {
        return "light";
      }

      return getSystemTheme();
    }

    return theme;
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    const resolved = nextTheme === "system" ? getSystemTheme() : nextTheme;
    localStorage.setItem("theme", nextTheme);
    applyTheme(resolved);
    setThemeState(nextTheme);
  };

  const contextValue = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
      <Toaster richColors position="top-right" />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within Providers");
  }

  return context;
}
