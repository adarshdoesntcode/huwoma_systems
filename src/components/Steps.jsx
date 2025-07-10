import { cn } from "@/lib/utils";

export function Steps({ steps, current, className }) {
  return (
    <div
      className={cn(
        "flex border  p-3 px-4 w-fit  bg-white rounded-full items-center justify-center gap-2",
        className
      )}
    >
      {Array.from({ length: steps }).map((_, idx) => {
        const isActive = current === idx;
        const isComplete = current > idx;
        const isLast = idx === steps - 1;

        return (
          <div key={idx} className="flex items-center ">
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                isComplete && "bg-primary/80",
                isActive && "bg-primary/30",
                !isActive && !isComplete && "bg-muted-foreground/10"
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Steps;
