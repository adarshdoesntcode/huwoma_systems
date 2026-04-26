import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import ApiError from "@/components/error/ApiError";
import { cn } from "@/lib/utils";
import { CheckCircle2, MapPinned } from "lucide-react";
import { useGetPublicCarwashTransactionStatusQuery } from "../carwashApiSlice";
import { GOOGLE_REVIEW_URL, IMAGE_DATA } from "@/lib/config";
import { Separator } from "@/components/ui/separator";

const TOUCH_CLEAN_INTERACTION_CLASS =
  "focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [-webkit-tap-highlight-color:transparent]";

const deriveStatusView = (transactionStatus, paymentStatus) => {
  if (transactionStatus === "Ready for Pickup") {
    return {
      title: "Your Vehicle Is Ready for Pickup",
      description: "Please proceed to checkout.",
      showQr: true,
    };
  }

  if (transactionStatus === "Completed") {
    return {
      title:
        paymentStatus === "Paid" ? "Transaction Completed" : "Wash Completed",
      description:
        paymentStatus === "Paid"
          ? "Payment completed"
          : "Awaiting payment confirmation at checkout.",
      showQr: false,
    };
  }

  if (transactionStatus === "Cancelled") {
    return {
      title: "This Entry Was Cancelled",
      description: "Please create a new entry if you still need service.",
      showQr: false,
    };
  }

  return {
    title: "You Are In Queue",
    description: "Show this QR code during checkout.",
    showQr: true,
  };
};

function PublicCarwashEntryStatus() {
  const navigate = useNavigate();
  const { transactionId = "" } = useParams();

  const { data, isLoading, isError, error, refetch } =
    useGetPublicCarwashTransactionStatusQuery(transactionId, {
      skip: !transactionId,
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const transaction = data?.data?.transaction;

  const statusView = useMemo(
    () =>
      deriveStatusView(
        transaction?.transactionStatus,
        transaction?.paymentStatus,
      ),
    [transaction?.paymentStatus, transaction?.transactionStatus],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="w-full max-w-3xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="space-y-3">
              <div className="rounded-md w-44 h-7 bg-slate-200 animate-pulse" />
              <div className="w-56 h-3 rounded bg-slate-100 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-48 h-48 mx-auto rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <ApiError error={error} refetch={refetch} />
          <Button
            className={cn("w-full min-h-12", TOUCH_CLEAN_INTERACTION_CLASS)}
            onClick={() => navigate("/parknwashbyhuwoma")}
          >
            Back To Entry Form
          </Button>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl">
            <CardContent className="py-10 space-y-4 text-center">
              <p className="text-muted-foreground">Transaction not found.</p>
              <Button
                className={cn("w-full min-h-12", TOUCH_CLEAN_INTERACTION_CLASS)}
                onClick={() => navigate("/parknwashbyhuwoma")}
              >
                Create New Entry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const checkoutQrValue = data?.data?.checkoutQrValue || `C-${transaction._id}`;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        <Card className="relative shadow-xl">
          <CardHeader className="space-y-2 text-center pt-28">
            <div className="absolute top-0 flex items-center justify-between w-full h-32 left-4">
              <img
                src={IMAGE_DATA.receipt_logo}
                className="object-contain h-full w-fit-content"
                alt="Receipt Logo"
              />
            </div>
            <CheckCircle2 className="absolute w-8 h-8 top-10 right-8 text-emerald-600" />
            <Separator />
            <CardTitle className="pt-3 text-2xl">{statusView.title}</CardTitle>
            <CardDescription>{statusView.description}</CardDescription>
            <div className="flex items-center justify-center gap-2 pt-2">
              {/* <StatusBadge status={transaction.transactionStatus} /> */}
              <span className="text-xs whitespace-nowrap text-muted-foreground">
                Payment Status
              </span>
              <StatusBadge status={transaction.paymentStatus} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {statusView.showQr ? (
              <div className="inline-flex flex-col items-center w-full gap-4 p-5 border rounded-xl">
                <QRCode value={checkoutQrValue} size={200} />
                <p className="text-xs text-center uppercase text-muted-foreground">
                  {data.data.checkoutQrValue}
                </p>
              </div>
            ) : null}

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <StatusItem
                label="Vehicle"
                value={transaction.vehicleModel || "-"}
              />
              <StatusItem
                label="Service"
                value={transaction?.service?.id?.serviceTypeName || "-"}
              />
              <StatusItem
                label="Initiated On"
                value={
                  transaction?.createdAt
                    ? format(transaction.createdAt, "d MMM, yy - h:mm a")
                    : "-"
                }
              />
              <StatusItem
                label="Identification No"
                value={transaction.billNo || "-"}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <p className="p-0 text-xs text-center text-muted-foreground">
                Please leave us a review on Google.
              </p>
              <Button
                variant="outline"
                className={cn("w-full min-h-12", TOUCH_CLEAN_INTERACTION_CLASS)}
                onClick={() =>
                  window.open(
                    GOOGLE_REVIEW_URL,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <MapPinned className="mr-2" /> Google Review
              </Button>
              <Button
                className={cn("w-full min-h-12", TOUCH_CLEAN_INTERACTION_CLASS)}
                onClick={() => navigate("/parknwashbyhuwoma")}
              >
                Create Another Entry
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Status syncs every minute.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusItem({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export default PublicCarwashEntryStatus;
