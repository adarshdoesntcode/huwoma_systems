import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Car,
    Eye,
    Fuel,
    Gauge,
    Phone,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, getDaysDifference } from "@/lib/utils";

export const PublicVehicleCard = ({ vehicle }) => {
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return Number(price).toLocaleString("en-IN");
    };

    const formatMileage = (mileage) => {
        return new Intl.NumberFormat("en-IN").format(mileage);
    };

    const handleViewDetails = () => {
        navigate(`/garagebyhuwoma/vehicle/${vehicle._id}`);
    };

    return (
        <Card className="overflow-hidden transition-all duration-300 animate-in fade-in-10 slide-in-from-bottom-1 hover:shadow-lg hover:scale-[1.02]">
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
                <div className="absolute px-3 py-1.5 text-xs font-semibold text-white bg-green-500 rounded-full top-3 right-3 shadow-lg">
                    {vehicle.status}
                </div>
                <div className="absolute px-2 py-1 text-xs text-white rounded bottom-2 left-2 bg-black/70">
                    {vehicle.photos.length}{" "}
                    {vehicle.photos.length === 1 ? "photo" : "photos"}
                </div>
            </div>

            <CardContent className="p-4">
                {/* Vehicle Title and Price */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            {vehicle.make} {vehicle.model}
                        </h3>
                        {vehicle.variant && (
                            <p className="text-xs text-gray-600 mt-0.5">{vehicle.variant}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                            ₹{formatPrice(vehicle.askingPrice)}
                        </p>
                    </div>
                </div>
                <Separator className="my-3" />

                {/* Vehicle Details Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{vehicle.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>{formatMileage(vehicle.mileage)} km</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Fuel className="w-3.5 h-3.5" />
                        <span>{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Car className="w-3.5 h-3.5" />
                        <span>{vehicle.transmission}</span>
                    </div>
                </div>
                <Separator className="my-3" />

                {/* Additional Details */}
                <div className="mb-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{vehicle.category}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Engine:</span>
                        <span className="font-medium">{vehicle.engineCC}cc</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Drive Type:</span>
                        <span className="font-medium">{vehicle.driveType}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Plate:</span>
                        <span className="font-mono font-medium">{vehicle.numberPlate}</span>
                    </div>
                    {vehicle.colour && (
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Color:</span>
                            <span className="font-medium">{vehicle.colour}</span>
                        </div>
                    )}
                </div>

                {/* Seller Info */}
                {/* {vehicle.seller && (
                    <>
                        <Separator className="my-3" />
                        <div className="mb-4 p-2.5 bg-gray-50 rounded-lg">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                                Seller Information
                            </p>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <User className="w-3 h-3" />
                                    <span>{vehicle.seller.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Phone className="w-3 h-3" />
                                    <span>{vehicle.seller.contactNumber}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )} */}

                {/* Action Button */}
                <Button className="w-full" size="sm" onClick={handleViewDetails}>
                    <Eye className="w-3.5 h-3.5 mr-2" />
                    <span className="text-xs">View Full Details</span>
                </Button>

                {/* Listing Date */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Listed on {formatDate(vehicle.createdAt)}
                    </div>
                    <div className="text-[10px] text-gray-500">
                        {getDaysDifference(vehicle.createdAt, new Date())}d ago
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
