import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ChevronLeft, Contact } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useGetCheckoutDetailsQuery,
  useTransactionThreeMutation,
} from "./carwashApiSlice";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApiError from "@/components/error/ApiError";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  findWashCount,
  getOrdinal,
  getTimeDifference,
  timeDifference,
} from "@/lib/utils";

function CarwashCheckout() {
  const [paymentMode, setPaymentMode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
  });
  const { transactionDetails } = location.state;
  const { data, isLoading, isError, error, isFetching, isSuccess } =
    useGetCheckoutDetailsQuery({
      customerId: transactionDetails.customer._id,
    });
  const [transactionThree] = useTransactionThreeMutation();

  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (paymentMode && qrCodeRef.current) {
      qrCodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [paymentMode]);

  let applicableTransactions,
    paymentModes,
    service,
    serviceName,
    washCount,
    washStreak,
    washStreakApplicable,
    vehicleName,
    vehicleNumber,
    serviceStart,
    serviceEnd,
    serviceCost,
    parkingBuffer,
    parkingEligible,
    parkingIncluded,
    parkingStart,
    parkingEnd,
    parkingTime,
    parkingCost,
    grossAmt,
    discountAmt,
    netAmt;

  const onSubmit = async (data) => {
    try {
      const res = await transactionThree({
        transactionId: transactionDetails._id,
        serviceId: service._id,
        transactionStatus: "Completed",
        paymentStatus: "Paid",
        paymentMode: paymentMode._id,
        parkingIn:
          parkingEligible && parkingIncluded ? parkingStart : undefined,
        parkingOut: parkingEligible && parkingIncluded ? parkingEnd : undefined,
        parkingCost: Number(data.parkingCost) || undefined,
        transactionTime: new Date(),
        grossAmount: grossAmt,
        discountAmount: Number(data.discountAmt) || 0,
        netAmount: netAmt,
        redeemed: serviceCost > 0 ? false : true,
        washCount: washStreakApplicable ? washCount : undefined,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Transaction Complete!",
          description: `Payment Received!`,
        });
        navigate("/carwash", { state: { tab: "complete" }, replace: true });
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
      <div className="flex-1 h-full flex items-center justify-center ">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    applicableTransactions = data?.data?.customer?.customerTransactions || [];
    paymentModes = data?.data?.paymentModes || [];
    service = transactionDetails?.service?.id;
    serviceName = transactionDetails?.service?.id?.serviceTypeName;
    washCount = transactionDetails?.service?.id?.streakApplicable.washCount;
    washStreak = findWashCount(applicableTransactions, service._id);
    washStreakApplicable =
      transactionDetails?.service?.id?.streakApplicable.decision;
    vehicleName =
      transactionDetails?.service?.id?.serviceVehicle?.vehicleTypeName;
    vehicleNumber = transactionDetails?.vehicleNumber;
    serviceStart = transactionDetails?.service?.start;
    serviceEnd = transactionDetails?.service?.end;
    serviceCost =
      washStreak >= washCount && washStreakApplicable
        ? 0
        : transactionDetails?.service?.cost;

    parkingBuffer =
      transactionDetails?.service?.id?.includeParking.parkingBuffer;
    parkingEligible = timeDifference(serviceEnd, new Date(), parkingBuffer);
    parkingIncluded = transactionDetails?.service?.id?.includeParking.decision;
    parkingStart = new Date(
      new Date(serviceEnd).getTime() + parkingBuffer * 60 * 1000
    );
    parkingEnd = new Date();
    parkingTime = getTimeDifference(parkingStart, parkingEnd);
    parkingCost = Number(watch("parkingCost")) || 0;
    grossAmt = (Number(watch("parkingCost")) || 0) + (serviceCost || 0);
    discountAmt = Number(watch("discountAmt")) || 0;

    netAmt = grossAmt - discountAmt;

    content = (
      <div className="mx-auto grid w-full max-w-xl items-start gap-4 ">
        <div className="text-lg font-semibold tracking-tight flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          Car Wash Checkout
        </div>

        <Card className="mb-20">
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
                    {data.data.customer.customerName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {data.data.customer.customerContact}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {service && (
              <div className="grid gap-2">
                <Label>Service</Label>
                <div className="border p-4 rounded-md shadow-sm">
                  <div className="flex flex-col border-b pb-2 mb-2">
                    <div className="font-medium flex items-center justify-between">
                      <div className="text-sm">{serviceName}</div>
                      <Badge>{getOrdinal(washStreak + 1)} Wash</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {vehicleName}
                      <div className="font-medium text-primary">
                        Vehicle No: {vehicleNumber}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-col mt-1">
                    {serviceStart && (
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-xs font-medium">
                          Start Time
                        </div>
                        <div className="text-xs ">
                          {format(serviceStart, "dd/MM/yyyy hh:mm a")}
                        </div>
                      </div>
                    )}
                    {serviceEnd && (
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-xs font-medium">
                          End Time
                        </div>
                        <div className="text-xs ">
                          {format(serviceEnd, "dd/MM/yyyy hh:mm a")}
                        </div>
                      </div>
                    )}
                    {transactionDetails?.service?.cost && (
                      <div className="flex items-center justify-between  ">
                        <div className="text-muted-foreground text-xs font-medium">
                          Cost
                        </div>
                        <div className="text-sm font-semibold">
                          {serviceCost === 0 ? "Free!!" : "Rs. " + serviceCost}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <form
                  id="final-transaction"
                  className="grid mt-2 gap-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {parkingEligible && parkingIncluded && (
                    <>
                      <Label>Parking</Label>

                      <div className="border p-4 rounded-md shadow-sm">
                        <div className="flex gap-1 flex-col">
                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-xs font-medium">
                              Start Time
                            </div>
                            <div className="text-xs ">
                              {format(parkingStart, "dd/MM/yyyy hh:mm a")}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-xs font-medium">
                              End Time
                            </div>
                            <div className="text-xs ">
                              {format(parkingEnd, "dd/MM/yyyy h:mm a")}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-xs font-medium">
                              Total Time
                            </div>
                            <div className="text-sm font-semibold ">
                              {`${parkingTime?.hours}h ${parkingTime?.minutes}m`}
                            </div>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between">
                            <Label>
                              {errors.parkingCost ? (
                                <span className="text-destructive">
                                  {errors.parkingCost.message}
                                </span>
                              ) : (
                                <span>Parking Cost</span>
                              )}
                            </Label>
                            <div className="flex items-center gap-2">
                              <Label>Rs.</Label>

                              <Input
                                onWheel={(e) => e.target.blur()}
                                id="parkingCost"
                                type="number"
                                placeholder="0"
                                {...register("parkingCost", {
                                  required: "Cost is required",
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
                      </div>
                    </>
                  )}

                  <div className="border p-4 rounded-md shadow-sm my-2">
                    <div className="flex items-center justify-between">
                      <Label>
                        {errors.discountAmt ? (
                          <span className="text-destructive">
                            {errors.discountAmt.message}
                          </span>
                        ) : (
                          <span>Discount</span>
                        )}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Label>Rs.</Label>

                        <Input
                          onWheel={(e) => e.target.blur()}
                          id="discountAmt"
                          type="number"
                          placeholder="0"
                          {...register("discountAmt", {
                            validate: (value) => {
                              if (parseFloat(value) > parseFloat(grossAmt)) {
                                return "Discount amount greater than gross amount";
                              }
                              return true;
                            },
                          })}
                          className={
                            errors.discountAmt
                              ? "border-destructive text-end"
                              : "text-end"
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2 mb-2 px-2">
                    <Label>Details</Label>
                    <div className="flex items-center justify-between  ">
                      <div className="text-muted-foreground text-xs font-medium">
                        Gross Amt
                      </div>
                      <div className="text-xs font-medium">Rs. {grossAmt}</div>
                    </div>
                    <div className="flex items-center justify-between  ">
                      <div className="text-muted-foreground text-xs font-medium">
                        Discount Amt
                      </div>
                      <div className="text-xs font-medium">
                        Rs. {discountAmt}
                      </div>
                    </div>
                    <div className="flex items-center justify-between  ">
                      <div className="text-muted-foreground text-xs font-medium">
                        Net Amt
                      </div>
                      <div className="text-base font-semibold">
                        Rs. {netAmt}
                      </div>
                    </div>
                  </div>

                  <div className="border p-4 rounded-md shadow-sm">
                    <div className="flex items-center justify-between">
                      <Label>Payment Mode</Label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={paymentMode._id}
                          onValueChange={(e) => {
                            setPaymentMode(
                              paymentModes?.find((mode) => e === mode._id) || ""
                            );
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Mode" />
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
                    <div>
                      {paymentMode?.qrCodeData && (
                        <div className="space-y-4 mt-4" ref={qrCodeRef}>
                          <Label>Qr Code</Label>
                          <div className="flex items-center flex-col gap-4 justify-center ">
                            <div className="p-4 border rounded-md">
                              <QRCode value={paymentMode.qrCodeData} />
                            </div>
                            <p className="text-muted-foreground uppercase font-medium">
                              {paymentMode?.paymentModeName}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 sm:p-6 flex justify-end">
            <Button
              type="submit"
              form="final-transaction"
              disabled={!paymentMode}
            >
              Payment Received <Check className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

export default CarwashCheckout;
