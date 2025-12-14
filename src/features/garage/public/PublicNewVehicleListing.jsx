import NavBackButton from "@/components/NavBackButton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Steps from "@/components/Steps";
import { cleanObject } from "@/lib/utils";
import { usePublicNewVehicleListingMutation } from "../garageApiSlice";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PublicSellerForm from "./form/PublicSellerForm";
import PublicVehicleDetailsForm from "./form/PublicVehicleDetailsForm";
import PublicVehicleImagesForm from "./form/PublicVehicleImagesForm";
import PublicPreviewForm from "./form/PublicPreviewForm";
import { IMAGE_DATA } from "@/lib/config";

function PublicNewVehicleListing() {
    const [selectedMake, setSelectedMake] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTransmission, setSelectedTransmission] = useState("");
    const [selectedFuelType, setSelectedFuelType] = useState("");
    const [selectedDriveType, setSelectedDriveType] = useState("");
    const [selectedListingType, setSelectedListingType] = useState("DIRECT");
    const [managedImages, setManagedImages] = useState([]);
    const [finalImageUrls, setFinalImageUrls] = useState([]);

    const [formStep, setFormStep] = useState(0);

    const [publicNewVehicleListing] = usePublicNewVehicleListingMutation();
    const navigate = useNavigate();
    const {
        handleSubmit,
        reset,
        trigger,
        setError,
        clearErrors,
        register,
        getValues,
        watch,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        const sellerPayload = {
            name: data.sellerName,
            contactNumber: data.sellerContact,
        };

        const vehiclePayload = cleanObject({
            make: selectedMake,
            category: selectedCategory,
            transmission: selectedTransmission,
            fuelType: selectedFuelType,
            driveType: selectedDriveType,
            listingType: selectedListingType,
            model: data.model,
            variant: data.variant,
            year: data.year,
            numberPlate: data?.numberPlate || "NO PLATE",
            mileage: data.mileage,
            askingPrice: data.askingPrice,
            engineCC: data.engineCC,
            colour: data.colour,
            description: data.description,
            photos: finalImageUrls,
        });

        const finalPayload = {
            seller: sellerPayload,
            vehicle: vehiclePayload,
        };

        try {
            const res = await publicNewVehicleListing({
                ...finalPayload,
            });
            if (res.error) {
                throw new Error(res.error.data.message);
            }
            if (!res.error) {
                toast({
                    title: "Vehicle Submitted!",
                    description: "Your vehicle will be visible after verification.",
                    duration: 3000,
                });
                reset();
                navigate(`/garagebyhuwoma`);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: error.message,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="flex sticky top-0 h-14 items-center gap-4 z-50 bg-slate-100/50 backdrop-filter backdrop-blur-lg px-4 lg:h-[60px] lg:px-6">
                <div className="relative max-w-4xl lg:px-8  px-4 mx-auto flex-1">
                    <div className="flex items-center justify-between">
                        <img
                            loading="lazy"
                            src={IMAGE_DATA.huwoma_logo}
                            className="h-6 aspect-auto"
                        />

                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-4">
                    <NavBackButton buttonText={"Back"} navigateTo={"/garagebyhuwoma"} />
                </div>

                <Card className="p-0 bg-transparent border-none shadow-none">
                    <CardHeader className="p-0">
                        <div className="flex items-end justify-between px-1">
                            <div>
                                <CardTitle className="text-lg sm:text-xl">
                                    List Your Vehicle
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Submit your vehicle for sale. It will be visible after verification.
                                </CardDescription>
                            </div>
                            <Steps steps={4} current={formStep} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                        <form
                            id="public-vehicle-form"
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid gap-6"
                        >
                            {formStep === 0 && (
                                <PublicSellerForm
                                    register={register}
                                    errors={errors}
                                    trigger={trigger}
                                    clearErrors={clearErrors}
                                    setFormStep={setFormStep}
                                    setFocus={setFocus}
                                />
                            )}

                            {formStep === 1 && (
                                <PublicVehicleDetailsForm
                                    register={register}
                                    selectedMake={selectedMake}
                                    setSelectedMake={setSelectedMake}
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    selectedTransmission={selectedTransmission}
                                    setSelectedTransmission={setSelectedTransmission}
                                    selectedFuelType={selectedFuelType}
                                    setSelectedFuelType={setSelectedFuelType}
                                    selectedDriveType={selectedDriveType}
                                    setSelectedDriveType={setSelectedDriveType}
                                    selectedListingType={selectedListingType}
                                    setSelectedListingType={setSelectedListingType}
                                    setFormStep={setFormStep}
                                    errors={errors}
                                    setError={setError}
                                    trigger={trigger}
                                    clearErrors={clearErrors}
                                    setFocus={setFocus}
                                />
                            )}

                            {formStep === 2 && (
                                <PublicVehicleImagesForm
                                    setFormStep={setFormStep}
                                    managedImages={managedImages}
                                    setManagedImages={setManagedImages}
                                    setFinalImageUrls={setFinalImageUrls}
                                />
                            )}

                            {formStep === 3 && (
                                <PublicPreviewForm
                                    setFormStep={setFormStep}
                                    getValues={getValues}
                                    selectedMake={selectedMake}
                                    selectedCategory={selectedCategory}
                                    selectedTransmission={selectedTransmission}
                                    selectedFuelType={selectedFuelType}
                                    selectedDriveType={selectedDriveType}
                                    selectedListingType={selectedListingType}
                                    finalImageUrls={finalImageUrls}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>


        </div>
    );
}

export default PublicNewVehicleListing;
