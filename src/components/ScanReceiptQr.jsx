import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ScanQrCode } from "lucide-react";
import { useState } from "react";
import { useGetCheckoutEndpointQuery } from "@/features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

import { toast } from "@/hooks/use-toast";

function ScanReceiptQr() {
  const [open, setOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const navigate = useNavigate();

  const { data, error, isLoading, isSuccess, isError, refetch } =
    useGetCheckoutEndpointQuery(scannedCode, {
      skip: !scannedCode || !open,
      keepUnusedDataFor: 0,
    });

  if (isSuccess && data) {
    if (data.data.endpoint === "carwash") {
      const transactionDetails = data.data.transaction;

      const origin =
        transactionDetails.transactionStatus === "In Queue"
          ? "queue"
          : transactionDetails.transactionStatus === "Ready for Pickup"
          ? "pickup"
          : transactionDetails.transactionStatus === "Completed" && "pending";

      navigate("/carwash/checkout", {
        state: { transactionDetails, origin },
      });
    } else if (data.data.endpoint === "parking") {
      navigate(`/parking/checkout/${data.data.transaction._id}`);
    }
    setOpen(false);
    setScannedCode(null);
  }

  if (isError) {
    setOpen(false);
    setScannedCode(null);
    if (error.status === 400) {
      toast({
        variant: "warning",
        title: "Invalid QR Code!!",
        description: "Please scan a valid QR code",
        duration: 2000,
      });
      return;
    } else if (error.status === 404) {
      toast({
        variant: "default",
        title: "Transaction Closed",
        description: "Qr code expired",
        duration: 2000,
      });
      return;
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.data.message,
      });
    }
  }
  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setScannedCode(null);
      }}
    >
      <DrawerTrigger asChild>
        <div className="fixed p-4 text-white transition-all bg-black rounded-full shadow-lg cursor-pointer hover:scale-110 bottom-6 right-6">
          <ScanQrCode className="w-5 h-5" />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Scan the token&apos;s QR code</DrawerTitle>
          <DrawerDescription>
            Align the QR code within the frame.
          </DrawerDescription>
        </DrawerHeader>

        <div>
          {!scannedCode && open ? (
            <Scanner onScan={(result) => setScannedCode(result[0].rawValue)} />
          ) : (
            isLoading && <Loader />
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="w-full">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ScanReceiptQr;
