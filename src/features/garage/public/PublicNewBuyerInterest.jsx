import { useState } from "react";
import { useForm } from "react-hook-form";
import NavBackButton from "@/components/NavBackButton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Steps from "@/components/Steps";
import { cleanObject } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { usePublicNewBuyerInterestMutation } from "../garageApiSlice";
import PublicSellerForm from "./form/PublicSellerForm";
import PublicBuyerInterestForm from "./form/PublicBuyerInterestForm";
import { IMAGE_DATA } from "@/lib/config";

function PublicNewBuyerInterest() {
    const [formStep, setFormStep] = useState(0);
    const [selectedInterestMakes, setSelectedInterestMakes] = useState([]);
    const [selectedInterestCategories, setSelectedInterestCategories] = useState([]);
    const [selectedInterestFuelTypes, setSelectedInterestFuelTypes] = useState([]);
    const [selectedInterestTransmissions, setSelectedInterestTransmissions] = useState([]);
    const [selectedInterestDriveTypes, setSelectedInterestDriveTypes] = useState([]);
    const [selectedInterestModels, setSelectedInterestModels] = useState([]);

    const [publicNewBuyerInterest] = usePublicNewBuyerInterestMutation();
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
        const buyerPayload = {
            name: data.sellerName,
            contactNumber: data.sellerContact,
        };

        const buyerInterestPayload = cleanObject({
            budget: {
                min: data.min,
                max: data.max,
            },
            criteria: {
                categories: selectedInterestCategories,
                makes: selectedInterestMakes,
                transmissions: selectedInterestTransmissions,
                driveTypes: selectedInterestDriveTypes,
                fuelTypes: selectedInterestFuelTypes,
                models: selectedInterestModels,
                mileageMax: data.mileageMax,
                year: {
                    min: data.from,
                    max: data.to,
                },
            },
        });

        const finalPayload = {
            buyer: buyerPayload,
            buyerInterest: buyerInterestPayload,
        };

        try {
            const res = await publicNewBuyerInterest(finalPayload);
            if (res.error) {
                throw new Error(res.error.data?.message || "Failed to submit");
            }
            toast({
                title: "Preference Submitted!",
                description: "You will be contacted if your preference matches with our sellers.",
                duration: 5000,
            });
            reset();
            navigate("/garagebyhuwoma");
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
                <div className="relative max-w-4xl lg:px-8 px-4 mx-auto flex-1">
                    <div className="flex items-center justify-between">
                        <img
                            loading="lazy"
                            src={IMAGE_DATA.huwoma_logo}
                            className="h-6 aspect-auto cursor-pointer"
                            onClick={() => navigate("/garagebyhuwoma")}
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
                                    Your Buying Preference
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Tell us what you&apos;re looking for.
                                </CardDescription>
                            </div>
                            <Steps steps={2} current={formStep} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                        <form
                            id="public-buyer-interest-form"
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
                                <PublicBuyerInterestForm
                                    setFormStep={setFormStep}
                                    selectedInterestMakes={selectedInterestMakes}
                                    setSelectedInterestMakes={setSelectedInterestMakes}
                                    selectedInterestCategories={selectedInterestCategories}
                                    setSelectedInterestCategories={setSelectedInterestCategories}
                                    selectedInterestTransmissions={selectedInterestTransmissions}
                                    setSelectedInterestTransmissions={setSelectedInterestTransmissions}
                                    selectedInterestFuelTypes={selectedInterestFuelTypes}
                                    setSelectedInterestFuelTypes={setSelectedInterestFuelTypes}
                                    selectedInterestDriveTypes={selectedInterestDriveTypes}
                                    setSelectedInterestDriveTypes={setSelectedInterestDriveTypes}
                                    selectedInterestModels={selectedInterestModels}
                                    setSelectedInterestModels={setSelectedInterestModels}
                                    register={register}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    getValues={getValues}
                                    trigger={trigger}
                                    setFocus={setFocus}
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

export default PublicNewBuyerInterest;
