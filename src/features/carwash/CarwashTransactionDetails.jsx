import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowUpRightIcon,
  Check,
  ChevronRight,
  Copy,
  OctagonX,
  Phone,
  Printer,
  Undo2Icon,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { isMobile } from "react-device-detect";
import { Badge } from "@/components/ui/badge";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

import {
  cn,
  getDaysDifference,
  getTimeDifference,
  handlePrint,
  timeDifference,
} from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRole } from "@/hooks/useRole";
import { ROLES_LIST } from "@/lib/config";

const CarwashTransactionDetails = ({
  showDetails,
  setTransactionDetails,
  setShowDetails,
  transactionDetails,
  setShowDelete,
  setDeleteId,
  setShowRollbackFromComplete,
  setShowRollbackFromPickup,
  setRollBackId,
  origin,
}) => {
  const location = useLocation();

  let serviceEnd,
    parkingBuffer,
    parkingEligible,
    parkingIncluded,
    parkingStart,
    parkingEnd,
    parkingTime;

  if (transactionDetails) {
    serviceEnd = transactionDetails?.service?.end;
    parkingBuffer =
      transactionDetails?.service?.id?.includeParking.parkingBuffer;
    parkingEligible = timeDifference(serviceEnd, new Date(), parkingBuffer);
    parkingIncluded = transactionDetails?.service?.id?.includeParking.decision;
    parkingStart = new Date(
      new Date(serviceEnd).getTime() + parkingBuffer * 60 * 1000
    );
    parkingEnd = new Date();
    parkingTime = getTimeDifference(parkingStart, parkingEnd);
  }

  const handleCloseSheet = () => {
    setShowDetails(false);
    setTransactionDetails(null);
  };

  const handleTermination = () => {
    setDeleteId(transactionDetails._id);
    setShowDetails(false);
    setTransactionDetails(null);
    setShowDelete(true);
  };

  const handleRollbackFromPickup = () => {
    setRollBackId(transactionDetails._id);
    setShowDetails(false);
    setTransactionDetails(null);
    setShowRollbackFromPickup(true);
  };

  const handleRollbackFromComplete = () => {
    setRollBackId(transactionDetails._id);
    setShowDetails(false);
    setTransactionDetails(null);
    setShowRollbackFromComplete(true);
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
                parkingEligible={parkingEligible}
                parkingIncluded={parkingIncluded}
                parkingStart={parkingStart}
                parkingTime={parkingTime}
              />
            </div>
            <SheetFooter className="sticky bottom-0 py-4 pb-6 border-t bg-background">
              <DetailsFooter
                transactionDetails={transactionDetails}
                handleTermination={handleTermination}
                handleRollbackFromComplete={handleRollbackFromComplete}
                handleRollbackFromPickup={handleRollbackFromPickup}
                origin={origin}
              />
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  } else {
    return (
      <Sheet open={showDetails} onOpenChange={handleCloseSheet}>
        <SheetContent className="min-w-[350px]  sm:min-w-[500px] ">
          <SheetHeader className="mb-2">
            <SheetTitle>Carwash Transaction Details</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1 pb-12 overflow-y-auto">
              <Details
                transactionDetails={transactionDetails}
                parkingEligible={parkingEligible}
                parkingIncluded={parkingIncluded}
                parkingStart={parkingStart}
                parkingTime={parkingTime}
              />
            </div>
            <SheetFooter className="sticky bottom-0 py-4 pb-6 border-t bg-background">
              <DetailsFooter
                transactionDetails={transactionDetails}
                handleTermination={handleTermination}
                handleRollbackFromComplete={handleRollbackFromComplete}
                handleRollbackFromPickup={handleRollbackFromPickup}
                origin={origin}
              />
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
};

const Details = ({
  transactionDetails,
  parkingIncluded,
  parkingEligible,
  parkingStart,
  parkingTime,
}) => {
  if (transactionDetails) {
    return (
      <div className="grid gap-5 overflow-y-auto">
        {transactionDetails?.service?.id && (
          <div className="grid gap-2">
            <Label>Service</Label>
            <div className="p-4 border rounded-md shadow-sm">
              <div className="flex flex-col pb-2 mb-2 border-b">
                <div className="flex items-center justify-between font-medium">
                  <div className="text-sm">
                    {transactionDetails?.service?.id?.serviceTypeName}
                  </div>
                  <StatusBadge status={transactionDetails?.transactionStatus} />
                </div>
                <div className="text-xs text-muted-foreground">
                  {
                    transactionDetails?.service?.id?.serviceVehicle
                      ?.vehicleTypeName
                  }
                  {/* <div className="font-medium text-primary">
                    Vehicle No: {transactionDetails?.vehicleNumber}
                  </div> */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-primary">
                      {transactionDetails?.vehicleModel}
                      {transactionDetails?.vehicleModel
                        ? " - "
                        : "Vehicle No - "}

                      {transactionDetails?.vehicleNumber}
                    </div>
                    {transactionDetails?.vehicleColor && (
                      <div
                        className={cn(
                          `w-5 h-5 border  rounded-full shadow-lg  cursor-pointer`
                        )}
                        style={{
                          backgroundColor:
                            transactionDetails?.vehicleColor?.colorCode,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {transactionDetails?.service?.start && (
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">
                      Start Time
                    </div>
                    <div className="text-xs ">
                      {format(
                        transactionDetails?.service?.start,
                        "d MMM, yy - h:mm a"
                      )}
                    </div>
                  </div>
                )}
                {transactionDetails?.service?.end && (
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">
                      End Time
                    </div>
                    <div className="text-xs ">
                      {format(
                        transactionDetails?.service?.end,
                        "d MMM, yy - h:mm a"
                      )}
                    </div>
                  </div>
                )}
                {transactionDetails?.transactionStatus === "Completed" ? (
                  <div className="flex items-center justify-between ">
                    <div className="text-xs font-medium text-muted-foreground">
                      Cost
                    </div>
                    <div className="text-xs font-semibold">
                      {transactionDetails?.service?.cost > 0
                        ? `Rs. ${transactionDetails?.service?.cost}`
                        : "Free"}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between ">
                    <div className="text-xs font-medium text-muted-foreground">
                      Rate
                    </div>
                    <div className="text-xs font-semibold">
                      Rs. {transactionDetails?.service?.actualRate}
                    </div>
                  </div>
                )}
              </div>
              {transactionDetails?.parking && (
                <div className="grid gap-2 mt-2">
                  <Label>Parking</Label>
                  <Separator />
                  <div>
                    <div className="flex flex-col gap-1">
                      {transactionDetails?.parking?.in && (
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-muted-foreground">
                            In
                          </div>
                          <div className="text-xs ">
                            {format(
                              transactionDetails?.parking?.in,
                              "d MMM, yy - h:mm a"
                            )}
                          </div>
                        </div>
                      )}
                      {transactionDetails?.parking?.out && (
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-muted-foreground">
                            Out
                          </div>
                          <div className="text-xs ">
                            {format(
                              transactionDetails?.parking?.out,
                              "d MMM, yy - h:mm a"
                            )}
                          </div>
                        </div>
                      )}
                      {transactionDetails?.parking?.cost && (
                        <>
                          <Separator className="my-1" />
                          <div className="flex items-center justify-between ">
                            <div className="text-xs font-medium text-muted-foreground">
                              Cost
                            </div>
                            <div className="text-xs font-medium">
                              Rs. {transactionDetails?.parking?.cost}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {transactionDetails?.addOns?.length > 0 && (
          <div className="grid gap-2">
            <Label>Add Ons</Label>
            <div className="p-4 border rounded-md shadow-sm">
              <div className="flex flex-col gap-1">
                {transactionDetails?.addOns?.map((addOn, index) => (
                  <div
                    key={addOn._id}
                    className="flex items-center justify-between"
                  >
                    <div className="text-xs font-medium text-muted-foreground">
                      {index + 1}. {addOn.name}
                    </div>
                    <div className="text-xs font-medium">Rs. {addOn.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {transactionDetails.transactionStatus === "Ready for Pickup" &&
          parkingEligible &&
          parkingIncluded && (
            <div className="grid gap-2">
              <Label>Parking</Label>
              <div className="p-4 border rounded-md shadow-sm">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">
                      Start Time
                    </div>
                    <div className="text-xs ">
                      {format(parkingStart, "d MMM, yy - hh:mm a")}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">
                      Total Time
                    </div>
                    <div className="text-sm font-semibold ">
                      {`
                      ${parkingTime?.days > 0 ? `${parkingTime?.days}d ` : ""}
                      ${
                        parkingTime?.hours > 0 ? `${parkingTime?.hours}h ` : ""
                      } ${
                        parkingTime?.minutes > 0
                          ? `${parkingTime?.minutes}m`
                          : ""
                      }`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {transactionDetails?.inspections.length > 0 && (
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <Label>Inspection</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    {transactionDetails?.inspections.map(
                      (inspection, index) => (
                        <div key={index} className="grid gap-1">
                          <div className="text-xs font-semibold ">
                            {inspection?.categoryName}
                          </div>
                          <div className="border rounded-md shadow-sm">
                            <Table>
                              <TableBody>
                                {inspection.items.map((item, itemIndex) => (
                                  <TableRow
                                    key={`item${itemIndex}`}
                                    className="border-b"
                                  >
                                    <TableCell className="w-11/12 px-2 py-2 text-xs border-r">
                                      {item.itemName}
                                    </TableCell>
                                    <TableCell className="w-1/12 p-0 px-2 py-2 text-center">
                                      {item.response && (
                                        <Check className="w-4 h-4" />
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
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
                Customer
              </div>
              <div className="text-xs ">
                <Link
                  to={`/carwash/customers/${transactionDetails?.customer?._id}`}
                  className="flex items-center gap-1 pt-1 text-sm font-medium underline underline-offset-4 "
                >
                  {transactionDetails?.customer?.customerName}
                  <ArrowUpRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Contact
              </div>
              <div className="text-sm font-medium">
                {transactionDetails?.customer?.customerContact ? (
                  <a
                    href={`tel:${transactionDetails?.customer?.customerContact}`}
                    className="flex items-center gap-1 py-1 text-sm font-medium underline underline-offset-4 "
                  >
                    {transactionDetails?.customer?.customerContact}
                    <Phone className="w-4 h-4" />
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Status
              </div>
              <div className="text-xs font-medium">
                {transactionDetails?.paymentStatus ? (
                  <StatusBadge status={transactionDetails?.paymentStatus} />
                ) : (
                  "-"
                )}
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

const DetailsFooter = ({
  transactionDetails,
  handleTermination,
  handleRollbackFromComplete,
  handleRollbackFromPickup,
  origin,
}) => {
  const navigate = useNavigate();

  const role = useRole();

  const handleReceiptPrint = () => {
    let tableList = [
      [
        `\n${1}\n`,
        `\n${transactionDetails?.service?.id?.serviceVehicle?.vehicleTypeName} ${transactionDetails?.service?.id?.serviceTypeName}\n`,
        `\n${transactionDetails?.service?.actualRate?.toFixed(2) || ""}\n`,
        `\n${transactionDetails?.service?.cost?.toFixed(2)}\n`,
      ],
    ];

    if (transactionDetails?.parking?.in && transactionDetails?.parking?.out) {
      tableList.push([
        `\n${2}\n`,
        `\nParking (${format(
          transactionDetails?.parking?.in,
          "d MMM, h:mm a"
        )} - ${format(transactionDetails?.parking.out, "d MMM, h:mm a")})\n`,
        `\n${" "}\n`,
        `\n${transactionDetails?.parking?.cost.toFixed(2)}\n`,
      ]);
    }

    const billData = {
      customerName: transactionDetails?.customer?.customerName || "",
      customerContact:
        transactionDetails?.customer?.customerContact.toString() || "",
      paymentMode: transactionDetails?.paymentMode?.paymentModeName || "",
      grossAmount:
        transactionDetails?.grossAmount.toFixed(2).toString() || "0.00",
      discountAmount:
        transactionDetails?.discountAmount.toFixed(2).toString() || "0.00",
      netAmount: transactionDetails?.netAmount.toFixed(2).toString() || "0.00",
      billNo: transactionDetails?.billNo.toString() || "",
      transactionDate: transactionDetails?.transactionTime
        ? format(transactionDetails?.transactionTime, "d MMM, yy h:mm a")
        : "",
      createdAt: transactionDetails?.createdAt
        ? format(transactionDetails?.createdAt, "d MMM, yy h:mm a")
        : "",

      tableList: tableList,
    };

    handlePrint(billData);
  };

  return (
    <div
      className={cn(
        "flex justify-between gap-4 items-start sm:items-center w-full",
        role === ROLES_LIST.STAFF &&
          transactionDetails?.transactionStatus === "In Queue" &&
          "gap-0"
      )}
    >
      <div>
        {transactionDetails?.transactionStatus === "In Queue" &&
          origin !== "transactions" &&
          role !== ROLES_LIST.STAFF && (
            <Button
              className="border border-destructive bg-bg text-destructive hover:bg-destructive hover:text-white"
              onClick={() => {
                handleTermination();
              }}
            >
              <OctagonX className="w-4 h-4 mr-2" /> Cancel
            </Button>
          )}

        {transactionDetails?.transactionStatus === "Ready for Pickup" &&
          origin !== "transactions" && (
            // getDaysDifference(transactionDetails?.service.end, new Date()) <=
            //   3 &&

            <Button
              variant="outline"
              onClick={() => {
                handleRollbackFromPickup();
              }}
            >
              <Undo2Icon className="w-4 h-4 mr-2" /> Rollback
            </Button>
          )}
        {transactionDetails?.transactionStatus === "Completed" &&
          origin !== "transactions" && (
            // getDaysDifference(transactionDetails?.transactionTime, new Date()) <=
            //   3
            //   &&
            <Button
              variant="secondary"
              onClick={() => {
                handleRollbackFromComplete();
              }}
            >
              <Undo2Icon className="w-4 h-4 mr-2" /> Rollback
            </Button>
          )}
      </div>
      {transactionDetails?.transactionStatus === "In Queue" &&
        origin !== "transactions" && (
          <div className="flex flex-col w-full gap-2 sm:flex-row">
            <Button
              variant="secondary"
              className="w-full border hover:border-primary"
              onClick={() => {
                navigate("/carwash/checkout", {
                  state: { transactionDetails, origin: "queue" },
                });
              }}
            >
              Checkout
              <ChevronRight className="w-4 h-4 ml-2" />{" "}
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                navigate(`/carwash/inspection/${transactionDetails._id}`);
              }}
            >
              Inspection
              <ChevronRight className="w-4 h-4 ml-2" />{" "}
            </Button>
          </div>
        )}

      {transactionDetails?.transactionStatus === "Ready for Pickup" &&
        origin !== "transactions" && (
          <Button
            className="w-full"
            onClick={() => {
              navigate("/carwash/checkout", {
                state: { transactionDetails, origin: "pickup" },
              });
            }}
          >
            Checkout
            <ChevronRight className="w-4 h-4 ml-2" />{" "}
          </Button>
        )}
      {transactionDetails?.transactionStatus === "Completed" &&
        transactionDetails.paymentStatus === "Pending" && (
          <Button
            className="w-full"
            onClick={() => {
              navigate("/carwash/checkout", {
                state: { transactionDetails, origin: "pedning" },
              });
            }}
          >
            Checkout
            <ChevronRight className="w-4 h-4 ml-2" />{" "}
          </Button>
        )}
      {transactionDetails?.transactionStatus === "Completed" &&
        transactionDetails.paymentStatus === "Paid" && (
          <Button
            className="w-full"
            variant="outline"
            onClick={handleReceiptPrint}
          >
            Print
            <Printer className="w-4 h-4 ml-2" />{" "}
          </Button>
        )}
    </div>
  );
};

export default CarwashTransactionDetails;
