import {
  Activity,
  ArrowUpRight,
  Car,
  ChevronLeft,
  CreditCard,
  DollarSign,
  Droplets,
  File,
  Footprints,
  GlassWater,
  ParkingCircle,
  RefreshCcw,
  TrendingUp,
  Users,
} from "lucide-react";
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetDashboardDataQuery } from "./dashboardApiSlice";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { DashboardTransactionsDataTable } from "./DashboardTransactionsDataTable";
import { DashboardTransactionsColumn } from "./DashboardTransactionsColumn";
import { format, isSameDay } from "date-fns";
import PaymentBreakdown from "./PaymentBreakdown";
import { useRole } from "@/hooks/useRole";
import { ROLES_LIST } from "@/lib/config";
import Unauthorized from "@/components/Unauthorized";

function calculateChange(today, yesterday, format = "percentage") {
  if (yesterday === 0) {
    // Handle cases where yesterday's value is 0
    if (format === "percentage") {
      return today > 0 ? "+100%" : "No change";
    } else if (format === "difference") {
      return `${today > yesterday ? "+" : ""}${today - yesterday}`;
    }
  }

  if (format === "percentage") {
    const change = ((today - yesterday) / yesterday) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  }

  if (format === "difference") {
    const difference = today - yesterday;
    return `${difference > 0 ? "+" : ""}${difference}`;
  }

  return "Invalid format";
}

const chartConfig = {
  views: {
    label: "Customers",
  },
  carwash: {
    label: "Carwash",
    color: "hsl(var(--chart-1))",
  },
  simracing: {
    label: "Sim Racing",
    color: "hsl(var(--chart-2))",
  },
  parking: {
    label: "Parking",
    color: "hsl(var(--chart-3))",
  },
};

