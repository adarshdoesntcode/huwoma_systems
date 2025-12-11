import React from "react";

export default function GoogleLoader({
  message = "Signing in with Google...",
  fullscreen = true,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        (fullscreen ? "fixed inset-0 z-50" : "relative w-full h-full") +
        " flex flex-col items-center justify-center bg-white backdrop-blur-sm"
      }
    >
      <div className="relative flex items-end gap-1.5">
        <Dot color="#4285F4" delay="0ms" />
        <Dot color="#EA4335" delay="120ms" />
        <Dot color="#FBBC05" delay="240ms" />
        <Dot color="#34A853" delay="360ms" />
      </div>

      <p className="mt-4 text-sm font-medium text-muted-foreground sm:text-base">
        {message}
      </p>

      <style>{`
        @keyframes g-bounce {
          0% { transform: translateY(0) scale(.92); opacity:.7; filter:saturate(.9); }
          25% { transform: translateY(-10px) scale(1); opacity:1; filter:saturate(1); }
          50% { transform: translateY(0) scale(.96); opacity:.9; }
          100% { transform: translateY(0) scale(.92); opacity:.7; }
        }
        @keyframes g-shadow {
          0%, 100% { transform: scale(.9); opacity:.25; }
          25% { transform: scale(1.05) translateY(1px); opacity:.35; }
          50% { transform: scale(.95); opacity:.28; }
        }

        .g-bounce {
          animation: g-bounce 900ms cubic-bezier(.22,.61,.36,1) infinite;
          will-change: transform, opacity, filter;
        }
        .g-shadow {
          animation: g-shadow 900ms cubic-bezier(.22,.61,.36,1) infinite;
          will-change: transform, opacity;
        }
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .g-bounce, .g-shadow { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function Dot({ color, delay }) {
  return (
    <div className="relative w-4 h-4">
      <div
        className="absolute inset-0 rounded-full g-bounce"
        style={{ backgroundColor: color, animationDelay: delay }}
      />

      <div
        className="g-shadow absolute -bottom-1 left-1/2 h-1.5 w-3 -translate-x-1/2 rounded-full blur-[2px] bg-black/30 dark:bg-black/50"
        style={{ animationDelay: delay }}
      />
    </div>
  );
}
