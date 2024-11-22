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
import { ParkingCircle, ReceiptText, RefreshCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
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

function Parking() {
  const isSuper = useIsSuper();
  const navigate = useNavigate();
  const location = useLocation();
  const navigateState = useMemo(() => location.state || {}, [location.state]);
  const [tab, setTab] = useState(navigateState?.tab || "parked");
  const [lastUpdated, setLastUpdated] = useState(null);

  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetParkingTransactionsQuery(undefined, {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    });

  useEffect(() => {
    if (isSuccess) {
      const date = format(new Date(), "hh:mm:ss a");
      setLastUpdated(date);
    }
  }, [isSuccess, isFetching]);

  let vehicles = [];
  let transactions = [];

  if (data) {
    vehicles = data?.data?.vehicles || [];
    transactions = data?.data?.transactions || [];
  }

  let parkedTransactions = [];

  let finishedTransactions = [];

  if (data) {
    parkedTransactions = transactions
      ?.filter((transaction) => transaction.transactionStatus === "Parked")
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

  let content;

  if (isLoading) {
    content = (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="space-y-4">
        <div className="  sm:flex-row  flex items-center sm:items-center tracking-tight  justify-between gap-4 sm:mb-4">
          <div className="text-sm font-semibold uppercase text-primary  flex items-center gap-2">
            <ParkingCircle className="w-4 h-4 text-muted-foreground" />
            Parking
          </div>
          <div className=" flex justify-end">
            {isSuper && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/parking/transactions")}
              >
                <span className="sr-only sm:not-sr-only">Transactions </span>

                <ReceiptText className="sm:ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 sm:gap-6 mb-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              className={"col-span-12 lg:col-span-6"}
              vehicle={vehicle}
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
            <TabsList>
              <TabsTrigger value="parked">
                Parked
                {parkedTransactions.length > 0 && (
                  <Badge className="ml-2  hidden sm:block py-0 text-[10px]">
                    {parkedTransactions.length}
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
            </TabsList>

            <TabsContent value="parked">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Parked
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Currently parked vehicles
                      </CardDescription>
                    </div>
                    <div className="flex items-end gap-2 flex-col">
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

                <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
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
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Finished
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Completed parkings that have been paid off
                      </CardDescription>
                    </div>
                    <div className="flex items-end gap-2 flex-col">
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

                <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
                  <ParkingFinishedDataTable
                    data={finishedTransactions}
                    columns={ParkingFinishedColumn}
                  />
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
