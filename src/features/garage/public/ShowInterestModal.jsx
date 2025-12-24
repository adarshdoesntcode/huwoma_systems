import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, User, Phone, Loader2, CheckCircle } from "lucide-react";
import { useAddPublicVehicleInterestMutation } from "../garageApiSlice";
import { toast } from "@/hooks/use-toast";

function ShowInterestModal({ vehicleId, vehicleName }) {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [addInterest, { isLoading }] = useAddPublicVehicleInterestMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await addInterest({
                vehicleId,
                name: data.name,
                contactNumber: data.contactNumber,
            });

            if (res.error) {
                throw new Error(res.error.data?.message || "Failed to submit interest");
            }

            setSubmitted(true);
            toast({
                title: "Interest Submitted!",
                description: "We will contact you soon.",
                duration: 3000,
            });

            // Close modal after 2 seconds
            setTimeout(() => {
                setOpen(false);
                setSubmitted(false);
                reset();
            }, 2000);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                    <Heart className="w-4 h-4 mr-2" />
                    Interested
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                        <h3 className="text-lg font-semibold">Thank You!</h3>
                        <p className="text-sm text-muted-foreground">
                            We have received your interest.
                        </p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Express Your Interest</DialogTitle>
                            <DialogDescription>
                                Interested in {vehicleName}? Enter your details and we&apos;ll
                                get in touch with you.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Full Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    autoComplete="off"
                                    placeholder="Enter your full name"
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Name must be at least 2 characters",
                                        },
                                    })}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="contactNumber"
                                    className="flex items-center gap-2"
                                >
                                    <Phone className="w-4 h-4" />
                                    Contact Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="contactNumber"
                                    type="tel"
                                    autoComplete="off"
                                    inputMode="numeric"
                                    placeholder="Enter your phone number"
                                    {...register("contactNumber", {
                                        required: "Contact number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Enter a valid 10-digit phone number",
                                        },
                                    })}
                                />
                                {errors.contactNumber && (
                                    <p className="text-xs text-red-500">
                                        {errors.contactNumber.message}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Heart className="w-4 h-4 mr-2" />
                                        Submit Interest
                                    </>
                                )}
                            </Button>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ShowInterestModal;
