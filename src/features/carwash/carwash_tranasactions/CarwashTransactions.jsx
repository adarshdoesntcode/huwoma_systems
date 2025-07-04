import NavBackButton from "@/components/NavBackButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ResetIcon } from "@radix-ui/react-icons";
import {
  BadgePercent,
  DollarSign,
  Droplets,
  Filter,
  ParkingCircle,
  Settings2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  endOfDay,
  format,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextSeparator from "@/components/ui/TextSeparator";
import {
  useGetPostFilterTransactionsMutation,
  useGetPreFilterTransactionsQuery,
} from "../carwashApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import SubmitButton from "@/components/SubmitButton";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { CarwashFilterTranasactionDataTable } from "./CarwashFilterTransactionDataTable";
import { CarwashFilterTransactionColumn } from "./CarwashFilterTransactionColumn";
import PaymentsGraph from "./charts/PaymentsGraph";
import VehicleIncomeGraph from "./charts/VehicleIncomeGraph";
import { DailyIncomeGraph } from "./charts/DailyIncomeGraph";
import { isMobile } from "react-device-detect";
import { useIsSuper } from "@/hooks/useSuper";
import { Navigate } from "react-router-dom";
import DateSelector from "./selector/DateSelector";
import RangeSelector from "./selector/RangeSelector";
import MonthSelector from "./selector/MonthSelector";

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
  customMonth: {
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

const configInitialState = {
  text: "All",
  value: "All",
};

function CarwashTransactions() {
  const isSuper = useIsSuper();
  const [filter, setFilter] = useState(initialState);
  const [selectedVehicle, setSelectedVehicle] = useState(configInitialState);
  const [selectedService, setSelectedService] = useState(configInitialState);
  const [responseData, setResponseData] = useState("");
  const [range, setRange] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { data, isLoading, isSuccess, isError, error } =
    useGetPreFilterTransactionsQuery();

  const [getPostFilterTransactions] = useGetPostFilterTransactionsMutation();

  if (!isSuper) {
    return <Navigate to="/carwash" />;
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
        customRange: {
          from: "",
          to: "",
        },
        customMonth: {
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

  const handleVehicleSelect = (vehicles, value) => {
    if (value !== "All") {
      const vehicle = vehicles.find(
        (vehicle) => vehicle.vehicleTypeName === value
      );
      setSelectedVehicle({
        text: value,
        value: vehicle,
      });
    } else {
      setSelectedVehicle(configInitialState);
    }
    setSelectedService(configInitialState);
  };

  const handleServiceSelect = (services, value) => {
    if (value !== "All") {
      const service = services.find(
        (service) => service.serviceTypeName === value
      );
      setSelectedService({
        text: value,
        value: service,
      });
    } else {
      setSelectedService(configInitialState);
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
      const res = await getPostFilterTransactions({
        timeRange: { ...dateRange },
        transactionStatus:
          filter.transaction.status === "All"
            ? null
            : filter.transaction.status,
        paymentStatus:
          filter.payment.status === "All" ? null : filter.payment.status,
        vehicleId: selectedVehicle?.value?._id || null,
        serviceId: selectedService?.value?._id || null,
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

  let content;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const vehicleTypes = data?.data || [];

    content = (
      <div className="space-y-4 mb-96">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 border-b sm:p-6 sm:pb-4">
            <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
              <Settings2 className="w-5 h-5" />
              Carwash Transactions Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 pb-0 sm:p-6 sm:pb-0 sm:pt-0">
            <form
              id="carwash-transaction-filter"
              className="grid grid-cols-12"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="col-span-12 p-4 pl-2 border-b sm:col-span-4 sm:border-b-0 sm:border-r">
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
                      <SelectItem value="Last 3 Months">
                        Last 3 Months
                      </SelectItem>
                      <SelectItem value="Last 6 Months">
                        Last 6 Months
                      </SelectItem>
                      <SelectItem value="Last Year">Last Year</SelectItem>
                      <SelectItem value="All Time">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <TextSeparator text={"Or custom date"} />
                  <DateSelector filter={filter} setFilter={setFilter} />
                  <TextSeparator text={"Or custom Range"} />
                  <RangeSelector filter={filter} setFilter={setFilter} />
                  <TextSeparator text={"Or Custom Month"} />
                  <MonthSelector filter={filter} onSelect={handleMonthChange} />
                </div>
              </div>
              <div className="col-span-12 p-4 space-y-4 border-b sm:col-span-4 sm:border-b-0 sm:border-r">
                <div className="flex flex-row gap-4 sm:flex-col">
                  <div className="w-full space-y-2">
                    <Label>Vehicle Type</Label>

                    <Select
                      value={selectedVehicle.text}
                      onValueChange={(value) => {
                        handleVehicleSelect(vehicleTypes, value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((vehicleType) => (
                          <SelectItem
                            key={vehicleType._id}
                            value={vehicleType.vehicleTypeName}
                          >
                            <span
                              className={
                                !vehicleType.vehicleTypeOperational
                                  ? "text-muted-foreground"
                                  : ""
                              }
                            >
                              {vehicleType.vehicleTypeName}
                            </span>
                          </SelectItem>
                        ))}

                        <SelectItem value={"All"}>All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full space-y-2">
                    <Label>Service Type</Label>

                    <Select
                      disabled={selectedVehicle.value === "All"}
                      value={selectedService.text}
                      onValueChange={(value) => {
                        handleServiceSelect(
                          selectedVehicle.value.services,
                          value
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedVehicle?.value?.services?.map((service) => (
                          <SelectItem
                            key={service._id}
                            value={service.serviceTypeName}
                          >
                            <span
                              className={
                                !service.serviceTypeOperational
                                  ? "text-muted-foreground"
                                  : ""
                              }
                            >
                              {service.serviceTypeName}
                            </span>
                          </SelectItem>
                        ))}
                        <SelectItem value={"All"}>All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="col-span-12 p-4 sm:col-span-4 ">
                <div className="flex flex-row gap-4 sm:flex-col">
                  <div className="w-full space-y-2">
                    <Label>Transaction Status</Label>

                    <Select
                      value={filter.transaction.status}
                      onValueChange={(value) => {
                        setFilter((prev) => ({
                          ...prev,
                          transaction: {
                            ...prev.transaction,
                            status: value,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Booked">Booked</SelectItem>
                        <SelectItem value="In Queue">In Queue</SelectItem>
                        <SelectItem value="Ready for Pickup">
                          Ready for Pickup
                        </SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value={"All"}>All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full space-y-2">
                    <Label>Payment Status</Label>

                    <Select
                      value={filter.payment.status}
                      onValueChange={(value) => {
                        setFilter((prev) => ({
                          ...prev,
                          payment: {
                            ...prev.payment,
                            status: value,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value={"All"}>All</SelectItem>
                      </SelectContent>
                    </Select>
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
                  setSelectedService(configInitialState);
                  setSelectedVehicle(configInitialState);
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
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
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

function calculateVehicleServiceIncome(transactions) {
  const result = [];

  transactions.forEach((transaction) => {
    const serviceVehicle = transaction.service?.id?.serviceVehicle;
    const serviceType = transaction.service?.id;
    const serviceCost = transaction.service?.cost;
    const addOns = transaction?.addOns?.reduce(
      (sum, addOn) => sum + addOn.price,
      0
    );

    if (serviceVehicle && serviceType && serviceCost !== undefined) {
      let vehicleTypeEntry = result.find(
        (entry) => entry.vehicleTypeId === serviceVehicle._id
      );

      if (!vehicleTypeEntry) {
        vehicleTypeEntry = {
          vehicleTypeName: serviceVehicle.vehicleTypeName,
          vehicleTypeId: serviceVehicle._id,
          services: [],
        };
        result.push(vehicleTypeEntry);
      }

      let serviceEntry = vehicleTypeEntry.services.find(
        (service) => service.serviceTypeId === serviceType._id
      );

      if (!serviceEntry) {
        serviceEntry = {
          serviceTypeName: serviceType.serviceTypeName,
          serviceTypeId: serviceType._id,
          income: 0,
        };
        vehicleTypeEntry.services.push(serviceEntry);
      }

      serviceEntry.income += serviceCost + addOns;
    }
  });

  return result;
}

const FilteredAnalytics = ({ responseData, range }) => {
  const analyticsRef = useRef(null);

  const completetedTransactions = responseData.filter(
    (transaction) =>
      transaction.transactionStatus === "Completed" &&
      transaction.paymentStatus === "Paid"
  );

  const vehicleIncomeData = calculateVehicleServiceIncome(
    completetedTransactions
  );

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
  const addOnsRevenue = completetedTransactions.reduce(
    (total, transaction) =>
      total + transaction.addOns.reduce((sum, addOn) => sum + addOn.price, 0),
    0
  );

  const actualWashRevenue = sumByKey(
    "service.actualRate",
    completetedTransactions
  );
  const freeWash = actualWashRevenue - WashRevenue;

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
          .reduce((sum, transaction) => sum + transaction.netAmount, 0);

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

  const carwashTableData = [...responseData];

  return (
    <div className="space-y-6 " ref={analyticsRef}>
      {completetedTransactions.length > 0 && (
        <div className="grid gap-4 mb-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Net Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalNetRevenue.toLocaleString()}
              </div>
              {pendingRevenue > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{pendingRevenue.toLocaleString()} pending
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Wash Revenue
              </CardTitle>
              <Droplets className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{(WashRevenue + addOnsRevenue).toLocaleString()}
              </div>
              {freeWash > 0 && (
                <p className="text-xs text-muted-foreground">
                  {freeWash.toLocaleString()} in free wash
                </p>
              )}
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
              {/* <p className="text-xs text-muted-foreground">+19% than yesterday</p> */}
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Discounted</CardTitle>
              <BadgePercent className="w-4 h-4 text-muted-foreground" />
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
            <VehicleIncomeGraph vehicleIncomeData={vehicleIncomeData} />
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
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <CarwashFilterTranasactionDataTable
            data={carwashTableData}
            columns={CarwashFilterTransactionColumn}
            origin={"transactions"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CarwashTransactions;
