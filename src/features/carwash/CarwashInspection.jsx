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
        serviceEnd: new Date(),
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Inspection Complete!",
          description: `Vehicle Ready for Pickup!`,
        });
        navigate("/carwash?tab=pickup");
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
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const customer = data?.data?.transaction?.customer;
    const service = data?.data?.transaction?.service?.id;
    content = (
      <div className="mx-auto grid w-full max-w-xl items-start gap-4 ">
        <div className="text-lg font-semibold tracking-tight flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          Car Wash Inspection
        </div>
        {customer && (
          <Card>
            <CardHeader className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      <Contact />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-md">
                      {customer.customerName}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {customer.customerContact}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        <div className="border flex items-start gap-4 p-4 bg-background rounded-md shadow-sm">
          <div className="w-24">
            <img src={`${service?.serviceVehicle?.vehicleIcon}`} />
          </div>
          <div className="flex flex-col flex-1">
            <div className="font-medium flex items-center justify-between">
              <div className="text-base font-semibold">
                {service?.serviceTypeName}
              </div>
              <Badge className="tracking-wider font-medium text-sm">
                # {data.data.transaction?.vehicleNumber}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {service?.serviceVehicle?.vehicleTypeName}
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inspection Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} id="inspection-submit">
              <div className="grid gap-4">
                {data.data.inspectionTemplates.map(
                  (inspection, categoryIndex) => (
                    <div key={inspection.categoryName} className="space-y-2">
                      <div className="text-sm font-semibold">
                        {inspection.categoryName}
                      </div>
                      <div className="space-y-2">
                        {inspection.items.map((item, itemIndex) => (
                          <div
                            key={`item${itemIndex}`}
                            className="flex items-center"
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
          <CardFooter className="border-t pt-4">
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
              {isSubmitting ? (
                <Button disabled>
                  Submitting
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </Button>
              ) : (
                <Button type="submit" form="inspection-submit">
                  Submit <ChevronRight className="h-4 w-4 ml-2" />{" "}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-xl items-start gap-4 ">
      {content}
    </div>
  );
}

export default CarwashInspection;
