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
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CarwashDataTable } from "./CarwashDataTable";
import { CarwashColumn } from "./CarwashColumn";
import { useGetCarwashTransactionsQuery } from "./carwashApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";

import { isMobile } from "react-device-detect";
import { Badge } from "@/components/ui/badge";

import NavBackButton from "@/components/NavBackButton";
import { CarwashBookingDataTable } from "./CarwashBookingDataTable";
import { CarwashBookingColumn } from "./CarwashBookingColumn";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useIsSuper } from "@/hooks/useSuper";

const chartConfig = {
  customers: {
    label: "Customers",
    color: "hsl(var(--chart-1))",
  },
};

function Carwash() {
  const [lastUpdated, setLastUpdated] = useState(null);
  const isSuper = useIsSuper();
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetCarwashTransactionsQuery(undefined, {
      pollingInterval: 60000,
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
    completedTransactions = data?.data?.transactions
      ?.filter((transaction) => transaction.transactionStatus === "Completed")
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
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="space-y-4">
        <div className="  sm:flex-row  flex items-center sm:items-center tracking-tight  justify-between gap-4 sm:mb-4">
          <div className="text-sm font-semibold uppercase text-primary  flex items-center gap-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            Carwash
          </div>
          <div className=" flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="mr-2"
              onClick={() => navigate("/carwash/customers")}
            >
              <span className="sr-only sm:not-sr-only">Customers </span>

              <Users className="sm:ml-2 w-4 h-4" />
            </Button>

            {isSuper && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/carwash/transactions")}
              >
                <span className="sr-only sm:not-sr-only">Transactions </span>

                <ReceiptText className="sm:ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        {!isMobile && (
          <div className="bg-background border rounded-md ">
            <div className="px-4 pt-3 text-xs text-muted-foreground">
              Hourly Customer Count
            </div>
            <ChartContainer config={chartConfig} className="h-[10vh] w-full">
              <LineChart
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
                <Line
                  dataKey="Customers"
                  type="natural"
                  stroke="var(--color-customers)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
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
            <div className="flex flex-col  items-start sm:items-center sm:flex-row gap-4 justify-between">
              <TabsList className="order-2 md:order-1">
                <TabsTrigger value="queue">
                  Queue
                  {inQueueTransactions.length > 0 && (
                    <Badge className="ml-2  hidden sm:block py-0 text-[10px]">
                      {inQueueTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pickup">
                  PickUp
                  {readyForPickupTransactions.length > 0 && (
                    <Badge className="ml-2  hidden sm:block py-0 text-[10px]">
                      {readyForPickupTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="complete">
                  Complete
                  {completedTransactions.length > 0 && (
                    <Badge className="ml-2  hidden sm:block py-0 text-[10px]">
                      {completedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="booking">
                  Booking
                  {bookedTransactions.length > 0 && (
                    <Badge className="ml-2  hidden sm:block py-0 text-[10px]">
                      {bookedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <div className="w-full sm:w-fit order-1 sm:order-2 flex justify-end ">
                <Button
                  size="sm"
                  variant="outline"
                  className="mr-2 w-full"
                  onClick={() => navigate("/carwash/booking")}
                >
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
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Queue
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Vehicles in queue for their wash
                      </CardDescription>
                    </div>
                    <div className="flex items-end gap-2 flex-col">
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
                <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
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
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Pick Up
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Vehicles ready for pickup
                      </CardDescription>
                    </div>
                    <div className="flex items-end gap-2 flex-col">
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
                <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
                  <CarwashDataTable
                    data={readyForPickupTransactions}
                    columns={CarwashColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="complete">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Complete
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Vehicles that have been paid off
                      </CardDescription>
                    </div>
                    <div className="flex items-end gap-2 flex-col">
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
                <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
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
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Booking
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Active Bookings
                      </CardDescription>
                    </div>
                    <div className="flex items-end gap-2 flex-col">
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

                <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
                  <CarwashBookingDataTable
                    data={bookedTransactions}
                    columns={CarwashBookingColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default Carwash;
