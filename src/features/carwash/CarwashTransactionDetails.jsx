import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useLocation, useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, ChevronRight, OctagonX, Printer } from "lucide-react";

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

import { getTimeDifference, timeDifference } from "@/lib/utils";

const CarwashTransactionDetails = ({
  showDetails,
  setTransactionDetails,
  setShowDetails,
  transactionDetails,
  showDelete,
  setShowDelete,
  setDeleteId,
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
                parkingEligible={parkingEligible}
                parkingIncluded={parkingIncluded}
                parkingStart={parkingStart}
                parkingTime={parkingTime}
              />
            </div>
            <SheetFooter className="sticky py-4 pb-6 border-t bg-background bottom-0">
              <DetailsFooter
                transactionDetails={transactionDetails}
                handleTermination={handleTermination}
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
                parkingEligible={parkingEligible}
                parkingIncluded={parkingIncluded}
                parkingStart={parkingStart}
                parkingTime={parkingTime}
              />
            </div>
            <SheetFooter className="sticky py-4 pb-6 border-t bg-background bottom-0">
              <DetailsFooter
                transactionDetails={transactionDetails}
                handleTermination={handleTermination}
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
            <div className="border p-4 rounded-md shadow-sm">
              <div className="flex flex-col border-b pb-2 mb-2">
                <div className="font-medium flex items-center justify-between">
                  <div className="text-sm">
                    {transactionDetails?.service?.id?.serviceTypeName}
                  </div>
                  <Badge>{transactionDetails?.transactionStatus}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {
                    transactionDetails?.service?.id?.serviceVehicle
                      ?.vehicleTypeName
                  }
                  <div className="font-medium text-primary">
                    Vehicle No: {transactionDetails?.vehicleNumber}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 flex-col mt-1">
                {transactionDetails?.service?.start && (
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs font-medium">
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
                    <div className="text-muted-foreground text-xs font-medium">
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
                {transactionDetails?.service?.cost >= 0 && (
                  <div className="flex items-center justify-between  ">
                    <div className="text-muted-foreground text-xs font-medium">
                      Cost
                    </div>
                    <div className="text-xs font-semibold">
                      {transactionDetails?.service?.cost > 0
                        ? `Rs. ${transactionDetails?.service?.cost}`
                        : "Free"}
                    </div>
                  </div>
                )}
              </div>
              {transactionDetails?.parking && (
                <div className="grid mt-2 gap-2">
                  <Label>Parking</Label>
                  <Separator />
                  <div>
                    <div className="flex gap-1 flex-col">
                      {transactionDetails?.parking?.in && (
                        <div className="flex items-center justify-between">
                          <div className="text-muted-foreground text-xs font-medium">
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
                          <div className="text-muted-foreground text-xs font-medium">
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
                          <div className="flex items-center justify-between  ">
                            <div className="text-muted-foreground text-xs font-medium">
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

        {transactionDetails.transactionStatus === "Ready for Pickup" &&
          parkingEligible &&
          parkingIncluded && (
            <div className="grid  gap-2">
              <Label>Parking</Label>
              <div className="border p-4 rounded-md shadow-sm">
                <div className="flex gap-1 flex-col">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs font-medium">
                      Start Time
                    </div>
                    <div className="text-xs ">
                      {format(parkingStart, "d MMM, yy - hh:mm a")}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs font-medium">
                      Total Time
                    </div>
                    <div className="text-sm font-semibold ">
                      {`${
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
                          <div className=" text-xs  font-semibold">
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
                                    <TableCell className="text-xs border-r py-2 px-2 w-11/12">
                                      {item.itemName}
                                    </TableCell>
                                    <TableCell className="p-0 text-center py-2 px-2 w-1/12">
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
          <div className="flex gap-1 flex-col mt-1">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-xs font-medium">
                Bill No
              </div>
              <div className="text-xs ">
                {transactionDetails?.billNo || "-"}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-xs font-medium">
                Transaction Date
              </div>
              {transactionDetails?.transactionTime ? (
                <div className="text-xs font-medium">
                  {format(
                    transactionDetails?.transactionTime,
                    "d MMM, yy - h:mm a"
                  ) || "-"}
                </div>
              ) : (
                "-"
              )}
            </div>

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

const DetailsFooter = ({ transactionDetails, handleTermination }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between gap-4 items-center w-full">
      <div>
        {transactionDetails?.transactionStatus === "In Queue" && (
          <Button
            variant="destructive"
            onClick={() => {
              handleTermination();
            }}
          >
            <OctagonX className="h-4 w-4 mr-2" /> Terminate
          </Button>
        )}
      </div>
      {transactionDetails?.transactionStatus === "In Queue" && (
        <Button
          className="w-full"
          onClick={() => {
            navigate(`/carwash/inspection/${transactionDetails._id}`);
          }}
        >
          Proceed
          <ChevronRight className="h-4 w-4 ml-2" />{" "}
        </Button>
      )}

      {transactionDetails?.transactionStatus === "Ready for Pickup" && (
        <Button
          className="w-full"
          onClick={() => {
            navigate("/carwash/checkout", {
              state: { transactionDetails },
            });
          }}
        >
          Checkout
          <ChevronRight className="h-4 w-4 ml-2" />{" "}
        </Button>
      )}
      {transactionDetails?.transactionStatus === "Completed" && (
        <Button
          className="w-full"
          variant="outline"
          // onClick={() => {
          //   navigate("/carwash/checkout", {
          //     state: { transactionDetails },
          //   });
          // }}
        >
          Print
          <Printer className="h-4 w-4 ml-2" />{" "}
        </Button>
      )}
    </div>
  );
};

export default CarwashTransactionDetails;
