import { useEffect, useState } from "react";
import { useGetSystemActivityQuery } from "./systemActivityApiSlice";
import {
  endOfDay,
  format,
  startOfDay,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import {
  Activity,
  CalendarIcon,
  Car,
  Filter,
  RefreshCcw,
  Users,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { SystemActivityDataTable } from "./SystemActivityDataTable";
import { SystemActivityColumn } from "./SystemActivityColumn";
import { Skeleton } from "@/components/ui/skeleton";

const initialState = {
  preset: {
    text: "Last Week",
    from: subWeeks(new Date(), 1),
    to: new Date(),
  },
  customDate: {
    date: "",
  },
  customRange: {
    from: "",
    to: "",
  },
};

const initialDateRange = {
  from: startOfDay(subWeeks(new Date(), 1)),
  to: endOfDay(new Date()),
};

function SystemActivity() {
  const [filter, setFilter] = useState(initialState);
  const [dateRange, setDateRange] = useState(JSON.stringify(initialDateRange));
  const [responseData, setResponseData] = useState([]);
  const [range, setRange] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetSystemActivityQuery(dateRange, {
      forceRefetch: true,
    });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    setResponseData(data?.data || []);
  }, [data]);

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

    setDateRange(JSON.stringify(dateRange));
  };

  let content;

  if (isLoading || isFetching) {
    content = (
      <div className="flex flex-col flex-1 gap-2 items-center justify-center">
        {[...Array(20)].map((_, index) => (
          <Skeleton className="h-8 w-full bg-muted-foreground/10" key={index} />
        ))}
      </div>
    );
  } else if (isSuccess) {
    content = <ActivityData data={responseData} />;
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }
  return (
    <div className="space-y-2">
      <div className="  sm:flex-row  flex items-center sm:items-center tracking-tight  justify-between gap-4 sm:mb-4">
        <div className="text-sm font-semibold uppercase text-primary  flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          System Activity
        </div>
        <div className=" flex justify-end">
          <Button
            size="sm"
            variant="outline"
            className="mr-2"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            <span className="sr-only sm:not-sr-only">Refresh </span>

            <RefreshCcw
              className={cn(
                "sm:ml-2 w-4 h-4",
                isFetching ? "animate-spin" : ""
              )}
            />
          </Button>
          <Button
            size="sm"
            className="mr-2"
            type="submit"
            disabled={isLoading || isFetching}
            form="system-activity-filter"
          >
            <span className="sr-only sm:not-sr-only">Filter </span>

            <Filter className="sm:ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
      <form
        id="system-activity-filter"
        className="grid  grid-cols-12 gap-0 sm:gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-12 p-2 px-0  sm:col-span-4 ">
          <div>
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
        <div className="p-2 px-0 col-span-12 sm:col-span-4 ">
          <div className="flex flex-row sm:flex-col">
            <div className="w-full">
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
        <div className="p-2 px-0 col-span-12 sm:col-span-4  ">
          <div className="flex flex-row sm:flex-col">
            <div className=" w-full">
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
      {content}
    </div>
  );
}

const ActivityData = ({ data }) => {
  return (
    <div className="pb-64">
      <SystemActivityDataTable columns={SystemActivityColumn} data={data} />
    </div>
  );
};

export default SystemActivity;
