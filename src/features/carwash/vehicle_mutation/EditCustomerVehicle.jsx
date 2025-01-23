import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useEditCarwashTransactionMutation,
  useEditCustomerVehicleMutation,
  useGetPreEditDataQuery,
} from "../carwashApiSlice";
import Loader from "@/components/Loader";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { CAR_COLOR_OPTIONS } from "@/lib/config";
import { cn } from "@/lib/utils";

function EditCustomerVehicle({
  showVehicleEdit,
  setShowVehicleEdit,
  vehicleDetails,
  setVehicleDetails,
  customerId,
}) {
  const [selectedColor, setSelectedColor] = useState(
    vehicleDetails?.vehicleColor || ""
  );
  const [carColors, setCarColors] = useState(CAR_COLOR_OPTIONS);

  const [editCustomerVehicle, { isLoading: isSubmitting }] =
    useEditCustomerVehicleMutation();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const handleCloseEdit = () => {
    setVehicleDetails("");
    setShowVehicleEdit(false);
    reset();
  };

  const handleEdit = async (data) => {
    try {
      if (!vehicleDetails) return;
      if (!selectedColor) {
        toast({
          variant: "destructive",
          title: "Something went wrong!!",
          description: "Please select a color",
        });
        return;
      }
      let payload;

      payload = {
        transactions: vehicleDetails.transactions.map(
          (transaction) => transaction._id
        ),
        customerId: customerId,
        vehicleModel: data.vehicleModel,
        vehicleNumber: data.vehicleNumber,
        vehicleColor: selectedColor,
      };

      const res = await editCustomerVehicle(payload);
      if (res.error) {
        handleCloseEdit();
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        handleCloseEdit();
        toast({
          title: "Vehicle Edited!",
          description: "Successfully",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  let content;

  content = (
    <>
      <form
        className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1"
        id="edit-customer-vehicle"
        onSubmit={handleSubmit(handleEdit)}
      >
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Model</Label>
          <Input
            id="vehicleModel"
            type="text"
            autoComplete="off"
            placeholder="Company/Model"
            autoFocus
            defaultValue={vehicleDetails?.vehicleModel}
            {...register("vehicleModel", {
              required: "Vehicle name is required",
              onChange: (e) => {
                const words = e.target.value.split(" ");
                const newWords = words.map(
                  (word) => word.charAt(0).toUpperCase() + word.slice(1)
                );
                const newValue = newWords.join(" ");
                if (e.target.value !== newValue) {
                  e.target.value = newValue;
                }
              },
            })}
            className={
              errors.vehicleModel
                ? "border-destructive col-span-3"
                : "col-span-3"
            }
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-left">Vehicle No</Label>
          <Input
            id="vehicleNumber"
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Vehicle Identification Number"
            defaultValue={vehicleDetails?.vehicleNumber}
            {...register("vehicleNumber", {
              required: "Identification is required",
            })}
            className={
              errors.vehicleNumber
                ? "border-destructive col-span-3"
                : "col-span-3"
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-right">Vehicle Colour</Label>
          <div className="flex  flex-wrap gap-2">
            {carColors.map((color) => (
              <div
                key={color.colorCode}
                className={cn(
                  "flex items-center gap-2  p-2 border-2 grayscale-0 rounded-lg  cursor-pointer hover:text-primary hover:scale-105 hover:grayscale-0 transition-all duration-150",
                  !selectedColor
                    ? ""
                    : selectedColor.colorCode == color.colorCode
                    ? "border-muted-foreground border-2 grayscale-0"
                    : "grayscale text-slate-400"
                )}
                onClick={() => {
                  selectedColor === color
                    ? setSelectedColor("")
                    : setSelectedColor(color);
                }}
              >
                <div
                  className={cn(
                    `w-6 h-6 border-2  rounded-full shadow-lg  cursor-pointer`
                  )}
                  style={{ backgroundColor: color.colorCode }}
                />
                <span className="text-xs">{color.colorName}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
      <DialogFooter>
        <SubmitButton
          form="edit-customer-vehicle"
          condition={isSubmitting}
          loadingText="Saving"
          buttonText="Save Changes"
        />
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={showVehicleEdit} onOpenChange={handleCloseEdit}>
      <DialogContent className="md:max-w-[425px] lg:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Save the changed you made to the vehicle
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

export default EditCustomerVehicle;
