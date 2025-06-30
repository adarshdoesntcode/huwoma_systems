import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { CheckCheck, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import {
  useAddToParkingTabMutation,
  useStartParkingMutation,
} from "../../parkingApiSlice";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function AddToParkingTab({ tab, vehicles, setTabState }) {
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [addToParkingTab] = useAddToParkingTabMutation();
  const onSubmit = async (data) => {
    try {
      const res = await addToParkingTab({
        ...data,
        vehicleId: selectedVehicle._id,
        tabId: tab._id,
        today: new Date().toISOString().slice(0, 10),
      });

      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Parking Initiated!",
          description: `Bill No: ${res.data.data.billNo}`,
          duration: 2000,
        });
        reset();
        setTabState("parked");
        setSelectedVehicle("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  const handleClose = () => {
    reset();
    setSelectedVehicle("");
  };

  return (
    <div>
      <Dialog onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="w-full">
            Add <PlusCircle className="w-4 h-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Parking</DialogTitle>
            <DialogDescription>
              Select the vehicle you want to start parking
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <div>
              <Label>
                Vehicles{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Select One)
                </span>
              </Label>
              <Separator className="mt-2" />
              <div
                // className="flex flex-wrap justify-between gap-2 my-6 sm:justify-evenly"
                className="grid grid-cols-2 gap-2 p-2 my-6 sm:gap-4"
              >
                {vehicles.map((vehicle) => {
                  return (
                    <div
                      key={vehicle._id}
                      className="flex flex-col items-center gap-3 text-xs transition-transform cursor-pointer text-muted-foreground hover:scale-105 hover:text-primary"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                      }}
                    >
                      <div
                        className="relative gap-2 px-4 py-2 duration-500 border rounded-lg shadow-lg animate-in fade-in"
                        // className="relative w-24 gap-2 px-4 py-2 duration-500 border rounded-lg shadow-lg sm:w-36 animate-in fade-in"
                      >
                        {selectedVehicle._id === vehicle._id && (
                          <Badge className="absolute top-0 right-0 p-1 rounded-full shadow-lg translate-x-1/4 -translate-y-1/4">
                            <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4 " />
                          </Badge>
                        )}
                        <img
                          src={vehicle.vehicleIcon}
                          loading="lazy"
                          alt="Vehicle Image"
                        />
                      </div>
                      <p>{vehicle.vehicleTypeName}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <form
              className="p-2"
              onSubmit={handleSubmit(onSubmit)}
              id="add-to-parking-tab-form"
            >
              <div className="grid gap-2 ">
                <Label>Vehicle No</Label>
                <Input
                  id="vehicleNumber"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Vehicle Identification Number"
                  autoFocus
                  {...register("vehicleNumber", {
                    required: "Identification is required",
                  })}
                  className={errors.vehicleNumber ? "border-destructive" : ""}
                />
              </div>
            </form>
          </div>

          <DialogFooter>
            <SubmitButton
              condition={isSubmitting}
              loadingText={"Starting..."}
              buttonText={"Start Parking"}
              form="add-to-parking-tab-form"
              disabled={isSubmitting || !selectedVehicle}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddToParkingTab;
