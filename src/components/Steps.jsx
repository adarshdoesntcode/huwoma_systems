"use client";

import { motion } from "framer-motion";
import { Check, Dot } from "lucide-react";
import { cn } from "@/lib/utils";

export function Steps({ steps, current }) {
  const variants = {
    inactive: {
      backgroundColor: "var(--muted-foreground)",
      color: "var(--muted)",
    },
    active: {
      backgroundColor: "black",
      color: "white",
      border: "2px solid black",
    },
    complete: {
      backgroundColor: "black",
      color: "white",
      border: "2px solid black",
    },
  };

  return (
    <div className="flex justify-center gap-14">
      {Array.from({ length: steps }).map((_, idx) => {
        const status =
          current > idx ? "complete" : current === idx ? "active" : "inactive";

        return (
          <motion.div
            key={idx}
            className="relative flex items-center justify-center w-4 h-4 border-2 rounded-full"
            animate={status}
            variants={variants}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: current > idx ? 1 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {current > idx ? (
                <Check className="w-3 h-3" />
              ) : (
                <Dot className="w-4 h-4" />
              )}
            </motion.div>

            {idx < steps - 1 && (
              <motion.div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 left-5 h-0.5 w-11"
                )}
                animate={{
                  backgroundColor: current > idx ? "gray" : "lightgrey",
                }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default Steps;
