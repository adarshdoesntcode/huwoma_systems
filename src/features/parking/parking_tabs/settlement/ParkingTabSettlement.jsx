import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CheckCheck, Contact } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/Loader";

import ApiError from "@/components/error/ApiError";
import { useForm } from "react-hook-form";

import QRCode from "react-qr-code";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import SubmitButton from "@/components/SubmitButton";
import NavBackButton from "@/components/NavBackButton";
import { useRole } from "@/hooks/useRole";
import {
  useGetParkingSettlementDetailsQuery,
  useParkingSettlementMutation,
} from "../../parkingApiSlice";
import { Button } from "@/components/ui/button";

function ParkingTabSettlement() {
  const [paymentMode, setPaymentMode] = useState("");
  const [transactionsForSettlement, setTransactionsForSettlement] = useState(
    []
  );

  const navigate = useNavigate();
  const role = useRole();
  const { id } = useParams();

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();

  const { data, isLoading, isError, error, isFetching, isSuccess, refetch } =
    useGetParkingSettlementDetailsQuery(id);
  const [parkingSettlement] = useParkingSettlementMutation();

  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (paymentMode && qrCodeRef.current) {
      qrCodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [paymentMode]);

  useEffect(() => {
    setTransactionsForSettlement(
      data?.data?.parkingTab?.parkingTransactions || []
    );
  }, [data]);

  let tab,
    tabbedtransactions,
    customerName,
    customerContact,
    paymentModes,
    grossAmt,
    discountAmt,
    netAmt;

  const onSubmit = async () => {
    try {
      const res = await parkingSettlement({
        tabId: tab._id,
        paymentMode: paymentMode._id,
        transactionsForSettlement: transactionsForSettlement.map((t) => t._id),
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Tab Settled!",
          description: `Payment Received!`,
          duration: 2000,
        });
        navigate("/parking", { state: { tab: "finish" }, replace: true });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  const handleSelectChange = (tran) => {
    if (transactionsForSettlement.map((t) => t._id).includes(tran._id)) {
      setTransactionsForSettlement(
        transactionsForSettlement.filter(
          (transaction) => transaction._id !== tran._id
        )
      );
    } else {
      setTransactionsForSettlement([...transactionsForSettlement, tran]);
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
    tab = data?.data?.parkingTab;
    tabbedtransactions = data?.data?.parkingTab?.parkingTransactions || [];
    netAmt = transactionsForSettlement?.reduce(
      (total, transaction) => total + transaction.netAmount,
      0
    );
    discountAmt = transactionsForSettlement?.reduce(
      (total, transaction) => total + transaction.discountAmount,
      0
    );
    grossAmt = transactionsForSettlement?.reduce(
      (total, transaction) => total + transaction.grossAmount,
      0
    );
    paymentModes = data?.data?.paymentModes || [];
    customerName = data?.data?.parkingTab?.tabOwnerName;
    customerContact = data?.data?.parkingTab?.tabOwnerContact;
    content = (
      <div className="grid items-start w-full max-w-xl gap-4 mx-auto ">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />

        <Card className="mb-20">
          <CardHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    <Contact />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-md">{customerName}</CardTitle>
                  <CardDescription className="text-xs">
                    {customerContact}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt sm:p-6 sm:pt-4">
            {tabbedtransactions && (
              <div className="grid gap-2">
                <form
                  id="parking-settlement-form"
                  className="grid gap-2 mt-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Label className="mb-2">
                    Pending Transactions {`(${tabbedtransactions.length})`}
                  </Label>
                  <div className="overflow-scroll max-h-[400px]">
                    <div className="grid gap-3 p-4">
                      {tabbedtransactions.map((transaction) => (
                        <div
                          key={transaction._id}
                          className="relative flex items-start justify-start gap-2 p-4 transition-all border rounded-lg shadow-sm cursor-pointer hover:border-primary"
                          onClick={() => handleSelectChange(transaction)}
                        >
                          {transactionsForSettlement
                            ?.map((t) => t._id)
                            .includes(transaction._id) && (
                            <Badge className="absolute top-0 right-0 p-1 rounded-full shadow-lg z-4 translate-x-1/4 -translate-y-1/4">
                              <CheckCheck className="w-3 h-3" />
                            </Badge>
                          )}
                          <div className="flex flex-wrap items-center justify-between w-full gap-2">
                            <div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  {transaction.vehicle.vehicleTypeName}
                                </div>
                                <div className="mb-1 text-sm font-semibold">
                                  Vehicle No: {transaction.vehicleNumber}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {format(transaction.start, "MMM d, hh:mm a")}{" "}
                                  - {format(transaction.end, "MMM d, hh:mm a")}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm font-semibold">
                              Rs. {transaction.netAmount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-2" />
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
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
              form="parking-settlement-form"
              disabled={!paymentMode || transactionsForSettlement.length === 0}
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
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default ParkingTabSettlement;
