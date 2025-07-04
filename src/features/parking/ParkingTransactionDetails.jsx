import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { isMobile } from "react-device-detect";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

import { getDaysDifference, getTimeDifference } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { Loader2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParkingRollbackFromCompletedMutation } from "./parkingApiSlice";

const ParkingTransactionDetails = ({
  showDetails,
  setTransactionDetails,
  setShowDetails,
  transactionDetails,
  origin,
}) => {
  let raceStart, raceEnd, raceTime;

  if (transactionDetails) {
    raceStart = transactionDetails?.start;
    raceEnd = transactionDetails?.end;
    raceTime = getTimeDifference(raceStart, raceEnd);
  }

  const handleCloseSheet = () => {
    setShowDetails(false);
    setTransactionDetails(null);
  };

  if (isMobile) {
    return (
      <Sheet open={showDetails} onOpenChange={handleCloseSheet}>
        <SheetContent
          className="h-[80dvh] flex-1 overflow-y-auto  sm:h-[75dvh] pb-0"
          side={"bottom"}
        >
          <SheetHeader className="mb-2">
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="flex flex-col flex-1">
            <div className="flex-1 pb-16 overflow-y-auto">
              <Details
                transactionDetails={transactionDetails}
                raceStart={raceStart}
                raceEnd={raceEnd}
                raceTime={raceTime}
              />
            </div>
            <SheetFooter className="sticky bottom-0 py-4 pb-6 border-t bg-background">
              <DetailsFooter
                transactionDetails={transactionDetails}
                origin={origin}
                handleCloseSheet={handleCloseSheet}
              />
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  } else {
    return (
      <Sheet open={showDetails} onOpenChange={handleCloseSheet}>
        <SheetContent className="min-w-[350px]  sm:min-w-[450px] ">
          <SheetHeader className="mb-2">
            <SheetTitle>Parking Transaction Details</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1 pb-12 overflow-y-auto">
              <Details
                transactionDetails={transactionDetails}
                raceStart={raceStart}
                raceEnd={raceEnd}
                raceTime={raceTime}
              />
            </div>
            <SheetFooter className="sticky bottom-0 py-4 pb-6 border-t bg-background">
              <DetailsFooter
                transactionDetails={transactionDetails}
                origin={origin}
                handleCloseSheet={handleCloseSheet}
              />
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
};

const Details = ({ transactionDetails, raceStart, raceEnd, raceTime }) => {
  if (transactionDetails) {
    return (
      <div className="grid gap-5 overflow-y-auto">
        <div className="grid gap-2">
          <div className="p-4 border rounded-md shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between font-medium">
                <div className="text-sm">
                  <div className="text-xs text-muted-foreground">
                    {transactionDetails?.vehicle?.vehicleTypeName}
                  </div>
                  <div className="text-sm">
                    Vehicle No: {transactionDetails?.vehicleNumber}
                  </div>
                </div>
                <StatusBadge status={transactionDetails?.transactionStatus} />
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">
                  Start Time
                </div>
                <div className="text-xs ">
                  {raceStart ? format(raceStart, "d MMM, yy - hh:mm a") : null}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">
                  End Time
                </div>
                <div className="text-xs ">
                  {raceEnd ? format(raceEnd, "d MMM, yy - hh:mm a") : null}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">
                  Total Time
                </div>
                <div className="text-sm font-semibold ">
                  {`
                  ${raceTime?.days > 0 ? `${raceTime?.days}d ` : ""}
                  ${raceTime?.hours > 0 ? `${raceTime?.hours}h ` : ""} ${
                    raceTime?.minutes > 0 ? `${raceTime?.minutes}m` : ""
                  }`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Details</Label>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">
                Bill No
              </div>
              <div className="text-xs ">
                {transactionDetails?.billNo || "-"}
              </div>
            </div>

            {transactionDetails?.transactionTime && (
              <div className="flex items-center justify-between">
                <>
                  <div className="text-xs font-medium text-muted-foreground">
                    Transaction Date
                  </div>
                  <div className="text-xs font-medium">
                    {format(
                      transactionDetails?.transactionTime,
                      "d MMM, yy - h:mm a"
                    )}
                  </div>
                </>
              </div>
            )}

            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Status
              </div>
              <div className="text-xs font-medium">
                {<StatusBadge status={transactionDetails?.paymentStatus} /> ||
                  "-"}
              </div>
            </div>
            {transactionDetails?.transactionStatus === "Completed" && (
              <>
                <div className="flex items-center justify-between ">
                  <div className="text-xs font-medium text-muted-foreground">
                    Mode
                  </div>
                  <div className="text-xs font-medium">
                    {transactionDetails?.paymentMode?.paymentModeName || "-"}
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="text-xs font-medium text-muted-foreground">
                    Gross Amt
                  </div>
                  <div className="text-xs font-medium">
                    Rs. {transactionDetails?.grossAmount || "0"}
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="text-xs font-medium text-muted-foreground">
                    Discount Amt
                  </div>
                  <div className="text-xs font-medium">
                    Rs. {transactionDetails?.discountAmount || "0"}
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="text-xs font-medium text-muted-foreground">
                    Net Amt
                  </div>
                  <div className="text-xs font-medium">
                    Rs. {transactionDetails?.netAmount || "0"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
};

const DetailsFooter = ({ transactionDetails, handleCloseSheet, origin }) => {
  const [openRollBack, setOpenRollBack] = useState(false);
  const navigate = useNavigate();
  const [parkingRollbackFromCompleted, { isLoading }] =
    useParkingRollbackFromCompletedMutation();

  const handleRollbackFromComplete = async () => {
    try {
      if (!transactionDetails._id) return;
      const res = await parkingRollbackFromCompleted({
        transactionId: transactionDetails._id,
      });

      if (res.error) {
        handleCloseSheet();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseSheet();

        if (origin === "parking") {
          navigate("/parking", { state: { tab: "parked" }, replace: true });
        }
        toast({
          title: "Transaction Rolled Back",
          description: "to Active",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-between w-full gap-4">
      <AlertDialog open={openRollBack} onOpenChange={setOpenRollBack}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you want to Rollback?</AlertDialogTitle>
            <AlertDialogDescription>
              This will rollback this transaction from Completed to Parked
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {isLoading ? (
              <Button variant="destructive" disabled>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Rolling back...
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleRollbackFromComplete}
              >
                Rollback <Undo2 className="w-4 h-4 ml-2" />
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {transactionDetails?.transactionStatus === "Completed" &&
        origin !== "transactions" &&
        getDaysDifference(transactionDetails?.end, new Date()) <= 3 && (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              setOpenRollBack(true);
            }}
          >
            Rollback
            <Undo2 className="w-4 h-4 ml-2" />{" "}
          </Button>
        )}
    </div>
  );
};

export default ParkingTransactionDetails;
