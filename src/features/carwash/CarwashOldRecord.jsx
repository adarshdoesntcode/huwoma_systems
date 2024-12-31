import NavBackButton from "@/components/NavBackButton";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useGetPreEditDataQuery } from "./carwashApiSlice";
function CarwashOldRecord() {
  const { data, isLoading, isSuccess, isError, error } =
    useGetPreEditDataQuery();
  console.log("🚀 ~ CarwashOldRecord ~ data:", data);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  return (
    <div className="mx-auto grid w-full max-w-2xl items-start gap-4 ">
      <NavBackButton buttonText={"Back"} navigateTo={-1} />
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">Old Wash Record</CardTitle>
          <CardDescription>Old wash record details</CardDescription>
        </CardHeader>
        <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
          <form
            // onSubmit={handleSubmit(onSubmit)}
            className="grid gap-2"
          >
            <Label>Customer</Label>
            <div className="grid gap-4 p-4 rounded-lg border">
              <div className="grid gap-2">
                <Label>
                  {errors.customerName ? (
                    <span className="text-destructive">
                      {errors.customerName.message}
                    </span>
                  ) : (
                    <span>Full Name</span>
                  )}
                </Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Name"
                  autoFocus
                  autoComplete="off"
                  {...register("customerName", {
                    required: "Name is required",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Invalid Name",
                    },
                  })}
                  className={errors.customerName ? "border-destructive" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  {errors.customerContact ? (
                    <span className="text-destructive">
                      {errors.customerContact.message}
                    </span>
                  ) : (
                    <span>Phone Number</span>
                  )}
                </Label>
                <Input
                  onWheel={(e) => e.target.blur()}
                  type="tel"
                  inputMode="numeric"
                  placeholder="+977"
                  autoComplete="off"
                  {...register("customerContact", {
                    required: "Number is required",
                    valueAsNumber: true,
                    validate: (value) =>
                      String(value).length === 10 || "Number must be 10 digits",
                  })}
                  className={errors.customerContact ? "border-destructive" : ""}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
          <div className="flex w-full items-center justify-between gap-4">
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  // setNewCustomer(false);
                }}
              >
                Reset
              </Button>
            </div>
            <SubmitButton buttonText={"Insert"} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CarwashOldRecord;
