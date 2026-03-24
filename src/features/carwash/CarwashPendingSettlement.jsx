import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import QRCode from "react-qr-code";
import {
  Check,
  CheckCheck,
  Contact,
  Edit,
  Eye,
  ListCollapse,
  Undo2,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/SubmitButton";
import NavBackButton from "@/components/NavBackButton";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { toast } from "@/hooks/use-toast";

import {
  useGetCarwashTransactionsQuery,
  useGetCheckoutDetailsQuery,
  useSettlePendingTransactionsMutation,
} from "./carwashApiSlice";
import ConfirmRollbackFromComplete from "./transaction_mutation/ConfirmRollbackFromComplete";
import CarwashTransactionDetails from "./CarwashTransactionDetails";
import EditCarwashTransaction from "./transaction_mutation/EditCarwashTransaction";

const groupPendingTransactions = (transactions = []) => {
  const grouped = new Map();

  transactions.forEach((transaction) => {
    const fallbackKey = `${transaction?.customer?.customerContact || "N/A"}-${transaction?.customer?.customerName || "Unknown Customer"}`;
    const key = transaction?.customer?._id || fallbackKey;

    const existing = grouped.get(key);
    const transactionTime = new Date(
      transaction?.transactionTime || transaction?.createdAt || new Date(),
    );

    if (!existing) {
      grouped.set(key, {
        customerId: transaction?.customer?._id || null,
        key,
        customerName: transaction?.customer?.customerName || "Unknown",
        customerContact: transaction?.customer?.customerContact || "-",
        transactions: [transaction],
        totalNetAmount: Number(transaction?.netAmount) || 0,
        totalGrossAmount: Number(transaction?.grossAmount) || 0,
        totalDiscountAmount: Number(transaction?.discountAmount) || 0,
        latestTransactionTime: transactionTime,
      });
      return;
    }

    existing.transactions.push(transaction);
    existing.totalNetAmount += Number(transaction?.netAmount) || 0;
    existing.totalGrossAmount += Number(transaction?.grossAmount) || 0;
    existing.totalDiscountAmount += Number(transaction?.discountAmount) || 0;
    if (transactionTime > existing.latestTransactionTime) {
      existing.latestTransactionTime = transactionTime;
    }
  });

  return Array.from(grouped.values())
    .map((group) => ({
      ...group,
      transactions: group.transactions.sort(
        (a, b) =>
          new Date(b?.transactionTime || b?.createdAt) -
          new Date(a?.transactionTime || a?.createdAt),
      ),
    }))
    .sort((a, b) => b.latestTransactionTime - a.latestTransactionTime);
};

function CarwashPendingSettlement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId } = useParams();

  const seededCustomerGroup = location.state?.customerGroup || null;

  const [selectedTransactionIds, setSelectedTransactionIds] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [isSettling, setIsSettling] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showRollbackFromComplete, setShowRollbackFromComplete] =
    useState(false);
  const [rollBackId, setRollBackId] = useState(null);

  const [settlePendingTransactions] = useSettlePendingTransactionsMutation();
  const qrCodeRef = useRef(null);

  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetCarwashTransactionsQuery(undefined, {
      pollingInterval: 600000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    });

  const pendingPaymentTransactions = useMemo(() => {
    if (!data) return seededCustomerGroup?.transactions || [];

    return (data?.data?.transactions || [])
      .filter(
        (transaction) =>
          transaction.transactionStatus === "Completed" &&
          transaction.paymentStatus === "Pending",
      )
      .sort(
        (a, b) =>
          new Date(b.transactionTime || b.createdAt) -
          new Date(a.transactionTime || a.createdAt),
      );
  }, [data, seededCustomerGroup]);

  const customerGroups = useMemo(
    () => groupPendingTransactions(pendingPaymentTransactions),
    [pendingPaymentTransactions],
  );

  const selectedCustomerGroup = useMemo(() => {
    const fromLatestData = customerGroups.find(
      (customer) =>
        customer.customerId === customerId || customer.key === customerId,
    );

    if (fromLatestData) return fromLatestData;

    // Use router-seeded data only before the live query resolves (or on fetch failure).
    // Once live data is available, avoid falling back to stale seeded state.
    const canUseSeededFallback = !data;

    if (
      canUseSeededFallback &&
      seededCustomerGroup &&
      (seededCustomerGroup.customerId === customerId ||
        seededCustomerGroup.key === customerId)
    ) {
      return seededCustomerGroup;
    }

    return null;
  }, [customerGroups, customerId, seededCustomerGroup, data]);

  const selectedTransactions = useMemo(() => {
    if (!selectedCustomerGroup) return [];

    const selectedIds = new Set(selectedTransactionIds);
    return selectedCustomerGroup.transactions.filter((transaction) =>
      selectedIds.has(transaction._id),
    );
  }, [selectedCustomerGroup, selectedTransactionIds]);

  const selectedTotals = useMemo(() => {
    return selectedTransactions.reduce(
      (acc, transaction) => {
        acc.gross += Number(transaction?.grossAmount) || 0;
        acc.discount += Number(transaction?.discountAmount) || 0;
        acc.net += Number(transaction?.netAmount) || 0;
        return acc;
      },
      { gross: 0, discount: 0, net: 0 },
    );
  }, [selectedTransactions]);

  const {
    data: checkoutData,
    isFetching: isFetchingCheckoutData,
    isSuccess: isCheckoutDataSuccess,
  } = useGetCheckoutDetailsQuery(
    { customerId: selectedCustomerGroup?.customerId },
    { skip: !selectedCustomerGroup?.customerId },
  );

  useEffect(() => {
    if (selectedCustomerGroup) {
      setSelectedTransactionIds(
        selectedCustomerGroup.transactions.map(
          (transaction) => transaction._id,
        ),
      );
      return;
    }
    setSelectedTransactionIds([]);
  }, [selectedCustomerGroup]);

  useEffect(() => {
    if (paymentMode && qrCodeRef.current) {
      qrCodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [paymentMode]);

  const handleClosePage = () => {
    navigate("/carwash", { state: { tab: "pending" }, replace: true });
  };

  const handleToggleTransaction = (transactionId) => {
    setSelectedTransactionIds((prev) => {
      if (prev.includes(transactionId)) {
        return prev.filter((id) => id !== transactionId);
      }
      return [...prev, transactionId];
    });
  };

  const handleSettleAll = async () => {
    try {
      if (!selectedCustomerGroup || !paymentMode?._id) return;
      const transactionIds = selectedTransactions.map(
        (transaction) => transaction._id,
      );

      if (transactionIds.length === 0) {
        toast({
          variant: "destructive",
          title: "No pending transactions",
        });
        return;
      }

      setIsSettling(true);
      const res = await settlePendingTransactions({
        transactionIds,
        paymentMode: paymentMode._id,
      });

      if (res.error) {
        throw new Error(res.error.data.message);
      }

      const modifiedCount = res?.data?.data?.modifiedCount || 0;

      toast({
        title: "Transactions settled",
        description: `Payment received for ${modifiedCount} transaction${modifiedCount > 1 ? "s" : ""}`,
        duration: 2000,
      });

      navigate("/carwash", { state: { tab: "pending" }, replace: true });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: err.message,
      });
    } finally {
      setIsSettling(false);
    }
  };

  const paymentModes = checkoutData?.data?.paymentModes || [];
  const isTransactionsLoading = isLoading || isFetching;
  const isCheckoutDetailsLoading =
    Boolean(selectedCustomerGroup?.customerId) && isFetchingCheckoutData;

  if (isTransactionsLoading || isCheckoutDetailsLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
        <Loader />
      </div>
    );
  }

  if (isError && !seededCustomerGroup) {
    return <ApiError error={error} refetch={refetch} />;
  }

  if (!selectedCustomerGroup) {
    return (
      <div className="grid items-start w-full max-w-3xl gap-4 mx-auto">
        <NavBackButton buttonText="Back" navigateTo={-1} />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Settlement</CardTitle>
            <CardDescription>
              No pending transactions found for this customer.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <Button variant="secondary" onClick={handleClosePage}>
              Close
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid items-start w-full max-w-4xl gap-4 mx-auto">
      <NavBackButton buttonText="Back" navigateTo={-1} />

      <Card className="mb-20">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
          <CardTitle className="text-lg">Customer Settlement</CardTitle>
          <CardDescription>
            Settle all pending transactions for this customer.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 p-4 pt-2 sm:p-6 sm:pt-2">
          <div className="p-4 border rounded-md shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback>
                  <Contact />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">
                  {selectedCustomerGroup.customerName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedCustomerGroup.customerContact}
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="grid gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Pending Transactions (Selected)
                </span>
                <span className="font-medium">
                  {selectedTransactions.length}/
                  {selectedCustomerGroup.transactions.length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>
              Pending Transactions ({selectedTransactions.length}/
              {selectedCustomerGroup.transactions.length})
            </Label>

            <div className="max-h-[300px] overflow-y-auto border rounded-md p-2">
              <div className="grid gap-3 p-2">
                {selectedCustomerGroup.transactions.map((transaction) => {
                  const isSelected = selectedTransactionIds.includes(
                    transaction._id,
                  );
                  const serviceName =
                    transaction?.service?.id?.serviceTypeName || "-";
                  const vehicleName =
                    transaction?.service?.id?.serviceVehicle?.vehicleTypeName ||
                    "-";
                  const transactionTime = transaction?.service?.end
                    ? format(
                        new Date(transaction?.service?.end),
                        "MMM d, hh:mm a",
                      )
                    : "-";

                  return (
                    <div
                      key={transaction._id}
                      className="relative p-3 transition-all border shadow-sm cursor-pointer rounded-xl hover:border-primary bg-background"
                      onClick={() => handleToggleTransaction(transaction._id)}
                    >
                      {isSelected && (
                        <Badge className="absolute top-0 right-0 p-1 rounded-full shadow-lg z-4 translate-x-1/4 -translate-y-1/4">
                          <CheckCheck className="w-3 h-3" />
                        </Badge>
                      )}

                      <div className="grid gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[11px] text-muted-foreground truncate">
                              {vehicleName}
                            </div>
                            <div className="text-sm font-semibold truncate">
                              {serviceName}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="mt-2 text-base font-semibold leading-none">
                              Rs. {transaction?.netAmount || 0}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between gap-2">
                            <span>
                              {" "}
                              {transaction?.vehicleModel}
                              {transaction?.vehicleModel ? " - " : ""}
                              {transaction?.vehicleNumber}
                            </span>
                            <span>{transactionTime}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-between gap-1 pt-2 border-t">
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px]"
                              onClick={(event) => {
                                event.stopPropagation();
                                setRollBackId(transaction._id);
                                setShowRollbackFromComplete(true);
                              }}
                            >
                              Rollback <Undo2 className="w-3 h-3 ml-1" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px]"
                              onClick={(event) => {
                                event.stopPropagation();
                                setTransactionDetails(transaction);
                                setShowEdit(true);
                              }}
                            >
                              Edit <Edit className="w-3 h-3 ml-1" />
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px]"
                            onClick={(event) => {
                              event.stopPropagation();
                              setTransactionDetails(transaction);
                              setShowDetails(true);
                            }}
                          >
                            View <Eye className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-2 px-2 mb-1">
            <Label className="flex items-center gap-1">
              <ListCollapse className="w-4 h-4" /> Details
            </Label>
            <Separator className="mb-1" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Gross Amt</span>
              <span className="font-medium">Rs. {selectedTotals.gross}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Discount Amt</span>
              <span className="font-medium">Rs. {selectedTotals.discount}</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">Net Amt</span>
              <span className="font-semibold">Rs. {selectedTotals.net}</span>
            </div>
          </div>

          <div className="p-4 border rounded-md shadow-sm">
            <div className="grid gap-4">
              <Label>Payment Mode</Label>
              <div className="flex flex-wrap gap-2 text-sm">
                {paymentModes?.map((mode) => (
                  <Button
                    className="rounded-full"
                    variant={mode._id === paymentMode?._id ? "" : "outline"}
                    size="sm"
                    type="button"
                    key={mode._id}
                    onClick={() => {
                      if (mode._id === paymentMode?._id) {
                        setPaymentMode("");
                      } else {
                        setPaymentMode(mode);
                      }
                    }}
                  >
                    {mode.paymentModeName}
                  </Button>
                ))}
              </div>
            </div>

            {paymentMode?.qrCodeData && (
              <div className="mt-4 space-y-4" ref={qrCodeRef}>
                <Label>Qr Code</Label>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="p-4 border rounded-md">
                    <QRCode value={paymentMode.qrCodeData} size={220} />
                  </div>
                  <p className="font-medium uppercase text-muted-foreground">
                    {paymentMode?.paymentModeName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-2 p-4 sm:p-6">
          <Button variant="secondary" onClick={handleClosePage}>
            Close
          </Button>
          <SubmitButton
            condition={isSettling}
            loadingText="Receiving"
            disabled={
              !paymentMode ||
              !selectedTransactions.length ||
              isFetchingCheckoutData ||
              !isCheckoutDataSuccess
            }
            onClick={handleSettleAll}
            buttonText={
              <>
                Checkout Selected <Check className="w-4 h-4 ml-2" />
              </>
            }
          />
        </CardFooter>
      </Card>

      <ConfirmRollbackFromComplete
        showRollbackFromComplete={showRollbackFromComplete}
        setShowRollbackFromComplete={setShowRollbackFromComplete}
        rollBackId={rollBackId}
        setRollBackId={setRollBackId}
        origin="pending"
      />
      <CarwashTransactionDetails
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        transactionDetails={transactionDetails}
        setTransactionDetails={setTransactionDetails}
        setShowDelete={() => {}}
        setDeleteId={() => {}}
        setShowRollbackFromComplete={setShowRollbackFromComplete}
        setShowRollbackFromPickup={() => {}}
        setRollBackId={setRollBackId}
        origin="pending"
        hideFooter={true}
      />
      <EditCarwashTransaction
        showEdit={showEdit}
        setShowEdit={setShowEdit}
        transactionDetails={transactionDetails}
        setTransactionDetails={setTransactionDetails}
      />
    </div>
  );
}

export default CarwashPendingSettlement;
