import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Fuel,
  Gauge,
  GitMerge,
  Pointer,
  Settings,
  SquareDashedMousePointer,
  Star,
} from "lucide-react";
import MatchBadge from "./MatchBadge";

function MatchedVehiclesCard({ vehicle }) {
  return (
    <Card
      key={vehicle._id}
      className="w-[300px] flex-shrink-0 shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex flex-col h-full">
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9} className="relative">
            <img
              src={vehicle.photos?.[0]?.primaryUrl}
              alt={`${vehicle.make || "Unknown"} ${vehicle.model || "Vehicle"}`}
              className="object-cover w-full h-full rounded-t-lg"
              onError={(e) => {
                e.target.src = vehicle.photos?.[0]?.fallBackUrl;
              }}
            />
            {vehicle.matchScore != null && (
              <div className="absolute top-2 right-2">
                <MatchBadge score={vehicle.matchScore} />
              </div>
            )}
          </AspectRatio>
          <div className="px-4 py-2">
            <CardTitle className="text-base">
              {vehicle.year || "Unknown"} {vehicle.make || "Make"}{" "}
              {vehicle.model || "Model"}
            </CardTitle>
            <CardDescription className="text-xs">
              {vehicle.variant && `${vehicle.variant} • `}
              {vehicle.category || "Vehicle"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0 space-y-3 text-sm">
          <p className="text-sm font-semibold text-green-600">
            {formatCurrency(vehicle.askingPrice)}
          </p>
          <div className="grid grid-cols-2 text-xs text-gray-600 gap-x-4 gap-y-2">
            <div className="flex items-center gap-2 truncate">
              <Gauge className="w-4 h-4 text-gray-400" />
              <span>{formatNumber(vehicle.mileage)} km</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <Fuel className="w-4 h-4 text-gray-400" />
              <span>{vehicle.fuelType || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <Settings className="w-4 h-4 text-gray-400" />
              <span>{vehicle.transmission || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <GitMerge className="w-4 h-4 text-gray-400" />
              <span>{vehicle.driveType || "N/A"}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 mt-auto rounded-b-lg bg-gray-50">
          <p className="text-xs text-gray-500">
            Seller:{" "}
            <span className="font-medium text-gray-700">
              {vehicle.seller?.name || "Unknown Seller"}
            </span>
          </p>
          <Button size="sm" className="text-xs">
            Select <SquareDashedMousePointer className="w-3 h-3 ml-2" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default MatchedVehiclesCard;
