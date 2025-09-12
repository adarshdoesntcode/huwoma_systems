import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Contact, GitMerge } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFindCustomerByPhoneMutation } from "../../carwashApiSlice";
import MergeSourceCustomer from "./MergeSourceCustomer";

function MergeCarwashCustomer({ targetCustomer }) {
  const [selectedTargetCustomer, setSelectedTargetVehicle] = useState("");

  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [findCustomerByPhone, { isLoading: isFinding }] =
    useFindCustomerByPhoneMutation();

  const onSubmit = async (data) => {
    try {
      const res = await findCustomerByPhone({
        customerContact: data.customerContact,
      });

      if (res.error) throw new Error(res.error.data.message);

      if (!res.error) {
        setSelectedTargetVehicle(res.data.data);
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
    setSelectedTargetVehicle("");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) handleClose();
        setOpen(state);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <GitMerge className="w-4 h-4 sm:mr-2" />
          <span className="ml-2 sr-only sm:not-sr-only">Merge</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        {!selectedTargetCustomer ? (
          <>
            <DialogHeader>
              <DialogTitle>Merge With</DialogTitle>
              <DialogDescription>
                Enter the number of the customer you want to merge with
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto">
              <form
                className="p-2"
                onSubmit={handleSubmit(onSubmit)}
                id="select-target-customer-form"
              >
                <div className="col-span-2 space-y-2 sm:col-span-1">
                  <Label>
                    {errors.customerContact ? (
                      <span className="text-destructive">
                        {errors.customerContact.message}
                      </span>
                    ) : (
                      <span>Contact Number</span>
                    )}
                  </Label>
                  <Input
                    onWheel={(e) => e.target.blur()}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="off"
                    {...register("customerContact", {
                      required: "Number is required",

                      validate: (value) =>
                        value
                          ? String(value).length === 10 ||
                            "Number must be 10 digits"
                          : true,
                    })}
                    className={errors.serviceRate ? "border-destructive" : ""}
                  />
                </div>
              </form>
            </div>

            <DialogFooter>
              <SubmitButton
                condition={isFinding}
                loadingText={"Loading..."}
                buttonText={"Next"}
                type="submit"
                form="select-target-customer-form"
                disabled={isFinding}
              />
            </DialogFooter>
          </>
        ) : (
          <MergeSourceCustomer
            selectedTargetCustomer={selectedTargetCustomer}
            targetCustomer={targetCustomer}
            setSelectedTargetVehicle={setSelectedTargetVehicle}
            handleClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MergeCarwashCustomer;
