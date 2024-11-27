import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { isMobile } from "react-device-detect";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

import { getDaysDifference, getTimeDifference } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Loader2, Undo2 } from "lucide-react";
import { useSimracingRollbackFromCompletedMutation } from "./simRacingApiSlice";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SimRacingTransactionDetails = ({
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
          className="h-[80vh] flex-1 overflow-y-auto  sm:h-[75vh] pb-0"
          side={"bottom"}
        >
          <SheetHeader className="mb-2">
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto pb-16">
              <Details
                transactionDetails={transactionDetails}
                raceStart={raceStart}
                raceEnd={raceEnd}
                raceTime={raceTime}
              />
            </div>
            <SheetFooter className="sticky py-4 pb-6 border-t bg-background bottom-0">
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
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pb-12">
              <Details
                transactionDetails={transactionDetails}
                raceStart={raceStart}
                raceEnd={raceEnd}
                raceTime={raceTime}
              />
            </div>
            <SheetFooter className="sticky py-4 pb-6 border-t bg-background bottom-0">
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
        <div className="grid  gap-2">
          <div className="border p-4 rounded-md shadow-sm">
            <div className="flex gap-1 flex-col">
              <div className="font-medium flex items-center justify-between">
                <div className="text-sm">
                  {transactionDetails?.rig?.rigName}
                </div>
                <StatusBadge status={transactionDetails?.transactionStatus} />
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-xs font-medium">
                  Start Time
                </div>
                <div className="text-xs ">
                  {raceStart ? format(raceStart, "d MMM, yy - hh:mm a") : null}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-xs font-medium">
                  End Time
                </div>
                <div className="text-xs ">
                  {raceEnd ? format(raceEnd, "d MMM, yy - hh:mm a") : null}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-xs font-medium">
                  Total Time
                </div>
                <div className="text-sm font-semibold ">
                  {`${raceTime?.hours > 0 ? `${raceTime?.hours}h ` : ""} ${
                    raceTime?.minutes > 0 ? `${raceTime?.minutes}m` : ""
                  }`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Details</Label>
          <div className="flex gap-1 flex-col mt-1">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-xs font-medium">
                Bill No
              </div>
              <div className="text-xs ">
                {transactionDetails?.billNo || "-"}
              </div>
            </div>

            {transactionDetails?.transactionTime && (
              <div className="flex items-center justify-between">
                <>
                  <div className="text-muted-foreground text-xs font-medium">
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

            <div className="flex items-center justify-between  ">
              <div className="text-muted-foreground text-xs font-medium">
                Customer
              </div>
              <div className="text-xs ">
                {transactionDetails?.customer?.customerName || "-"}
              </div>
            </div>
            <div className="flex items-center justify-between  ">
              <div className="text-muted-foreground text-xs font-medium">
                Contact
              </div>
              <div className="text-xs font-medium">
                {transactionDetails?.customer?.customerContact || "-"}
              </div>
            </div>
            <div className="flex items-center justify-between  ">
              <div className="text-muted-foreground text-xs font-medium">
                Status
              </div>
              <div className="text-xs font-medium">
                {transactionDetails?.paymentStatus || "-"}
              </div>
            </div>
            {transactionDetails?.transactionStatus === "Completed" && (
              <>
                <div className="flex items-center justify-between  ">
                  <div className="text-muted-foreground text-xs font-medium">
                    Mode
                  </div>
                  <div className="text-xs font-medium">
                    {transactionDetails?.paymentMode?.paymentModeName || "-"}
                  </div>
                </div>
                <div className="flex items-center justify-between  ">
                  <div className="text-muted-foreground text-xs font-medium">
                    Gross Amt
                  </div>
                  <div className="text-xs font-medium">
                    Rs. {transactionDetails?.grossAmount || "0"}
                  </div>
                </div>
                <div className="flex items-center justify-between  ">
                  <div className="text-muted-foreground text-xs font-medium">
                    Discount Amt
                  </div>
                  <div className="text-xs font-medium">
                    Rs. {transactionDetails?.discountAmount || "0"}
                  </div>
                </div>
                <div className="flex items-center justify-between  ">
                  <div className="text-muted-foreground text-xs font-medium">
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
  const [simracingRollbackFromCompleted, { isLoading }] =
    useSimracingRollbackFromCompletedMutation();

  const handleRollbackFromComplete = async () => {
    try {
      if (!transactionDetails._id) return;
      const res = await simracingRollbackFromCompleted({
        transactionId: transactionDetails._id,
      });

      if (res.error) {
        handleCloseSheet();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseSheet();
        if (origin === "simracing") {
          navigate("/simracing", { state: { tab: "active" }, replace: true });
        }
        toast({
          title: "Transaction Rolled Back",
          description: "to Active",
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
    <div className="flex justify-between gap-4 items-center w-full">
      <AlertDialog open={openRollBack} onOpenChange={setOpenRollBack}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you want to Rollback?</AlertDialogTitle>
            <AlertDialogDescription>
              This will rollback this transaction from Completed to Ready for
              Pickup
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {isLoading ? (
              <Button variant="destructive" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rolling back...
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleRollbackFromComplete}
              >
                Rollback <Undo2 className="ml-2 h-4 w-4" />
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
            <Undo2 className="h-4 w-4 ml-2" />{" "}
          </Button>
        )}
    </div>
  );
};

export default SimRacingTransactionDetails;
