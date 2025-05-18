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

function EditCarwashTransaction({
  showEdit,
  setShowEdit,
  transactionDetails,
  setTransactionDetails,
}) {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const { data, isLoading, isSuccess, isError, error } = useGetPreEditDataQuery(
    undefined,
    { skip: !showEdit }
  );
  const [editCarwashTransaction, { isLoading: isSubmitting }] =
    useEditCarwashTransactionMutation();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isSuccess) {
      const vehicle = data.data.vehicleTypes.find(
        (vehicle) =>
          vehicle._id === transactionDetails?.service?.id?.serviceVehicle._id
      );
      if (vehicle) {
        setSelectedVehicle(vehicle);
        const service = vehicle.services.find(
          (service) => service._id === transactionDetails?.service?.id?._id
        );
        if (service) {
          setSelectedService(service);
        } else {
          setSelectedService("");
        }
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

  const handleVehicleSelect = (vehicleTypes, value) => {
    const vehicle = vehicleTypes.find((vehicle) => vehicle._id === value);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setSelectedService("");
    }
  };

  const handleServiceSelect = (services, value) => {
    if (!services) return;
    const service = services.find((service) => service._id === value);
    if (service) {
      setSelectedService(service);
    }
  };

  const handleEdit = async (data) => {
    try {
      if (!transactionDetails) return;
      let payload;
      if (transactionDetails?.transactionStatus === "Completed") {
        if (!paymentMode && transactionDetails?.paymentStatus === "Paid") {
          toast({
            variant: "destructive",
            title: "Fill All Details!!",
            description: "Payment Mode is required",
          });
          return;
        }

        payload = {
          transactionId: transactionDetails._id,
          vehicleModel: data.vehicleModel,
          vehicleNumber: data.vehicleNumber,
          paymentMode: paymentMode._id || undefined,
        };
      } else {
        if (!selectedVehicle || !selectedService) {
          toast({
            variant: "destructive",
            title: "Fill All Details!!",
            description: "Vehicle and Service are required",
          });
          return;
        }
        payload = {
          transactionId: transactionDetails._id,
          vehicleModel: data.vehicleModel,
          vehicleNumber: data.vehicleNumber,
          serviceId: selectedService._id,
        };
      }
      const res = await editCarwashTransaction(payload);
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
    const vehicleTypes = data?.data?.vehicleTypes || [];
    const paymentModes = data?.data?.paymentModes || [];
    content = (
      <>
        <form
          className="grid gap-4 py-4"
          id="edit-transaction-before-completion"
          onSubmit={handleSubmit(handleEdit)}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Model</Label>
            <Input
              id="vehicleModel"
              type="text"
              autoComplete="off"
              placeholder="Company/Model"
              autoFocus
              defaultValue={transactionDetails?.vehicleModel}
              {...register("vehicleModel", {
                required: "Vehicle name is required",
              })}
              className={
                errors.vehicleModel
                  ? "border-destructive col-span-3"
                  : "col-span-3"
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Vehicle No</Label>
            <Input
              id="vehicleNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Vehicle Identification Number"
              defaultValue={transactionDetails?.vehicleNumber}
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
          {transactionDetails?.transactionStatus !== "Completed" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Vehicle
              </Label>
              <Select
                value={selectedVehicle?._id}
                onValueChange={(value) => {
                  handleVehicleSelect(vehicleTypes, value);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((vehicleType) => (
                    <SelectItem key={vehicleType._id} value={vehicleType._id}>
                      {vehicleType.vehicleTypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {transactionDetails?.transactionStatus !== "Completed" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Service
              </Label>
              <Select
                disabled={selectedVehicle === ""}
                value={selectedService?._id || ""}
                onValueChange={(value) => {
                  handleServiceSelect(selectedVehicle.services, value);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {selectedVehicle?.services?.map((service) => (
                    <SelectItem key={service._id} value={service._id}>
                      {service.serviceTypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {transactionDetails?.transactionStatus === "Completed" &&
            transactionDetails.paymentStatus === "Paid" && (
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
            )}
        </form>
        <DialogFooter>
          <SubmitButton
            form="edit-transaction-before-completion"
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

export default EditCarwashTransaction;
