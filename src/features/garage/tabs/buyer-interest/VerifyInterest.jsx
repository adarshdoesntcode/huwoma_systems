import { useParams, useNavigate } from "react-router-dom";
import { useGetInterestDetailsQuery, useVerifyBuyerInterestMutation } from "../../garageApiSlice";
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
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { toast } from "@/hooks/use-toast";
import { capitalizeFirstLetter, formatCurrency } from "@/lib/utils";

function VerifyInterest() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isSuccess, isError, error, refetch } =
        useGetInterestDetailsQuery(id);

    const [verifyInterest, { isLoading: isVerifying }] = useVerifyBuyerInterestMutation();

    const interest = data?.data;

    const handleApprove = async () => {
        try {
            const res = await verifyInterest({ id, action: "approve" });
            if (res.error) {
                throw new Error(res.error.data?.message || "Failed to approve");
            }
            toast({
                title: "Interest Approved",
                description: "The buyer preference has been activated.",
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
            const res = await verifyInterest({ id, action: "reject" });
            if (res.error) {
                throw new Error(res.error.data?.message || "Failed to reject");
            }
            toast({
                title: "Interest Rejected",
                description: "The buyer preference has been cancelled.",
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
    } else if (isSuccess && interest) {
        const buyer = interest.buyer || {};
        const criteria = interest.criteria || {};

        content = (
            <div className="duration-500 slide-in-from-right-5 animate-in">
                <div className="grid gap-2 p-4 border shadow-sm rounded-xl sm:p-6 bg-background">
                    <div>
                        <h3 className="text-lg font-semibold">Verify Buyer Preference</h3>
                        <p className="text-sm text-muted-foreground">
                            Review details and approve or reject this preference
                        </p>
                    </div>

                    <h3 className="pb-2 font-semibold border-b">Buyer</h3>
                    <div className="duration-300 fade-in animate-in">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 sm:col-span-1">
                                <Label>Information</Label>
                                <Separator className="my-2" />
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Full Name
                                    </div>
                                    <div className="text-xs font-medium">{buyer.name || "-"}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Contact Number
                                    </div>
                                    <div className="text-xs font-medium">
                                        {buyer.contactNumber || "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="pb-2 font-semibold border-b">Preferences</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <Label>Budget</Label>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Range
                                </div>
                                <div className="text-xs font-medium">
                                    {formatCurrency(interest.budget?.min)} -{" "}
                                    {formatCurrency(interest.budget?.max)}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label>Vehicles</Label>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Makes
                                </div>
                                <div className="text-xs font-medium text-right">
                                    {criteria.makes?.length > 0
                                        ? criteria.makes.join(", ")
                                        : "Any"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Categories
                                </div>
                                <div className="text-xs font-medium text-right">
                                    {criteria.categories?.length > 0
                                        ? criteria.categories.join(", ")
                                        : "Any"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Models
                                </div>
                                <div className="text-xs font-medium text-right">
                                    {criteria.models?.length > 0
                                        ? criteria.models.join(", ")
                                        : "Any"}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label>Specs</Label>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Fuel Types
                                </div>
                                <div className="text-xs font-medium text-right">
                                    {criteria.fuelTypes?.length > 0
                                        ? criteria.fuelTypes.join(", ")
                                        : "Any"}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Transmission
                                </div>
                                <div className="text-xs font-medium text-right">
                                    {criteria.transmissions?.length > 0
                                        ? criteria.transmissions.join(", ")
                                        : "Any"}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label>Other Criteria</Label>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Year Range
                                </div>
                                <div className="text-xs font-medium">
                                    {criteria.year?.min} - {criteria.year?.max}
                                </div>
                            </div>
                            {criteria.mileageMax && (
                                <div className="flex items-center justify-between mt-1">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Max Mileage
                                    </div>
                                    <div className="text-xs font-medium">
                                        {criteria.mileageMax.toLocaleString()} km
                                    </div>
                                </div>
                            )}
                        </div>
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
                                Preference Verification
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Review and verify this buyer preference
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">{content}</CardContent>
            </Card>
        </div>
    );
}

export default VerifyInterest;
