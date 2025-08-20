import { useState } from "react";
import { useForm } from "react-hook-form";
import NavBackButton from "@/components/NavBackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Steps from "@/components/Steps";
import { cleanObject } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreateBuyerInterestMutation } from "../garageApiSlice";
import GarageCustomerForm from "./form/GarageCustomerForm";
import BuyerInterestForm from "./form/BuyerInterestForm";

function NewBuyerInterest() {
  const [formStep, setFormStep] = useState(0);
  const [selectedBuyer, setSelectedBuyer] = useState("");
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

  const [createBuyerInterest] = useCreateBuyerInterestMutation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    trigger,
    setValue,
    setError,
    clearErrors,
    register,
    getValues,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const userPayload = cleanObject({
      new: !selectedBuyer._id,
      info: {
        name: selectedBuyer.name,
        contactNumber: selectedBuyer.contactNumber,
      },
    });

    const buyerInterestPayload = cleanObject({
      hasInterest: hasBuyerInterest,
      info: hasBuyerInterest
        ? {
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
          }
        : {},
    });

    const finalPayload = {
      buyer: userPayload,
      buyerInterest: buyerInterestPayload,
    };

    try {
      const res = await createBuyerInterest({
        ...finalPayload,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Interest Listed!",
          description: "Successfully",
          duration: 2000,
        });
        reset();
        navigate(`/garage`, {
          state: { tab: "interest" },
          replace: true,
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
                New Buyer Interest Form
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Add a new buyer interest to your garage
              </CardDescription>
            </div>
            <Steps steps={2} current={formStep} />
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <form
            id="new-buyer-interest-form"
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6"
          >
            {formStep === 0 && (
              <GarageCustomerForm
                register={register}
                watch={watch}
                errors={errors}
                trigger={trigger}
                selectedSeller={selectedBuyer}
                setSelectedSeller={setSelectedBuyer}
                setValue={setValue}
                clearErrors={clearErrors}
                setFormStep={setFormStep}
                reset={reset}
                setError={setError}
                setFocus={setFocus}
              />
            )}

            {formStep === 1 && (
              <BuyerInterestForm
                setFormStep={setFormStep}
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
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return content;
}

export default NewBuyerInterest;
