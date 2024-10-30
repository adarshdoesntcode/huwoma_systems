import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  OctagonX,
  PlusCircle,
  Printer,
  ReceiptText,
  RefreshCcw,
  StopCircle,
  Users,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Bar, BarChart, XAxis } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { CarwashDataTable } from "./CarwashDataTable";
import { CarwashColumn } from "./CarwashColumn";
import {
  useDeleteCarwashTransactionMutation,
  useGetCarwashTransactionsQuery,
} from "./carwashApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Badge } from "@/components/ui/badge";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { getTimeDifference, timeDifference } from "@/lib/utils";

const chartConfig = {
  desktop: {
    label: "Customers",
    color: "hsl(var(--chart-2))",
  },
};

function Carwash() {
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0];
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetCarwashTransactionsQuery(formattedDate);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateState = location.state || {};

  const transactionDetailsId = navigateState?.view;
  const deleteId = navigateState?.delete;
  const tab = navigateState?.tab;

  let transactionDetails;

  let inQueueTransactions = [];
  let readyForPickupTransactions = [];
  let bookedTransactions = [];
  let completedTransactions = [];

  useEffect(() => {
    if (transactionDetailsId) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  }, [transactionDetailsId]);

  useEffect(() => {
    if (deleteId) {
      setShowDelete(true);
    } else {
      setShowDelete(false);
    }
  }, [deleteId]);

  if (transactionDetailsId) {
    transactionDetails = data?.data.find(
      (transaction) => transaction._id === transactionDetailsId
    );
  }

  let hourlyCounts;

  if (data) {
    hourlyCounts = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
    })).map((hour) => {
      const count = data.data.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt.getHours() === hour.hour;
      }).length;
      return { hour: hour.hour, Customers: count };
    });
  }
  if (data) {
    bookedTransactions = data?.data
      ?.filter((transaction) => transaction.transactionStatus === "Booked")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    inQueueTransactions = data?.data
      ?.filter((transaction) => transaction.transactionStatus === "In Queue")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    readyForPickupTransactions = data?.data
      ?.filter(
        (transaction) => transaction.transactionStatus === "Ready for Pickup"
      )
      .sort((a, b) => new Date(b.service.end) - new Date(a.service.end));
    completedTransactions = data?.data
      ?.filter((transaction) => transaction.transactionStatus === "Completed")
      .sort(
        (a, b) => new Date(b.transactionTime) - new Date(a.transactionTime)
      );
  }
  const handleRefresh = () => {
    refetch();
  };
  let content;

  if (isLoading || isFetching) {
    content = (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="space-y-4">
        <div className="  sm:flex-row  flex items-start sm:items-center tracking-tight  justify-between gap-4 sm:mb-4">
          <div className="flex items-center  gap-2 ">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-base sm:text-lg  font-bold">Car Wash</span>
          </div>
          <div className=" flex justify-end">
            <Button size="sm" variant="outline" className="mr-2">
              <span className="sr-only sm:not-sr-only">Customers </span>

              <Users className="sm:ml-2 w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <span className="sr-only sm:not-sr-only">Transactions </span>

              <ReceiptText className="sm:ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="bg-white border rounded-md pt-3">
          <ChartContainer config={chartConfig} className="h-[8vh] w-full ">
            <BarChart accessibilityLayer data={hourlyCounts}>
              <XAxis
                dataKey="hour"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                tickFormatter={(value) => `${value}:00`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="Customers"
                fill="var(--color-desktop)"
                radius={4}
                barSize={12}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div>
          <Tabs
            value={tab || "queue"}
            onValueChange={(value) => {
              navigate("/carwash", { state: { tab: value }, replace: true });
            }}
          >
            <div className="flex flex-col  items-start sm:items-center sm:flex-row gap-4 justify-between">
              <TabsList className="order-2 sm:order-1">
                <TabsTrigger value="queue">
                  Queue
                  {inQueueTransactions.length > 0 && !isMobile && (
                    <Badge className="ml-2 font-medium ">
                      {inQueueTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pickup">
                  PickUp
                  {readyForPickupTransactions.length > 0 && !isMobile && (
                    <Badge className="ml-2 font-medium">
                      {readyForPickupTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="complete">
                  Complete
                  {completedTransactions.length > 0 && !isMobile && (
                    <Badge className="ml-2 font-medium">
                      {completedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="booking">
                  Booking
                  {bookedTransactions.length > 0 && !isMobile && (
                    <Badge className="ml-2 font-medium">
                      {bookedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <div className="w-full sm:w-fit order-1 sm:order-2 flex justify-end ">
                <Button size="sm" variant="outline" className="mr-2 w-full">
                  <span>Booking</span>
                  <PlusCircle className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/carwash/new")}
                  className="w-full"
                >
                  <span>Record</span>
                  <PlusCircle className="ml-2  w-4 h-4" />
                </Button>
              </div>
            </div>
            <TabsContent value="queue">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Queue
                      </CardTitle>
                      <CardDescription>
                        Vehicles in queue for their wash
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={handleRefresh}>
                      <span className="sr-only sm:not-sr-only">Refresh</span>
                      <RefreshCcw className="w-4 h-4 sm:ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
                  <CarwashDataTable
                    data={inQueueTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pickup">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Pick Up
                      </CardTitle>
                      <CardDescription>
                        Vehicles ready for pickup
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={handleRefresh}>
                      <span className="sr-only sm:not-sr-only">Refresh</span>
                      <RefreshCcw className="w-4 h-4 sm:ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
                  <CarwashDataTable
                    data={readyForPickupTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="complete">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Complete
                      </CardTitle>
                      <CardDescription>
                        Vehicles that have been washed and paid off
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={handleRefresh}>
                      <span className="sr-only sm:not-sr-only">Refresh</span>
                      <RefreshCcw className="w-4 h-4 sm:ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
                  <CarwashDataTable
                    data={completedTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="booking">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Booking
                      </CardTitle>
                      <CardDescription>Active Bookings</CardDescription>
                    </div>
                    <Button variant="outline" onClick={handleRefresh}>
                      <span className="sr-only sm:not-sr-only">Refresh</span>
                      <RefreshCcw className="w-4 h-4 sm:ml-2" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
                  <CarwashDataTable
                    data={bookedTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <TransactionDetails
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          transactionDetails={transactionDetails}
        />
        <ConfirmDelete
          dialogOpen={showDelete}
          setDialogOpen={setShowDelete}
          transactionId={deleteId}
        />
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

const TransactionDetails = ({
  showDetails,

  transactionDetails,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateState = location.state || {};
  const tab = navigateState?.tab;

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

  const handleCloseSheet = (value) => {
    navigate(
      `${window.location.pathname}?${new URLSearchParams({
        ...Object.fromEntries(new URLSearchParams(window.location.search)),
      }).toString()}`,
      { replace: true, state: { tab: tab } }
    );
  };

  if (isMobile) {
    return (
      <Sheet open={showDetails} onOpenChange={handleCloseSheet}>
        <SheetContent
          className="h-[80vh] flex-1 overflow-y-auto  sm:h-[70vh] pb-0"
          side={"bottom"}
        >
          <SheetHeader className="mb-2">
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto pb-16">
              {transactionDetails && (
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
                            <Badge>
                              {transactionDetails?.transactionStatus}
                            </Badge>
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
                          {transactionDetails?.service?.cost && (
                            <div className="flex items-center justify-between  ">
                              <div className="text-muted-foreground text-xs font-medium">
                                Rate
                              </div>
                              <div className="text-xs font-medium">
                                Rs. {transactionDetails?.service?.cost}
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

                  {transactionDetails.transactionStatus ===
                    "Ready for Pickup" &&
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
                                {`${parkingTime?.hours}h ${parkingTime?.minutes}m`}
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
                                          {inspection.items.map(
                                            (item, itemIndex) => (
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
                                            )
                                          )}
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
                      {transactionDetails?.transactionStatus ===
                        "Completed" && (
                        <>
                          <div className="flex items-center justify-between  ">
                            <div className="text-muted-foreground text-xs font-medium">
                              Mode
                            </div>
                            <div className="text-xs font-medium">
                              {transactionDetails?.paymentMode
                                ?.paymentModeName || "-"}
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
              )}
            </div>
            <SheetFooter className="sticky py-4 pb-6 border-t bg-background bottom-0">
              <div className="flex justify-between gap-4 items-center w-full">
                <div>
                  {transactionDetails?.transactionStatus === "In Queue" && (
                    <Button
                      variant="destructive"
                      onClick={() =>
                        navigate("/carwash", {
                          replace: true,
                          state: { delete: transactionDetails?._id, tab: tab },
                        })
                      }
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

                {transactionDetails?.transactionStatus ===
                  "Ready for Pickup" && (
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
              {transactionDetails && (
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
                            <Badge>
                              {transactionDetails?.transactionStatus}
                            </Badge>
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
                          {transactionDetails?.service?.cost && (
                            <div className="flex items-center justify-between  ">
                              <div className="text-muted-foreground text-xs font-medium">
                                Rate
                              </div>
                              <div className="text-xs font-medium">
                                Rs. {transactionDetails?.service?.cost}
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

                  {transactionDetails.transactionStatus ===
                    "Ready for Pickup" &&
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
                                  parkingTime?.hours > 0
                                    ? `${parkingTime?.hours}h `
                                    : ""
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
                                          {inspection.items.map(
                                            (item, itemIndex) => (
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
                                            )
                                          )}
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
                      {transactionDetails?.transactionStatus ===
                        "Completed" && (
                        <>
                          <div className="flex items-center justify-between  ">
                            <div className="text-muted-foreground text-xs font-medium">
                              Mode
                            </div>
                            <div className="text-xs font-medium">
                              {transactionDetails?.paymentMode
                                ?.paymentModeName || "-"}
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
              )}
            </div>
            <SheetFooter className="sticky py-4 pb-6 border-t bg-background bottom-0">
              <div className="flex justify-between gap-4 items-center w-full">
                <div>
                  {transactionDetails?.transactionStatus === "In Queue" && (
                    <Button
                      variant="destructive"
                      onClick={() =>
                        navigate("/carwash", {
                          replace: true,
                          state: { delete: transactionDetails?._id, tab: tab },
                        })
                      }
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

                {transactionDetails?.transactionStatus ===
                  "Ready for Pickup" && (
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
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
};

function ConfirmDelete({ dialogOpen, setDialogOpen, transactionId }) {
  const [deleteCarwashTransaction, { isLoading }] =
    useDeleteCarwashTransactionMutation();
  const navigate = useNavigate();

  const handleCloseDelete = (value) => {
    navigate("/carwash", { replace: true });
  };

  const handleDelete = async () => {
    try {
      if (!transactionId) return;
      const res = await deleteCarwashTransaction({
        id: transactionId,
      });

      if (res.error) {
        handleCloseDelete();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseDelete();
        toast({
          title: "Transaction Terminated!",
          description: "Successfully",
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
    <AlertDialog open={dialogOpen} onOpenChange={handleCloseDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will cancel the active
            transaction
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Carwash;
