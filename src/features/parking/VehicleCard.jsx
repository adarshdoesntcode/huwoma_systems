import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { PlusCircle } from "lucide-react";

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
import { useStartParkingMutation } from "./parkingApiSlice";

function VehicleCard({ vehicle, className }) {
  const [modelOpen, setModalOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [startParking] = useStartParkingMutation();

  const onSubmit = async (data) => {
    try {
      const res = await startParking({
        ...data,
        vehicleId: vehicle._id,
        today: new Date().toISOString().slice(0, 10),
      });

      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Parking Initiated!",
          description: `Bill No: ${res.data.data.billNo}`,
        });
        reset();
        setModalOpen(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  return (
    <Card className={cn("p-2 sm:p-4 ", className)}>
      <div className="flex ">
        <div className="w-3/12 aspect-auto flex items-center animate-in  fade-in duration-500 justify-center ">
          <img
            src={vehicle.vehicleIcon}
            loading="defer"
            // className="w-full"
            width={200}
            height={133}
            alt="Vehicle Image"
          />
        </div>
        <div className="w-9/12   flex flex-col justify-between">
          <div>
            <CardHeader className=" p-2 pb-0 sm:pt-0 sm:pr-0 sm:pb-2 space-y-0">
              <CardTitle className="flex text-base sm:text-lg  items-start justify-between gap-4 ">
                <div>
                  {vehicle?.vehicleTypeName}

                  <CardDescription className="font-normal  items-center gap-1 hidden sm:flex ">
                    <span className="text-xs  "> Rs {vehicle.rate}</span>
                    <span className="text-xs  text-muted-foreground">/hr</span>
                  </CardDescription>
                </div>
                <div>
                  <Dialog open={modelOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <span className="sr-only sm:not-sr-only">Add</span>
                        <PlusCircle className="h-4 w-4 sm:ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <div className="flex items-center gap-4">
                          <div>
                            <img
                              src={`${vehicle.vehicleIcon}`}
                              className="h-16"
                            />
                          </div>
                          <div>
                            <DialogTitle>{vehicle.vehicleTypeName}</DialogTitle>
                            <DialogDescription>
                              Rs{" "}
                              <span className="text-xs sm:text-sm font-semibold">
                                {vehicle.rate}
                              </span>
                              <span className="text-xs sm:text-xs text-muted-foreground">
                                /hr
                              </span>
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto">
                        <form
                          className="p-2"
                          onSubmit={handleSubmit(onSubmit)}
                          id="parking-form"
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
                              className={
                                errors.vehicleNumber ? "border-destructive" : ""
                              }
                            />
                          </div>
                        </form>
                      </div>

                      <DialogFooter>
                        <SubmitButton
                          condition={isSubmitting}
                          loadingText={"Starting..."}
                          buttonText={"Start Parking"}
                          form="parking-form"
                        />
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
          </div>
          <div className="space-y-2 p-2 sm:p-0 sm:pl-2">
            <div className="flex justify-between items-center">
              <div className="text-xs">
                <span className="text-muted-foreground">Occupied:</span>{" "}
                {vehicle?.currentlyAccomodated}
              </div>
              <div className="text-xs hidden sm:block">
                <span className="text-muted-foreground">Capacity:</span>{" "}
                {vehicle?.totalAccomodationCapacity}
              </div>
            </div>
            <Progress
              value={
                (vehicle?.currentlyAccomodated /
                  vehicle?.totalAccomodationCapacity) *
                100
              }
              className="h-3 sm:h-4"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default VehicleCard;
