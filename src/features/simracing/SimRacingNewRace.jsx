import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCheck, ChevronRight, Contact, Loader2 } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ResetIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import {
  useCreateRacerMutation,
  useFindRacerMutation,
  useGetAvailableRigsQuery,
  useStartRaceMutation,
} from "./simRacingApiSlice";

function SimRacingNewRace() {
  const [customer, setCoustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState(false);
  const [findRacer] = useFindRacerMutation();
  const [createRacer] = useCreateRacerMutation();

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
        const res = await createRacer({
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
        const res = await findRacer({
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
            <CardTitle className="text-xl sm:text-2xl">New Race</CardTitle>
            <CardDescription>Customer for the new race record</CardDescription>
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
                  id="serviceRate"
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
        <RigSelect customer={customer} locationState={locationState} />
      )}
    </div>
  );
}

const RigSelect = ({ customer, locationState }) => {
  const [selectedRig, setSelectedRig] = useState("");

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useGetAvailableRigsQuery();

  const [startRace] = useStartRaceMutation();
  // const [transactionStartFromBooking] =
  //   useTransactionStartFromBookingMutation();
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
        // res = await transactionStartFromBooking({
        //   service: selectedService._id,
        //   transactionId: locationState.transaction,
        //   serviceRate: serviceCost,
        //   actualRate: selectedService.serviceRate,
        //   vehicleNumber: data.vehicleNumber,
        //   customer: customer._id,
        //   serviceStart: new Date().toISOString(),
        // });
        return;
      } else {
        res = await startRace({
          rig: selectedRig._id,
          customer: customer._id,
        });
      }
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Race Started!",
          description: `Bill No: ${res.data.data.billNo}`,
        });
        navigate("/simracing", { state: { tab: "active" }, replace: true });
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

  if (isLoading || isFetching) {
    content = (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rig Selection</CardTitle>
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
            <CardTitle className="text-lg">Rig Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex text-center  items-center justify-center text-sm text-muted-foreground py-6 ">
              No Available Rigs
            </div>
          </CardContent>
        </Card>
      );
    } else {
      content = (
        <Card className="mb-64">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg">Rig Selection</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <form id="rig-form" onSubmit={handleSubmit(onSubmit)}>
              <Label>
                Rigs{" "}
                <span className="font-normal text-xs text-muted-foreground">
                  (Select One)
                </span>
              </Label>
              <Separator className="mt-2" />
              <div className="flex flex-wrap gap-2 justify-evenly my-6">
                {data.data.map((rig) => {
                  return (
                    <div
                      key={rig._id}
                      className="flex flex-col  items-center gap-3 text-xs text-muted-foreground cursor-pointer hover:scale-105 transition-transform hover:text-primary"
                      onClick={() => {
                        setSelectedRig(rig);
                      }}
                    >
                      <div className="w-32 sm:w-44 relative border  p-4 rounded-lg shadow-lg gap-2">
                        {selectedRig._id === rig._id && (
                          <Badge className="rounded-full p-1 shadow-lg absolute right-0 top-0 translate-x-1/4 -translate-y-1/4">
                            <CheckCheck className="w-3 sm:w-4 h-3 sm:h-4 " />
                          </Badge>
                        )}
                        <img src={"/rig.webp"} />
                      </div>
                      <p className="font-medium text-sm">{rig.rigName}</p>
                    </div>
                  );
                })}
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t sm:px-6 px-4  py-4 flex justify-end">
            <SubmitButton
              condition={isSubmitting}
              loadingText="Submitting"
              type="submit"
              disabled={!selectedRig}
              form="rig-form"
              buttonText={
                <>
                  Submit <ChevronRight className="w-4 h-4 ml-2" />
                </>
              }
            />
          </CardFooter>
        </Card>
      );
    }
  } else if (isError) {
    content = <ApiError error={error} />;
  }
  return content;
};

export default SimRacingNewRace;
