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
  CheckCircle,
  ChevronLeft,
  Contact,
  Cross,
  Hourglass,
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
import { Checkbox } from "@/components/ui/checkbox";
import { ResetIcon } from "@radix-ui/react-icons";
import { useRole } from "@/hooks/useRole";
import { ROLES_LIST } from "@/lib/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function CarwashCheckout() {
  const [paymentMode, setPaymentMode] = useState("");

  const [redeem, setRedeem] = useState(false);
  const [checkAll, setCheckAll] = useState(true);

  const [newAddOn, setNewAddOn] = useState({
    name: "",
    price: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const role = useRole();

  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
  });

  const transactionDetails = location.state?.transactionDetails;
  const [addOnsList, setAddOnsList] = useState(
    transactionDetails?.addOns || []
  );
  const [addOns, setAddOns] = useState(
    transactionDetails?.addOns.length > 0 ? true : false
  );

  const origin = location.state?.origin;

  const { data, isLoading, isError, error, isFetching, isSuccess } =
    useGetCheckoutDetailsQuery({
      customerId: transactionDetails?.customer?._id,
    });

  const [transactionThree] = useTransactionThreeMutation();

  const qrCodeRef = useRef(null);
  const serviceBoxRef = useRef(null);

  useEffect(() => {
    if (data) {
      const inspectionForm = data.data.inspectionTemplates.map((template) => ({
        categoryName: template.categoryName,
        items: template.items.map((item) => ({
          itemName: item,
          response: true,
        })),
      }));

      reset({
        inspections: inspectionForm,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (paymentMode && qrCodeRef.current) {
      qrCodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [paymentMode]);

  useEffect(() => {
    if (data && isSuccess && serviceBoxRef.current) {
      serviceBoxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [data, isSuccess]);

  const handleCheckAll = () => {
    reset({
      inspections: data.data.inspectionTemplates.map((template) => ({
        categoryName: template.categoryName,
        items: template.items.map((item) => ({
          itemName: item,
          response: true,
        })),
      })),
    });
    setCheckAll(true);
  };

  const handleReset = () => {
    reset({
      inspections: data.data.inspectionTemplates.map((template) => ({
        categoryName: template.categoryName,
        items: template.items.map((item) => ({
          itemName: item,
          response: false,
        })),
      })),
    });
    setCheckAll(false);
  };

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
    isFreeTransaction,
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
      let payload;
      if (origin === "queue") {
        payload = {
          transactionId: transactionDetails._id,
          serviceId: service._id,
          transactionStatus: "Completed",
          paymentStatus: paymentMode._id ? "Paid" : "Pending",
          paymentMode: paymentMode._id ?? undefined,
          parkingIn:
            parkingEligible && parkingIncluded
              ? parkingStart.toISOString()
              : undefined,
          parkingOut:
            parkingEligible && parkingIncluded ? parkingEnd : undefined,
          parkingCost: Number(data.parkingCost) || undefined,

          addOns: addOns === true ? addOnsList : [],
          grossAmount: grossAmt,
          discountAmount: Number(data.discountAmt) || 0,
          netAmount: netAmt,
          serviceCost: serviceCost,
          redeemed: serviceCost === 0 && paymentMode?._id ? true : false,
          washCount: washStreakApplicable ? washCount : undefined,
          origin: origin,
          inspections: data.inspections,
        };
      } else {
        payload = {
          transactionId: transactionDetails._id,
          serviceId: service._id,
          transactionStatus: "Completed",
          paymentStatus: paymentMode._id ? "Paid" : "Pending",
          paymentMode: paymentMode._id ?? undefined,
          parkingIn:
            parkingEligible && parkingIncluded
              ? parkingStart.toISOString()
              : undefined,
          parkingOut:
            parkingEligible && parkingIncluded ? parkingEnd : undefined,
          parkingCost: Number(data.parkingCost) || undefined,

          addOns: addOns === true ? addOnsList : [],
          grossAmount: grossAmt,
          discountAmount: Number(data.discountAmt) || 0,
          netAmount: netAmt,
          serviceCost: serviceCost,
          redeemed: serviceCost === 0 && paymentMode?._id ? true : false,

          washCount: washStreakApplicable ? washCount : undefined,
          origin: origin,
        };
      }
      const res = await transactionThree(payload);
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Transaction Complete!",
          description: `Payment ${paymentMode._id ? "Received" : "Pending"}`,
          duration: 2000,
        });
        navigate("/carwash", {
          // state: { tab: paymentMode._id ? "complete" : "pending" },
          state: { tab: "queue" },
          replace: true,
        });
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
      <div className="flex items-center justify-center flex-1 h-full ">
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
    serviceEnd = transactionDetails?.service?.end || new Date();
    isFreeTransaction =
      washStreak >= washCount && washStreakApplicable ? true : false;

    // if (isFreeTransaction === true && redeem === undefined) {
    //   setRedeem(true);
    // }

    serviceCost =
      washStreak >= washCount && washStreakApplicable && redeem
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
      <div className="grid items-start w-full max-w-xl gap-4 mx-auto ">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />

        <Card className="mb-20">
          <CardHeader
            className="p-4 transition-all cursor-pointer hover:bg-muted sm:p-6"
            onClick={() =>
              navigate(`/carwash/customers/${data.data.customer._id}`)
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback
                    className={data.data.hasRedeemed ? "bg-orange-100" : ""}
                  >
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
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {origin === "queue" && (
              <>
                <Separator />

                <Accordion type="single" collapsible className="mb-4">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Inspection</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-end">
                          {/* <Label className="text-base font-bold">
                          Inspection
                        </Label> */}
                          <div className="flex justify-end w-full">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                if (checkAll) {
                                  handleReset();
                                } else {
                                  handleCheckAll();
                                }
                              }}
                            >
                              {!checkAll ? (
                                <>
                                  Check All{" "}
                                  <CheckCircle className="w-4 h-4 ml-2" />
                                </>
                              ) : (
                                <>
                                  Reset <ResetIcon className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {data.data.inspectionTemplates.map(
                          (inspection, categoryIndex) => (
                            <div
                              key={inspection.categoryName}
                              className="space-y-2"
                            >
                              <div className="flex justify-between py-2 pl-4 pr-2 text-sm font-semibold rounded-md bg-muted">
                                <span>{inspection.categoryName}</span>
                                <Badge
                                  variant="outline"
                                  className="font-medium bg-background "
                                >
                                  {inspection.scope}
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                {inspection.items.map((item, itemIndex) => (
                                  <div
                                    key={`item${itemIndex}`}
                                    className="flex items-center ml-4"
                                  >
                                    <Checkbox
                                      checked={watch(
                                        `inspections.${categoryIndex}.items.${itemIndex}.response`
                                      )}
                                      {...register(
                                        `inspections.${categoryIndex}.items.${itemIndex}.response`
                                      )}
                                      onCheckedChange={(e) => {
                                        setValue(
                                          `inspections.${categoryIndex}.items.${itemIndex}.response`,
                                          e
                                        );
                                      }}
                                    />
                                    <span className="ml-2 text-sm">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}

                        <Separator className="mb-6" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            )}
            {service && (
              <div className="grid gap-2" ref={serviceBoxRef}>
                <Label>Service</Label>
                <div className="p-4 border rounded-md shadow-sm">
                  <div className="flex flex-col pb-2 mb-2 border-b">
                    <div className="flex items-center justify-between font-medium">
                      <div className="text-sm">{serviceName}</div>
                      <Badge>{getOrdinal(washStreak + 1)} Wash</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {vehicleName}

                      <div className="text-xs font-medium text-primary">
                        {transactionDetails?.vehicleModel}
                        {transactionDetails?.vehicleModel
                          ? " - "
                          : "Vehicle No - "}

                        {transactionDetails?.vehicleNumber}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {serviceStart && (
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-muted-foreground">
                          Start Time
                        </div>
                        <div className="text-xs ">
                          {format(serviceStart, "d MMM, yy - h:mm a")}
                        </div>
                      </div>
                    )}
                    {serviceEnd && (
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-muted-foreground">
                          End Time
                        </div>
                        <div className="text-xs ">
                          {format(serviceEnd, "d MMM, yy - h:mm a")}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between ">
                      <div className="text-xs font-medium text-muted-foreground">
                        Cost
                      </div>
                      <div className="text-sm font-semibold">
                        {serviceCost === 0 ? "Free" : "Rs. " + serviceCost}
                      </div>
                    </div>
                    {isFreeTransaction && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between overflow-hidden ">
                          <Label className="text-sm font-medium text-orange-500">
                            Redeem
                          </Label>

                          <Switch
                            checked={redeem}
                            onCheckedChange={setRedeem}
                            className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-orange-300"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <form
                  id="final-transaction"
                  className="grid gap-2 mt-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {parkingEligible && parkingIncluded && (
                    <>
                      <Label>Parking</Label>

                      <div className="p-4 border rounded-md shadow-sm">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-medium text-muted-foreground">
                              Start Time
                            </div>
                            <div className="text-xs ">
                              {format(parkingStart, "d MMM, yy - h:mm a")}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs font-medium text-muted-foreground">
                              End Time
                            </div>
                            <div className="text-xs ">
                              {format(parkingEnd, "d MMM, yy - h:mm a")}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-medium text-muted-foreground">
                              Total Time
                            </div>
                            <div className="text-sm font-semibold ">
                              {`
                              ${
                                parkingTime?.days > 0
                                  ? `${parkingTime?.days}d `
                                  : ""
                              }
                              ${
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
                          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
                  <div className="p-4 my-2 border rounded-md shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <Label>Add Ons</Label>
                      <Switch checked={addOns} onCheckedChange={setAddOns} />
                    </div>
                    {addOns && (
                      <div className="flex flex-col gap-2 pt-3 mt-4 border-t">
                        {addOnsList.map((addOn, index) => (
                          <div
                            key={index}
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
                            autoFocus={
                              transactionDetails?.addOns.length > 0
                                ? false
                                : true
                            }
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

                  {role !== ROLES_LIST.STAFF && (
                    <div className="p-4 my-2 border rounded-md shadow-sm">
                      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
                                if (!value) {
                                  return true;
                                }
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
                  )}

                  <div className="grid gap-2 px-2 mb-2">
                    <Label>Details</Label>
                    <div className="flex items-center justify-between ">
                      <div className="text-xs font-medium text-muted-foreground">
                        Gross Amt
                      </div>
                      <div className="text-xs font-medium">Rs. {grossAmt}</div>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="text-xs font-medium text-muted-foreground">
                        Discount Amt
                      </div>
                      <div className="text-xs font-medium">
                        Rs. {discountAmt}
                      </div>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="text-xs font-medium text-muted-foreground">
                        Net Amt
                      </div>
                      <div className="text-base font-semibold">
                        Rs. {netAmt}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md shadow-sm">
                    {/* <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
                          <SelectContent> */}
                    <div className="grid gap-4">
                      <Label>Payment Mode</Label>
                      <div className="flex flex-wrap gap-2 text-sm text-normal">
                        {paymentModes?.map((mode) => (
                          <Button
                            className="rounded-full"
                            variant={
                              mode._id === paymentMode?._id ? "" : "outline"
                            }
                            size="sm"
                            type="button"
                            onClick={() => {
                              if (mode._id === paymentMode?._id) {
                                setPaymentMode("");
                              } else {
                                setPaymentMode(mode);
                              }
                            }}
                            key={mode._id}
                          >
                            {mode.paymentModeName}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {/* </SelectContent>
                        </Select>
                      </div>
                    </div> */}
                    <div>
                      {paymentMode?.qrCodeData && (
                        <div className="mt-4 space-y-4" ref={qrCodeRef}>
                          <Label>Qr Code</Label>
                          <div className="flex flex-col items-center justify-center gap-4 ">
                            <div className="p-4 border rounded-md">
                              <QRCode
                                value={paymentMode.qrCodeData}
                                size={220}
                              />
                            </div>
                            <p className="font-medium uppercase text-muted-foreground">
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
          <CardFooter className="flex justify-end p-4 sm:p-6">
            <SubmitButton
              condition={isSubmitting}
              loadingText="Receiving"
              type="submit"
              form="final-transaction"
              buttonText={
                !paymentMode ? (
                  <>
                    Payment Pending <Hourglass className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Payment Received <Check className="w-4 h-4 ml-2" />
                  </>
                )
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
