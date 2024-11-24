import { useIsSuper } from "@/hooks/useSuper";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetSimRacingFilteredTransactionsMutation } from "../simRacingApiSlice";
import {
  endOfDay,
  format,
  startOfDay,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  BadgePercent,
  CalendarIcon,
  DollarSign,
  Droplets,
  Filter,
  ParkingCircle,
  Settings2,
} from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import { ResetIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import TextSeparator from "@/components/ui/TextSeparator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import NavBackButton from "@/components/NavBackButton";
import { isMobile } from "react-device-detect";
import { DailyIncomeGraph } from "@/features/carwash/carwash_tranasactions/charts/DailyIncomeGraph";
import PaymentsGraph from "@/features/carwash/carwash_tranasactions/charts/PaymentsGraph";
import RigIncomeGraph from "./RigIncomeGraph";
import { Navigate } from "react-router-dom";
import { SimRacingFilterTranasactionDataTable } from "./SimRacingFilteredTransactionsDataTable";
import { SimRacingFilteredTransactionsColumn } from "./SimRacingFilteredTransactionsColumn";

const initialState = {
  preset: {
    text: "All Time",
    from: null,
    to: new Date(),
  },
  customDate: {
    date: "",
  },
  customRange: {
    from: "",
    to: "",
  },
  transaction: {
    status: "All",
  },
  payment: {
    status: "All",
  },
};

function SimRacingTransactions() {
  const isSuper = useIsSuper();
  const [filter, setFilter] = useState(initialState);
  const [responseData, setResponseData] = useState("");
  const [range, setRange] = useState("");

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const [getSimRacingFilteredTransactions] =
    useGetSimRacingFilteredTransactionsMutation();

  if (!isSuper) {
    return <Navigate to="/carwash" />;
  }
  const handlePresetSelect = (value) => {
    let changedstate = {
      text: "",
      from: null,
    };
    switch (value) {
      case "Last Week":
        changedstate = {
          text: "Last Week",
          from: subWeeks(filter.preset.to || new Date(), 1),
        };
        break;
      case "Last Month":
        changedstate = {
          text: "Last Month",
          from: subMonths(filter.preset.to || new Date(), 1),
        };
        break;
      case "Last 3 Months":
        changedstate = {
          text: "Last 3 Months",
          from: subMonths(filter.preset.to || new Date(), 3),
        };
        break;
      case "Last 6 Months":
        changedstate = {
          text: "Last 6 Months",
          from: subMonths(filter.preset.to || new Date(), 6),
        };
        break;
      case "Last Year":
        changedstate = {
          text: "Last Year",
          from: subYears(filter.preset.to || new Date(), 1),
        };
        break;
      case "All Time":
        changedstate = {
          text: "All Time",
          from: null,
        };
        break;
      default:
        break;
    }
    if (changedstate && value) {
      setFilter((prev) => ({
        ...prev,
        customDate: {
          date: "",
        },
        customRange: {
          from: "",
          to: "",
        },
        preset: {
          ...prev.preset,
          ...changedstate,
        },
      }));
    }
  };
  const onSubmit = async () => {
    setResponseData("");

    let dateRange;

    if (filter.preset.from || filter.preset.from === null) {
      dateRange = { from: filter.preset.from, to: filter.preset.to };
    } else if (filter.customDate.date) {
      dateRange = {
        from: startOfDay(filter.customDate.date),
        to: endOfDay(filter.customDate.date),
      };
    } else if (filter.customRange.from && filter.customRange.to) {
      dateRange = { ...filter.customRange };
    } else {
      return toast({
        variant: "destructive",
        title: "Not Enough Information!!",
        description: "Please select a time range",
      });
    }
    try {
      const res = await getSimRacingFilteredTransactions({
        timeRange: { ...dateRange },
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setResponseData(res.data.data);
        setRange(dateRange);
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
    <div className=" space-y-4 mb-64">
      <NavBackButton buttonText={"Back"} navigateTo={-1} />
      <Card>
        <CardHeader className="p-4 sm:p-6 sm:pb-4 border-b">
          <CardTitle className="flex gap-3 text-lg sm:text-xl items-center">
            <Settings2 className="h-5 w-5" />
            Transaction Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4  sm:p-6 pt-0 pb-0 sm:pb-0 sm:pt-0">
          <form
            id="carwash-transaction-filter"
            className="grid  grid-cols-12"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-span-12 p-4 pl-2 sm:col-span-4 border-b sm:border-b-0  sm:border-r">
              <div className="space-y-2">
                <Label>
                  Time Presets{" "}
                  <span className="text-xs text-muted-foreground">
                    (Select One)
                  </span>
                </Label>

                <Select
                  value={filter.preset.text}
                  onValueChange={handlePresetSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Last Week">Last Week</SelectItem>
                    <SelectItem value="Last Month">Last Month</SelectItem>
                    <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                    <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                    <SelectItem value="Last Year">Last Year</SelectItem>
                    <SelectItem value="All Time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-4 col-span-12 sm:col-span-4 border-b sm:border-b-0  sm:border-r space-y-4">
              <div className="flex flex-row sm:flex-col  gap-4">
                <div className="space-y-2 w-full">
                  <Label>Custom Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full  justify-start text-left font-normal",
                          !filter.customDate.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filter.customDate.date ? (
                          format(filter.customDate.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        toDate={new Date()}
                        selected={filter.customDate.date}
                        onSelect={(date) => {
                          setFilter((prev) => ({
                            ...prev,
                            preset: {
                              from: "",
                              to: new Date().toISOString(),
                            },
                            customRange: {
                              from: "",
                              to: "",
                            },
                            customDate: { date: date },
                          }));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="p-4 col-span-12 sm:col-span-4  ">
              <div className="flex flex-row sm:flex-col  gap-4">
                <div className="space-y-2 w-full">
                  <Label>Custom Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filter.customRange?.from &&
                            !filter.customRange?.to &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filter.customRange?.from ? (
                          filter.customRange?.to ? (
                            <>
                              {format(filter.customRange?.from, "LLL dd, y")} -{" "}
                              {format(filter.customRange?.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(filter.customRange?.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        toDate={new Date()}
                        selected={filter.customRange}
                        onSelect={(value) => {
                          setFilter((prev) => ({
                            ...prev,
                            preset: {
                              from: "",
                              to: new Date(),
                            },
                            customDate: {
                              date: "",
                            },
                            customRange: {
                              ...prev.customRange,
                              ...{
                                from: value.from
                                  ? startOfDay(value.from)
                                  : undefined,
                                to: value.to ? endOfDay(value.to) : undefined,
                              },
                            },
                          }));
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t  px-4 sm:px-6  py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={() => {
                setFilter(initialState);
                setResponseData("");
              }}
            >
              Defaults <ResetIcon className="h-4 w-4 ml-2" />
            </Button>
            <SubmitButton
              buttonText={
                <>
                  Filter <Filter className="h-4 w-4 ml-2" />
                </>
              }
              condition={isSubmitting}
              loadingText="Submitting"
              form="carwash-transaction-filter"
            />
          </div>
        </CardFooter>
      </Card>
      {responseData && (
        <FilteredAnalytics responseData={responseData} range={range} />
      )}
    </div>
  );
}

function sumByKey(key, array) {
  return array.reduce((sum, obj) => {
    const keys = key.split(".");
    let value = obj;

    for (let key of keys) {
      value = value && key in value ? value[key] : undefined;
      if (value === undefined) break;
    }

    return typeof value === "number" ? sum + value : sum;
  }, 0);
}

const FilteredAnalytics = ({ responseData, range }) => {
  const analyticsRef = useRef(null);

  const completetedTransactions = responseData.filter(
    (transaction) =>
      transaction.transactionStatus === "Completed" &&
      transaction.paymentStatus === "Paid"
  );

  // const vehicleIncomeData = calculateVehicleServiceIncome(
  //   completetedTransactions
  // );

  const pendingTransactions = responseData.filter(
    (transaction) =>
      transaction.paymentStatus === "Pending" &&
      transaction.transactionStatus !== "Cancelled"
  );

  const totalNetRevenue = sumByKey("netAmount", completetedTransactions);
  const WashRevenue = sumByKey("service.cost", completetedTransactions);
  const discountAmount = sumByKey("discountAmount", completetedTransactions);

  const parkingRevenue = sumByKey("parking.cost", completetedTransactions);
  const pendingRevenue = sumByKey("service.cost", pendingTransactions);
  const actualWashRevenue = sumByKey(
    "service.actualRate",
    completetedTransactions
  );
  const freeWash = actualWashRevenue - WashRevenue;

  let dailyIncome = [];

  if (responseData) {
    dailyIncome = Array.from(
      new Set(
        completetedTransactions.map(
          (transaction) =>
            new Date(transaction.createdAt).toLocaleDateString().split("T")[0]
        )
      )
    ).map((date) => {
      const income = completetedTransactions
        .filter(
          (transaction) =>
            new Date(transaction.createdAt)
              .toLocaleDateString()
              .split("T")[0] === date
        )
        .reduce((sum, transaction) => sum + transaction.netAmount, 0);

      return { date: format(date, "MMM d, yyyy"), Income: income };
    });
  }

  useEffect(() => {
    const headerOffset = 70;

    if (analyticsRef.current) {
      const elementPosition = analyticsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [responseData]);

  let rangeString;

  if (responseData.length > 0) {
    rangeString = `${
      !range.from
        ? format(responseData[0].createdAt, "dd MMM, yyyy")
        : format(range.from, "dd MMM, yyyy")
    } - ${format(range.to, "dd MMM, yyy")}`;
  }

  const simRacingTableData = [...responseData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-6 " ref={analyticsRef}>
      {completetedTransactions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Net Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{totalNetRevenue.toLocaleString()}
              </div>
              {pendingRevenue > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{pendingRevenue.toLocaleString()} pending
                </p>
              )}
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discounted</CardTitle>
              <BadgePercent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                -{discountAmount.toLocaleString()}
              </div>
              {/* <p className="text-xs text-muted-foreground">+201 than yesterday</p> */}
            </CardContent>
          </Card>
        </div>
      )}

      {dailyIncome.length > 1 && !isMobile && (
        <DailyIncomeGraph dailyIncome={dailyIncome} range={rangeString} />
      )}
      <div className="grid grid-cols-12 gap-6 ">
        {completetedTransactions.length > 0 && (
          <>
            <RigIncomeGraph
              completetedTransactions={completetedTransactions}
              range={rangeString}
            />
            <PaymentsGraph
              completetedTransactions={completetedTransactions}
              range={rangeString}
            />
          </>
        )}
      </div>
      <Card>
        <CardHeader className="p-4 sm:p-6 ">
          <CardTitle className="text-lg sm:text-xl">Transactions</CardTitle>
          <CardDescription className="text-xs">
            {rangeString?.split("-")[0].trim() ===
            rangeString?.split("-")[1].trim()
              ? rangeString?.split("-")[0]
              : rangeString}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <SimRacingFilterTranasactionDataTable
            data={simRacingTableData}
            columns={SimRacingFilteredTransactionsColumn}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SimRacingTransactions;