import { Button } from "@/components/ui/button";
import { KeySquare, Link, PlusCircle, QrCode, ReceiptText, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsSuper } from "@/hooks/useSuper";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleListing from "./tabs/vehicle-list/VehicleListing";
import GarageStatsCards from "./components/GarageStatsCards";
import BuyerInterests from "./tabs/buyer-interest/BuyerInterests";
import PotentialMatches from "./tabs/potential-matches/PotentialMatches";
import GaragePublicPortal from "./components/GaragePublicPortal";

function CarGarage() {
  const isSuper = useIsSuper();
  const navigate = useNavigate();
  const location = useLocation();
  const navigateState = useMemo(() => location.state || {}, [location.state]);
  const [tab, setTab] = useState(navigateState?.tab || "listing");
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 tracking-tight sm:flex-row sm:items-center sm:mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase text-primary">
          <KeySquare className="w-4 h-4 text-muted-foreground" />
          Car Garage
        </div>

        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowShare(true)}
          >
            <span className="sr-only sm:not-sr-only">Public Portal</span>

            <Link className="w-4 h-4 sm:ml-2" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/garage/customers")}
          >
            <span className="sr-only sm:not-sr-only">Customers</span>

            <Users className="w-4 h-4 sm:ml-2" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/garage/transactions")}
          >
            <span className="sr-only sm:not-sr-only">Transactions</span>
            <ReceiptText className="w-4 h-4 sm:ml-2" />
          </Button>
        </div>
      </div>
      <div>
        <GarageStatsCards />
      </div>
      <div>
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value);
          }}
        >
          <div className="flex flex-col items-start justify-between gap-4 h-max-content sm:items-center sm:flex-row">
            <TabsList className="flex-wrap justify-start order-2 md:order-1 ">
              <TabsTrigger
                value="listing"
                onClick={() => {
                  navigate("/garage", { state: { tab: "listing" } });
                }}
              >
                Vehicles
              </TabsTrigger>
              <TabsTrigger
                value="interest"
                onClick={() => {
                  navigate("/garage", { state: { tab: "interest" } });
                }}
              >
                Preferences
              </TabsTrigger>
              <TabsTrigger
                value="match"
                onClick={() => {
                  navigate("/garage", { state: { tab: "match" } });
                }}
              >
                Potential Match
              </TabsTrigger>
            </TabsList>
            <div className="flex justify-end order-1 w-full gap-2 sm:w-fit sm:order-2 ">
              <Button
                size="sm"
                className="w-full sm:w-fit"
                variant="outline"
                onClick={() => navigate("/garage/new-interest")}
              >
                <span>Preference</span>
                <PlusCircle className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="sm"
                className="w-full sm:w-fit"
                onClick={() => navigate("/garage/new-vehicle")}
              >
                <span>New Vehicle</span>
                <PlusCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          <TabsContent value="listing">
            <VehicleListing tab={tab} />
          </TabsContent>
          <TabsContent value="interest">
            <BuyerInterests tab={tab} />
          </TabsContent>
          <TabsContent value="match">
            <PotentialMatches tab={tab} />
          </TabsContent>
        </Tabs>
        <GaragePublicPortal showShare={showShare} setShowShare={setShowShare} />
      </div>
    </div>
  );
}

export default CarGarage;
