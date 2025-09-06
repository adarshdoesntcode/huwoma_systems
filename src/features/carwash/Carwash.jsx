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
  Droplets,
  PlusCircle,
  ReceiptText,
  RefreshCcw,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CarwashDataTable } from "./CarwashDataTable";
import { CarwashColumn } from "./CarwashColumn";
import { useGetCarwashTransactionsQuery } from "./carwashApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";

import { isMobile } from "react-device-detect";
import { Badge } from "@/components/ui/badge";

import { CarwashBookingDataTable } from "./CarwashBookingDataTable";
import { CarwashBookingColumn } from "./CarwashBookingColumn";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useIsSuper } from "@/hooks/useSuper";
import { ReviewModal } from "@/components/ReviewModal";
import { ROLES_LIST } from "@/lib/config";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";

const chartConfig = {
  customers: {
    label: "Customers",
    color: "hsl(var(--chart-1))",
  },
};

function Carwash() {
  const [lastUpdated, setLastUpdated] = useState(null);
  const isSuper = useIsSuper();
  const role = useRole();

  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetCarwashTransactionsQuery(undefined, {
      pollingInterval: 600000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    });

  useEffect(() => {
    if (isSuccess) {
      const date = format(new Date(), "hh:mm:ss a");
      setLastUpdated(date);
    }
  }, [isSuccess, isFetching]);

  const navigate = useNavigate();
  const location = useLocation();

  const navigateState = useMemo(() => location.state || {}, [location.state]);

  const [tab, setTab] = useState(navigateState?.tab || "queue");

  useEffect(() => {
    setTab(navigateState?.tab || "queue");
  }, [navigateState]);

  let inQueueTransactions = [];
  let readyForPickupTransactions = [];
  let pendingPaymentTransactions = [];
  let bookedTransactions = [];
  let completedTransactions = [];

  let hourlyCounts;

  if (data) {
    // const filteredTransactions = data?.data?.transactions?.filter(
    //   (transaction) =>
    //     transaction.transactionStatus !== "Cancelled" &&
    //     transaction.paymentStatus !== "Cancelled"
    // );
    hourlyCounts = Object.entries(data?.data?.hours).map(
      ([hour, customers]) => ({
        hour: hour,
        Customers: Number(customers),
      })
    );
  }
  if (data) {
    bookedTransactions = data?.data?.transactions
      ?.filter((transaction) => transaction.transactionStatus === "Booked")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    inQueueTransactions = data?.data?.transactions
      ?.filter((transaction) => transaction.transactionStatus === "In Queue")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    readyForPickupTransactions = data?.data?.transactions
      ?.filter(
        (transaction) => transaction.transactionStatus === "Ready for Pickup"
      )
      .sort((a, b) => new Date(b.service.end) - new Date(a.service.end));
    pendingPaymentTransactions = data?.data?.transactions
      ?.filter(
        (transaction) =>
          transaction.transactionStatus === "Completed" &&
          transaction.paymentStatus === "Pending"
      )
      .sort(
        (a, b) => new Date(b.transactionTime) - new Date(a.transactionTime)
      );

    completedTransactions = data?.data?.transactions
      ?.filter(
        (transaction) =>
          transaction.transactionStatus === "Completed" &&
          transaction.paymentStatus === "Paid"
      )
      .sort(
        (a, b) => new Date(b.transactionTime) - new Date(a.transactionTime)
      );
  }

  const handleRefresh = () => {
    refetch();
  };

  let content;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 tracking-tight sm:flex-row sm:items-center sm:mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-primary">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            Carwash
          </div>
          <div className="flex justify-end ">
            {role !== ROLES_LIST.STAFF && (
              <Button
                size="sm"
                variant="outline"
                className="mr-2"
                onClick={() => navigate("/carwash/old-record")}
              >
                <span>Old </span>
                <span className="sr-only sm:ml-1 sm:not-sr-only">Record</span>
                <PlusCircle className="w-4 h-4 ml-2" />
              </Button>
            )}

            {role !== ROLES_LIST.STAFF && (
              <Button
                size="sm"
                variant="outline"
                className="mr-2"
                onClick={() => navigate("/carwash/customers")}
              >
                <span className="sr-only sm:not-sr-only">Customers </span>

                <Users className="w-4 h-4 sm:ml-2" />
              </Button>
            )}

            {isSuper && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/carwash/transactions")}
              >
                <span className="sr-only sm:not-sr-only">Transactions </span>

                <ReceiptText className="w-4 h-4 sm:ml-2" />
              </Button>
            )}
          </div>
        </div>
        {!isMobile && (
          <div className="border rounded-md bg-background ">
            <div className="px-4 pt-3 text-xs text-muted-foreground">
              Hourly Customer Count
            </div>
            <ChartContainer config={chartConfig} className="h-[10vh] w-full">
              <AreaChart
                accessibilityLayer
                data={hourlyCounts}
                margin={{ top: 20, left: 30, bottom: 10, right: 30 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="hour"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => `${value}:00`}
                />

                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(value) =>
                        `${value}:00 ${value < 12 ? "AM" : "PM"}`
                      }
                    />
                  }
                />
                <defs>
                  <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-customers)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-customers)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="Customers"
                  type="natural"
                  fill="url(#fillIncome)"
                  fillOpacity={0.4}
                  stroke="var(--color-customers)"
                  // strokeWidth={2}
                  dot={false}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}

        <div>
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value);
            }}
          >
            <div className="flex flex-col items-start justify-between gap-4 h-max-content sm:items-center sm:flex-row">
              <TabsList className="flex-wrap justify-start order-2 h-20 md:order-1 md:h-10 ">
                <TabsTrigger value="queue">
                  Queue
                  {inQueueTransactions.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {inQueueTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pickup">
                  PickUp
                  {readyForPickupTransactions.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {readyForPickupTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending
                  {pendingPaymentTransactions.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {pendingPaymentTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="complete">
                  Complete
                  {completedTransactions.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {completedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="booking">
                  Booking
                  {bookedTransactions.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {bookedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <div className="flex justify-end order-1 w-full sm:w-fit sm:order-2 ">
                {role !== ROLES_LIST.STAFF && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mr-2"
                    onClick={() => navigate("/carwash/booking")}
                  >
                    <span>Booking</span>
                    <PlusCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => navigate("/carwash/new")}
                  className={cn(
                    "w-full",
                    role === ROLES_LIST.STAFF && " h-14 sm:h-10"
                  )}
                >
                  <span>Record</span>
                  <PlusCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <TabsContent value="queue">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Queue
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Vehicles in queue for their wash
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                      >
                        <span className="sr-only sm:not-sr-only">Refresh</span>
                        <RefreshCcw
                          className={`w-4 h-4 sm:ml-2 ${
                            isFetching && "animate-spin"
                          }`}
                        />
                      </Button>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        Last Updated: {lastUpdated ? lastUpdated : "loading..."}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 sm:p-6 sm:pt-0">
                  <CarwashDataTable
                    data={inQueueTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pickup">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Pick Up
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Vehicles ready for pickup
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                      >
                        <span className="sr-only sm:not-sr-only">Refresh</span>
                        <RefreshCcw
                          className={`w-4 h-4 sm:ml-2 ${
                            isFetching && "animate-spin"
                          }`}
                        />
                      </Button>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        Last Updated: {lastUpdated ? lastUpdated : "loading..."}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 sm:p-6 sm:pt-0">
                  <CarwashDataTable
                    data={readyForPickupTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Pending
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Vehicles with pending payment
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                      >
                        <span className="sr-only sm:not-sr-only">Refresh</span>
                        <RefreshCcw
                          className={`w-4 h-4 sm:ml-2 ${
                            isFetching && "animate-spin"
                          }`}
                        />
                      </Button>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        Last Updated: {lastUpdated ? lastUpdated : "loading..."}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 sm:p-6 sm:pt-0">
                  <CarwashDataTable
                    data={pendingPaymentTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="complete">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Complete
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Vehicles that have been paid off
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                      >
                        <span className="sr-only sm:not-sr-only">Refresh</span>
                        <RefreshCcw
                          className={`w-4 h-4 sm:ml-2 ${
                            isFetching && "animate-spin"
                          }`}
                        />
                      </Button>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        Last Updated: {lastUpdated ? lastUpdated : "loading..."}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 sm:p-6 sm:pt-0">
                  <CarwashDataTable
                    data={completedTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="booking">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Booking
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Active Bookings
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                      >
                        <span className="sr-only sm:not-sr-only">Refresh</span>
                        <RefreshCcw
                          className={`w-4 h-4 sm:ml-2 ${
                            isFetching && "animate-spin"
                          }`}
                        />
                      </Button>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        Last Updated: {lastUpdated ? lastUpdated : "loading..."}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 sm:p-6 sm:pt-0">
                  <CarwashBookingDataTable
                    data={bookedTransactions}
                    columns={CarwashBookingColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <ReviewModal />
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default Carwash;
