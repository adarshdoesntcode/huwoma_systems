import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Car, User, Phone } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { capitalizeFirstLetter } from "@/lib/utils";

function PublicPreviewForm({
    setFormStep,
    getValues,
    selectedMake,
    selectedCategory,
    selectedTransmission,
    selectedFuelType,
    selectedDriveType,
    selectedListingType,
    finalImageUrls,
    isSubmitting,
}) {
    const formData = getValues();

    return (
        <div className="duration-500 slide-in-from-right-5 animate-in">
            <div className="p-4 border shadow-sm rounded-xl sm:p-6 bg-background">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold">Review Your Listing</h3>
                    <p className="text-sm text-muted-foreground">
                        Please verify all details before submitting
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Images */}
                    <div>
                        {finalImageUrls.length > 0 && (
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {finalImageUrls.map((photo, index) => (
                                        <CarouselItem key={index}>
                                            <img
                                                src={photo.primaryUrl || photo.fallbackUrl}
                                                alt={`Vehicle ${index + 1}`}
                                                className="object-cover w-full h-64 rounded-lg"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {finalImageUrls.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-2" />
                                        <CarouselNext className="right-2" />
                                    </>
                                )}
                            </Carousel>
                        )}
                        <p className="mt-2 text-xs text-center text-muted-foreground">
                            {finalImageUrls.length} photo(s) uploaded
                        </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        {/* Seller Info */}
                        <div className="p-4 border rounded-lg bg-muted/50">
                            <h4 className="flex items-center gap-2 mb-3 font-semibold">
                                <User className="w-4 h-4" /> Seller Information
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="font-medium">{formData.sellerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Contact:</span>
                                    <span className="font-medium">{formData.sellerContact}</span>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="p-4 border rounded-lg bg-muted/50">
                            <h4 className="flex items-center gap-2 mb-3 font-semibold">
                                <Car className="w-4 h-4" /> Vehicle Details
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between col-span-2">
                                    <span className="text-muted-foreground">Vehicle:</span>
                                    <span className="font-medium">
                                        {formData.year} {selectedMake} {formData.model}
                                    </span>
                                </div>
                                {formData.variant && (
                                    <div className="flex justify-between col-span-2">
                                        <span className="text-muted-foreground">Variant:</span>
                                        <span className="font-medium">{formData.variant}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Category:</span>
                                    <span className="font-medium">{selectedCategory}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Transmission:</span>
                                    <span className="font-medium">{selectedTransmission}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fuel:</span>
                                    <span className="font-medium">{selectedFuelType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Drive:</span>
                                    <span className="font-medium">{selectedDriveType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mileage:</span>
                                    <span className="font-medium">
                                        {Number(formData.mileage).toLocaleString("en-IN")} km
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Power:</span>
                                    <span className="font-medium">{formData.engineCC} cc/kW</span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="p-4 text-center border rounded-lg bg-green-50">
                            <p className="text-sm text-muted-foreground">Asking Price</p>
                            <p className="text-2xl font-bold text-green-600">
                                Rs. {Number(formData.askingPrice).toLocaleString("en-IN")}
                            </p>
                        </div>

                        {formData.description && (
                            <div className="p-4 border rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold">Description</h4>
                                <p className="text-sm text-muted-foreground">
                                    {formData.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-6 mt-6 border-t">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => setFormStep(2)}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                        type="submit"
                        form="public-vehicle-form"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Submit for Verification
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PublicPreviewForm;
