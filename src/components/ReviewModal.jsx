import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GOOGLE_REVIEW_URL } from "@/lib/config";
import { MapPinPlus } from "lucide-react";
import QRCode from "react-qr-code";

export function ReviewModal({ open, onOpenChange, showTrigger = true }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <div className="fixed shadow-lg bg-white hover:scale-110 transition-all cursor-pointer text-black bottom-6 left-6 md:left-[256px] lg:left-[312px] p-3.5 rounded-full">
            <MapPinPlus className="w-5 h-5" />
          </div>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Google Review</DialogTitle>
          <DialogDescription>
            Scan the QR code to write a review
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <div className="p-4 border rounded-md shadow-lg">
            <QRCode value={GOOGLE_REVIEW_URL} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
