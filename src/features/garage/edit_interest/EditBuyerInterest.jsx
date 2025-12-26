import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEditBuyerInterestMutation,
  useGetInterestDetailsQuery,
} from "../garageApiSlice";
import BuyerInterestForm from "./form/BuyerInterestForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NavBackButton from "@/components/NavBackButton";
import { cleanObject } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { replace } from "lodash";

function EditBuyerInterest() {
  const { id } = useParams();
  const [hasBuyerInterest, setHasBuyerInterest] = useState(true);
  const [selectedInterestMakes, setSelectedInterestMakes] = useState([]);
  const [selectedInterestCategories, setSelectedInterestCategories] = useState(
    []
  );
  const [selectedInterestFuelTypes, setSelectedInterestFuelTypes] = useState(
    []
  );
  const [selectedInterestTransmissions, setSelectedInterestTransmissions] =
    useState([]);
  const [selectedInterestDriveTypes, setSelectedInterestDriveTypes] = useState(
    []
  );
  const [selectedInterestModels, setSelectedInterestModels] = useState([]);

  const { data, isLoading, isFetching, isSuccess, isError, refetch, error } =
    useGetInterestDetailsQuery(id);

  const [editBuyerInterest] = useEditBuyerInterestMutation();

  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    trigger,
    setError,
    setValue,
    clearErrors,
    register,
    getValues,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isSuccess && data) {
      const interest = data.data;
      setValue("min", interest?.budget?.min);
      setValue("max", interest?.budget?.max);
      setValue("mileageMax", interest?.criteria?.mileageMax);
      setValue("from", interest?.criteria?.year?.from);
      setValue("to", interest?.criteria?.year?.to);
      setSelectedInterestMakes(interest?.criteria?.makes);
      setSelectedInterestCategories(interest?.criteria?.categories);
      setSelectedInterestFuelTypes(interest?.criteria?.fuelTypes);
      setSelectedInterestTransmissions(interest?.criteria?.transmissions);
      setSelectedInterestDriveTypes(interest?.criteria?.driveTypes);
      setSelectedInterestModels(interest?.criteria?.models);
    }
  }, [data, isSuccess, reset]);

  const onSubmit = async (data) => {
    const interestPayload = cleanObject({
      budget: {
        min: data.min,
        max: data.max,
      },

      criteria: {
        categories: selectedInterestCategories,
        makes: selectedInterestMakes,
        transmissions: selectedInterestTransmissions,
        driveTypes: selectedInterestDriveTypes,
        fuelTypes: selectedInterestFuelTypes,
        models: selectedInterestModels,
        mileageMax: data.mileageMax,
        year: {
          min: data.from,
          max: data.to,
        },
      },
    });

    try {
      const res = await editBuyerInterest({
        id,
        ...interestPayload,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Interest Updated!",
          description: "Your interest has been updated successfully",
          variant: "success",
        });
        navigate(`/garage/interest/${id}`, { replace: true });
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

  content = (
    <div className="grid items-start w-full max-w-4xl gap-4 mx-auto mb-64">
      <div>
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
      </div>
      <Card className="p-0 bg-transparent border-none shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-end justify-between px-1">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Edit Buyer Preference Form
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Edit the buyer preference in your garage
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <form
            id="edit-buyer-interest-form"
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6"
          >
            <BuyerInterestForm
              hasBuyerInterest={hasBuyerInterest}
              setHasBuyerInterest={setHasBuyerInterest}
              selectedInterestMakes={selectedInterestMakes}
              setSelectedInterestMakes={setSelectedInterestMakes}
              selectedInterestCategories={selectedInterestCategories}
              setSelectedInterestCategories={setSelectedInterestCategories}
              selectedInterestTransmissions={selectedInterestTransmissions}
              setSelectedInterestTransmissions={
                setSelectedInterestTransmissions
              }
              selectedInterestFuelTypes={selectedInterestFuelTypes}
              setSelectedInterestFuelTypes={setSelectedInterestFuelTypes}
              selectedInterestDriveTypes={selectedInterestDriveTypes}
              setSelectedInterestDriveTypes={setSelectedInterestDriveTypes}
              selectedInterestModels={selectedInterestModels}
              setSelectedInterestModels={setSelectedInterestModels}
              register={register}
              errors={errors}
              clearErrors={clearErrors}
              getValues={getValues}
              trigger={trigger}
              reset={reset}
              setFocus={setFocus}
              isSubmitting={isSubmitting}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return content;
}

export default EditBuyerInterest;
