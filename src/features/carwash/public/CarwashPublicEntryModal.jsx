import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Download, ExternalLink } from "lucide-react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";

function CarwashPublicEntryModal({ showPublicEntry, setShowPublicEntry }) {
  const [isCopied, setIsCopied] = useState(false);
  const qrCardRef = useRef(null);

  const publicEntryUrl = `${window.location.origin}/parknwashbyhuwoma`;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const openInExternalBrowser = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer external";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleOpenLink = () => {
    if (isIOS && isStandalone && publicEntryUrl.startsWith("https://")) {
      window.location.href = `x-safari-${publicEntryUrl}`;
      return;
    }
    openInExternalBrowser(publicEntryUrl);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicEntryUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Please copy the URL manually from the dialog.",
      });
    }
  };

  const handleDownloadQr = async () => {
    try {
      const canvas = await html2canvas(qrCardRef.current, {
        backgroundColor: "#ffffff",
      });
      const imageUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "ParkNWash_Public_Entry_QR.png";
      link.click();
    } catch {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not generate QR image.",
      });
    }
  };

  const handleOpenChange = (open) => {
    setShowPublicEntry(open);
    if (!open) {
      setIsCopied(false);
    }
  };

  return (
    <AlertDialog open={showPublicEntry} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            Customer Portal QR
          </AlertDialogTitle>
          <AlertDialogDescription className="p-3 text-sm text-center break-all border rounded-md bg-muted">
            {publicEntryUrl}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center">
          <div
            ref={qrCardRef}
            className="flex flex-col items-center gap-3 p-4 bg-white border rounded-lg"
          >
            <QRCode
              size={240}
              className="p-1 rounded-md"
              value={publicEntryUrl}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            disabled={isCopied}
            className="w-full mt-2 sm:w-auto sm:mt-0"
          >
            {isCopied ? (
              <>
                Copied
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Copy Link
                <Copy className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          <Button
            onClick={handleOpenLink}
            variant="outline"
            className="w-full mt-2 sm:w-auto sm:mt-0"
          >
            Open
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={handleDownloadQr}
            className="w-full mt-2 sm:w-auto sm:mt-0"
          >
            Download QR
            <Download className="w-4 h-4 ml-2" />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CarwashPublicEntryModal;
