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

import { PlusCircle, ReceiptText, RefreshCcw, Users } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Bar, BarChart, XAxis } from "recharts";
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

const chartConfig = {
  desktop: {
    label: "Customers",
    color: "hsl(var(--chart-2))",
  },
};

function Carwash() {
  const [lastUpdated, setLastUpdated] = useState(null);

  const date = useMemo(() => new Date().toISOString(), []);

  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetCarwashTransactionsQuery(date, {
      pollingInterval: 30000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    });

  useEffect(() => {
    if (isSuccess) {
      setLastUpdated(new Date().getTime());
    }
  }, [isSuccess, isFetching]);

  const navigate = useNavigate();
  const location = useLocation();

  const navigateState = location.state || {};

  const tab = navigateState?.tab;

  let inQueueTransactions = [];
  let readyForPickupTransactions = [];
  let bookedTransactions = [];
  let completedTransactions = [];

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

  if (isLoading) {
    content = (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="space-y-4">
        <div className="  sm:flex-row  flex items-start sm:items-center tracking-tight  justify-between gap-4 sm:mb-4">
          <NavBackButton buttonText={"Car Wash"} navigateTo={-1} />
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
        <div className="bg-white border rounded-md pt-3 hidden sm:block">
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
                barSize={14}
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
              <TabsList className="order-2 md:order-1">
                <TabsTrigger value="queue">
                  Queue
                  {inQueueTransactions.length > 0 && (
                    <Badge className="ml-2 font-medium hidden sm:block ">
                      {inQueueTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pickup">
                  PickUp
                  {readyForPickupTransactions.length > 0 && (
                    <Badge className="ml-2 font-medium hidden sm:block">
                      {readyForPickupTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="complete">
                  Complete
                  {completedTransactions.length > 0 && (
                    <Badge className="ml-2 font-medium hidden sm:block">
                      {completedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="booking">
                  Booking
                  {bookedTransactions.length > 0 && (
                    <Badge className="ml-2 font-medium hidden sm:block">
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
                        Last Updated:{" "}
                        {lastUpdated
                          ? new Date(lastUpdated).toLocaleString()
                          : "loading..."}
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
                        Last Updated:{" "}
                        {lastUpdated
                          ? new Date(lastUpdated).toLocaleString()
                          : "loading..."}
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
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Complete
                      </CardTitle>
                      <CardDescription>
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
                        Last Updated:{" "}
                        {lastUpdated
                          ? new Date(lastUpdated).toLocaleString()
                          : "loading..."}
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
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Booking
                      </CardTitle>
                      <CardDescription>Active Bookings</CardDescription>
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
                        Last Updated:{" "}
                        {lastUpdated
                          ? new Date(lastUpdated).toLocaleString()
                          : "loading..."}
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
    content = <ApiError error={error} />;
  }

  return content;
}

export default Carwash;
