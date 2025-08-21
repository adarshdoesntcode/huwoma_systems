import NavBackButton from "@/components/NavBackButton";
import { toast } from "@/hooks/use-toast";
import { useIsSuper } from "@/hooks/useSuper";
import {
  endOfDay,
  format,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useGetGarageFilteredTransactionsMutation } from "../garageApiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import MonthSelector from "./selector/MonthSelector";
import DateSelector from "./selector/DateSelector";
import RangeSelector from "./selector/RangeSelector";
import { Button } from "@/components/ui/button";
import { ResetIcon } from "@radix-ui/react-icons";
import SubmitButton from "@/components/SubmitButton";
import { Car, Filter, HandCoins, Settings2, ArrowDownUp } from "lucide-react";
import { isMobile } from "react-device-detect";
import { DailyIncomeGraph } from "@/features/carwash/carwash_tranasactions/charts/DailyIncomeGraph";
const initialState = {
  preset: {
    text: "All Time",
    from: null,
    to: new Date(),
  },
  customDate: {
    date: "",
  },
  customMonth: {
    from: "",
    to: "",
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
function GarageTransactions() {
  const isSuper = useIsSuper();
  const [filter, setFilter] = useState(initialState);
  const [responseData, setResponseData] = useState("");
  const [range, setRange] = useState("");

  const [getGarageFilteredTransactions] =
    useGetGarageFilteredTransactionsMutation();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  if (!isSuper) {
    return <Navigate to="/garage" />;
  }

  const handlePresetSelect = (value) => {
    let changedstate = {
      text: "",
      from: null,
    };
    switch (value) {
      case "Today":
        changedstate = {
          text: "Today",
          from: startOfDay(new Date()),
          to: endOfDay(new Date()),
        };
        break;
      case "Yesterday":
        changedstate = {
          text: "Yesterday",
          from: startOfDay(subDays(filter.preset.to || new Date(), 1)),
          to: endOfDay(subDays(filter.preset.to || new Date(), 1)),
        };
        break;
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
        customMonth: {
          from: "",
          to: "",
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

  const handleMonthChange = (range) => {
    setFilter((prev) => ({
      ...prev,
      preset: {
        from: "",
        text: "",
        to: new Date().toISOString(),
      },
      customRange: {
        from: "",
        to: "",
      },
      customDate: {
        date: "",
      },
      customMonth: {
        from: range.from,
        to: range.to,
      },
    }));
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
    } else if (filter.customMonth.from && filter.customMonth.to) {
      dateRange = { ...filter.customMonth };
    } else {
      return toast({
        variant: "destructive",
        title: "Not Enough Information!!",
        description: "Please select a time range",
      });
    }
    try {
      const res = await getGarageFilteredTransactions({
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
    <div className="space-y-4 mb-80">
      <NavBackButton buttonText={"Back"} navigateTo={-1} />
      <Card>
        <CardHeader className="p-4 border-b sm:p-6 sm:pb-4">
          <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
            <Settings2 className="w-5 h-5" />
            Garage Transactions Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 pb-0 sm:p-6 sm:pb-0 sm:pt-0">
          <form
            id="carwash-transaction-filter"
            className="grid grid-cols-12"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-span-12 p-4 pl-2 space-y-2 border-b sm:col-span-4 sm:border-b-0 sm:border-r">
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
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Yesterday">Yesterday</SelectItem>
                    <SelectItem value="Last Week">Last Week</SelectItem>
                    <SelectItem value="Last Month">Last Month</SelectItem>
                    <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                    <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                    <SelectItem value="Last Year">Last Year</SelectItem>
                    <SelectItem value="All Time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Custom Month</Label>
                <MonthSelector filter={filter} onSelect={handleMonthChange} />
              </div>
            </div>
            <div className="col-span-12 p-4 space-y-4 border-b sm:col-span-4 sm:border-b-0 sm:border-r">
              <div className="flex flex-row gap-4 sm:flex-col">
                <div className="w-full space-y-2">
                  <Label>Custom Date</Label>
                  <DateSelector setFilter={setFilter} filter={filter} />
                </div>
              </div>
            </div>
            <div className="col-span-12 p-4 sm:col-span-4 ">
              <div className="flex flex-row gap-4 sm:flex-col">
                <div className="w-full space-y-2">
                  <Label>Custom Range</Label>
                  <RangeSelector setFilter={setFilter} filter={filter} />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="px-4 py-4 border-t sm:px-6 ">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={() => {
                setFilter(initialState);
                setResponseData("");
              }}
            >
              Defaults <ResetIcon className="w-4 h-4 ml-2" />
            </Button>
            <SubmitButton
              buttonText={
                <>
                  Filter <Filter className="w-4 h-4 ml-2" />
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
    (transaction) => transaction.transactionStatus === "Completed"
  );

  const noOfTransactions = completetedTransactions.length;
  const totalCommissions = sumByKey(
    "commissionAmount",
    completetedTransactions
  );

  let dailyIncome = [];
  if (responseData && !isMobile) {
    dailyIncome = Array.from(
      new Set(
        completetedTransactions.map((transaction) =>
          new Date(transaction.transactionTime).toDateString()
        )
      )
    )
      .map((date) => {
        const income = completetedTransactions
          .filter(
            (transaction) =>
              new Date(transaction.transactionTime).toDateString() === date
          )
          .reduce((sum, transaction) => sum + transaction.commissionAmount, 0);

        return { date: format(new Date(date), "MMM d, yyyy"), Income: income };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
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
        ? format(completetedTransactions[0].transactionTime, "dd MMM, yyyy")
        : format(range.from, "dd MMM, yyyy")
    } - ${format(range.to, "dd MMM, yyy")}`;
  }

  const garageTableData = [...responseData];

  return (
    <div className="space-y-6 " ref={analyticsRef}>
      {completetedTransactions.length > 0 && (
        <div className="grid gap-4 mb-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Cars Flipped
              </CardTitle>
              <Car className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {noOfTransactions.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Commission
              </CardTitle>
              <HandCoins className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{totalCommissions.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {dailyIncome.length > 0 && !isMobile && (
        <DailyIncomeGraph dailyIncome={dailyIncome} range={rangeString} />
      )}
    </div>
  );
};

export default GarageTransactions;