export function Dashboard() {
  const role = useRole();

  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeChart, setActiveChart] = useState("carwash");
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetDashboardDataQuery(undefined, {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    });

  let chartData = useMemo(() => [], []);

  let carwashTransactions;
  let carwashCompletedTransactions;
  let carwashRevenue;
  let simracingTransactions;
  let simracingCompletedTransactions;
  let simracingRevenue;
  let parkingTransactions;
  let parkingCompletedTransactions;
  let parkingRevenue;
  let todayTotalVisitors;
  let yesterdayTotalVisitors;
  let yesterdayCarwashRevenue;
  let yesterdaySimracingRevenue;
  let yesterdayParkingRevenue;
  let breakdownData;
  let activeRaces;
  let activeParkings;
  let tableData;
  let pendingCarwashAmount;

  useEffect(() => {
    if (isSuccess) {
      const date = format(new Date(), "hh:mm:ss a");
      setLastUpdated(date);
    }
  }, [isSuccess, isFetching]);

  if (data) {
    carwashTransactions = data?.data?.carwashTransactions;
    carwashCompletedTransactions = carwashTransactions.filter(
      (transaction) =>
        transaction.transactionStatus === "Completed" &&
        transaction.paymentStatus === "Paid"
    );
    carwashRevenue = carwashCompletedTransactions.reduce(
      (acc, curr) => acc + curr.netAmount,
      0
    );

    pendingCarwashAmount = carwashTransactions
      .filter((transaction) => transaction.paymentStatus === "Pending")
      .reduce((acc, curr) => acc + curr.service.actualRate, 0);

    simracingTransactions = data?.data?.simracingTransactions;
    simracingCompletedTransactions = simracingTransactions.filter(
      (transaction) =>
        transaction.transactionStatus === "Completed" &&
        transaction.paymentStatus === "Paid"
    );

    activeRaces = simracingTransactions.filter(
      (transaction) =>
        transaction.transactionStatus === "Active" ||
        transaction.transactionStatus === "Paused"
    );

    simracingRevenue = simracingCompletedTransactions.reduce(
      (acc, curr) => acc + curr.netAmount,
      0
    );

    parkingTransactions = data?.data?.parkingTransactions;
    parkingCompletedTransactions = parkingTransactions.filter(
      (transaction) =>
        transaction.transactionStatus === "Completed" &&
        transaction.paymentStatus === "Paid"
    );

    parkingRevenue = parkingCompletedTransactions.reduce(
      (acc, curr) => acc + curr.netAmount,
      0
    );

    activeParkings = parkingTransactions.filter(
      (transaction) => transaction.transactionStatus === "Parked"
    );

    todayTotalVisitors =
      carwashTransactions.filter(
        (transaction) =>
          transaction.transactionStatus !== "Cancelled" &&
          transaction.transactionStatus !== "Booked" &&
          isSameDay(new Date(transaction.createdAt), new Date())
      ).length +
      simracingTransactions.filter(
        (transaction) =>
          transaction.transactionStatus !== "Cancelled" &&
          transaction.transactionStatus !== "Booked" &&
          isSameDay(new Date(transaction.createdAt), new Date())
      ).length +
      parkingTransactions.filter(
        (transaction) =>
          transaction.transactionStatus !== "Cancelled" &&
          isSameDay(new Date(transaction.createdAt), new Date())
      ).length;

    yesterdayTotalVisitors =
      data?.data?.yesterday?.carwash?.count +
      data?.data?.yesterday?.simracing?.count +
      data?.data?.yesterday?.parking?.count;

    yesterdayCarwashRevenue = data?.data?.yesterday?.carwash?.total || 0;

    yesterdaySimracingRevenue = data?.data?.yesterday?.simracing?.total || 0;

    yesterdayParkingRevenue = data?.data?.yesterday?.parking?.total || 0;

    const allDates = [
      ...new Set(
        Object.values(data?.data?.counts).flatMap((service) =>
          Object.keys(service)
        )
      ),
    ];

    chartData = allDates.map((date) => {
      return {
        date,
        carwash: data?.data?.counts.carwash[date] || 0,
        simracing: data?.data?.counts.simracing[date] || 0,
        parking: data?.data?.counts.parking[date] || 0,
      };
    });

    tableData = [
      ...carwashCompletedTransactions,
      ...simracingCompletedTransactions,
      ...parkingCompletedTransactions,
    ].sort((a, b) => new Date(b.transactionTime) - new Date(a.transactionTime));
  }

  const total = useMemo(
    () => ({
      carwash: chartData.reduce((acc, curr) => acc + curr.carwash, 0),
      simracing: chartData.reduce((acc, curr) => acc + curr.simracing, 0),
      parking: chartData.reduce((acc, curr) => acc + curr.parking, 0),
    }),
    [chartData]
  );

  let content;

  if (role === ROLES_LIST.STAFF) {
    return <Navigate to="/carwash" replace />;
  }

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
            Dashboard
          </div>
          <div className="flex justify-end ">
            <Button
              size="sm"
              variant="outline"
              className="mr-2"
              onClick={refetch}
              disabled={isFetching}
            >
              <span className="sr-only sm:not-sr-only">Refresh </span>

              <RefreshCcw
                className={`w-4 h-4 sm:ml-2 ${isFetching && "animate-spin"}`}
              />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Carwash Revenue
              </CardTitle>
              <Droplets className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{carwashRevenue.toLocaleString()}
              </div>
              {pendingCarwashAmount > 0 && (
                <p className="text-xs font-medium text-orange-500">
                  ~ {pendingCarwashAmount.toLocaleString()} pending
                </p>
              )}
              {pendingCarwashAmount === 0 && (
                <p className="text-xs text-muted-foreground">
                  {calculateChange(
                    carwashRevenue,
                    yesterdayCarwashRevenue,
                    "percentage"
                  )}{" "}
                  than yesterday
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Sim Racing Revenue
              </CardTitle>
              <Car className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{simracingRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeRaces.length > 0 && (
                  <p className="text-xs font-medium text-green-600">
                    {activeRaces.length}{" "}
                    {activeRaces.length === 1 ? "race" : "races"} active
                  </p>
                )}
                {activeRaces.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {calculateChange(
                      simracingRevenue,
                      yesterdaySimracingRevenue,
                      "percentage"
                    )}{" "}
                    than yesterday
                  </p>
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Parking Revenue
              </CardTitle>
              <ParkingCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{parkingRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeParkings.length > 0 && (
                  <p className="text-xs font-medium text-green-600">
                    {activeParkings.length}{" "}
                    {activeParkings.length === 1 ? "vehicle" : "vehicles"}{" "}
                    parked
                  </p>
                )}

                {activeParkings.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {calculateChange(
                      parkingRevenue,
                      yesterdayParkingRevenue,
                      "percentage"
                    )}{" "}
                    than yesterday
                  </p>
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Visitors</CardTitle>
              <Footprints className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{todayTotalVisitors}</div>
              <p className="text-xs text-muted-foreground">
                {calculateChange(
                  todayTotalVisitors,
                  yesterdayTotalVisitors,
                  "difference"
                )}{" "}
                than yesterday
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-12">
            <CardHeader className="flex flex-col items-stretch p-0 space-y-0 border-b sm:flex-row ">
              <div className="flex flex-col justify-center flex-1 gap-1 px-6 py-5 sm:py-6">
                <CardTitle className="text-xl font-2xl">
                  Customer Traffic
                </CardTitle>
                <CardDescription className="text-xs sm:text-xs">
                  Showing total customers count over the time
                </CardDescription>
              </div>
              <div className="flex">
                {["carwash", "simracing", "parking"].map((key) => {
                  const chart = key;
                  return (
                    <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left odd:border-x   data-[active=true]:bg-muted/50  sm:border-t-0 sm:px-8 sm:py-6"
                      onClick={() => setActiveChart(chart)}
                    >
                      <span className="text-xs text-muted-foreground text-nowrap">
                        {chartConfig[chart].label}
                      </span>
                      <span className="text-lg font-bold leading-none sm:text-3xl ">
                        {total[key].toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />

                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Line
                    dataKey={activeChart}
                    type="natural"
                    stroke={`var(--color-${activeChart})`}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="p-4 sm:p-6 sm:pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    Transactions
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Transactions for {format(new Date(), "do MMMM ")}
                  </CardDescription>
                </div>
                <div>
                  <p className="text-end text-muted-foreground/70 text-[10px]">
                    Last Updated{" "}
                  </p>
                  <p className="text-end text-[12px] text-muted-foreground">
                    {lastUpdated}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 sm:p-6 sm:pt-2">
              <DashboardTransactionsDataTable
                data={tableData}
                columns={DashboardTransactionsColumn}
              />
            </CardContent>
          </Card>

          <PaymentBreakdown
            paymentModes={data.data.activePaymentModes}
            carWashTransactions={carwashTransactions}
            simRacingTransactions={simracingTransactions}
            parkingTransactions={parkingTransactions}
          />
        </div>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default Dashboard;
