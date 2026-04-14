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
import { Copy, Check, ExternalLink } from "lucide-react";
import QRCode from "react-qr-code";

function CarwashPublicPortal({ setShowShare, showShare }) {
  const [isCopied, setIsCopied] = useState(false);
  const publicPortalUrl = `${window.location.origin}/carwashbyhuwoma`;

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const handleCloseShare = () => {
    setShowShare(false);
    setIsCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicPortalUrl);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const openInNewTab = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer external";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleVisit = () => {
    if (isIOS && isStandalone && publicPortalUrl.startsWith("https://")) {
      window.location.href = `x-safari-${publicPortalUrl}`;
      return;
    }

    openInNewTab(publicPortalUrl);
  };

  return (
    <AlertDialog open={showShare} onOpenChange={handleCloseShare}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Copy the customer check-in link</AlertDialogTitle>
          <AlertDialogDescription className="p-3 text-sm text-center break-all border rounded-md bg-muted">
            {publicPortalUrl}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center">
          <QRCode
            size={128}
            className="border rounded-md p-1 shadow-sm"
            value={publicPortalUrl}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleCopy} variant="outline" disabled={isCopied}>
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
          <Button className="mb-2 sm:ml-2" onClick={handleVisit}>
            Visit <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CarwashPublicPortal;
