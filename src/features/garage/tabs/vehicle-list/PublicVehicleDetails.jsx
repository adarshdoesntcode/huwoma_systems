import Loader from "@/components/Loader";
import { useGetPublicVehicleDetailsQuery } from "../../garageApiSlice";
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

import {
  ArrowUpRight,
  Calendar,
  MessageSquare,
  PhoneCall,
  User,
} from "lucide-react";
import { formatCurrency, formatDate, getDaysDifference } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { IMAGE_DATA } from "@/lib/config";

function PublicVehicleDetails() {
  const { id } = useParams();

  const navigate = useNavigate();
  const { data, isLoading, isFetching, isSuccess, isError, refetch, error } =
    useGetPublicVehicleDetailsQuery(id);

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
      <div className="flex flex-col h-full max-w-6xl mx-auto duration-300 fade-in animate-in slide-in-from-bottom-4">
        <header className="flex sticky top-0 h-14 items-center gap-4 z-50 bg-slate-100/50 backdrop-filter backdrop-blur-lg px-4 lg:h-[60px] lg:px-6">
          <div className="relative flex-1 ml-auto ">
            <div className="flex items-center justify-center ">
              <img
                loading="lazy"
                src={IMAGE_DATA.huwoma_logo}
                className="h-6 mx-auto aspect-auto"
              />
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 bg-white rounded-lg sm:p-6">
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
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
                {vehicle.description && (
                  <div>
                    <Separator className="mt-2" />
                    <Label className="mb-2">Description</Label>
                    <div className="text-xs italic text-gray-600">
                      {`"${vehicle.description}"`}
                    </div>
                  </div>
                )}

                {/* <div className="space-y-2">
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
                </div> */}
                {/* {vehicle.transaction && vehicle.status === "Sold" && (
                  <div className="space-y-2">
                    <Label className="text-xs font-normal ">
                      Buyer Details
                    </Label>
                    <div className="py-4 text-sm text-gray-700 border-y ">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <User className="w-5 h-5 ml-2" />
                          <div className="flex flex-col gap-1">
                            <p
                              className="flex items-center text-base font-semibold leading-none cursor-pointer group "
                              onClick={() =>
                                navigate(
                                  `/garage/customers/${vehicle.transaction.buyer._id}`
                                )
                              }
                            >
                              {vehicle.transaction.buyer.name}
                              <ArrowUpRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </p>

                            <p className="flex items-center text-xs">
                              {vehicle.transaction.buyer.contactNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Paid</span>
                          <Badge className="text-sm text-green-600 border-green-100 bg-green-50">
                            {formatCurrency(vehicle.transaction.sellingPrice)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}
                <Separator className="mt-2" />

                {vehicle.status === "Available" ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      Listed on {formatDate(vehicle.createdAt)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {getDaysDifference(vehicle.createdAt, new Date())}d ago
                    </div>
                  </div>
                ) : (
                  vehicle.status === "Sold" && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        Sold on{" "}
                        {formatDate(vehicle.transaction.transactionTime)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {getDaysDifference(
                          vehicle.transaction.transactionTime,
                          new Date()
                        )}
                        d ago
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isError) {
    content = (
      <div className="flex flex-col h-full max-w-6xl mx-auto duration-300 fade-in animate-in slide-in-from-bottom-4">
        <header className="flex sticky top-0 h-14 items-center gap-4 z-50 bg-slate-100/50 backdrop-filter backdrop-blur-lg px-4 lg:h-[60px] lg:px-6">
          <div className="relative flex-1 ml-auto ">
            <div className="flex items-center justify-center ">
              <img
                loading="lazy"
                src={IMAGE_DATA.huwoma_logo}
                className="h-6 mx-auto aspect-auto"
              />
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <ApiError error={error} refetch={refetch} />;
        </div>
      </div>
    );
  }
  return content;
}

export default PublicVehicleDetails;
