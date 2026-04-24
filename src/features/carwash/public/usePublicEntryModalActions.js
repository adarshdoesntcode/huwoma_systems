import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";

const PUBLIC_ENTRY_PATH = "/parknwashbyhuwoma";
const QR_DOWNLOAD_FILE_NAME = "ParkNWash_Public_Entry_QR.png";

const openInExternalBrowser = (url) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer external";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

const isIOSWebView = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isStandaloneDisplay = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export function usePublicEntryModalActions({ setShowPublicEntry }) {
  const [isCopied, setIsCopied] = useState(false);
  const qrCardRef = useRef(null);
  const publicEntryUrl = useMemo(
    () => `${window.location.origin}${PUBLIC_ENTRY_PATH}`,
    [],
  );

  const handleOpenLink = () => {
    if (
      isIOSWebView() &&
      isStandaloneDisplay() &&
      publicEntryUrl.startsWith("https://")
    ) {
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
      link.download = QR_DOWNLOAD_FILE_NAME;
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

  return {
    isCopied,
    qrCardRef,
    publicEntryUrl,
    handleOpenChange,
    handleCopyLink,
    handleOpenLink,
    handleDownloadQr,
  };
}
