import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetSimRacingCustomerByIdQuery,
  useUpdateSimRacingCustomerMutation,
} from "../simRacingApiSlice";
import { toast } from "@/hooks/use-toast";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import NavBackButton from "@/components/NavBackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SimRacingFinishedDataTable } from "../SimRacingFinishedDataTable";
import { SimRacingFinishedColumn } from "../SimRacingFinishedColumn";
import { Separator } from "@/components/ui/separator";

function SimRacingCustomerDetails() {
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const [updateSimRacingCustomer] = useUpdateSimRacingCustomerMutation();
  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetSimRacingCustomerByIdQuery(id);
  let customer = {};
  let customerTransactions = [];

  if (data) {
    customer = data?.data || {};
    customerTransactions = data?.data?.customerTransactions || [];
  }

  const onSubmit = async (data) => {
    if (!customer) return;
    try {
      const res = await updateSimRacingCustomer({
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
            <Separator className="my-4" />
            <SimRacingFinishedDataTable
              data={customer.customerTransactions}
              columns={SimRacingFinishedColumn}
              origin="customer"
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

export default SimRacingCustomerDetails;
