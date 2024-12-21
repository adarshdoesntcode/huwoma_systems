import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import {
  Check,
  ChevronLeft,
  Contact,
  Cross,
  Loader2,
  Trash,
  X,
} from "lucide-react";
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
import SubmitButton from "@/components/SubmitButton";
import NavBackButton from "@/components/NavBackButton";

function CarwashCheckout() {
  const [paymentMode, setPaymentMode] = useState("");
  const [addOns, setAddOns] = useState(false);
  const [newAddOn, setNewAddOn] = useState({
    name: "",
    price: "",
  });
  const [addOnsList, setAddOnsList] = useState([]);

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

  const transactionDetails = location.state?.transactionDetails;

  const { data, isLoading, isError, error, isFetching, isSuccess } =
    useGetCheckoutDetailsQuery({
      customerId: transactionDetails?.customer?._id,
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
    addOnTotal,
    grossAmt,
    discountAmt,
    netAmt;

  const handleRemoveAddOn = (index) => {
    setAddOnsList((prev) => {
      return prev.filter((addOn, i) => {
        return i !== index;
      });
    });
  };

  const onSubmit = async (data) => {
    try {
      const res = await transactionThree({
        transactionId: transactionDetails._id,
        serviceId: service._id,
        transactionStatus: "Completed",
        paymentStatus: "Paid",
        paymentMode: paymentMode._id,
        parkingIn:
          parkingEligible && parkingIncluded
            ? parkingStart.toISOString()
            : undefined,
        parkingOut: parkingEligible && parkingIncluded ? parkingEnd : undefined,
        parkingCost: Number(data.parkingCost) || undefined,
        // transactionTime: new Date().toISOString(),
        addOns: addOnsList.length > 0 ? addOnsList : undefined,
        grossAmount: grossAmt,
        discountAmount: Number(data.discountAmt) || 0,
        netAmount: netAmt,
        serviceCost: serviceCost,
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
          duration: 2000,
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
        : transactionDetails?.service?.id.serviceRate;

    parkingBuffer =
      transactionDetails?.service?.id?.includeParking.parkingBuffer;

    parkingEligible = timeDifference(serviceEnd, new Date(), parkingBuffer);
    parkingIncluded = transactionDetails?.service?.id?.includeParking.decision;
    parkingStart = new Date(
      new Date(serviceEnd).getTime() + parkingBuffer * 60 * 1000
    );

    parkingEnd = new Date().toISOString();
    parkingTime = getTimeDifference(parkingStart, parkingEnd);
    parkingCost = Number(watch("parkingCost")) || 0;
    addOnTotal = addOnsList.reduce((sum, addOn) => sum + addOn.price, 0);

    grossAmt =
      (Number(watch("parkingCost")) || 0) +
      (serviceCost || 0) +
      (addOns ? addOnTotal : 0);
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
                          {format(serviceStart, "d MMM, yy - h:mm a")}
                        </div>
                      </div>
                    )}
                    {serviceEnd && (
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-xs font-medium">
                          End Time
                        </div>
                        <div className="text-xs ">
                          {format(serviceEnd, "d MMM, yy - h:mm a")}
                        </div>
                      </div>
                    )}
                    {/* {transactionDetails?.service?.cost >= 0 && ( */}
                    <div className="flex items-center justify-between  ">
                      <div className="text-muted-foreground text-xs font-medium">
                        Cost
                      </div>
                      <div className="text-sm font-semibold">
                        {serviceCost === 0 ? "Free" : "Rs. " + serviceCost}
                      </div>
                    </div>
                    {/* )} */}
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
                              {format(parkingStart, "d MMM, yy - h:mm a")}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-xs font-medium">
                              End Time
                            </div>
                            <div className="text-xs ">
                              {format(parkingEnd, "d MMM, yy - h:mm a")}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-xs font-medium">
                              Total Time
                            </div>
                            <div className="text-sm font-semibold ">
                              {`${
                                parkingTime?.hours > 0
                                  ? `${parkingTime?.hours}h `
                                  : ""
                              } ${
                                parkingTime?.minutes > 0
                                  ? `${parkingTime?.minutes}m`
                                  : ""
                              }`}
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
                            <div className="flex items-center gap-6 sm:gap-2 w-full  sm:w-[180px] ">
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
                      </div>
                    </>
                  )}
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
                                {addOn.price === 0
                                  ? "Free"
                                  : "Rs. " + addOn.price}
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
                              if (parseFloat(value) > parseFloat(grossAmt)) {
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
              form="final-transaction"
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
    if (!transactionDetails) {
      navigate("/carwash", { state: { tab: "pickup" }, replace: true });
    }
    content = <ApiError error={error} />;
  }

  return content;
}

export default CarwashCheckout;
