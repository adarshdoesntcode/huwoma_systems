import { useParams } from "react-router-dom";
import {
  useEditCarwashTransactionMutation,
  useEditCustomerVehicleMutation,
  useGetCarwashCustomerByIdQuery,
  useResetStreakMutation,
  useUpdateCarwashCustomerMutation,
} from "../carwashApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";

import NavBackButton from "@/components/NavBackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { CarwashFilterTranasactionDataTable } from "../carwash_tranasactions/CarwashFilterTransactionDataTable";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  Edit,
  Loader2,
  Merge,
  Phone,
  Save,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import { CarwashCustomerDetailsColumn } from "./CarwashCustomerDetailsColumn";
import { ResetIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import EditCustomerVehicle from "../vehicle_mutation/EditCustomerVehicle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/hooks/useRole";
import { ROLES_LIST } from "@/lib/config";
import MergeCarwashCustomer from "./merge/MergeCarwashCustomer";

function CarwashCustomerDetails() {
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");

  const [showVehicleEdit, setShowVehicleEdit] = useState(false);
  const [mergeItems, setMergeItems] = useState([]);

  const role = useRole();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const [updateCarwashCustomer] = useUpdateCarwashCustomerMutation();

  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetCarwashCustomerByIdQuery(id);

  const handleReset = (serviceId) => {
    setIsReset(true);
    setServiceId(serviceId);
  };

  let customer = {};
  let customerTransactions = [];
  let vehicleWithServices = [];
  let vehicleWithServicesAndStats;
  let customerVehicles = [];

  if (data) {
    customer = data?.data.customer || {};
    customerTransactions =
      data?.data?.customer?.customerTransactions.filter(
        (transaction) =>
          transaction.transactionStatus === "Completed" &&
          transaction.paymentStatus === "Paid"
      ) || [];

    vehicleWithServices = data?.data?.activeVehicleTypes || [];

    vehicleWithServicesAndStats = vehicleWithServices
      .filter((vehicleWithService) => vehicleWithService.services.length > 0)
      .map((vehicleWithService) => {
        const services = vehicleWithService.services.map((service) => {
          const transactionsForService = customerTransactions.filter(
            (transaction) => transaction.service.id._id === service._id
          );
          const totalTransactions = transactionsForService.length;
          const streak = transactionsForService.filter(
            (transaction) => transaction.redeemed === false
          ).length;
          return {
            serviceTypeName: service.serviceTypeName,
            serviceId: service._id,
            washCount: service.streakApplicable.washCount,
            totalTransactions,
            streak,
          };
        });
        return {
          vehicleTypeName: vehicleWithService.vehicleTypeName,
          services,
        };
      });

    customerVehicles = customerTransactions.reduce((acc, transaction) => {
      const { vehicleModel, vehicleNumber, vehicleColor } = transaction;
      const key = `${vehicleModel}-${vehicleNumber}-${vehicleColor?.colorCode}-${vehicleColor?.colorName}`;
      const existing = acc.find((item) => item.key === key);
      if (existing) {
        existing.transactions.push(transaction);
      } else {
        acc.push({
          key,
          vehicleModel,
          vehicleNumber,
          vehicleColor,
          transactions: [transaction],
        });
      }
      return acc;
    }, []);
  }

  const handleEditVehicle = (vehicle) => {
    setShowVehicleEdit(true);
    setVehicleDetails(vehicle);
  };

  const onSubmit = async (data) => {
    if (!customer) return;
    try {
      const res = await updateCarwashCustomer({
        id: customer._id,
        customerName: data.customerName,
        customerContact: data.customerContact,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setIsEdit(false);
        toast({
          title: "Customer Updated!",
          description: "Customer details updated successfully",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  let content;
  if (isLoading || isFetching) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="mb-64 space-y-4 ">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
            {!isEdit ? (
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    {customer.customerName}
                  </CardTitle>
                  <CardDescription className="flex flex-col text-xs">
                    <a
                      href={`tel:${customer?.customerContact}`}
                      className="flex items-center gap-1 text-sm font-medium "
                    >
                      {customer?.customerContact}
                      <Phone className="w-3.4 h-3.5" />
                    </a>

                    <span>
                      Since {format(customer.createdAt, "MMMM d, yyyy")}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {role === ROLES_LIST.SUPERADMIN && (
                    <MergeCarwashCustomer targetCustomer={customer} />
                  )}
                  {role !== ROLES_LIST.STAFF && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEdit(true)}
                    >
                      <Edit className="w-4 h-4 sm:mr-2" />
                      <span className="ml-2 sr-only sm:not-sr-only">Edit</span>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4"
                id="updateCarwashCustomer"
              >
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setIsEdit(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <SubmitButton
                    condition={isSubmitting}
                    buttonText={
                      <>
                        <Save className="w-4 h-4 sm:mr-2" />
                        <span className="sr-only sm:not-sr-only">Save</span>
                      </>
                    }
                    type="submit"
                    size="sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="col-span-2 space-y-2 sm:col-span-1">
                    <Label>
                      {errors.customerName ? (
                        <span className="text-destructive">
                          {errors.customerName.message}
                        </span>
                      ) : (
                        <span>Name</span>
                      )}
                    </Label>
                    <Input
                      type="text"
                      placeholder="Name"
                      autoComplete="off"
                      autoFocus
                      defaultValue={customer.customerName}
                      {...register("customerName", {
                        required: "Name is required",
                        pattern: {
                          value: /^[a-zA-Z\s]*$/,
                          message: "Invalid Name",
                        },
                      })}
                      className={
                        errors.customerName ? "border-destructive" : ""
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-2 sm:col-span-1">
                    <Label>
                      {errors.customerContact ? (
                        <span className="text-destructive">
                          {errors.customerContact.message}
                        </span>
                      ) : (
                        <span>Contact</span>
                      )}
                    </Label>
                    <Input
                      onWheel={(e) => e.target.blur()}
                      type="tel"
                      inputMode="numeric"
                      defaultValue={customer.customerContact}
                      autoComplete="off"
                      {...register("customerContact", {
                        required: "Number is required",
                        valueAsNumber: true,
                        validate: (value) =>
                          String(value).length === 10 ||
                          "Number must be 10 digits",
                      })}
                      className={errors.serviceRate ? "border-destructive" : ""}
                    />
                  </div>
                </div>
              </form>
            )}
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <Separator className="my-2" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {vehicleWithServicesAndStats.map((vehicleWithService, index) => {
                return (
                  <div key={index} className="space-y-2 ">
                    <Label className="text-xs">
                      {vehicleWithService.vehicleTypeName}
                    </Label>
                    <div className="border rounded-lg">
                      <Table className="text-[10px]">
                        <TableHeader className="border-b bg-muted">
                          <TableRow>
                            <TableHead className="py-0 ">Services</TableHead>
                            <TableHead className="py-0 text-center ">
                              Current Streak{" "}
                            </TableHead>
                            <TableHead className="py-0 text-center ">
                              Free After{" "}
                            </TableHead>
                            <TableHead className="py-0 text-center ">
                              Total Washes{" "}
                            </TableHead>
                            {role !== ROLES_LIST.STAFF && (
                              <TableHead className="py-0 text-center ">
                                Reset
                              </TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vehicleWithService.services.map((service, index) => {
                            return (
                              <TableRow
                                key={index}
                                className="hover:bg-inherit"
                              >
                                <TableCell className="font-medium">
                                  <span>{service.serviceTypeName}</span>
                                </TableCell>
                                <TableCell className="py-1 text-xs font-medium text-center ">
                                  <div className="flex flex-col gap-1">
                                    <span>{service.streak}</span>
                                    <Progress
                                      className="h-3"
                                      value={
                                        (service.streak / service.washCount) *
                                        100
                                      }
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs font-medium text-center">
                                  <span>{service.washCount}</span>
                                </TableCell>
                                <TableCell className="text-xs font-medium text-center">
                                  <span>{service.totalTransactions}</span>
                                </TableCell>
                                {role !== ROLES_LIST.STAFF && (
                                  <TableCell className="text-xs font-bold text-center">
                                    <Button
                                      disabled={service.streak === 0}
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleReset(service.serviceId)
                                      }
                                    >
                                      <Undo2 className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <Label>Customer Vehicles</Label>

              <div>
                <div className="flex flex-wrap gap-4">
                  {customerVehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      className="border rounded-md shadow-md cursor-grab"
                      draggable={role !== ROLES_LIST.STAFF}
                      onDragOver={(e) => e.preventDefault()}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "vehicle",
                          JSON.stringify(vehicle)
                        );
                      }}
                      onDrop={(e) => {
                        const droppedVehicle = JSON.parse(
                          e.dataTransfer.getData("vehicle")
                        );
                        if (droppedVehicle.key !== vehicle.key) {
                          setMergeItems([vehicle, droppedVehicle]);
                        }
                      }}
                    >
                      <div className="flex items-start gap-2 p-4 pb-2">
                        {vehicle?.vehicleColor ? (
                          <div
                            className={cn(
                              `w-7 h-7 border-2  rounded-full shadow-lg`
                            )}
                            style={{
                              backgroundColor: vehicle?.vehicleColor?.colorCode,
                            }}
                          />
                        ) : (
                          <div
                            className={cn(
                              `w-7 h-7 border-2 flex items-center justify-center text-muted-foreground  text-[8px] rounded-full shadow-lg`
                            )}
                          >
                            N/A
                          </div>
                        )}
                        <div className="flex flex-col items-start ">
                          <div className="text-xs font-semibold text-left text-primary">
                            {vehicle?.vehicleModel || "Not Set"}
                          </div>
                          <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                            {vehicle?.vehicleNumber || "Not Set"}
                          </div>
                        </div>
                      </div>
                      <div className="flex border-t justify-evenly">
                        <Button
                          variant="ghost"
                          className="w-full text-xs text-muted-foreground "
                          size="sm"
                          onClick={() => handleEditVehicle(vehicle)}
                          disabled={role === ROLES_LIST.STAFF}
                        >
                          Edit <Edit className="w-3 h-3 ml-2" />
                        </Button>
                        <Separator orientation="vertical" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Separator className="my-6" />

            <CarwashFilterTranasactionDataTable
              data={customer.customerTransactions}
              columns={CarwashCustomerDetailsColumn}
              searchOptions={[
                {
                  value: "billNo",
                  label: "Bill No",
                },

                { value: "serviceTypeName", label: "Vehicle No" },
              ]}
              origin={"customer"}
            />
          </CardContent>
        </Card>
        <ResetStreak
          customerId={id}
          serviceId={serviceId}
          setServiceId={setServiceId}
          isReset={isReset}
          setIsReset={setIsReset}
        />
        {showVehicleEdit && (
          <EditCustomerVehicle
            showVehicleEdit={showVehicleEdit}
            setShowVehicleEdit={setShowVehicleEdit}
            vehicleDetails={vehicleDetails}
            setVehicleDetails={setVehicleDetails}
            customerId={id}
          />
        )}

        <MergeVehicles
          mergeItems={mergeItems}
          setMergeItems={setMergeItems}
          customerId={id}
        />
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

const ResetStreak = ({
  customerId,
  serviceId,
  setServiceId,
  isReset,
  setIsReset,
}) => {
  const [resetStreak, { isLoading }] = useResetStreakMutation();

  const handleCloseReset = () => {
    setIsReset(false);
    setServiceId("");
  };

  const handleResetStreak = async () => {
    try {
      if (!customerId && !serviceId) return;
      const res = await resetStreak({
        customerId,
        serviceId,
      });

      if (res.error) {
        handleCloseReset();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseReset();
        toast({
          title: "Streak Reset!",
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
  return (
    <AlertDialog open={isReset} onOpenChange={handleCloseReset}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will reset the streak to zero.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Terminating
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleResetStreak}>
              Reset
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const MergeVehicles = ({ mergeItems, setMergeItems, customerId }) => {
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const [editCustomerVehicle, { isLoading: isSubmitting }] =
    useEditCustomerVehicleMutation();
  const handleCloseMerge = () => {
    setMergeItems([]);
    setSelectedVehicle("");
  };

  const handleMerge = async () => {
    try {
      if (!selectedVehicle) return;
      let payload;

      payload = {
        transactions: mergeItems.flatMap((item) =>
          item.transactions.map((i) => i._id)
        ),
        customerId: customerId,
        vehicleModel: selectedVehicle?.vehicleModel,
        vehicleNumber: selectedVehicle?.vehicleNumber,
        vehicleColor: selectedVehicle?.vehicleColor,
      };

      const res = await editCustomerVehicle(payload);
      if (res.error) {
        handleCloseMerge();
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        handleCloseMerge();
        toast({
          title: "Vehicles Merged!",
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

  return (
    <Dialog open={mergeItems.length === 2} onOpenChange={handleCloseMerge}>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>Merge Vehicle</DialogTitle>
          <DialogDescription>
            Select the vehicle you want to keep
          </DialogDescription>
        </DialogHeader>
        {
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
            <div className="grid gap-4">
              {mergeItems.map((vehicle, index) => (
                <div
                  key={index}
                  className={cn(
                    "border-2 cursor-pointer relative hover:border-muted-foreground p-4 pb-2  transition-all  rounded-xl shadow-md",
                    selectedVehicle.key === vehicle.key ? "border-primary" : ""
                  )}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  {selectedVehicle.key === vehicle.key && (
                    <Badge className="absolute top-0 right-0 p-1 rounded-full shadow-lg translate-x-1/4 -translate-y-1/4">
                      <CheckCheck className="w-4 h-4 " />
                    </Badge>
                  )}
                  <div className="flex items-start gap-4 py-2 pb-2">
                    {vehicle?.vehicleColor ? (
                      <div
                        className={cn(
                          `w-7 h-7 border-2  rounded-full shadow-lg`
                        )}
                        style={{
                          backgroundColor: vehicle?.vehicleColor?.colorCode,
                        }}
                      />
                    ) : (
                      <div
                        className={cn(
                          `w-7 h-7 border-2 flex items-center justify-center text-muted-foreground  text-[8px] rounded-full shadow-lg`
                        )}
                      >
                        N/A
                      </div>
                    )}
                    <div className="flex flex-col items-start gap-1 ">
                      <p className="text-sm font-medium leading-none">
                        {vehicle?.vehicleModel || "Not Set"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle?.vehicleNumber}
                      </p>
                    </div>
                  </div>
                  <div></div>
                  <p className="flex items-center justify-center gap-2 pt-2 mt-1 text-xs border-t text-muted-foreground">
                    Records:{" "}
                    <span className="font-semibold ">
                      {" "}
                      {vehicle.transactions.length}{" "}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
        <DialogFooter>
          <SubmitButton
            disabled={!selectedVehicle}
            condition={isSubmitting}
            loadingText="Saving..."
            buttonText="Save Changes"
            onClick={handleMerge}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CarwashCustomerDetails;
