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
  Car,
  DollarSign,
  Dot,
  Droplets,
  Filter,
  Footprints,
  ParkingCircle,
  Settings2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  endOfDay,
  format,
  startOfDay,
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

const configInitialState = {
  text: "All",
  value: "All",
};

function CarwashTransactions() {
  const [filter, setFilter] = useState(initialState);
  const [selectedVehicle, setSelectedVehicle] = useState(configInitialState);
  const [selectedService, setSelectedService] = useState(configInitialState);
  const [responseData, setResponseData] = useState("");
  const [range, setRange] = useState("");

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { data, isLoading, isSuccess, isError, error } =
    useGetPreFilterTransactionsQuery();

  const [getPostFilterTransactions] = useGetPostFilterTransactionsMutation();

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
      <div className=" space-y-4 mb-64">
        <NavBackButton buttonText={"Car Wash Transactions"} navigateTo={-1} />
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
                  <TextSeparator text={"Or custom Range"} />
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
                        initialFocus
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
                            customRange: { ...prev.customRange, ...value },
                          }));
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="p-4 col-span-12 sm:col-span-4 border-b sm:border-b-0  sm:border-r space-y-4">
                <div className="flex flex-row sm:flex-col  gap-4">
                  <div className="space-y-2 w-full">
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
                  <div className="space-y-2 w-full">
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
              <div className="p-4 col-span-12 sm:col-span-4  ">
                <div className="flex flex-row sm:flex-col  gap-4">
                  <div className="space-y-2 w-full">
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
                  <div className="space-y-2 w-full">
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
          <CardFooter className="border-t  px-4 sm:px-6  py-4 ">
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
    const serviceType = transaction.service?.id?.serviceTypeName;
    const serviceCost = transaction.service?.cost;

    if (serviceVehicle && serviceType && serviceCost !== undefined) {
      let vehicleTypeEntry = result.find(
        (entry) => entry.vehicleTypeName === serviceVehicle.vehicleTypeName
      );

      if (!vehicleTypeEntry) {
        vehicleTypeEntry = {
          vehicleTypeName: serviceVehicle.vehicleTypeName,
          services: [],
        };
        result.push(vehicleTypeEntry);
      }

      let serviceEntry = vehicleTypeEntry.services.find(
        (service) => service.serviceTypeName === serviceType
      );

      if (!serviceEntry) {
        serviceEntry = {
          serviceTypeName: serviceType,
          income: 0,
        };
        vehicleTypeEntry.services.push(serviceEntry);
      }

      serviceEntry.income += serviceCost;
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Wash Revenue
              </CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{WashRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* -{freeWashes.toLocaleString()} for free washes */}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Parking Revenue
              </CardTitle>
              <ParkingCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{parkingRevenue.toLocaleString()}
              </div>
              {/* <p className="text-xs text-muted-foreground">+19% than yesterday</p> */}
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
            <VehicleIncomeGraph vehicleIncomeData={vehicleIncomeData} />
            <PaymentsGraph
              completetedTransactions={completetedTransactions}
              range={rangeString}
            />
          </>
        )}
      </div>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Transactions</CardTitle>
          <CardDescription className="text-xs">
            {rangeString?.split("-")[0].trim() ===
            rangeString?.split("-")[1].trim()
              ? rangeString?.split("-")[0]
              : rangeString}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <CarwashFilterTranasactionDataTable
            data={responseData}
            columns={CarwashFilterTransactionColumn}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CarwashTransactions;
