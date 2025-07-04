import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCheck, ChevronRight, Contact, Loader2, X } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCreateCutomerMutation,
  useFindCustomerMutation,
  useTransactionOneMutation,
  useTransactionStartFromBookingMutation,
  useVehicleTypeWithServicesQuery,
} from "./carwashApiSlice";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  cn,
  findWashCountForCustomer,
  getMostDetailedObject,
} from "@/lib/utils";
import { ResetIcon } from "@radix-ui/react-icons";
import SubmitButton from "@/components/SubmitButton";
import NavBackButton from "@/components/NavBackButton";
import { CAR_COLOR_OPTIONS } from "@/lib/config";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

function CarwashNewRecord() {
  const [tab, setTab] = useState("vehicle");
  const [customer, setCustomer] = useState(null);
  const [customerList, setCustomerList] = useState(null);
  const [vehicleCustomerList, setVehicleCustomerList] = useState(null);
  const [newCustomer, setNewCustomer] = useState(false);
  const navigate = useNavigate();

  const [findCustomer] = useFindCustomerMutation();
  const [createCutomer] = useCreateCutomerMutation();

  const locationState = useLocation().state || null;
  useEffect(() => {
    if (locationState?.customer) {
      setCustomer(locationState.customer);
    }
  }, [locationState]);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (newCustomer && tab !== "vehicle") {
      try {
        const res = await createCutomer({
          customerContact: data.customerContact,
          customerName: data.customerName,
        });
        if (res.error) {
          throw new Error(res.error.data.message);
        }
        if (!res.error) {
          setCustomer(res.data.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong!!",
          description: error.message,
        });
      }
    } else if (tab === "vehicle" || !newCustomer) {
      try {
        let payload;

        if (tab === "number") {
          payload = {
            customerContact: data.customerContact,
          };
        } else if (tab === "vehicle") {
          payload = {
            vehicleNumber: data.vehicleNumber,
          };
        } else if (tab === "name") {
          payload = {
            customerName: data.customerName,
          };
        }
        const res = await findCustomer(payload);
        if (res.error) {
          if (res.error.status === 404) {
            if (tab === "vehicle") {
              toast({
                variant: "destructive",
                title: "Vehicle Not Found",
                description: "No Customer with this vehicle number",
              });
            } else {
              setNewCustomer(true);
            }
          } else {
            throw new Error(res.error.data.message);
          }
        }
        if (!res.error) {
          if (tab === "number") {
            setCustomer(res.data.data.customer);
          } else if (tab === "vehicle") {
            if (res.data.data.customer.length > 0) {
              setVehicleCustomerList(res.data.data.customer);
            }
          } else if (tab === "name") {
            if (res.data.data.customer.length > 0) {
              setCustomerList(res.data.data.customer);
            }
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong!!",
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="grid items-start w-full max-w-xl gap-4 mx-auto ">
      <NavBackButton buttonText={"Back"} navigateTo={-1} />

      {customer ? (
        <Card>
          <CardHeader
            className="p-4 transition-all cursor-pointer hover:bg-muted"
            onClick={() => {
              navigate(`/carwash/customers/${customer._id}`);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 ">
                  <AvatarFallback>
                    <Contact />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <CardTitle className="text-md ">
                    {customer.customerName}
                  </CardTitle>
                  <CardDescription className="flex flex-col text-xs">
                    {customer.customerContact}
                  </CardDescription>
                </div>
              </div>
              <div>
                {!locationState && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomer(null);
                      setCustomerList(null);
                      setVehicleCustomerList(null);
                      reset();
                    }}
                  >
                    Reset <ResetIcon className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          {customer.vehicleModels?.length > 0 && (
            <CardFooter className="flex items-center justify-center py-3 border-t">
              <div className="flex flex-wrap items-center gap-2">
                {customer.vehicleModels.map((vehicle, index) => (
                  <Fragment key={index}>
                    {vehicle?.vehicleColor && (
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              className={cn(
                                `w-5 h-5 border-2  rounded-full shadow-lg  cursor-pointer`
                              )}
                              style={{
                                backgroundColor:
                                  vehicle?.vehicleColor?.colorCode,
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {vehicle?.vehicleColor?.colorName}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <div className="flex items-start gap-2">
                      <div className="text-xs font-semibold text-left text-primary">
                        {vehicle?.model}
                      </div>
                      <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                        {vehicle.vehicleNumber}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </CardFooter>
          )}
        </Card>
      ) : (
        <Card>
          <CardHeader className="p-4 sm:p-6 sm:pb-4 ">
            <CardTitle className="text-xl sm:text-2xl">New Wash</CardTitle>
            <CardDescription>Customer for the new wash record</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 sm:p-6 sm:pt-0">
            <form onSubmit={handleSubmit(onSubmit)} id="customer">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                  <TabsTrigger value="number">Contact</TabsTrigger>
                  <TabsTrigger value="name">Name</TabsTrigger>
                </TabsList>
                <TabsContent value="number">
                  <div className="grid gap-2">
                    <Label className="mt-2">
                      {errors.customerContact ? (
                        <span className="text-destructive">
                          {errors.customerContact.message}
                        </span>
                      ) : (
                        <span>Customer Number</span>
                      )}
                    </Label>
                    <Input
                      autoFocus
                      onWheel={(e) => e.target.blur()}
                      type="tel"
                      inputMode="numeric"
                      placeholder="+977"
                      autoComplete="off"
                      {...register("customerContact", {
                        required:
                          tab === "number" ? "Number is required" : false,

                        validate:
                          tab === "number"
                            ? (value) =>
                                String(value).length === 10 ||
                                "Number must be 10 digits"
                            : () => true,
                      })}
                      className={
                        errors.customerContact ? "border-destructive" : ""
                      }
                    />
                    {newCustomer && (
                      <div className="grid gap-2">
                        <Label className="mt-2">
                          {errors.customerName ? (
                            <span className="text-destructive">
                              {errors.customerName.message}
                            </span>
                          ) : (
                            <span>Customer Name</span>
                          )}
                        </Label>
                        <Input
                          id="customerName"
                          type="text"
                          placeholder="Name"
                          autoFocus
                          autoComplete="off"
                          {...register("customerName", {
                            // required: "Name is required",
                            pattern: {
                              value: /^[a-zA-Z\s]*$/,
                              message: "Invalid Name",
                            },
                            onChange: (e) => {
                              const words = e.target.value.split(" ");
                              const newWords = words.map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              );
                              const newValue = newWords.join(" ");
                              if (e.target.value !== newValue) {
                                e.target.value = newValue;
                              }
                            },
                          })}
                          className={
                            errors.customerName ? "border-destructive" : ""
                          }
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="vehicle">
                  {!vehicleCustomerList && (
                    <div className="grid gap-2">
                      <Label className="mt-2">
                        {errors.vehicleNumber ? (
                          <span className="text-destructive">
                            {errors.vehicleNumber.message}
                          </span>
                        ) : (
                          <span>Vehicle Number</span>
                        )}
                      </Label>
                      <Input
                        autoFocus
                        id="vehicleNumber"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Number Plate"
                        {...register("vehicleNumber", {
                          // required: "Identification is required",
                        })}
                        className={
                          errors.vehicleNumber ? "border-destructive" : ""
                        }
                      />
                    </div>
                  )}
                  <div className="grid gap-2 mt-4">
                    {vehicleCustomerList &&
                      vehicleCustomerList.map((customer) => {
                        return (
                          <Card
                            key={customer._id}
                            className="transition-all cursor-pointer hover:border-primary "
                            onClick={() => {
                              setCustomer(customer);
                              setVehicleCustomerList(null);
                            }}
                          >
                            <CardHeader className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  {/* <Avatar className="w-12 h-12">
                                    <AvatarFallback>
                                      <Contact />
                                    </AvatarFallback>
                                  </Avatar> */}
                                  <div>
                                    <CardTitle className="text-xs">
                                      {customer.customerName}
                                    </CardTitle>
                                    <CardDescription className="flex flex-col text-xs">
                                      {customer.customerContact}
                                    </CardDescription>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {customer.vehicleModels.map(
                                    (vehicle, index) => (
                                      <div
                                        className="flex items-center gap-2"
                                        key={index}
                                      >
                                        {vehicle?.vehicleColor && (
                                          <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                              <TooltipTrigger>
                                                <div
                                                  className={cn(
                                                    `w-5 h-5 border-2  rounded-full shadow-lg  cursor-pointer`
                                                  )}
                                                  style={{
                                                    backgroundColor:
                                                      vehicle?.vehicleColor
                                                        ?.colorCode,
                                                  }}
                                                />
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className="text-xs">
                                                  {
                                                    vehicle?.vehicleColor
                                                      ?.colorName
                                                  }
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}
                                        <div className="flex flex-col items-start">
                                          <div className="text-xs font-semibold text-left text-primary">
                                            {vehicle?.model}
                                          </div>
                                          <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                                            {vehicle.vehicleNumber}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        );
                      })}
                  </div>
                </TabsContent>
                <TabsContent value="name">
                  <div className="grid gap-2">
                    {!customerList && (
                      <>
                        <Label className="mt-2">
                          {errors.customerName ? (
                            <span className="text-destructive">
                              {errors.customerName.message}
                            </span>
                          ) : (
                            <span>Customer Name</span>
                          )}
                        </Label>
                        <Input
                          autoFocus
                          id="customerName"
                          type="text"
                          placeholder="Name"
                          autoComplete="off"
                          {...register("customerName", {
                            // required: "Name is required",
                            pattern: {
                              value: /^[a-zA-Z\s]*$/,
                              message: "Invalid Name",
                            },
                            onChange: (e) => {
                              const words = e.target.value.split(" ");
                              const newWords = words.map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              );
                              const newValue = newWords.join(" ");
                              if (e.target.value !== newValue) {
                                e.target.value = newValue;
                              }
                            },
                          })}
                          className={
                            errors.customerName ? "border-destructive" : ""
                          }
                        />
                      </>
                    )}

                    <div className="grid gap-2 ">
                      {customerList &&
                        customerList.map((customer) => {
                          return (
                            <Card
                              key={customer._id}
                              className="transition-all cursor-pointer hover:border-primary "
                              onClick={() => {
                                setCustomer(customer);
                                setCustomerList(null);
                              }}
                            >
                              <CardHeader className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <CardTitle className="text-xs ">
                                        {customer.customerName}
                                      </CardTitle>
                                      {/* <CardDescription className="flex flex-col text-xs">
                                        {customer.customerContact}
                                      </CardDescription> */}
                                    </div>
                                  </div>
                                  <Label className="text-xs">
                                    {customer?.customerContact}
                                  </Label>
                                </div>
                              </CardHeader>
                            </Card>
                          );
                        })}
                    </div>
                    {newCustomer && (
                      <div className="grid gap-2">
                        <Label>
                          {errors.customerContact ? (
                            <span className="text-destructive">
                              {errors.customerContact.message}
                            </span>
                          ) : (
                            <span>Customer Number</span>
                          )}
                        </Label>
                        <Input
                          onWheel={(e) => e.target.blur()}
                          type="tel"
                          inputMode="numeric"
                          placeholder="+977"
                          autoComplete="off"
                          autoFocus
                          {...register("customerContact", {
                            // required: "Number is required",

                            validate: (value) =>
                              String(value).length === 10 ||
                              "Number must be 10 digits",
                          })}
                          className={
                            errors.customerContact ? "border-destructive" : ""
                          }
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end px-4 py-4 border-t sm:px-6">
            <div className="flex items-center justify-between w-full gap-4">
              {tab === "number" && (
                <div>
                  {newCustomer && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        reset();
                        setNewCustomer(false);
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              )}
              {tab === "vehicle" && (
                <div>
                  {vehicleCustomerList && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        reset();
                        setVehicleCustomerList(null);
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              )}
              {tab === "name" && (
                <div>
                  {(newCustomer || customerList) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        reset();
                        setNewCustomer(false);
                        setCustomerList(null);
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              )}

              {tab === "number" && (
                <SubmitButton
                  condition={isSubmitting}
                  loadingText={newCustomer ? "Creating" : "Finding"}
                  buttonText={
                    newCustomer ? (
                      <>
                        Create <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )
                  }
                  type="submit"
                  form="customer"
                />
              )}
              {tab === "vehicle" && (
                <SubmitButton
                  condition={isSubmitting}
                  loadingText={"Finding"}
                  disabled={vehicleCustomerList}
                  buttonText={
                    <>
                      Find <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  }
                  type="submit"
                  form="customer"
                />
              )}
              {tab === "name" && (
                <SubmitButton
                  condition={isSubmitting}
                  loadingText={newCustomer ? "Creating" : "Finding"}
                  buttonText={
                    newCustomer ? (
                      <>
                        Create <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )
                  }
                  type="submit"
                  form="customer"
                />
              )}
            </div>
          </CardFooter>
        </Card>
      )}
      {customer && (
        <ServiceSelect customer={customer} locationState={locationState} />
      )}
    </div>
  );
}

const ServiceSelect = ({ customer, locationState }) => {
  const vehicleData = getMostDetailedObject(customer?.vehicleModels || []);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    vehicleData?.vehicleColor || ""
  );
  const [carColors, setCarColors] = useState(CAR_COLOR_OPTIONS);
  const [customCarColors, setCustomCarColors] = useState([]);
  const [showColourPicker, setShowColourPicker] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [serviceCost, setServiceCost] = useState("");
  const [newAddOn, setNewAddOn] = useState({
    name: "",
    price: "",
  });
  const [addOns, setAddOns] = useState(false);
  const [addOnsList, setAddOnsList] = useState([]);

  const serviceSelectRef = useRef(null);
  const vehicleSelectRef = useRef(null);
  const submitButtonRef = useRef(null);

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useVehicleTypeWithServicesQuery();

  const [transactionOne] = useTransactionOneMutation();
  const [transactionStartFromBooking] =
    useTransactionStartFromBookingMutation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isSuccess && data) {
      const serviceIds = customer.customerTransactions
        .filter(
          (transaction) =>
            transaction.vehicleNumber === vehicleData?.vehicleNumber &&
            transaction.service?.id
        )
        .map((transaction) => transaction.service.id);

      const uniqueServiceIds = [...new Set(serviceIds)];

      const vehicle = data.data.find((vehicle) => {
        return vehicle.services.some((service) =>
          uniqueServiceIds.includes(service._id)
        );
      });

      if (vehicle) {
        setSelectedVehicle(vehicle);
      }
    }
  }, [data, vehicleData, isSuccess, customer.customerTransactions]);

  useEffect(() => {
    if (selectedVehicle && serviceSelectRef.current) {
      serviceSelectRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedVehicle, vehicleData]);

  useEffect(() => {
    if (
      vehicleData.vehicleNumber &&
      vehicleData.vehicleColor &&
      vehicleData.model &&
      submitButtonRef.current
    ) {
      submitButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedService, vehicleData]);

  const handleColourPicker = () => {
    if (showColourPicker === true) {
      if (!newColor) return setShowColourPicker(false);
      setCustomCarColors((prev) => [
        ...prev,
        {
          colorName: newColor.hex.toUpperCase(),
          colorCode: newColor.hex,
        },
      ]);
      setShowColourPicker(false);
      newColor("");
    } else {
      setShowColourPicker(true);
    }
  };
  const handleRemoveAddOn = (index) => {
    setAddOnsList((prev) => {
      return prev.filter((addOn, i) => {
        return i !== index;
      });
    });
  };

  const onSubmit = async (data) => {
    if (!selectedService) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: "Please select a service",
      });
      return;
    }
    if (!selectedColor) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: "Please select a color",
      });
      return;
    }
    try {
      let res;
      if (locationState) {
        res = await transactionStartFromBooking({
          service: selectedService._id,
          transactionId: locationState.transaction,
          serviceRate: serviceCost,
          actualRate: selectedService.serviceRate,
          vehicleNumber: data.vehicleNumber,
          vehicleModel: data.vehicleModel,
          vehicleColor: selectedColor,
          customer: customer._id,
          addOns: addOnsList.length > 0 && addOns ? addOnsList : undefined,
          hour: new Date().getHours(),
          today: new Date().toISOString().slice(0, 10),
        });
      } else {
        res = await transactionOne({
          service: selectedService._id,
          serviceRate: serviceCost,
          actualRate: selectedService.serviceRate,
          vehicleNumber: data.vehicleNumber,
          vehicleModel: data.vehicleModel,
          vehicleColor: selectedColor,
          customer: customer._id,
          addOns: addOnsList.length > 0 && addOns ? addOnsList : undefined,
          hour: new Date().getHours(),
          today: new Date().toISOString().slice(0, 10),
        });
      }
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Transaction Initiated!",
          description: `Bill No: ${res.data.data.billNo}`,
          duration: 2000,
        });
        navigate("/carwash", { state: { tab: "queue" }, replace: true });
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

  const applicableTransactions = customer?.customerTransactions || [];

  if (isLoading || isFetching) {
    content = (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vehicle Type</CardTitle>
        </CardHeader>

        <CardContent>
          <Loader />
        </CardContent>
      </Card>
    );
  } else if (isSuccess) {
    if (!data) {
      content = (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6 text-sm text-center text-muted-foreground ">
              No Configuration <br />
              create in the settings page
            </div>
          </CardContent>
        </Card>
      );
    } else {
      content = (
        <Card className="mb-64">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg">Wash Selection</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div>
              <Label>
                Vehicles{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Select One)
                </span>
              </Label>
              <Separator className="mt-2" />
              <div
                // className="flex flex-wrap justify-between gap-2 my-6 sm:justify-evenly"
                className="grid grid-cols-3 gap-2 my-6 sm:gap-4"
                ref={vehicleSelectRef}
              >
                {data.data.map((vehicle) => {
                  return (
                    <div
                      key={vehicle._id}
                      className="flex flex-col items-center gap-3 text-xs transition-transform cursor-pointer text-muted-foreground hover:scale-105 hover:text-primary"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setSelectedService("");
                        // setSelectedColor("");
                        reset();
                      }}
                    >
                      <div
                        className="relative gap-2 px-4 py-2 duration-500 border rounded-lg shadow-lg animate-in fade-in"
                        // className="relative w-24 gap-2 px-4 py-2 duration-500 border rounded-lg shadow-lg sm:w-36 animate-in fade-in"
                      >
                        {selectedVehicle._id === vehicle._id && (
                          <Badge className="absolute top-0 right-0 p-1 rounded-full shadow-lg translate-x-1/4 -translate-y-1/4">
                            <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4 " />
                          </Badge>
                        )}
                        <img
                          src={vehicle.vehicleIcon}
                          loading="lazy"
                          alt="Vehicle Image"
                        />
                      </div>
                      <p>{vehicle.vehicleTypeName}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedVehicle && (
              <div>
                <Label>
                  Services{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (Select One)
                  </span>
                </Label>
                <Separator className="mt-2" />

                <div
                  // className="flex flex-wrap justify-between gap-2 my-6 sm:justify-evenly"
                  className="grid grid-cols-3 gap-5 my-6 sm:gap-6"
                  ref={serviceSelectRef}
                >
                  {selectedVehicle.services.map((service) => {
                    let washCount = service.streakApplicable.washCount;
                    let washStreak = findWashCountForCustomer(
                      applicableTransactions,
                      service._id
                    );

                    let washStreakApplicable =
                      service.streakApplicable.decision;

                    let isFree =
                      washStreak >= washCount && washStreakApplicable
                        ? true
                        : false;

                    return (
                      <div
                        key={service._id}
                        className="flex flex-col items-center gap-3 text-xs font-medium transition-transform cursor-pointer text-primary hover:scale-105 hover:text-primary"
                        onClick={() => {
                          setSelectedService(service);
                          setServiceCost(isFree ? 0 : service.serviceRate);
                        }}
                      >
                        <div
                          // className="relative w-24 px-2 py-6 text-center uppercase border rounded-lg shadow-lg sm:w-36"
                          className="relative w-full h-full px-2 py-6 text-sm text-center uppercase border rounded-lg shadow-lg sm:py-8"
                        >
                          {selectedService._id === service._id && (
                            <Badge className="absolute top-0 right-0 p-1 rounded-full shadow-lg translate-x-1/4 -translate-y-1/4">
                              <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4 " />
                            </Badge>
                          )}
                          {isFree && (
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs bg-primary-foreground normal-case text-destructive  border-dashed border-destructive   tracking-wider  shadow-lg absolute left-0 top-0 -translate-x-1/4 -translate-y-1/4 rotate-[-20deg]"
                            >
                              Free!!
                            </Badge>
                          )}

                          {service.serviceTypeName}
                        </div>
                        <p>Rs. {service.serviceRate}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {selectedService && (
              <>
                <form id="transaction-1" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center justify-between gap-4">
                    <Label>Add Ons</Label>
                    <Switch checked={addOns} onCheckedChange={setAddOns} />
                  </div>
                  {addOns && (
                    <div className="flex flex-col gap-2 pt-3 mt-4 border-t">
                      {addOnsList.map((addOn, index) => (
                        <div
                          key={addOn.id}
                          className="flex items-center justify-between"
                        >
                          <div className="text-xs font-medium text-muted-foreground">
                            {index + 1}. {addOn.name}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm font-semibold">
                              {addOn.price === 0
                                ? "Free"
                                : "Rs. " + addOn.price}
                            </div>
                            <X
                              className="w-4 h-4 transition-all cursor-pointer hover:scale-110 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveAddOn(index)}
                            />
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-between gap-4 mt-2">
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
                  <Separator className="mt-4 mb-2" />
                  <div className="grid gap-2 mt-6">
                    <Label>Vehicle Name</Label>
                    <Input
                      id="vehicleModel"
                      type="text"
                      defaultValue={vehicleData?.model}
                      autoComplete="off"
                      placeholder="Company/Model"
                      autoFocus={vehicleData.model ? false : true}
                      {...register("vehicleModel", {
                        required: "Vehicle name is required",
                        onChange: (e) => {
                          const words = e.target.value.split(" ");
                          const newWords = words.map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          );
                          const newValue = newWords.join(" ");
                          if (e.target.value !== newValue) {
                            e.target.value = newValue;
                          }
                        },
                      })}
                      className={
                        errors.vehicleModel ? "border-destructive" : ""
                      }
                    />
                  </div>
                  <div className="grid gap-2 mt-6">
                    <Label>Vehicle Number</Label>
                    <Input
                      id="vehicleNumber"
                      type="tel"
                      defaultValue={vehicleData?.vehicleNumber}
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Number Plate"
                      {...register("vehicleNumber", {
                        required: "Identification is required",
                      })}
                      className={
                        errors.vehicleNumber ? "border-destructive" : ""
                      }
                    />
                  </div>
                  <div className="grid gap-2 mt-6">
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
                            selectedColor.colorCode == color.colorCode
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
                      {customCarColors.map((color) => (
                        <div
                          key={color.colorCode}
                          className={cn(
                            "flex items-center gap-2  p-2 border-2 grayscale-0 rounded-lg  cursor-pointer hover:text-primary hover:scale-105 hover:grayscale-0 transition-all duration-300",
                            !selectedColor
                              ? ""
                              : selectedColor.colorCode == color.colorCode
                              ? "border-muted-foreground border-2 grayscale-0"
                              : "grayscale text-slate-400"
                          )}
                          onClick={() => {
                            selectedColor.colorCode == color.colorCode
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
                      {/* <Popover
                        open={showColourPicker}
                        onOpenChange={handleColourPicker}
                      >
                        <PopoverTrigger>
                          <div
                            className={cn(
                              "flex items-center gap-2  p-2 border-2 grayscale-0 rounded-lg  cursor-pointer hover:text-primary hover:scale-105 hover:grayscale-0 "
                            )}
                            onClick={() => {}}
                          >
                            <Pipette className="w-5 h-5 text-muted-foreground" />
                            <span className="text-xs">{"New Colour"}</span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-50" align="center">
                          <ChromePicker
                            color={newColor}
                            onChange={setNewColor}
                          />
                        </PopoverContent>
                      </Popover> */}
                    </div>
                  </div>
                </form>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end px-4 py-4 border-t sm:px-6">
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting
              </Button>
            ) : (
              <Button
                ref={submitButtonRef}
                type="submit"
                disabled={!selectedVehicle || !selectedService}
                form="transaction-1"
              >
                Submit <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      );
    }
  } else if (isError) {
    content = <ApiError error={error} />;
  }
  return content;
};

export default CarwashNewRecord;
