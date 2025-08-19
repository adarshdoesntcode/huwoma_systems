import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import ApiError from "@/components/error/ApiError";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useGetPotentialVehiclesQuery } from "../garageApiSlice";
import MatchedVehiclesCard from "./MatchedVehiclesCard";

function PotentialVehicles({ interestId }) {
  const [showVehicles, setShowVehicles] = useState(false);
  const { data, isLoading, isError, isSuccess, error, refetch } =
    useGetPotentialVehiclesQuery(
      { interestId },
      {
        skip: !showVehicles,
      }
    );

  return (
    <Card className="w-full bg-transparent border-none">
      <CardContent className="p-0 py-2 ">
        {isLoading && (
          <div className="flex min-h-[20rem] items-center justify-center">
            <Loader />
          </div>
        )}

        {showVehicles && isSuccess && (
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <Label className="text-base font-semibold">
                Potential Vehicles ({data?.data.length})
              </Label>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowVehicles(false)}
              >
                Clear <X className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Separator />
            <div
              className="relative w-full overflow-x-auto scrollbar-thin scroll-smooth  min-h-[420px]"
              style={{ maxWidth: "100%" }}
            >
              <div className="absolute left-0 flex gap-4 pb-4 top-4 flex-nowrap w-max">
                {data?.data.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className="min-w-[300px] flex-shrink-0 snap-start"
                  >
                    <MatchedVehiclesCard vehicle={vehicle} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!showVehicles && (
          <div className="flex min-h-[20rem] flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-semibold tracking-tight">
              Ready to Discover Vehicles?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Click the button below to see a list of potential vehicles.
            </p>
            <Button className="mt-6" onClick={() => setShowVehicles(true)}>
              Find Matching Vehicles
              <MagnifyingGlassIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {isError && <ApiError error={error} refetch={refetch} />}
      </CardContent>
    </Card>
  );
}

export default PotentialVehicles;
