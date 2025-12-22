import { useParams, useNavigate } from "react-router-dom";
import { useGetVehicleDetailsQuery, useVerifyVehicleMutation } from "../../garageApiSlice";
import NavBackButton from "@/components/NavBackButton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import PhotoGallery from "@/components/PhotoGallery";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { toast } from "@/hooks/use-toast";
import { capitalizeFirstLetter } from "@/lib/utils";

function VerifyVehicle() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isSuccess, isError, error, refetch } =
        useGetVehicleDetailsQuery(id);

    const [verifyVehicle, { isLoading: isVerifying }] = useVerifyVehicleMutation();

    const vehicle = data?.data;

    const handleApprove = async () => {
        try {
            const res = await verifyVehicle({ id, action: "approve" });
            if (res.error) {
                throw new Error(res.error.data?.message || "Failed to approve");
            }
            toast({
                title: "Vehicle Approved",
                description: "The vehicle has been verified and listed.",
                duration: 2000,
            });
            navigate("/garage");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    };

    const handleReject = async () => {
        try {
            const res = await verifyVehicle({ id, action: "reject" });
            if (res.error) {
                throw new Error(res.error.data?.message || "Failed to reject");
            }
            toast({
                title: "Vehicle Rejected",
                description: "The vehicle listing has been rejected.",
                duration: 2000,
            });
            navigate("/garage");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    };

    let content;

    if (isLoading) {
        content = (
            <div className="flex items-center justify-center flex-1 h-full py-10">
                <Loader />
            </div>
        );
    } else if (isSuccess && vehicle) {
        const seller = vehicle.seller || {};
        const photos = vehicle.photos || [];

        content = (
            <div className="duration-500 slide-in-from-right-5 animate-in">
                <div className="grid gap-2 p-4 border shadow-sm rounded-xl sm:p-6 bg-background">
                    <div>
                        <h3 className="text-lg font-semibold">Verify Vehicle Listing</h3>
                        <p className="text-sm text-muted-foreground">
                            Review the details and approve or reject this listing
                        </p>
                    </div>

                    <h3 className="pb-2 font-semibold border-b">Seller</h3>
                    <div className="duration-300 fade-in animate-in">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 sm:col-span-1">
                                <Label>Information</Label>
                                <Separator className="my-2" />
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Full Name
                                    </div>
                                    <div className="text-xs font-medium">
                                        {seller?.name || "-"}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Contact Number
                                    </div>
                                    <div className="text-xs font-medium">
                                        {seller?.contactNumber || "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="pb-2 font-semibold border-b">Vehicle</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <Label>Information</Label>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Manufacturer
                                </div>
                                <div className="text-xs font-medium">{vehicle.make || "-"}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Model
                                </div>
                                <div className="text-xs font-medium">{vehicle.model || "-"}</div>
                            </div>
                            {vehicle.variant && (
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Variant
                                    </div>
                                    <div className="text-xs font-medium">{vehicle.variant}</div>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Manufactured Year
                                </div>
                                <div className="text-xs font-medium">{vehicle.year || "-"}</div>
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label>Registration & Specification</Label>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Number Plate
                                </div>
                                <div className="text-xs font-medium">
                                    {vehicle.numberPlate || "-"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Kilometers Driven
                                </div>
                                <div className="text-xs font-medium">
                                    {vehicle.mileage
                                        ? `${Number(vehicle.mileage)?.toLocaleString("en-IN")} kms`
                                        : "-"}
                                </div>
                            </div>
                            {vehicle.engineCC && (
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Engine CC
                                    </div>
                                    <div className="text-xs font-medium">
                                        {vehicle.engineCC ? `${vehicle.engineCC} cc` : "-"}
                                    </div>
                                </div>
                            )}
                            {vehicle.colour && (
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Colour Name
                                    </div>
                                    <div className="text-xs font-medium">{vehicle.colour}</div>
                                </div>
                            )}
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label>Classification</Label>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Category
                                </div>
                                <div className="text-xs font-medium">
                                    {vehicle.category || "-"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Transmission
                                </div>
                                <div className="text-xs font-medium">
                                    {vehicle.transmission || "-"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Drive Type
                                </div>
                                <div className="text-xs font-medium">
                                    {vehicle.driveType || "-"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Fuel Type
                                </div>
                                <div className="text-xs font-medium">
                                    {vehicle.fuelType || "-"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Listing Type
                                </div>
                                <div className="text-xs font-medium">
                                    {capitalizeFirstLetter(vehicle.listingType) || "-"}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            {vehicle.description && (
                                <>
                                    <Label>Description</Label>
                                    <Separator className="my-2" />
                                    <div className="text-xs">
                                        <div className="flex flex-col items-start justify-between">
                                            {vehicle.description}
                                        </div>
                                    </div>
                                </>
                            )}

                            <Separator className="mt-6 mb-2" />
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium">
                                    <Label>Expected Price</Label>
                                </div>
                                <div className="text-sm font-semibold">
                                    {vehicle.askingPrice
                                        ? `Rs. ${Number(vehicle.askingPrice)?.toLocaleString("en-IN")}`
                                        : "-"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Label className="mt-4">Images</Label>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                        <PhotoGallery photos={photos} />
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t">
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isVerifying}
                        >
                            {isVerifying ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <XCircle className="w-4 h-4 mr-2" />
                            )}
                            Reject
                        </Button>
                        <Button onClick={handleApprove} disabled={isVerifying}>
                            {isVerifying ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            Approve
                        </Button>
                    </div>
                </div>
            </div>
        );
    } else if (isError) {
        content = <ApiError error={error} refetch={refetch} />;
    }

    return (
        <div className="grid items-start w-full max-w-4xl gap-4 mx-auto mb-64">
            <div>
                <NavBackButton buttonText={"Back"} navigateTo={-1} />
            </div>
            <Card className="p-0 bg-transparent border-none shadow-none">
                <CardHeader className="p-0">
                    <div className="flex items-end justify-between px-1">
                        <div>
                            <CardTitle className="text-lg sm:text-xl">
                                Vehicle Verification
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Review and verify this vehicle listing
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">{content}</CardContent>
            </Card>
        </div>
    );
}

export default VerifyVehicle;
