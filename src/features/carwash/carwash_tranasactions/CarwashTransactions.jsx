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
import { Dot, Filter, Settings2 } from "lucide-react";
import { useState } from "react";
import { format, subMonths, subWeeks, subYears } from "date-fns";
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
import { useGetPreFilterTransactionsQuery } from "../carwashApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";

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
    status: null,
  },
  payment: {
    status: null,
  },
};

const configInitialState = {
  text: null,
  value: null,
};

function CarwashTransactions() {
  const [filter, setFilter] = useState(initialState);
  const [selectedVehicle, setSelectedVehicle] = useState(configInitialState);
  const [selectedService, setSelectedService] = useState(configInitialState);
  console.log("🚀 ~ CarwashTransactions ~ selectedService:", selectedService);

  const { data, isLoading, isSuccess, isError, error } =
    useGetPreFilterTransactionsQuery();

  const handlePresetSelect = (value) => {
    let changedstate = {
      text: "",
      from: null,
    };
    console.log(value);
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
    const vehicle = vehicles.find(
      (vehicle) => vehicle.vehicleTypeName === value
    );
    setSelectedVehicle({ text: value, value: vehicle });
    setSelectedService(configInitialState);
  };

  const handleServiceSelect = (services, value) => {
    const service = services.find((service) => service.serviceName === value);
    setSelectedService({ text: value, value: service });
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
      <div className=" space-y-4">
        <NavBackButton buttonText={"Car Wash Transactions"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 sm:p-6 sm:pb-4 border-b">
            <CardTitle className="flex gap-3 text-lg sm:text-xl items-center">
              <Settings2 className="h-5 w-5" />
              Transaction Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-0 pb-0 sm:pb-0 sm:pt-0">
            <div className="grid  grid-cols-12">
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
                              to: new Date().toISOString(),
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

                        <SelectItem value={null}>All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 w-full">
                    <Label>Service Type</Label>

                    <Select
                      disabled={!selectedVehicle.value}
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
                        {selectedVehicle?.value?.services.map((service) => (
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
                        <SelectItem value={null}>All</SelectItem>
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
                        <SelectItem value={null}>All</SelectItem>
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
                        <SelectItem value={null}>All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t  px-4 sm:px-6  py-4 ">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedService(configInitialState);
                  setSelectedVehicle(configInitialState);
                  setFilter(initialState);
                }}
              >
                Defaults <ResetIcon className="h-4 w-4 ml-2" />
              </Button>
              <Button>
                Filter <Filter className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

export default CarwashTransactions;
