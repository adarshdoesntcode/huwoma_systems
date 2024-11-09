import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Car,
  ChevronLeft,
  Droplets,
  Edit,
  PlusCircle,
  QrCode,
  ReceiptText,
  RefreshCcw,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import RigCard from "./RigCard";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { useGetSimRacingTransactionsQuery } from "./simRacingApiSlice";
import { SimRacingDataTable } from "./SimRacingDataTable";
import { SimRacingColumn } from "./SimRacingColumn";

function SimRacing() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateState = useMemo(() => location.state || {}, [location.state]);
  const [tab, setTab] = useState(navigateState?.tab || "active");

  const [lastUpdated, setLastUpdated] = useState(null);

  const date = useMemo(() => new Date().toISOString(), []);

  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetSimRacingTransactionsQuery(date, {
      pollingInterval: 10000,
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

  let rigs = [];
  let transactions = [];

  if (data) {
    rigs = data?.data?.rigs || [];
    transactions = data?.data?.transactions || [];
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
            <Car className="w-4 h-4 text-muted-foreground" />
            Sim Racing
          </div>
          <div className=" flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="mr-2"
              onClick={() => navigate("/simracing/customers")}
            >
              <span className="sr-only sm:not-sr-only">Customers </span>

              <Users className="sm:ml-2 w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/simracing/transactions")}
            >
              <span className="sr-only sm:not-sr-only">Transactions </span>

              <ReceiptText className="sm:ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 sm:gap-6 mb-6">
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
            <div className="flex flex-col  items-start sm:items-center sm:flex-row gap-4 justify-between">
              <TabsList className="order-2 md:order-1">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="finish">Finished</TabsTrigger>
                <TabsTrigger value="booking">Booking</TabsTrigger>
              </TabsList>
              <div className="w-full sm:w-fit order-1 sm:order-2 flex justify-end ">
                <Button
                  size="sm"
                  variant="outline"
                  className="mr-2 w-full"
                  onClick={() => navigate("/simracing/booking")}
                >
                  <span>Booking</span>
                  <PlusCircle className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/simracing/new")}
                  className="w-full"
                >
                  <span>Race</span>
                  <PlusCircle className="ml-2  w-4 h-4" />
                </Button>
              </div>
            </div>
            <TabsContent value="active">
              <Card>
                <CardHeader className="p-4 sm:p-6 sm:pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        Active
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Ongoing sessions on the rigs
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
                  <SimRacingDataTable
                    data={transactions}
                    columns={SimRacingColumn}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bookings">
              <Card></Card>
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
