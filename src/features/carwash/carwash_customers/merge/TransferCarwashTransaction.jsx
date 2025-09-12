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
import SubmitButton from "@/components/SubmitButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFindCustomerByPhoneMutation } from "../../carwashApiSlice";
import TransferSourceCustomer from "./TransferSourceCustomer";

function TransferCarwashTransaction({
  open,
  onOpenChange,
  selectedTransaction,
}) {
  const [targetCustomer, setTargetCustomer] = useState("");

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
        setTargetCustomer(res.data.data);
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
    setTargetCustomer("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {!targetCustomer ? (
          <>
            <DialogHeader>
              <DialogTitle>Transfer To</DialogTitle>
              <DialogDescription>
                Enter the number of the customer you want to transfer to
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto">
              <form
                className="p-2"
                onSubmit={handleSubmit(onSubmit)}
                id="select-target-transaction-customer-form"
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
                form="select-target-transaction-customer-form"
                disabled={isFinding}
              />
            </DialogFooter>
          </>
        ) : (
          <TransferSourceCustomer
            targetCustomer={targetCustomer}
            setTargetCustomer={setTargetCustomer}
            selectedTransaction={selectedTransaction}
            handleClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TransferCarwashTransaction;
