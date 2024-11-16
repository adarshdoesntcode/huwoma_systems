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

import { getTimeDifference } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";

const SimRacingTransactionDetails = ({
  showDetails,
  setTransactionDetails,
  setShowDetails,
  transactionDetails,
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

export default SimRacingTransactionDetails;
