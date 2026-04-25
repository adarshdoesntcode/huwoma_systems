import { Loader2 } from "lucide-react";

function PublicEntryButtonBusyState({ label }) {
  return (
    <span className="inline-flex items-center">
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      {label}
    </span>
  );
}

export default PublicEntryButtonBusyState;
