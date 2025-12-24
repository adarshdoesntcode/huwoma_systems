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
  Calendar,
  Edit,
  Heart,
  MessageSquare,
  PhoneCall,
  Share,
  Share2,
  ShoppingBag,
  Trash,
  User,
} from "lucide-react";
import DeleteVehicleListing from "./mutation/DeleteVehicleListing";
import PotentialBuyers from "../../components/PotentialBuyers";
import { capitalizeFirstLetter, formatCurrency, formatDate, getDaysDifference } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import ShareVehicle from "./mutation/ShareVehicle";

function VehicleDetails() {
  const { id } = useParams();
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [shareId, setShareId] = useState(null);
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

  const handleShare = () => {
    setShowShare(true);
    setShareId(id);
  };

  const handleSellNow = () => {
    navigate("/garage/sell-vehicle", {
      state: {
        selectedVehicle: data.data,
      },
    });
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
        <div className="flex-1 p-4 bg-white border rounded-lg shadow-sm sm:p-6">
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
                  <StatusBadge status={vehicle.status} />
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
                        {vehicle.engineCC} cc/kW
                      </p>
                      <span className="leading-none text-[10px]">Power</span>
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
                {vehicle.description && (
                  <div>
                    <Separator className="mt-2" />
                    <Label className="mb-2">Description</Label>
                    <div className="text-xs italic text-gray-600">
                      {`"${vehicle.description}"`}
                    </div>
                  </div>
                )}

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
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      Listed on {formatDate(vehicle.createdAt)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {capitalizeFirstLetter(vehicle.listingType)}
                    </div>
                  </div>
                </div>
                {vehicle.transactions?.length > 0 &&
                  <div className="space-y-2">
                    <Label className="text-xs font-normal ">
                      Buyer Details
                    </Label>

                    {vehicle.transactions.map(transaction => {
                      return (
                        <>
                          <div className="py-4 text-sm text-gray-700 border-y ">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <User className="w-5 h-5 ml-2" />
                                <div className="flex flex-col gap-1">
                                  <p
                                    className="flex items-center text-base font-semibold leading-none cursor-pointer group "
                                    onClick={() =>
                                      navigate(
                                        `/garage/customers/${transaction.buyer._id
                                        }`
                                      )
                                    }
                                  >
                                    {
                                      transaction.buyer.name
                                    }
                                    <ArrowUpRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                  </p>

                                  <p className="flex items-center text-xs">
                                    {
                                      transaction.buyer.contactNumber
                                    }
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">Paid</span>
                                <Badge className="text-sm text-green-600 border-green-100 bg-green-50">
                                  {formatCurrency(
                                    transaction.sellingPrice
                                  )}
                                </Badge>
                              </div>
                            </div>

                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Calendar className="w-3 h-3 text-gray-500" />
                              Sold on
                              {" "}{formatDate(
                                transaction.transactionTime
                              )}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {getDaysDifference(
                                transaction.transactionTime,
                                new Date()
                              ) > 0 ? getDaysDifference(
                                transaction.transactionTime,
                                new Date()
                              ) + "d ago" : "Today"}
                            </div>
                          </div>
                        </>
                      )
                    })}
                  </div>}


                {
                  vehicle.status === "Available" && (
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
                        {vehicle.status === "Available" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShare}
                          >
                            <span className="sr-only sm:not-sr-only">Share</span>
                            <Share2 className="w-4 h-4 sm:ml-2" />
                          </Button>
                        )}
                      </div>
                      <Button onClick={handleSellNow}>
                        <span>Sell Now</span>
                        <ShoppingBag className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          {/* Interested Buyers Section */}
          {vehicle.interestedBuyers?.filter(ib => !ib.fulfilled).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <Label className="text-base font-semibold">
                  Interested Buyers ({vehicle.interestedBuyers.filter(ib => !ib.fulfilled).length})
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {vehicle.interestedBuyers
                  .filter(ib => !ib.fulfilled)
                  .map((interest, idx) => (
                    <div
                      key={idx}
                      className="relative flex flex-col justify-between p-4 transition-all duration-300 border rounded-lg shadow-sm hover:shadow-md bg-card text-card-foreground animate-in fade-in-10 slide-in-from-bottom-1"
                    >
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p
                              className="text-sm font-semibold leading-none cursor-pointer hover:underline"
                              onClick={() =>
                                navigate(`/garage/customers/${interest.customer._id}`)
                              }
                            >
                              {interest.customer.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                              <PhoneCall className="w-3 h-3" />
                              {interest.customer.contactNumber}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-auto border-t">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {getDaysDifference(interest.createdAt, new Date())}d ago
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`sms:${interest.customer.contactNumber}`}
                            className="inline-flex items-center justify-center w-8 h-8 transition-colors border rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${interest.customer.contactNumber}`}
                            className="inline-flex items-center justify-center w-8 h-8 transition-colors border rounded-md hover:bg-accent hover:text-accent-foreground"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {vehicle.status === "Available" && (
            <PotentialBuyers vehicle={vehicle} />
          )}
        </div>
        <DeleteVehicleListing
          deleteId={deleteId}
          setDeleteId={setDeleteId}
          showDelete={showDelete}
          setShowDelete={setShowDelete}
        />
        <ShareVehicle
          shareId={shareId}
          setShowShare={setShowShare}
          setShareId={setShareId}
          showShare={showShare}
        />
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }
  return content;
}

export default VehicleDetails;
