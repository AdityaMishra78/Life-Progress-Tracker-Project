"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers";
import { Button } from "./Button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const icon = mounted
    ? resolvedTheme === "dark"
      ? <Sun size={16} />
      : <Moon size={16} />
    : <Sun size={16} />;

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {icon}
    </Button>
  );
}
