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
import {
  ParkingCircle,
  PlusCircle,
  ReceiptText,
  RefreshCcw,
} from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";

import { useIsSuper } from "@/hooks/useSuper";
import { useGetParkingTransactionsQuery } from "./parkingApiSlice";
import VehicleCard from "./VehicleCard";
import { ParkingDataTable } from "./ParkingDataTable";
import { ParkingColumn } from "./ParkingColumn";
import { ParkingFinishedDataTable } from "./ParkingFinishedDataTable";
import { ParkingFinishedColumn } from "./ParkingFinishedColumn";
import { useRole } from "@/hooks/useRole";
import { ROLES_LIST } from "@/lib/config";
import NewParkingTab from "./NewParkingTabCard";
import ParkingTabs from "./parking_tabs/ParkingTabs";

function Parking() {
  const isSuper = useIsSuper();
  const navigate = useNavigate();
  const location = useLocation();
  const navigateState = useMemo(() => location.state || {}, [location.state]);
  const [tab, setTab] = useState(navigateState?.tab || "parked");

  const [lastUpdated, setLastUpdated] = useState(null);

  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetParkingTransactionsQuery(undefined, {
      pollingInterval: 600000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    });
  useEffect(() => {
    setTab(navigateState?.tab || "parked");
  }, [navigateState]);

  useEffect(() => {
    if (isSuccess) {
      const date = format(new Date(), "hh:mm:ss a");
      setLastUpdated(date);
    }
  }, [isSuccess, isFetching]);

  let vehicles = [];
  let transactions = [];
  let onTabs = [];

  if (data) {
    vehicles = data?.data?.vehicles || [];
    transactions = data?.data?.transactions || [];
    onTabs = data?.data?.onTabs || [];
  }

  let parkedTransactions = [];

  let finishedTransactions = [];

  if (data) {
    parkedTransactions = transactions
      ?.filter(
        (transaction) =>
          transaction.transactionStatus === "Parked" &&
          transaction.isTabbed === false
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    finishedTransactions = transactions
      ?.filter(
        (transaction) =>
          transaction.transactionStatus === "Completed" &&
          transaction.isTabbed === false
      )
      .sort(
        (a, b) => new Date(b.transactionTime) - new Date(a.transactionTime)
      );
  }

  const handleRefresh = () => {
    refetch();
  };

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
        <div className="flex items-center justify-between gap-4 tracking-tight sm:flex-row sm:items-center sm:mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-primary">
            <ParkingCircle className="w-4 h-4 text-muted-foreground" />
            Parking
          </div>
          <div className="flex justify-end ">
            {isSuper && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/parking/transactions")}
              >
                <span className="sr-only sm:not-sr-only">Transactions </span>

                <ReceiptText className="w-4 h-4 sm:ml-2" />
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-6 sm:gap-6">
          {vehicles.map((vehicle) => (
            <React.Fragment key={vehicle._id}>
              <VehicleCard
                className={"col-span-12 lg:col-span-6"}
                vehicle={vehicle}
              />
            </React.Fragment>
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
              <TabsList>
                <TabsTrigger value="parked">
                  Parked
                  {parkedTransactions.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {parkedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="finish">
                  Finished
                  {finishedTransactions.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {finishedTransactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="ontab">
                  On Tab
                  {onTabs.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {onTabs.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              {/* <div className="flex justify-end order-1 w-full sm:w-fit sm:order-2 ">
                <NewParkingTab />
              </div> */}
            </div>

            <TabsContent value="parked">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Parked
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Currently parked vehicles
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
                  <ParkingDataTable
                    data={parkedTransactions}
                    columns={ParkingColumn}
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
                        Completed parkings that have been paid off
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
                  <ParkingFinishedDataTable
                    data={finishedTransactions}
                    columns={ParkingFinishedColumn}
                    origin={"parking"}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ontab">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Pending Tabs
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Customers with pending payment on their tab
                      </CardDescription>
                    </div>

                    <div className="flex items-end w-full gap-2 sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                      >
                        <RefreshCcw
                          className={`w-4 h-4   ${
                            isFetching && "animate-spin"
                          }`}
                        />
                      </Button>

                      <NewParkingTab />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 sm:p-6 sm:pt-2">
                  <div className="grid gap-4">
                    {onTabs.length === 0 && (
                      <div className="flex items-center justify-center py-24">
                        <p className="text-sm text-muted-foreground">
                          No pending tabs
                        </p>
                      </div>
                    )}
                    {onTabs.map((tab) => (
                      <ParkingTabs
                        key={tab._id}
                        tab={tab}
                        vehicles={vehicles}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default Parking;
