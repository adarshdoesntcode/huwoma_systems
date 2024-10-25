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
  ChevronLeft,
  ChevronRight,
  Contact,
  PlusCircle,
  ReceiptText,
  StopCircle,
  Users,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
import { CarwashDataTable } from "./CarwashDataTable";
import { CarwashColumn } from "./CarwashColumn";
import { useGetCarwashTransactionsQuery } from "./carwashApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

const chartConfig = {
  desktop: {
    label: "Customers",
    color: "hsl(var(--chart-2))",
  },
};

function Carwash() {
  const [showDetails, setShowDetails] = useState(false);
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0];
  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetCarwashTransactionsQuery(formattedDate);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const transactionDetailsId = searchParams.get("view");
  let transactionDetails;

  let inQueueTransactions = [];
  let readyForPickupTransactions = [];
  let bookedTransactions = [];
  let completedTransactions = [];

  if (data) {
    bookedTransactions = data?.data?.filter(
      (transaction) => transaction.transactionStatus === "Booked"
    );
    inQueueTransactions = data?.data?.filter(
      (transaction) => transaction.transactionStatus === "In Queue"
    );
    readyForPickupTransactions = data?.data?.filter(
      (transaction) => transaction.transactionStatus === "Ready for Pickup"
    );
    completedTransactions = data?.data?.filter(
      (transaction) => transaction.transactionStatus === "Completed"
    );
  }

  useEffect(() => {
    if (transactionDetailsId) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  }, [transactionDetailsId]);

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
        <div className="text-xl flex-col sm:flex-row font-semibold  flex items-start sm:items-center tracking-tight  justify-between gap-4 mb-4">
          <div className="flex items-center  gap-4 ">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            Car Wash
          </div>
          <div className="w-full sm:w-fit flex justify-end">
            <Button size="sm" variant="outline" className="mr-2">
              Customers <Users className="ml-2 w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              Transactions <ReceiptText className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="bg-white border rounded-md p-2 ">
          <p className="text-xs text-muted-foreground p-2">
            Hourly Traffic Visualization
          </p>
          <ChartContainer config={chartConfig} className="h-[10vh] w-full ">
            <BarChart accessibilityLayer data={hourlyCounts}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
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
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div>
          <Tabs
            value={searchParams.get("tab") || "queue"}
            onValueChange={(value) => {
              navigate(`/carwash?tab=${value}`, { replace: true });
            }}
          >
            <div className="flex flex-col items-start sm:items-center sm:flex-row gap-4 justify-between">
              <TabsList>
                <TabsTrigger value="queue">Queue</TabsTrigger>
                <TabsTrigger value="pickup">PickUp</TabsTrigger>
                <TabsTrigger value="complete">Complete</TabsTrigger>
                <TabsTrigger value="booking">Booking</TabsTrigger>
              </TabsList>
              <div className="w-full sm:w-fit flex justify-end ">
                <Button size="sm" variant="outline" className="mr-2">
                  Booking <PlusCircle className="ml-2 w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => navigate("/carwash/new")}>
                  Record <PlusCircle className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
            <TabsContent value="queue">
              <Card>
                <CardHeader>
                  <CardTitle>Queue</CardTitle>
                  <CardDescription>
                    Vehicles in queue for their wash
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarwashDataTable
                    data={inQueueTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pickup">
              <Card>
                <CardHeader>
                  <CardTitle>Pick Up</CardTitle>
                  <CardDescription>Vehicles ready to pickup</CardDescription>
                </CardHeader>
                <CardContent>
                  <CarwashDataTable
                    data={readyForPickupTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="complete">
              <Card>
                <CardHeader>
                  <CardTitle>Complete</CardTitle>
                  <CardDescription>
                    Vehicles that have been washed and paid off
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarwashDataTable
                    data={completedTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="booking">
              <Card>
                <CardHeader>
                  <CardTitle>Booking</CardTitle>
                  <CardDescription>Active Bookings</CardDescription>
                </CardHeader>
                <CardContent>
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
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

const TransactionDetails = ({
  showDetails,
  setShowDetails,
  transactionDetails,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCloseSheet = (value) => {
    setShowDetails(false);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("view");
      window.history.replaceState(null, "", `?${newParams.toString()}`);
      return newParams;
    });
  };

  if (isMobile) {
    return (
      <Drawer open={showDetails} onOpenChange={handleCloseSheet}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Transaction Details</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="p-6">
            <div className="flex-1 overflow-y-auto">
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
                                "dd/MM/yyyy h:mm a"
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
                                "dd/MM/yyyy h:mm a"
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
                    </div>
                  </div>
                )}
                {transactionDetails?.parking && (
                  <div className="grid gap-2">
                    <Label>Parking</Label>
                    <div className="border p-4 rounded-md shadow-sm">
                      <div className="flex gap-1 flex-col">
                        {transactionDetails?.parking?.in && (
                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-xs font-medium">
                              In
                            </div>
                            <div className="text-xs ">
                              {format(
                                transactionDetails?.parking?.in,
                                "dd/MM/yyyy h:mm a"
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
                                "dd/MM/yyyy h:mm a"
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
                            "dd/MM/yyyy h:mm a"
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
                    <div className="flex items-center justify-between  ">
                      <div className="text-muted-foreground text-xs font-medium">
                        Mode
                      </div>
                      <div className="text-xs font-medium">
                        {transactionDetails?.paymentMode?.paymentModeName ||
                          "-"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between  ">
                      <div className="text-muted-foreground text-xs font-medium">
                        Gross Amt
                      </div>
                      <div className="text-xs font-medium">
                        Rs. {transactionDetails?.grossAmount || "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between  ">
                    <div className="text-muted-foreground text-xs font-medium">
                      Discount Amt
                    </div>
                    <div className="text-xs font-medium">
                      Rs. {transactionDetails?.discountAmount || "-"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between  ">
                    <div className="text-muted-foreground text-xs font-medium">
                      Net Amt
                    </div>
                    <div className="text-xs font-medium">
                      Rs. {transactionDetails?.netAmount || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <div className="flex justify-between items-center w-full">
              <Button variant="outline">
                <StopCircle className="h-4 w-4 mr-2" /> Terminate
              </Button>
              <Button>
                Proceed <ChevronRight className="h-4 w-4 ml-2" />{" "}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Sheet open={showDetails} onOpenChange={handleCloseSheet}>
        <SheetContent>
          <SheetHeader className="mb-2">
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
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
                                "dd/MM/yyyy h:mm a"
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
                                "dd/MM/yyyy h:mm a"
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
                    </div>
                  </div>
                )}
                {transactionDetails?.parking && (
                  <div className="grid gap-2">
                    <Label>Parking</Label>
                    <div className="border p-4 rounded-md shadow-sm">
                      <div className="flex gap-1 flex-col">
                        {transactionDetails?.parking?.in && (
                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-xs font-medium">
                              In
                            </div>
                            <div className="text-xs ">
                              {format(
                                transactionDetails?.parking?.in,
                                "dd/MM/yyyy h:mm a"
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
                                "dd/MM/yyyy h:mm a"
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
                            "dd/MM/yyyy h:mm a"
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
                    <div className="flex items-center justify-between  ">
                      <div className="text-muted-foreground text-xs font-medium">
                        Mode
                      </div>
                      <div className="text-xs font-medium">
                        {transactionDetails?.paymentMode?.paymentModeName ||
                          "-"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between  ">
                      <div className="text-muted-foreground text-xs font-medium">
                        Gross Amt
                      </div>
                      <div className="text-xs font-medium">
                        Rs. {transactionDetails?.grossAmount || "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between  ">
                    <div className="text-muted-foreground text-xs font-medium">
                      Discount Amt
                    </div>
                    <div className="text-xs font-medium">
                      Rs. {transactionDetails?.discountAmount || "-"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between  ">
                    <div className="text-muted-foreground text-xs font-medium">
                      Net Amt
                    </div>
                    <div className="text-xs font-medium">
                      Rs. {transactionDetails?.netAmount || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter className="sticky py-4 pb-6 border-t bg-background bottom-0">
              <div className="flex justify-between items-center w-full">
                <Button variant="outline">
                  <StopCircle className="h-4 w-4 mr-2" /> Terminate
                </Button>
                <Button>
                  Proceed <ChevronRight className="h-4 w-4 ml-2" />{" "}
                </Button>
              </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
};

export default Carwash;
