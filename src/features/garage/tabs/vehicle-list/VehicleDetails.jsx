import { useState } from "react";
import Loader from "@/components/Loader";
import { useGetVehicleDetailsQuery } from "../../garageApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import NavBackButton from "@/components/NavBackButton";
import ApiError from "@/components/error/ApiError";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PhotoProvider } from "react-photo-view";
import { FallbackImage } from "@/components/PhotoGallery";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Edit,
  MessageSquare,
  Phone,
  PhoneCall,
  ShoppingBag,
  Trash,
  User,
} from "lucide-react";
import DeleteVehicleListing from "./mutation/DeleteVehicleListing";
import PotentialBuyers from "../../components/PotentialBuyers";
import { formatDate, getDaysDifference } from "@/lib/utils";

function VehicleDetails() {
  const { id } = useParams();
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isSuccess, isError, refetch, error } =
    useGetVehicleDetailsQuery(id);

  const handleEdit = () => {
    navigate(`/garage/edit-vehicle/${id}`);
  };

  const handleDelete = () => {
    setShowDelete(true);
    setDeleteId(id);
  };
  let content;

  if (isLoading || isFetching) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const vehicle = data.data;

    content = (
      <div className="flex flex-col h-full gap-4 duration-300 fade-in animate-in slide-in-from-bottom-2">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <div className="flex-1 p-6 bg-white border rounded-lg shadow-sm">
          <div className="grid grid-cols-12 gap-6 mb-4">
            <div className="col-span-12 pb-16 lg:col-span-6">
              <Carousel>
                <CarouselContent className="rounded-lg shadow-xl">
                  <PhotoProvider>
                    {vehicle.photos.map((image, idx) => (
                      <CarouselItem key={idx}>
                        <FallbackImage image={image} index={idx} />
                      </CarouselItem>
                    ))}
                  </PhotoProvider>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselDots />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="text-xs text-gray-600">
                      {vehicle?.variant} {vehicle?.variant && "•"}{" "}
                      {vehicle.numberPlate}
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      Rs. {vehicle.askingPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <Badge className={"bg-green-500"}> {vehicle.status} </Badge>
                </div>

                <Separator />
                <Label className="mb-6 text-xs font-normal">
                  Vehicle Details
                </Label>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                  <div>
                    <p className="text-sm font-semibold leading-none ">
                      {vehicle.year}
                    </p>
                    <span className="leading-none text-[10px]">Year</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none ">
                      {vehicle.mileage.toLocaleString("en-IN")} km
                    </p>
                    <span className="leading-none text-[10px]">Mileage</span>
                  </div>
                  {vehicle.engineCC && (
                    <div>
                      <p className="text-sm font-semibold leading-none ">
                        {vehicle.engineCC} cc
                      </p>
                      <span className="leading-none text-[10px]">Engine</span>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold leading-none ">
                      {vehicle.transmission}
                    </p>
                    <span className="leading-none text-[10px]">
                      Transmission
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold leading-none ">
                      {vehicle.driveType}
                    </p>
                    <span className="leading-none text-[10px]">Drive Type</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none ">
                      {vehicle.fuelType}
                    </p>
                    <span className="leading-none text-[10px]">Fuel Type</span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold leading-none ">
                      {vehicle.category}
                    </p>
                    <span className="leading-none text-[10px]">Category</span>
                  </div>
                  {vehicle.colour && (
                    <div>
                      <p className="text-sm font-semibold leading-none ">
                        {vehicle.colour}
                      </p>
                      <span className="leading-none text-[10px]">Color</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground">
                    Listed on {formatDate(vehicle.createdAt)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getDaysDifference(vehicle.createdAt, new Date())}d ago
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-normal ">Seller Details</Label>
                  <div className="py-4 text-sm text-gray-700 border-y ">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <User className="w-5 h-5 ml-2" />
                        <div className="flex flex-col gap-1">
                          <p
                            className="flex items-center text-base font-semibold leading-none cursor-pointer group "
                            onClick={() =>
                              navigate(
                                `/garage/customers/${vehicle.seller._id}`
                              )
                            }
                          >
                            {vehicle.seller.name}
                            <ArrowUpRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </p>

                          <p className="flex items-center text-xs">
                            <div></div>
                            {vehicle.seller.contactNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          className="p-2 border rounded-full shadow-md"
                          href={`sms:${vehicle.seller.contactNumber}`}
                        >
                          <MessageSquare className="w-5 h-5" />
                        </a>
                        <a
                          className="p-2 border rounded-full shadow-md"
                          href={`tel:${vehicle.seller.contactNumber}`}
                        >
                          <PhoneCall className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                {vehicle.status === "Available" && (
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="space-x-2">
                      {vehicle.status === "Available" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDelete}
                        >
                          <span className="sr-only sm:not-sr-only">Delete</span>
                          <Trash className="w-4 h-4 sm:ml-2" />
                        </Button>
                      )}
                      {vehicle.status === "Available" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEdit}
                        >
                          <span className="sr-only sm:not-sr-only">Edit</span>
                          <Edit className="w-4 h-4 sm:ml-2" />
                        </Button>
                      )}
                    </div>
                    <Button>
                      <span>Sell Now</span>
                      <ShoppingBag className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {vehicle.status === "Available" && (
            <PotentialBuyers vehicleId={vehicle._id} />
          )}
        </div>
        <DeleteVehicleListing
          deleteId={deleteId}
          setDeleteId={setDeleteId}
          showDelete={showDelete}
          setShowDelete={setShowDelete}
        />
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }
  return content;
}

export default VehicleDetails;
