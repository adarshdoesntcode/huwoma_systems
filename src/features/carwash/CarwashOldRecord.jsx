import NavBackButton from "@/components/NavBackButton";
import SubmitButton from "@/components/SubmitButton";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useGetPreEditDataQuery } from "./carwashApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { useState } from "react";
import { CalendarIcon, Car, Droplet, User, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { add, format, set } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { CAR_COLOR_OPTIONS } from "@/lib/config";

const configInitialState = {
  text: "",
  value: "",
};
function CarwashOldRecord() {
  const [selectedVehicle, setSelectedVehicle] = useState(configInitialState);
  const [selectedService, setSelectedService] = useState(configInitialState);

  const [addOns, setAddOns] = useState(false);
  const [parking, setParking] = useState(false);

  const [parkingStart, setParkingStart] = useState(new Date());
  const [parkingEnd, setParkingEnd] = useState(new Date());
  const [serviceStart, setServiceStart] = useState(new Date());
  const [serviceEnd, setServiceEnd] = useState(new Date());

  const [selectedColor, setSelectedColor] = useState("");
  const [carColors, setCarColors] = useState(CAR_COLOR_OPTIONS);

  const [newAddOn, setNewAddOn] = useState({
    name: "",
    price: "",
  });
  const [addOnsList, setAddOnsList] = useState([]);
  const [paymentMode, setPaymentMode] = useState("");

  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetPreEditDataQuery();
  console.log("🚀 ~ CarwashOldRecord ~ data:", data);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

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
  const handleRemoveAddOn = (index) => {
    setAddOnsList((prev) => {
      return prev.filter((addOn, i) => {
        return i !== index;
      });
    });
  };

  let content;

  if (isLoading) {
    content = (
      <div className="flex-1 h-full flex items-center justify-center ">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const vehicleTypes = data?.data?.vehicleTypes || [];
    const paymentModes = data?.data?.paymentModes || [];
    content = (
      <div className="mx-auto grid w-full max-w-2xl items-start gap-4 ">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">
              Old Wash Record
            </CardTitle>
            <CardDescription>Old wash record details</CardDescription>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
            <form
              // onSubmit={handleSubmit(onSubmit)}
              className="grid gap-2"
            >
              <Label className="flex items-center text-muted-foreground">
                <User className="mr-2 w-4 h-4" /> Customer
              </Label>
              <div className="grid gap-4 p-4 rounded-lg border">
                <div className="grid gap-2">
                  <Label>
                    {errors.customerName ? (
                      <span className="text-destructive">
                        {errors.customerName.message}
                      </span>
                    ) : (
                      <span>Full Name</span>
                    )}
                  </Label>
                  <Input
                    id="customerName"
                    type="text"
                    placeholder="Name"
                    autoFocus
                    autoComplete="off"
                    {...register("customerName", {
                      required: "Name is required",
                      pattern: {
                        value: /^[a-zA-Z\s]*$/,
                        message: "Invalid Name",
                      },
                    })}
                    className={errors.customerName ? "border-destructive" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>
                    {errors.customerContact ? (
                      <span className="text-destructive">
                        {errors.customerContact.message}
                      </span>
                    ) : (
                      <span>Phone Number</span>
                    )}
                  </Label>
                  <Input
                    onWheel={(e) => e.target.blur()}
                    type="tel"
                    inputMode="numeric"
                    placeholder="+977"
                    autoComplete="off"
                    {...register("customerContact", {
                      required: "Number is required",
                      valueAsNumber: true,
                      validate: (value) =>
                        String(value).length === 10 ||
                        "Number must be 10 digits",
                    })}
                    className={
                      errors.customerContact ? "border-destructive" : ""
                    }
                  />
                </div>
              </div>
              <Label className="flex items-center text-muted-foreground mt-4">
                <Droplet className="mr-2 w-4 h-4" /> Wash Selection
              </Label>
              <div className="grid gap-4 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <Label>Vehicle Type</Label>

                  <Select
                    value={selectedVehicle.text}
                    onValueChange={(value) => {
                      handleVehicleSelect(vehicleTypes, value);
                    }}
                  >
                    <SelectTrigger className="w-[160px] sm:w-[200px]">
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Service Type</Label>

                  <Select
                    value={selectedService.text}
                    disabled={!selectedVehicle.value}
                    onValueChange={(value) => {
                      handleServiceSelect(
                        selectedVehicle.value.services,
                        value
                      );
                    }}
                  >
                    <SelectTrigger className="w-[160px] sm:w-[200px]">
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 flex-col border-t pt-3 ">
                  <div className="flex items-center justify-between">
                    <div className=" text-xs font-medium">Start Time</div>
                    <div className="text-xs ">
                      <DateTimePicker
                        date={serviceStart}
                        setDate={setServiceStart}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className=" text-xs font-medium">End Time</div>
                    <div className="text-xs ">
                      <DateTimePicker
                        date={serviceEnd}
                        setDate={setServiceEnd}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Label className="flex items-center text-muted-foreground mt-4">
                <Car className="mr-2 w-4 h-4" /> Vehicle
              </Label>
              <div className="grid gap-4 p-4 rounded-lg border">
                <div className="grid gap-2">
                  <Label>Vehicle Name</Label>
                  <Input
                    id="vehicleModel"
                    type="text"
                    autoComplete="off"
                    placeholder="Company/Model"
                    autoFocus
                    {...register("vehicleModel", {
                      required: "Vehicle name is required",
                      onChange: (e) => {
                        const words = e.target.value.split(" ");
                        const newWords = words.map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        );
                        const newValue = newWords.join(" ");
                        if (e.target.value !== newValue) {
                          e.target.value = newValue;
                        }
                      },
                    })}
                    className={errors.vehicleModel ? "border-destructive" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Number Plate"
                    {...register("vehicleNumber", {
                      required: "Identification is required",
                    })}
                    className={errors.vehicleNumber ? "border-destructive" : ""}
                  />
                </div>
                <Label>Vehicle Colour</Label>
                <div className="flex flex-wrap gap-2">
                  {carColors.map((color) => (
                    <div
                      key={color.colorCode}
                      className={cn(
                        "flex items-center gap-2  p-2 border-2 grayscale-0 rounded-lg  cursor-pointer hover:text-primary hover:scale-105 hover:grayscale-0 transition-all duration-150",
                        !selectedColor
                          ? ""
                          : selectedColor.colorCode == color.colorCode
                          ? "border-muted-foreground border-2 grayscale-0"
                          : "grayscale text-slate-400"
                      )}
                      onClick={() => {
                        selectedColor === color
                          ? setSelectedColor("")
                          : setSelectedColor(color);
                      }}
                    >
                      <div
                        className={cn(
                          `w-6 h-6 border-2  rounded-full shadow-lg  cursor-pointer`
                        )}
                        style={{ backgroundColor: color.colorCode }}
                      />
                      <span className="text-xs">{color.colorName}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border p-4 rounded-md shadow-sm my-2">
                <div className="flex   gap-4 items-center  justify-between">
                  <Label>Add Ons</Label>
                  <Switch checked={addOns} onCheckedChange={setAddOns} />
                </div>
                {addOns && (
                  <div className="flex flex-col gap-2 border-t pt-3 mt-4">
                    {addOnsList.map((addOn, index) => (
                      <div
                        key={addOn.id}
                        className="flex items-center justify-between"
                      >
                        <div className="text-muted-foreground text-xs font-medium">
                          {index + 1}. {addOn.name}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-semibold">
                            {addOn.price === 0 ? "Free" : "Rs. " + addOn.price}
                          </div>
                          <X
                            className="w-4 h-4 hover:scale-110 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                            onClick={() => handleRemoveAddOn(index)}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-4 mt-2  justify-between">
                      <Input
                        id="newAddOn"
                        type="text"
                        autoComplete="off"
                        placeholder="Add On"
                        autoFocus
                        value={newAddOn.name}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            document.getElementById("addAddOn").click();
                            e.target.blur();
                          }
                        }}
                        onChange={(e) =>
                          setNewAddOn((prev) => {
                            return { ...prev, name: e.target.value };
                          })
                        }
                        className="text-sm font-medium "
                      />
                      <Input
                        onWheel={(e) => e.target.blur()}
                        id="newAddOnPrice"
                        type="tel"
                        autoComplete="off"
                        inputMode="numeric"
                        placeholder="Rs"
                        value={newAddOn.price}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            document.getElementById("addAddOn").click();
                            e.target.blur();
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value;

                          setNewAddOn((prev) => {
                            return {
                              ...prev,
                              price: value,
                            };
                          });
                        }}
                        className="text-sm font-medium "
                      />
                      <Button
                        id="addAddOn"
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          if (!newAddOn.name) {
                            toast({
                              title: "Add On Name is required",
                              variant: "destructive",
                            });
                            return;
                          }
                          if (isNaN(parseFloat(newAddOn.price))) {
                            toast({
                              title: "Add On Price must be a number",
                              variant: "destructive",
                            });
                            return;
                          }
                          if (!Number(newAddOn.price) > 0) {
                            toast({
                              title: "Add On Price is required",
                              variant: "destructive",
                            });
                            return;
                          }
                          setAddOnsList([
                            ...addOnsList,
                            {
                              name: newAddOn.name,
                              price: Number(newAddOn.price),
                            },
                          ]);
                          setNewAddOn({
                            name: "",
                            price: "",
                          });
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="border p-4 rounded-md shadow-sm">
                <div className="flex   gap-4 items-center  justify-between">
                  <Label>Parking</Label>
                  <Switch checked={parking} onCheckedChange={setParking} />
                </div>
                {parking && (
                  <div className="flex gap-2 flex-col border-t pt-3 mt-4">
                    <div className="flex items-center justify-between">
                      <div className=" text-xs font-medium">Parking Start</div>
                      <div className="text-xs ">
                        <DateTimePicker
                          date={parkingStart}
                          setDate={setParkingStart}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className=" text-xs font-medium">Parking End</div>
                      <div className="text-xs ">
                        <DateTimePicker
                          date={parkingEnd}
                          setDate={setParkingEnd}
                        />
                      </div>
                    </div>

                    <Separator className="my-2" />
                    <div className="flex sm:flex-row flex-col items-start gap-4 sm:items-center  justify-between">
                      <Label>
                        {errors.parkingCost ? (
                          <span className="text-destructive">
                            {errors.parkingCost.message}
                          </span>
                        ) : (
                          <span>Parking Cost</span>
                        )}
                      </Label>
                      <div className="flex items-center gap-6 sm:gap-2 w-full  sm:w-[220px] ">
                        <Label>Rs.</Label>

                        <Input
                          onWheel={(e) => e.target.blur()}
                          id="parkingCost-Checkout"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="0"
                          autoFocus
                          {...register("parkingCost", {
                            required: "Cost is required",
                            validate: (value) => {
                              const regex = /^\d*$/;
                              if (!regex.test(value)) {
                                return "Not a valid amount";
                              }

                              return true;
                            },
                          })}
                          className={
                            errors.parkingCost
                              ? "border-destructive text-end"
                              : "text-end"
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="border p-4 rounded-md shadow-sm my-2">
                <div className="flex sm:flex-row flex-col items-start gap-4 sm:items-center  justify-between">
                  <Label>
                    {errors.discountAmt ? (
                      <span className="text-destructive">
                        {errors.discountAmt.message}
                      </span>
                    ) : (
                      <span>Discount</span>
                    )}
                  </Label>
                  <div className="flex items-center gap-6 sm:gap-2 w-full  sm:w-[180px] ">
                    <Label>Rs.</Label>

                    <Input
                      onWheel={(e) => e.target.blur()}
                      id="discountAmt"
                      type="tel"
                      autoComplete="off"
                      inputMode="numeric"
                      placeholder="0"
                      {...register("discountAmt", {
                        validate: (value) => {
                          const regex = /^\d*$/;
                          if (!regex.test(value)) {
                            return "Not a valid amount";
                          }
                          // if (parseFloat(value) > parseFloat(grossAmt)) {
                          //   return "Discount amount greater than gross amount";
                          // }
                          return true;
                        },
                      })}
                      className={
                        errors.discountAmt
                          ? "border-destructive text-end "
                          : "text-end "
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="border p-4 rounded-md shadow-sm my-2">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center  justify-between">
                  <Label>Payment Mode</Label>
                  <div className="flex items-center gap-2 w-full sm:w-[180px]">
                    <Select
                      value={paymentMode._id}
                      onValueChange={(e) => {
                        setPaymentMode(
                          paymentModes?.find((mode) => e === mode._id) || ""
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentModes?.map((mode) => (
                          <SelectItem key={mode._id} value={mode._id}>
                            {mode.paymentModeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid gap-2 mb-2 px-2">
                <Label>Details</Label>
                <div className="flex items-center justify-between  ">
                  <div className="text-muted-foreground text-xs font-medium">
                    Gross Amt
                  </div>
                  <div className="text-xs font-medium">
                    {/* Rs. {grossAmt} */}
                  </div>
                </div>
                <div className="flex items-center justify-between  ">
                  <div className="text-muted-foreground text-xs font-medium">
                    Discount Amt
                  </div>
                  <div className="text-xs font-medium">
                    {/* Rs. {discountAmt} */}
                  </div>
                </div>
                <div className="flex items-center justify-between  ">
                  <div className="text-muted-foreground text-xs font-medium">
                    Net Amt
                  </div>
                  <div className="text-base font-semibold">
                    {/* Rs. {netAmt} */}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
            <div className="flex w-full items-center justify-between gap-4">
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </Button>
              </div>
              <SubmitButton buttonText={"Insert"} />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }
  return content;
}

function DateTimePicker({ date, setDate }) {
  const handleSelect = (newDay) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full sm:w-[230px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PP   hh:mm a") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => handleSelect(d)}
          disabled={{ after: new Date() }}
        />
        <div className="p-3 border-t border-border">
          <TimePicker setDate={setDate} date={date} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CarwashOldRecord;
