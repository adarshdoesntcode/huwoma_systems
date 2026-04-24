import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download, ExternalLink } from "lucide-react";

function PublicEntryModalActions({
  isCopied,
  handleCopyLink,
  handleOpenLink,
  handleDownloadQr,
}) {
  return (
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
  );
}

export default PublicEntryModalActions;
