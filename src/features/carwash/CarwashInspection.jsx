import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Contact,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import {
  useGetTransactionForInspectionQuery,
  useTransactionTwoMutation,
} from "./carwashApiSlice";

import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/SubmitButton";
import StatusBadge from "@/components/ui/StatusBadge";

function CarwashInspection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [checkAll, setCheckAll] = useState(false);

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useGetTransactionForInspectionQuery(id);

  const [transactionTwo] = useTransactionTwoMutation();

  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (data) {
      const inspectionForm = data.data.inspectionTemplates.map((template) => ({
        categoryName: template.categoryName,
        items: template.items.map((item) => ({
          itemName: item,
          response: false,
        })),
      }));

      reset({
        inspections: inspectionForm,
      });
    }
  }, [data, reset]);

  const handleCheckAll = () => {
    reset({
      inspections: data.data.inspectionTemplates.map((template) => ({
        categoryName: template.categoryName,
        items: template.items.map((item) => ({
          itemName: item,
          response: true,
        })),
      })),
    });
    setCheckAll(true);
  };

  const handleReset = () => {
    reset({
      inspections: data.data.inspectionTemplates.map((template) => ({
        categoryName: template.categoryName,
        items: template.items.map((item) => ({
          itemName: item,
          response: false,
        })),
      })),
    });
    setCheckAll(false);
  };

  const onSubmit = async (data) => {
    try {
      const res = await transactionTwo({
        transactionId: id,
        inspections: data.inspections,
        transactionStatus: "Ready for Pickup",
        // serviceEnd: new Date().toISOString(),
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Inspection Complete!",
          description: `Vehicle Ready for Pickup!`,
        });
        navigate("/carwash", { state: { tab: "pickup" }, replace: true });
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
  if (isLoading || isFetching) {
    content = (
      <div className="flex-1 h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const service = data?.data?.transaction?.service?.id;
    content = (
      <div className="mx-auto grid w-full max-w-xl items-start gap-4 ">
        <div className="text-lg font-semibold tracking-tight flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate("/carwash", { state: { tab: "queue" } })}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          Car Wash Inspection
        </div>

        {service && (
          <div className="grid gap-2 ">
            <Label>Inspection For</Label>
            <div className="border p-4 rounded-md shadow-sm bg-background">
              <div className="flex gap-4">
                <div className="w-24 ">
                  <img src={`${service?.serviceVehicle?.vehicleIcon}`} />
                </div>
                <div className="flex flex-1 flex-col  pb-2 mb-2">
                  <div className="font-medium flex items-center justify-between">
                    <div className="text-sm">{service?.serviceTypeName}</div>
                    <StatusBadge
                      status={data?.data?.transaction?.transactionStatus}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {service?.serviceVehicle?.vehicleTypeName}
                    <div className="font-medium text-primary">
                      Vehicle No: {data?.data?.transaction?.vehicleNumber}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex gap-1 flex-col mt-2">
                {data?.data?.transaction?.service?.start && (
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs font-medium">
                      Start Time
                    </div>
                    <div className="text-xs ">
                      {format(
                        data?.data?.transaction?.service?.start,
                        "dd/MM/yyyy h:mm a"
                      )}
                    </div>
                  </div>
                )}
                {data?.data?.transaction?.service?.end && (
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs font-medium">
                      End Time
                    </div>
                    <div className="text-xs ">
                      {format(
                        data?.data?.transaction?.service?.end,
                        "dd/MM/yyyy h:mm a"
                      )}
                    </div>
                  </div>
                )}
                {data?.data?.transaction?.service?.cost >= 0 && (
                  <div className="flex items-center justify-between  ">
                    <div className="text-muted-foreground text-xs font-medium">
                      Rate
                    </div>
                    <div className="text-xs font-medium">
                      {data?.data?.transaction?.service?.cost > 0
                        ? `Rs. ${data?.data?.transaction?.service?.cost}`
                        : "Free"}
                    </div>
                  </div>
                )}
              </div>
              {data?.data?.transaction?.parking && (
                <div className="grid mt-2 gap-2">
                  <Label>Parking</Label>
                  <Separator />
                  <div>
                    <div className="flex gap-1 flex-col">
                      {data?.data?.transaction?.parking?.in && (
                        <div className="flex items-center justify-between">
                          <div className="text-muted-foreground text-xs font-medium">
                            In
                          </div>
                          <div className="text-xs ">
                            {format(
                              data?.data?.transaction?.parking?.in,
                              "dd/MM/yyyy h:mm a"
                            )}
                          </div>
                        </div>
                      )}
                      {data?.data?.transaction?.parking?.out && (
                        <div className="flex items-center justify-between">
                          <div className="text-muted-foreground text-xs font-medium">
                            Out
                          </div>
                          <div className="text-xs ">
                            {format(
                              data?.data?.transaction?.parking?.out,
                              "dd/MM/yyyy h:mm a"
                            )}
                          </div>
                        </div>
                      )}
                      {data?.data?.transaction?.parking?.cost && (
                        <>
                          <Separator className="my-1" />
                          <div className="flex items-center justify-between  ">
                            <div className="text-muted-foreground text-xs font-medium">
                              Cost
                            </div>
                            <div className="text-xs font-medium">
                              Rs. {data?.data?.transaction?.parking?.cost}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <Card className="mb-16">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg">Inspection Form</CardTitle>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit(onSubmit)} id="inspection-submit">
              <div className="grid gap-4">
                {data.data.inspectionTemplates.map(
                  (inspection, categoryIndex) => (
                    <div key={inspection.categoryName} className="space-y-2">
                      <div className="text-sm font-semibold bg-muted py-2 pl-4 pr-2 rounded-md flex justify-between">
                        <span>{inspection.categoryName}</span>
                        <Badge
                          variant="outline"
                          className="bg-background font-medium "
                        >
                          {inspection.scope}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {inspection.items.map((item, itemIndex) => (
                          <div
                            key={`item${itemIndex}`}
                            className="flex items-center ml-4"
                          >
                            <Checkbox
                              checked={watch(
                                `inspections.${categoryIndex}.items.${itemIndex}.response`
                              )}
                              {...register(
                                `inspections.${categoryIndex}.items.${itemIndex}.response`
                              )}
                              onCheckedChange={(e) => {
                                setValue(
                                  `inspections.${categoryIndex}.items.${itemIndex}.response`,
                                  e
                                );
                              }}
                            />
                            <span className="ml-2 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t pt-4 p-4 sm:p-6">
            <div className="w-full flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (checkAll) {
                    handleReset();
                  } else {
                    handleCheckAll();
                  }
                }}
              >
                {!checkAll ? (
                  <>
                    Check All <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "Reset"
                )}
              </Button>
              <SubmitButton
                condition={isSubmitting}
                loadingText="Submitting"
                type="submit"
                form="inspection-submit"
                buttonText={
                  <>
                    Submit <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                }
              />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

export default CarwashInspection;
