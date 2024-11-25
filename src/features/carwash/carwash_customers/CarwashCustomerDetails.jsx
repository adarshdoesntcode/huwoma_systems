import { useParams } from "react-router-dom";
import {
  useGetCarwashCustomerByIdQuery,
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
import { CarwashFilterTransactionColumn } from "../carwash_tranasactions/CarwashFilterTransactionColumn";
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
import { Edit, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import { CarwashCustomerDetailsColumn } from "./CarwashCustomerDetailsColumn";

function CarwashCustomerDetails() {
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);

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

  let customer = {};
  let customerTransactions = [];
  let vehicleWithServices = [];
  let vehicleWithServicesAndStats;

  if (data) {
    customer = data?.data.customer || {};
    customerTransactions =
      data?.data?.customer?.customerTransactions.filter(
        (transaction) =>
          transaction.transactionStatus === "Completed" &&
          transaction.paymentStatus === "Paid"
      ) || [];

    vehicleWithServices = data?.data?.activeVehicleTypes || [];

    vehicleWithServicesAndStats = vehicleWithServices.map(
      (vehicleWithService) => {
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
            washCount: service.streakApplicable.washCount,
            totalTransactions,
            streak,
          };
        });
        return {
          vehicleTypeName: vehicleWithService.vehicleTypeName,
          services,
        };
      }
    );
  }

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
      <div className=" space-y-4 mb-64">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
            {!isEdit ? (
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    {customer.customerName}
                  </CardTitle>
                  <CardDescription className="flex flex-col text-xs">
                    <span>{customer.customerContact}</span>
                    <span>
                      Since {format(customer.createdAt, "MMMM d, yyyy")}
                    </span>
                  </CardDescription>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEdit(true)}
                  >
                    <Edit className="sm:mr-2 h-4 w-4" />
                    <span className="ml-2 sr-only sm:not-sr-only">Edit</span>
                  </Button>
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
                        <Save className="sm:mr-2  h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Save</span>
                      </>
                    }
                    type="submit"
                    size="sm"
                  />
                </div>
                <div className="grid grid-cols-2 sm:gap-6 gap-4">
                  <div className="col-span-2 sm:col-span-1 space-y-2">
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
                  <div className="sm:col-span-1 col-span-2 space-y-2">
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
          <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
            <Separator className="my-2" />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                            <TableHead className=" py-0 ">Services</TableHead>
                            <TableHead className=" py-0  text-center">
                              Current Streak{" "}
                            </TableHead>
                            <TableHead className=" py-0 text-center ">
                              Free After{" "}
                            </TableHead>
                            <TableHead className=" py-0 text-center ">
                              Total Washes{" "}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vehicleWithService.services.map((service, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  <span>{service.serviceTypeName}</span>
                                </TableCell>
                                <TableCell className="text-center text-xs font-medium py-1 ">
                                  <div className="flex gap-1 flex-col">
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
                                <TableCell className="text-center text-xs font-medium">
                                  <span>{service.washCount}</span>
                                </TableCell>
                                <TableCell className="text-center text-xs font-medium">
                                  <span>{service.totalTransactions}</span>
                                </TableCell>
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
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

export default CarwashCustomerDetails;
