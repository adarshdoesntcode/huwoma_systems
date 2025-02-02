import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
import {
  useEditSimracingTransactionMutation,
  useGetSimracingPreEditDetailsQuery,
} from "./simRacingApiSlice";

function EditSimracingTransaction({
  showEdit,
  setShowEdit,
  transactionDetails,
  setTransactionDetails,
}) {
  const [seletedRig, setSelectedRig] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const { data, isLoading, isSuccess, isError, error } =
    useGetSimracingPreEditDetailsQuery(undefined, { skip: !showEdit });
  const [editSimracingTransaction, { isLoading: isSubmitting }] =
    useEditSimracingTransactionMutation();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isSuccess) {
      const vehicle = data.data.rigs.find(
        (rig) => rig._id === transactionDetails?.rig?._id
      );
      if (vehicle) {
        setSelectedRig(vehicle);
      }
      const payment = data.data.paymentModes.find(
        (payment) => payment._id === transactionDetails?.paymentMode?._id
      );
      if (payment) {
        setPaymentMode(payment);
      }
    }
  }, [data]);

  const handleCloseEdit = () => {
    setShowEdit(false);
    setTransactionDetails(null);
    reset();
  };

  const handleEdit = async (data) => {
    try {
      if (!transactionDetails) return;
      let payload;

      if (!seletedRig) {
        toast({
          variant: "destructive",
          title: "Fill All Details!!",
          description: "Rig is required",
        });
        return;
      }

      if (!paymentMode) {
        toast({
          variant: "destructive",
          title: "Fill All Details!!",
          description: "Payment Mode is required",
        });
        return;
      }

      payload = {
        transactionId: transactionDetails._id,
        rigId: seletedRig._id,
        paymentMode: paymentMode._id,
      };

      const res = await editSimracingTransaction(payload);
      if (res.error) {
        handleCloseEdit();
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        handleCloseEdit();
        toast({
          title: "Transaction Edited!",
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

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const rigs = data?.data?.rigs || [];
    const paymentModes = data?.data?.paymentModes || [];
    content = (
      <>
        <form
          className="grid gap-4 py-4"
          id="edit-simracing-transaction-after-completion"
          onSubmit={handleSubmit(handleEdit)}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rigs" className="text-right">
              Rig
            </Label>
            <Select
              value={seletedRig?._id}
              onValueChange={(e) => {
                setSelectedRig(rigs?.find((rig) => e === rig._id) || "");
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {rigs?.map((rig) => (
                  <SelectItem key={rig._id} value={rig._id}>
                    {rig.rigName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Payment
            </Label>
            <Select
              value={paymentMode?._id}
              onValueChange={(e) => {
                setPaymentMode(
                  paymentModes?.find((mode) => e === mode._id) || ""
                );
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {paymentModes?.map((mode) => (
                  <SelectItem key={mode._id} value={mode._id}>
                    {mode.paymentModeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <SubmitButton
            form="edit-simracing-transaction-after-completion"
            condition={isSubmitting}
            loadingText="Saving"
            buttonText="Save Changes"
          />
        </DialogFooter>
      </>
    );
  }
  return (
    <Dialog open={showEdit} onOpenChange={handleCloseEdit}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Save the changed you made to the transaction
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

export default EditSimracingTransaction;
