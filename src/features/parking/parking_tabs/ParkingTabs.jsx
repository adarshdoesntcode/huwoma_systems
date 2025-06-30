import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BookCheck, Phone, Trash } from "lucide-react";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParkingTabDataTable } from "./ParkingTabDataTable";
import { ParkingTabColumn } from "./ParkingTabColumn";
import { ParkingTabFinishedDataTable } from "./ParkingTabFinishedDataTable";
import { ParkingTabFinishedColumn } from "./ParkingTabFinishedColumn";
import AddToParkingTab from "./mutation/AddToParkingTab";
import { Badge } from "@/components/ui/badge";
import { DeleteParkingTab } from "./mutation/DeleteParkingTab";
import { useNavigate } from "react-router-dom";

function ParkingTabs({ tab, vehicles }) {
  const [showDelete, setShowDelete] = useState(false);
  const [tabState, setTabState] = useState("parked");
  const navigate = useNavigate();

  const parkedTransactions = tab.parkingTransactions.filter(
    (transaction) =>
      transaction.transactionStatus === "Parked" &&
      transaction.paymentStatus === "Pending"
  );
  const finishedTransactions = tab.parkingTransactions.filter(
    (transaction) =>
      transaction.transactionStatus === "Completed" &&
      transaction.paymentStatus === "Pending"
  );

  let content;
  content = (
    <>
      <Card>
        <CardHeader className="p-2 sm:p-4">
          <div className="flex flex-col items-start justify-between w-full gap-2 sm:flex-row">
            <div>
              <CardTitle className="text-base sm:text-lg ">
                {tab.tabOwnerName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm hover:text-primary">
                <a href={`tel:${tab.tabOwnerContact}`}>{tab.tabOwnerContact}</a>
                <Phone className="w-3.5 text-primary h-3.5" />
              </CardDescription>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                className="w-1/5 hover:text-red-500"
                onClick={() => setShowDelete(true)}
              >
                <Trash className="w-4 h-4 " />
              </Button>

              <div className="w-2/5">
                <AddToParkingTab
                  tab={tab}
                  vehicles={vehicles}
                  setTabState={setTabState}
                />
              </div>
              <Button
                size="sm"
                variant="default"
                disabled={parkedTransactions.length > 0}
                className="w-2/5"
                onClick={() => navigate(`/parking/settlement/${tab._id}`)}
              >
                Settle
                <BookCheck className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 sm:pt-0">
          <Tabs
            defaultValue="parked"
            value={tabState}
            onValueChange={setTabState}
          >
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
            </TabsList>
            <TabsContent value="parked">
              <ParkingTabDataTable
                data={parkedTransactions || []}
                columns={ParkingTabColumn}
                tabId={tab._id}
              />
            </TabsContent>
            <TabsContent value="finish">
              <ParkingTabFinishedDataTable
                data={finishedTransactions || []}
                columns={ParkingTabFinishedColumn}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <DeleteParkingTab
        tab={tab}
        showDelete={showDelete}
        setShowDelete={setShowDelete}
      />
    </>
  );

  return content;
}

export default ParkingTabs;
