"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function AnimatedCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28 }}
      className={cn("glass rounded-3xl p-5 shadow-sm", className)}
    >
      {children}
    </motion.div>
  );
}
