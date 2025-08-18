import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, TriangleAlert } from "lucide-react";

export function OfflineAlert() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showOnline = () => {
      setIsOnline(true);
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    };
    const showOffline = () => {
      setIsOnline(false);
      setShow(true);
    };

    window.addEventListener("online", showOnline);
    window.addEventListener("offline", showOffline);
    return () => {
      window.removeEventListener("online", showOnline);
      window.removeEventListener("offline", showOffline);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 z-[100000000] w-11/12 max-w-md transform -translate-x-1/2 rounded-lg px-4 py-3 flex items-start space-x-3 shadow-lg",
        isOnline
          ? "bg-emerald-500 text-white"
          : "bg-yellow-300 text-neutral-900"
      )}
      role="alert"
    >
      <div className="mt-0.5">
        {isOnline ? (
          <ShieldCheck className="w-6 h-6 text-white" />
        ) : (
          <TriangleAlert className="w-6 h-6 text-neutral-800" />
        )}
      </div>
      <div className="flex-1 space-y-1 ">
        <p className="text-sm font-semibold">
          {isOnline ? "You are back online!" : "You are offline."}
        </p>
        <p className={isOnline ? "opacity-90 text-xs" : "opacity-80 text-xs"}>
          {isOnline
            ? "Your connection has been restored."
            : "Some features may not work until you reconnect."}
        </p>
      </div>
      <button
        onClick={() => setShow(false)}
        className={cn(
          "ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full focus:outline-none",
          isOnline
            ? "text-white hover:bg-white/20"
            : "text-neutral-800 hover:bg-neutral-900/10"
        )}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
