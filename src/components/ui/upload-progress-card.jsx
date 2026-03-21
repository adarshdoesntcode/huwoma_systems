import { Loader2 } from "lucide-react";
import { Progress } from "./progress";

export const UploadProgressCard = ({ progress }) => {
  if (!progress) {
    return null;
  }

  const {
    phase,
    percent = 0,
    uploadedFiles = 0,
    totalFiles = 0,
    currentBatch = 0,
    totalBatches = 0,
  } = progress;

  const safePercent = Math.round(percent);
  const safeTotalFiles = totalFiles || 0;
  const safeUploadedFiles = Math.min(uploadedFiles || 0, safeTotalFiles);

  let statusLabel = "Preparing upload...";
  if (phase === "uploading") {
    statusLabel = `Uploading photos ${safeUploadedFiles}/${safeTotalFiles}`;
  } else if (phase === "complete") {
    statusLabel = `Upload complete (${safeTotalFiles}/${safeTotalFiles})`;
  }

  return (
    <div className="w-full max-w-4xl p-4 mx-auto border rounded-lg bg-neutral-50 border-neutral-200">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {phase !== "complete" ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
          ) : null}
          <p className="text-sm font-medium text-neutral-700">{statusLabel}</p>
        </div>
        <p className="text-sm font-semibold text-neutral-700">{safePercent}%</p>
      </div>
      <Progress className="h-2 mt-3 bg-neutral-200" value={safePercent} />
      <p className="mt-2 text-xs text-neutral-500">
        Batch {Math.max(currentBatch, 1)} of {Math.max(totalBatches, 1)}
      </p>
    </div>
  );
};
