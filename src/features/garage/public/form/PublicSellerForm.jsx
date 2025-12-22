import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, User, Phone } from "lucide-react";

function PublicSellerForm({
    register,
    errors,
    trigger,
    clearErrors,
    setFormStep,
    setFocus,
}) {
    const handleNext = async () => {
        const isValid = await trigger(["sellerName", "sellerContact"]);

        if (!isValid) {
            const firstErrorField = ["sellerName", "sellerContact"].find(
                (field) => errors[field]
            );
            if (firstErrorField) {
                setFocus(firstErrorField);
            }
            return;
        }

        setFormStep(1);
    };

    return (
        <div className="duration-500 slide-in-from-right-5 animate-in">
            <div className="grid gap-6 p-4 border shadow-sm rounded-xl sm:p-6 bg-background">
                <div>
                    <h3 className="text-lg font-semibold">Seller Information</h3>
                    <p className="text-sm text-muted-foreground">
                        Enter your contact details
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="sellerName" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="sellerName"
                            autoComplete="off"
                            placeholder="Enter your full name"
                            {...register("sellerName", {
                                required: "Name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters",
                                },
                                onChange: () => clearErrors("sellerName"),
                            })}
                        />
                        {errors.sellerName && (
                            <p className="text-xs text-red-500">{errors.sellerName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sellerContact" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Contact Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="sellerContact"
                            type="tel"
                            autoComplete="off"
                            inputMode="numeric"
                            placeholder="Enter your phone number"
                            {...register("sellerContact", {
                                required: "Contact number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Enter a valid 10-digit phone number",
                                },
                                onChange: () => clearErrors("sellerContact"),
                            })}
                        />
                        {errors.sellerContact && (
                            <p className="text-xs text-red-500">{errors.sellerContact.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="button" onClick={handleNext}>
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PublicSellerForm;
