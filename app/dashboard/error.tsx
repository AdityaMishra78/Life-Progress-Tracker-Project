"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <EmptyState
        title="Something went wrong"
        description="We encountered an error loading your dashboard. Please try again."
        action={
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
        }
      />
    </div>
  );
}