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
import {
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Contact,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
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
  findWashCountForCustomer,
  generateBillNo,
  getOrdinal,
} from "@/lib/utils";
import { ResetIcon } from "@radix-ui/react-icons";
import SubmitButton from "@/components/SubmitButton";
import NavBackButton from "@/components/NavBackButton";
import { Image } from "@unpic/react";

function CarwashNewRecord() {
  const [customer, setCoustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState(false);
  const [findCustomer] = useFindCustomerMutation();
  const [createCutomer] = useCreateCutomerMutation();

  const locationState = useLocation().state || null;
  useEffect(() => {
    if (locationState?.customer) {
      setCoustomer(locationState.customer);
    }
  }, [locationState]);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (newCustomer) {
      try {
        const res = await createCutomer({
          customerContact: data.customerContact,
          customerName: data.customerName,
        });
        if (res.error) {
          throw new Error(res.error.data.message);
        }
        if (!res.error) {
          setCoustomer(res.data.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong!!",
          description: error.message,
        });
      }
    } else if (!newCustomer) {
      try {
        const res = await findCustomer({
          customerContact: data.customerContact,
        });
        if (res.error) {
          if (res.error.status === 404) {
            setNewCustomer(true);
          } else {
            throw new Error(res.error.data.message);
          }
        }
        if (!res.error) {
          setCoustomer(res.data.data);
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
    <div className="mx-auto grid w-full max-w-xl items-start gap-4 ">
      <NavBackButton buttonText={"Back"} navigateTo={-1} />

      {customer ? (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    <Contact />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-md">
                    {customer.customerName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {customer.customerContact}
                  </CardDescription>
                </div>
              </div>
              <div>
                {!locationState && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCoustomer(null);
                      reset();
                    }}
                  >
                    Reset <ResetIcon className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">New Wash</CardTitle>
            <CardDescription>Customer for the new wash record</CardDescription>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4"
              id="customer"
            >
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
                    required: "Number is required",
                    valueAsNumber: true,
                    validate: (value) =>
                      String(value).length === 10 || "Number must be 10 digits",
                  })}
                  className={errors.serviceRate ? "border-destructive" : ""}
                />
              </div>
              {newCustomer && (
                <div className="grid gap-2">
                  <Label>
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
                      required: "Name is required",
                      pattern: {
                        value: /^[a-zA-Z\s]*$/,
                        message: "Invalid Name",
                      },
                    })}
                    className={errors.customerName ? "border-destructive" : ""}
                  />
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
            <div className="flex w-full items-center justify-between gap-4">
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
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [serviceCost, setServiceCost] = useState("");
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

  const onSubmit = async (data) => {
    try {
      let res;
      if (locationState) {
        res = await transactionStartFromBooking({
          service: selectedService._id,
          transactionId: locationState.transaction,
          serviceRate: serviceCost,
          actualRate: selectedService.serviceRate,
          vehicleNumber: data.vehicleNumber,
          customer: customer._id,
          // serviceStart: new Date().toISOString(),
        });
      } else {
        res = await transactionOne({
          service: selectedService._id,
          serviceRate: serviceCost,
          actualRate: selectedService.serviceRate,
          vehicleNumber: data.vehicleNumber,
          customer: customer._id,
          // serviceStart: new Date().toISOString(),
          // clientDate: new Date().toISOString(),
        });
      }
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Transaction Initiated!",
          description: `Bill No: ${res.data.data.billNo}`,
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
            <div className="flex text-center  items-center justify-center text-sm text-muted-foreground py-6 ">
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
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div>
              <Label>
                Vehicles{" "}
                <span className="font-normal text-xs text-muted-foreground">
                  (Select One)
                </span>
              </Label>
              <Separator className="mt-2" />
              <div className="flex flex-wrap gap-2 justify-between sm:justify-evenly my-6">
                {data.data.map((vehicle) => {
                  return (
                    <div
                      key={vehicle._id}
                      className="flex flex-col  items-center gap-3 text-xs text-muted-foreground cursor-pointer hover:scale-105 transition-transform hover:text-primary"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setSelectedService("");
                      }}
                    >
                      <div className="w-24 sm:w-36 relative border  px-4 py-2 rounded-lg shadow-lg gap-2">
                        {selectedVehicle._id === vehicle._id && (
                          <Badge className="rounded-full p-1 shadow-lg absolute right-0 top-0 translate-x-1/4 -translate-y-1/4">
                            <CheckCheck className="w-3 sm:w-4 h-3 sm:h-4 " />
                          </Badge>
                        )}
                        <Image
                          src={vehicle.vehicleIcon}
                          aspectRatio={1.5 / 1}
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
                  <span className="font-normal text-xs text-muted-foreground">
                    (Select One)
                  </span>
                </Label>
                <Separator className="mt-2" />

                <div className="flex flex-wrap gap-2 justify-between sm:justify-evenly my-6">
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
                        className="flex flex-col  items-center gap-3 text-xs text-primary font-medium   cursor-pointer hover:scale-105 transition-transform hover:text-primary"
                        onClick={() => {
                          setSelectedService(service);
                          setServiceCost(isFree ? 0 : service.serviceRate);
                        }}
                      >
                        <div className="w-24 sm:w-36 relative border  px-2 py-6 uppercase text-center rounded-lg shadow-lg">
                          {selectedService._id === service._id && (
                            <Badge className="rounded-full p-1 shadow-lg absolute right-0 top-0 translate-x-1/4 -translate-y-1/4">
                              <CheckCheck className="w-3 sm:w-4 h-3 sm:h-4 " />
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
                          {/* {!isFree && washStreakApplicable && (
                            <Badge
                              variant="outline"
                              className=" text-xs bg-primary-foreground normal-case     tracking-wider  shadow-lg absolute left-0 top-0 -translate-x-1/4 -translate-y-1/4 "
                            >
                              {getOrdinal(washStreak + 1)}
                            </Badge>
                          )} */}
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
                  <Separator className="mb-2" />
                  <div className="grid gap-2 mt-6">
                    <Label>
                      Vehicle No.{" "}
                      <span className="font-normal text-xs text-muted-foreground">
                        (for your own convenience)
                      </span>
                    </Label>
                    <Input
                      id="vehicleNumber"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Vehicle Identification Number"
                      autoFocus
                      {...register("vehicleNumber", {
                        required: "Identification is required",
                      })}
                      className={
                        errors.vehicleNumber ? "border-destructive" : ""
                      }
                    />
                  </div>
                </form>
              </>
            )}
          </CardContent>
          <CardFooter className="border-t sm:px-6 px-4  py-4 flex justify-end">
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting
              </Button>
            ) : (
              <Button
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
