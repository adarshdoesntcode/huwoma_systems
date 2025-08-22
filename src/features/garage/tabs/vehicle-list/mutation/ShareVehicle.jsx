import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

function ShareVehicle({ shareId, setShowShare, setShareId, showShare }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCloseShare = () => {
    setShowShare(false);
    setShareId(null);
    setIsCopied(false);
  };

  const handleCopy = async () => {
    if (!shareId) return;

    await navigator.clipboard.writeText(
      `${window.location.origin}/garage/vehicle-details/${shareId}`
    );

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <AlertDialog open={showShare} onOpenChange={handleCloseShare}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Copy the shareable link</AlertDialogTitle>
          <AlertDialogDescription className="p-3 text-sm text-center break-words border rounded-md bg-muted">
            {`${window.location.origin}/garage/vehicle-details/${shareId}`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleCopy} disabled={isCopied}>
            {isCopied ? (
              <>
                Copied!
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Copy Link
                <Copy className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ShareVehicle;
