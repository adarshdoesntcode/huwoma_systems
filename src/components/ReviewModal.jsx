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
import { MapPinPlus } from "lucide-react";
import QRCode from "react-qr-code";

export function ReviewModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="fixed shadow-lg bg-white hover:scale-110 transition-all cursor-pointer text-black bottom-6 left-6 md:left-[256px] lg:left-[312px] p-3.5 rounded-full">
          <MapPinPlus className="w-5 h-5" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Google Review</DialogTitle>
          <DialogDescription>
            Scan the QR code to write a review
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <div className="p-4 border rounded-md shadow-lg">
            <QRCode
              value={
                "https://search.google.com/local/writereview?placeid=ChIJX7h_TQAb6zkRwutDM9cd9qo"
              }
            />
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
