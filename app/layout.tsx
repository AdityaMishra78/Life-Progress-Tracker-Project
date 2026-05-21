import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Life Progress Tracker",
  description: "Track study, workouts, habits, skills, goals, streaks, and life progress.",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background bg-aurora text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
