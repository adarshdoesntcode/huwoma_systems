import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Contact } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
import { getOrdinal, getTimeDifference } from "@/lib/utils";
import SubmitButton from "@/components/SubmitButton";
import NavBackButton from "@/components/NavBackButton";

import {
  useGetSimracingCheckoutDetailsQuery,
  useSimracingCheckoutMutation,
} from "./simRacingApiSlice";

function SimRacingCheckout() {
  const [paymentMode, setPaymentMode] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
  });

  const { data, isLoading, isError, error, isFetching, isSuccess } =
    useGetSimracingCheckoutDetailsQuery(id);

  const [simracingCheckout] = useSimracingCheckoutMutation();

  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (paymentMode && qrCodeRef.current) {
      qrCodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [paymentMode]);

  let transactionDetails,
    paymentModes,
    customer,
    raceStart,
    raceEnd,
    raceTime,
    raceCost,
    grossAmt,
    discountAmt,
    netAmt;

  const onSubmit = async (data) => {
    try {
      const res = await simracingCheckout({
        transactionId: transactionDetails._id,
        paymentMode: paymentMode._id,
        raceCost: Number(data.raceCost) || 0,
        grossAmount: grossAmt,
        discountAmount: Number(data.discountAmt) || 0,
        netAmount: netAmt,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Transaction Complete!",
          description: `Payment Received!`,
        });
        navigate("/simracing", { state: { tab: "finish" }, replace: true });
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
    transactionDetails = data?.data?.transaction || {};
    customer = transactionDetails.customer;
    paymentModes = data?.data?.paymentModes || [];

    raceStart = transactionDetails?.start;

    raceEnd = new Date().toISOString();
    raceTime = getTimeDifference(raceStart, raceEnd);
    raceCost = Number(watch("raceCost")) || 0;
    grossAmt = raceCost;
    discountAmt = Number(watch("discountAmt")) || 0;

    netAmt = grossAmt - discountAmt;

    content = (
      <div className="mx-auto grid w-full max-w-xl items-start gap-4 ">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />

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
                    {customer.customerName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {customer.customerContact}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {transactionDetails && (
              <div className="grid gap-2">
                <form
                  id="simracing-checkout"
                  className="grid mt-2 gap-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="border p-4 rounded-md shadow-sm">
                    <div className="flex gap-1 flex-col">
                      <div className="font-medium flex items-center justify-between">
                        <div className="text-sm">
                          {transactionDetails?.rig?.rigName}
                        </div>
                        <Badge>
                          {getOrdinal(customer.customerTransactions.length + 1)}{" "}
                          Race
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-xs font-medium">
                          Start Time
                        </div>
                        <div className="text-xs ">
                          {format(raceStart, "d MMM, yy - h:mm a")}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-xs font-medium">
                          End Time
                        </div>
                        <div className="text-xs ">
                          {format(raceEnd, "d MMM, yy - h:mm a")}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-xs font-medium">
                          Total Time
                        </div>
                        <div className="text-sm font-semibold ">
                          {`${
                            raceTime?.hours > 0 ? `${raceTime?.hours}h ` : ""
                          } ${
                            raceTime?.minutes > 0 ? `${raceTime?.minutes}m` : ""
                          }`}
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex sm:flex-row flex-col items-start gap-4 sm:items-center  justify-between">
                        <Label>
                          {errors.raceCost ? (
                            <span className="text-destructive">
                              {errors.raceCost.message}
                            </span>
                          ) : (
                            <span>Cost</span>
                          )}
                        </Label>
                        <div className="flex items-center gap-6 sm:gap-2 w-full  sm:w-[180px] ">
                          <Label>Rs.</Label>

                          <Input
                            onWheel={(e) => e.target.blur()}
                            id="raceCost-Checkout"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="0"
                            autoFocus
                            {...register("raceCost", {
                              required: "Cost is required",
                              validate: (value) => {
                                const regex = /^\d+$/;
                                return (
                                  regex.test(value) || "Not a valid amount"
                                );
                              },
                            })}
                            className={
                              errors.raceCost
                                ? "border-destructive text-end"
                                : "text-end"
                            }
                          />
                        </div>
                      </div>
                    </div>
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
                              if (
                                value &&
                                parseFloat(value) > parseFloat(grossAmt)
                              ) {
                                return "Discount amount greater than gross amount";
                              }
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
            <SubmitButton
              condition={isSubmitting}
              loadingText="Receiving"
              type="submit"
              form="simracing-checkout"
              disabled={!paymentMode}
              buttonText={
                <>
                  Payment Received <Check className="w-4 h-4 ml-2" />
                </>
              }
            />
          </CardFooter>
        </Card>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

export default SimRacingCheckout;
