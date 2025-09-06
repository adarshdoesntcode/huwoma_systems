import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, PlusCircle, ReceiptText, RefreshCcw, Users } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import RigCard from "./RigCard";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { useGetSimRacingTransactionsQuery } from "./simRacingApiSlice";
import { SimRacingDataTable } from "./SimRacingDataTable";
import { SimRacingColumn } from "./SimRacingColumn";
import { SimRacingBookingDataTable } from "./SimRacingBookingDataTable";
import { SimRacingBookingColumn } from "./SimRacingBookingColumn";
import { SimRacingFinishedColumn } from "./SimRacingFinishedColumn";
import { SimRacingFinishedDataTable } from "./SimRacingFinishedDataTable";
import { useIsSuper } from "@/hooks/useSuper";
import { useRole } from "@/hooks/useRole";
import { ROLES_LIST } from "@/lib/config";

function SimRacing() {
  const isSuper = useIsSuper();
  const navigate = useNavigate();
  const location = useLocation();
  const navigateState = useMemo(() => location.state || {}, [location.state]);
  const [tab, setTab] = useState(navigateState?.tab || "active");

  const [lastUpdated, setLastUpdated] = useState(null);
  const [isMutating, setIsMutating] = useState(false);
  const [mutatingId, setMutatingId] = useState(null);
  const [changeRigId, setChangeRigId] = useState(null);

  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetSimRacingTransactionsQuery(undefined, {
      pollingInterval: 600000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    });

  useEffect(() => {
    setTab(navigateState?.tab || "active");
  }, [navigateState]);

  useEffect(() => {
    if (isSuccess) {
      const date = format(new Date(), "hh:mm:ss a");
      setLastUpdated(date);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (!isFetching && !isMutating) {
      setMutatingId(null);
      setChangeRigId(null);
    }
  }, [isFetching, isMutating]);

  let rigs = [];
  let transactions = [];

  if (data) {
    rigs = data?.data?.rigs || [];
    transactions = data?.data?.transactions || [];
  }

  let activeTransactions = [];
  let bookedTransactions = [];
  let finishedTransactions = [];

  if (data) {
    bookedTransactions = transactions
      ?.filter((transaction) => transaction.transactionStatus === "Booked")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    activeTransactions = transactions
      ?.filter(
        (transaction) =>
          transaction.transactionStatus === "Active" ||
          transaction.transactionStatus === "Paused"
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    finishedTransactions = transactions
      ?.filter((transaction) => transaction.transactionStatus === "Completed")
      .sort(
        (a, b) => new Date(b.transactionTime) - new Date(a.transactionTime)
      );
  }

  const handleRefresh = () => {
    refetch();
  };

  const role = useRole();

  if (role !== ROLES_LIST.SUPERADMIN && role !== ROLES_LIST.ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  let content;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 tracking-tight  sm:flex-row sm:items-center sm:mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-primary">
            <Car className="w-4 h-4 text-muted-foreground" />
            Sim Racing
          </div>
          <div className="flex justify-end ">
            <Button
              size="sm"
              variant="outline"
              className="mr-2"
              onClick={() => navigate("/simracing/customers")}
            >
              <span className="sr-only sm:not-sr-only">Customers </span>

              <Users className="w-4 h-4 sm:ml-2" />
            </Button>
            {isSuper && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/simracing/transactions")}
              >
                <span className="sr-only sm:not-sr-only">Transactions </span>

                <ReceiptText className="w-4 h-4 sm:ml-2" />
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-6 sm:gap-6">
          {rigs.map((rig) => (
            <RigCard
              key={rig._id}
              className={"col-span-12 lg:col-span-6"}
              rig={rig}
            />
          ))}
        </div>
        <div>
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value);
            }}
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:items-center sm:flex-row">
              <TabsList className="order-2 md:order-1">
                <TabsTrigger value="active">
                  Active
                  {activeTransactions.length > 0 && (
                    <Badge className="ml-2  hidden sm:block py-0 text-[10px]">
                      {activeTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="finish">
                  Finished
                  {finishedTransactions.length > 0 && (
                    <Badge className="ml-2  hidden sm:block py-0 text-[10px]">
                      {finishedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="booking">
                  Booking
                  {bookedTransactions.length > 0 && (
                    <Badge className="ml-2  hidden sm:block py-0 text-[10px]">
                      {bookedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <div className="flex justify-end order-1 w-full sm:w-fit sm:order-2 ">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mr-2"
                  onClick={() => navigate("/simracing/booking")}
                >
                  <span>Booking</span>

                  <PlusCircle className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/simracing/new")}
                  className="w-full"
                >
                  <span>Race</span>
                  <PlusCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <TabsContent value="active">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Active
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Ongoing sessions on the rigs
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                      >
                        <span className="sr-only sm:not-sr-only">Refresh</span>
                        <RefreshCcw
                          className={`w-4 h-4 sm:ml-2 ${
                            isFetching && "animate-spin"
                          }`}
                        />
                      </Button>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        Last Updated: {lastUpdated ? lastUpdated : "loading..."}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 sm:p-6 sm:pt-0">
                  <SimRacingDataTable
                    data={activeTransactions}
                    columns={SimRacingColumn(
                      isFetching,
                      isMutating,
                      setIsMutating,
                      mutatingId,
                      setMutatingId,
                      changeRigId,
                      setChangeRigId,
                      rigs
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="finish">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Finished
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Completed races that have been paid off
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                      >
                        <span className="sr-only sm:not-sr-only">Refresh</span>
                        <RefreshCcw
                          className={`w-4 h-4 sm:ml-2 ${
                            isFetching && "animate-spin"
                          }`}
                        />
                      </Button>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        Last Updated: {lastUpdated ? lastUpdated : "loading..."}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 sm:p-6 sm:pt-0">
                  <SimRacingFinishedDataTable
                    data={finishedTransactions}
                    columns={SimRacingFinishedColumn}
                    origin={"simracing"}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="booking">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Booking
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Active Bookings
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                      >
                        <span className="sr-only sm:not-sr-only">Refresh</span>
                        <RefreshCcw
                          className={`w-4 h-4 sm:ml-2 ${
                            isFetching && "animate-spin"
                          }`}
                        />
                      </Button>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        Last Updated: {lastUpdated ? lastUpdated : "loading..."}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 sm:p-6 sm:pt-0">
                  <SimRacingBookingDataTable
                    data={bookedTransactions}
                    columns={SimRacingBookingColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

export default SimRacing;
