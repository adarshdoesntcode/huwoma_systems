import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Car,
  Edit,
  Eye,
  Fuel,
  Gauge,
  Heart,
  Menu,
  Share2,
  ShieldCheck,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DynamicMenu from "../../components/DynamicMenu";
import { useState } from "react";
import DeleteVehicleListing from "./mutation/DeleteVehicleListing";
import { capitalizeFirstLetter, formatDate, getDaysDifference } from "@/lib/utils";
import ShareVehicle from "./mutation/ShareVehicle";
import StatusBadge from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";

export const VehicleCard = ({ vehicle, scope = null }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [shareId, setShareId] = useState(null);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat("en-IN").format(mileage);
  };

  const handleViewDetails = () => {
    if (scope === "public") {
      navigate(`/garagebyhuwoma/${vehicle._id}`);
    } else {
      navigate(`/garage/vehicle/${vehicle._id}`);
    }
  };

  const handleShare = () => {
    setShowShare(true);
    setShareId(vehicle._id);
  };

  const handleVerify = () => {
    navigate(`/garage/verify/${vehicle._id}`);
  };

  const vehicleConfigs = [
    {
      label: "Share",
      icon: <Share2 className="w-3 h-3 mr-1" />,
      action: () => {
        handleShare();
      },
    },
    {
      label: "Edit",
      icon: <Edit className="w-3 h-3 mr-1" />,
      action: () => {
        navigate(`/garage/edit-vehicle/${vehicle._id}`);
      },
    },
    {
      label: "Delete",
      icon: <Trash className="w-3 h-3 mr-1" />,
      action: () => {
        setShowDelete(true);
        setDeleteId(vehicle._id);
      },
    },
  ];

  const hasInterestedBuyers = vehicle.interestedBuyers.filter(ib => !ib.fulfilled).length > 0;

  return (
    <Card className="overflow-hidden transition-all duration-300 animate-in fade-in-10 slide-in-from-bottom-1 hover:shadow-md">
      {/* Vehicle Image */}
      <div className="relative h-48 bg-gray-100 sm:h-56">
        <img
          src={vehicle.photos[0]?.primaryUrl || vehicle.photos[0]?.fallbackUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.src =
              vehicle.photos[0]?.fallbackUrl || "/api/placeholder/400/200";
          }}
        />
        <div className="absolute top-2 left-2">
          {hasInterestedBuyers && scope !== "public" && (
            <div className="bg-white text-red-500  p-1.5 rounded-full"><Heart className="w-4 fill-red-500 h-4" /></div>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <StatusBadge status={vehicle.status} variant="solid" />
        </div>
        <div className="absolute px-2 py-1 text-xs text-white rounded bottom-2 left-2 bg-black/70">
          {vehicle.photos.length}{" "}
          {vehicle.photos.length === 1 ? "photo" : "photos"}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Vehicle Title and Price */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {vehicle.make} {vehicle.model}{" "}
              {vehicle.variant && (
                <span className="text-xs font-normal text-gray-600 ">
                  {vehicle.variant}
                </span>
              )}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-600">
              Rs {formatPrice(vehicle.askingPrice)}
            </p>
          </div>
        </div>
        <Separator className="my-2" />

        {/* Vehicle Details Grid */}
        <div className="grid grid-cols-2 gap-2 ">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Gauge className="w-3 h-3" />
            <span>{formatMileage(vehicle.mileage)} km</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Fuel className="w-3 h-3" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Car className="w-3 h-3" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>
        <Separator className="my-2" />

        {/* Additional Details */}
        <div className="mb-4 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{vehicle.category}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Power:</span>
            <span className="font-medium">{vehicle.engineCC} cc/kW</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Drive Type:</span>
            <span className="font-medium">{vehicle.driveType}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Plate:</span>
            <span className="font-mono font-medium">{vehicle.numberPlate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {vehicle.status === "Unverified" ? (
            <Button className="flex-1" size="sm" onClick={handleVerify}>
              <ShieldCheck className="w-3 h-3 mr-2" />
              <span className="text-xs">Verify</span>
            </Button>
          ) : (
            <Button className="flex-1" size="sm" onClick={handleViewDetails}>
              <Eye className="w-3 h-3 mr-2" />
              <span className="text-xs">View Details</span>
            </Button>
          )}
          {scope !== "public" && vehicle.status !== "Unverified" && (
            <DynamicMenu configs={vehicleConfigs}>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </DynamicMenu>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Calendar className="w-3 h-3" />
            Listed on {formatDate(vehicle.createdAt)}
          </div>
          <div className="text-[10px] text-gray-500">
            {scope === "public" ? getDaysDifference(
              vehicle.createdAt,
              new Date()
            ) > 0 ? getDaysDifference(
              vehicle.createdAt,
              new Date()
            ) + "d ago" : "Today" : capitalizeFirstLetter(vehicle.listingType)}

          </div>
        </div>
        <DeleteVehicleListing
          showDelete={showDelete}
          setShowDelete={setShowDelete}
          deleteId={deleteId}
          setDeleteId={setDeleteId}
        />
        <ShareVehicle
          shareId={shareId}
          setShowShare={setShowShare}
          setShareId={setShareId}
          showShare={showShare}
        />
      </CardContent>
    </Card>
  );
};
