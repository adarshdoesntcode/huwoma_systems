import { useState } from "react";
import { useGetPotentialBuyersQuery } from "../garageApiSlice";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import ApiError from "@/components/error/ApiError";
import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Menu,
  Phone,
  SquareDashedMousePointer,
  Star,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DynamicMenu from "./DynamicMenu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import MatchBadge from "./MatchBadge";

function PotentialBuyers({ vehicleId }) {
  const [showBuyers, setShowBuyers] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, isError, isSuccess, error, refetch } =
    useGetPotentialBuyersQuery(
      { vehicleId },
      {
        skip: !showBuyers,
      }
    );

  return (
    <Card className="w-full border-none">
      <CardContent className="p-0 py-2 ">
        {isLoading && (
          <div className="flex min-h-[20rem] items-center justify-center">
            <Loader />
          </div>
        )}

        {showBuyers && isSuccess && (
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <Label className="text-base font-semibold">
                Potential Buyers ({data?.data.length})
              </Label>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowBuyers(false)}
              >
                Clear <X className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {data?.data.map((interest) => (
                <Card
                  key={interest._id}
                  className="relative flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <User className="w-4 h-4" />
                          {interest.buyer.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-3">
                          <Phone className="w-3 h-3" />
                          {interest.buyer.contactNumber}
                        </CardDescription>
                      </div>

                      <MatchBadge score={interest.matchScore} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pb-2 text-xs border-t text-muted-foreground">
                    <div className="mb-2 font-mono text-ellipsis">
                      Interest ID: {interest._id}
                    </div>
                  </CardContent>

                  <div className="flex gap-2 p-4 pt-0">
                    <Button className="flex-1" size="sm">
                      Select Buyer
                      <SquareDashedMousePointer className="w-4 h-4 ml-2" />
                    </Button>
                    <DynamicMenu
                      configs={[
                        {
                          label: "View Buyer",
                          icon: <User className="w-3 h-3 mr-1" />,
                          action: () => {
                            navigate(`/garage/customers/${interest.buyer._id}`);
                          },
                        },
                        {
                          label: "View Interest",
                          icon: <Star className="w-3 h-3 mr-1" />,
                          action: () => {
                            navigate(`/garage/interest/${interest._id}`);
                          },
                        },
                      ]}
                    >
                      <Button variant="outline" size="sm">
                        <Menu className="w-4 h-4" />
                      </Button>
                    </DynamicMenu>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!showBuyers && (
          <div className="flex min-h-[20rem] flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-semibold tracking-tight">
              Ready to Discover Buyers?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Click the button below to see a list of potential buyers.
            </p>
            <Button className="mt-6" onClick={() => setShowBuyers(true)}>
              Find Potential Buyers
              <MagnifyingGlassIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {isError && <ApiError error={error} refetch={refetch} />}
      </CardContent>
    </Card>
  );
}

export default PotentialBuyers;
