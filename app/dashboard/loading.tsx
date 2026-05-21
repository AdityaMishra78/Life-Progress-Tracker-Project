import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass rounded-3xl p-5">
            <Skeleton className="mb-5 h-12 w-12 rounded-2xl" />
            <Skeleton className="mb-1 h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_.9fr]">
        <div className="glass rounded-3xl p-5">
          <Skeleton className="mb-5 h-6 w-40" />
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="glass rounded-3xl p-5 flex items-center justify-center">
          <Skeleton className="h-40 w-40 rounded-full" />
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-3xl p-5">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </section>
    </div>
  );
}