import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PublicEntryQrCard from "./PublicEntryQrCard";
import PublicEntryModalActions from "./PublicEntryModalActions";
import { usePublicEntryModalActions } from "./usePublicEntryModalActions";

function CarwashPublicEntryModal({ showPublicEntry, setShowPublicEntry }) {
  const {
    isCopied,
    qrCardRef,
    publicEntryUrl,
    handleOpenChange,
    handleCopyLink,
    handleOpenLink,
    handleDownloadQr,
  } = usePublicEntryModalActions({ setShowPublicEntry });

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

        <PublicEntryQrCard qrCardRef={qrCardRef} publicEntryUrl={publicEntryUrl} />

        <PublicEntryModalActions
          isCopied={isCopied}
          handleCopyLink={handleCopyLink}
          handleOpenLink={handleOpenLink}
          handleDownloadQr={handleDownloadQr}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CarwashPublicEntryModal;
