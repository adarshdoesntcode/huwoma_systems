import ApiError from "@/components/error/ApiError";
import {
  useEditGarageCustomerMutation,
  useGetGarageCustomerDetailsQuery,
} from "../../garageApiSlice";
import Loader from "@/components/Loader";
import { useParams } from "react-router-dom";
import NavBackButton from "@/components/NavBackButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Phone, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import SubmitButton from "@/components/SubmitButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { InterestCard } from "../../components/InterestCard";
import MatchedVehiclesCard from "../../components/MatchedVehiclesCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

function GarageCustomerDetails() {
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);

  const [editGarageCustomer] = useEditGarageCustomerMutation();
  const { data, isSuccess, isError, error, isLoading, isFetching, refetch } =
    useGetGarageCustomerDetailsQuery(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  let customer = {};
  let history = {};
  let purchasedVehicles;
  let buyerInterests;
  let vehicleListings;

  if (data) {
    customer = data?.data || {};
    history = data?.data?.history || {};
    purchasedVehicles = [...(history?.purchasedVehicles || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    buyerInterests = [...(history?.buyerInterests || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    vehicleListings = [...(history?.listedVehicles || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  const onSubmit = async (data) => {
    if (!customer) return;
    try {
      const res = await editGarageCustomer({
        id: customer._id,
        name: data.name,
        contactNumber: data.contactNumber,
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

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const customer = data?.data || {};
    const history = data?.data?.history || {};

    content = (
      <div className="mb-64 space-y-4 ">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
            {!isEdit ? (
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    {customer.name}
                  </CardTitle>
                  <CardDescription className="flex flex-col text-xs">
                    <a
                      href={`tel:${customer?.contactNumber}`}
                      className="flex items-center gap-1 text-sm font-medium "
                    >
                      {customer?.contactNumber}
                      <Phone className="w-3.4 h-3.5" />
                    </a>

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
                    <Edit className="w-4 h-4 sm:mr-2" />
                    <span className="ml-2 sr-only sm:not-sr-only">Edit</span>
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4"
                id="updateGarageCustomer"
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
                      {errors.name ? (
                        <span className="text-destructive">
                          {errors.name.message}
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
                      defaultValue={customer.name}
                      {...register("name", {
                        required: "Name is required",
                        pattern: {
                          value: /^[a-zA-Z\s]*$/,
                          message: "Invalid Name",
                        },
                      })}
                      className={errors.name ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="col-span-2 space-y-2 sm:col-span-1">
                    <Label>
                      {errors.contactNumber ? (
                        <span className="text-destructive">
                          {errors.contactNumber.message}
                        </span>
                      ) : (
                        <span>Contact</span>
                      )}
                    </Label>
                    <Input
                      onWheel={(e) => e.target.blur()}
                      type="tel"
                      inputMode="numeric"
                      defaultValue={customer.contactNumber}
                      autoComplete="off"
                      {...register("contactNumber", {
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

            <Tabs defaultValue="vehicles">
              <TabsList>
                <TabsTrigger value="vehicles">
                  Vehicles
                  {vehicleListings.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {vehicleListings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="interest">
                  Interests
                  {buyerInterests.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {buyerInterests.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="purchased">
                  Purchased
                  {purchasedVehicles.length > 0 && (
                    <Badge className="ml-2   py-0 text-[10px]">
                      {purchasedVehicles.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="vehicles">
                <div>
                  {vehicleListings.length > 0 ? (
                    <div
                      className="relative w-full overflow-x-auto scrollbar-thin scroll-smooth  min-h-[425px]"
                      style={{ maxWidth: "100%" }}
                    >
                      <div className="absolute left-0 flex gap-4 pb-4 top-4 flex-nowrap w-max">
                        {vehicleListings.map((vehicle) => (
                          <div
                            key={vehicle._id}
                            className="min-w-[300px] flex-shrink-0 snap-start"
                          >
                            <MatchedVehiclesCard
                              vehicle={vehicle}
                              showFooter={false}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[6rem] items-center justify-center">
                      <div className="text-xs text-muted-foreground">
                        No vehicles listed
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="interest">
                <div>
                  {buyerInterests.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {buyerInterests.map((interest) => (
                        <InterestCard
                          key={interest._id}
                          interest={interest}
                          showBuyer={false}
                          showMutation={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[6rem] items-center justify-center">
                      <div className="text-xs text-muted-foreground">
                        No interests listed
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="purchased">
                <div>
                  {purchasedVehicles.length > 0 ? (
                    <div
                      className="relative w-full overflow-x-auto scrollbar-thin scroll-smooth  min-h-[425px]"
                      style={{ maxWidth: "100%" }}
                    >
                      <div className="absolute left-0 flex gap-4 pb-4 top-4 flex-nowrap w-max">
                        {purchasedVehicles.map((vehicle) => (
                          <div
                            key={vehicle._id}
                            className="min-w-[300px] flex-shrink-0 snap-start"
                          >
                            <MatchedVehiclesCard
                              vehicle={vehicle}
                              showFooter={false}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[6rem] items-center justify-center">
                      <div className="text-xs text-muted-foreground">
                        No vehicles purchased
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default GarageCustomerDetails;
