import { Button } from "@/components/ui/button";
import { CheckCheck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetVehicleConfigQuery } from "../../garageApiSlice";
import ApiError from "@/components/error/ApiError";
import { Switch } from "@/components/ui/switch";
import Loader from "@/components/Loader";
import { useBuyerInterestFormConfig } from "./form_items/useBuyerInterestFormConfig";
import FormItems from "./form_items";

function BuyerInterestForm({
  register,
  errors,
  clearErrors,
  setFormStep,
  hasBuyerInterest,
  setHasBuyerInterest,
  selectedInterestMakes,
  setSelectedInterestMakes,
  selectedInterestCategories,
  setSelectedInterestCategories,
  selectedInterestTransmissions,
  setSelectedInterestTransmissions,
  selectedInterestFuelTypes,
  setSelectedInterestFuelTypes,
  selectedInterestDriveTypes,
  setSelectedInterestDriveTypes,
  selectedInterestModels,
  setSelectedInterestModels,
  getValues,
  trigger,
  reset,
  setFocus,
  isSubmitting,
}) {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetVehicleConfigQuery();

  const [makeData, setMakeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [transmissionData, setTransmissionData] = useState([]);
  const [fuelTypeData, setFuelTypeData] = useState([]);
  const [driveTypeData, setDriveTypeData] = useState([]);

  useEffect(() => {
    if (data) {
      setMakeData(data?.data?.vehicleMakers || []);
      setCategoryData(data?.data?.vehicleCategories || []);
      setTransmissionData(data?.data?.transmissionTypes || []);
      setFuelTypeData(data?.data?.fuelTypes || []);
      setDriveTypeData(data?.data?.driveTypes || []);
    }
  }, [data]);

  const formConfig = useBuyerInterestFormConfig(
    register,
    errors,
    clearErrors,
    getValues,
    trigger,
    makeData,
    categoryData,
    transmissionData,
    fuelTypeData,
    driveTypeData,
    selectedInterestMakes,
    setSelectedInterestMakes,
    selectedInterestCategories,
    setSelectedInterestCategories,
    selectedInterestTransmissions,
    setSelectedInterestTransmissions,
    selectedInterestFuelTypes,
    setSelectedInterestFuelTypes,
    selectedInterestDriveTypes,
    setSelectedInterestDriveTypes,
    selectedInterestModels,
    setSelectedInterestModels
  );

  const budgetConfig = formConfig.filter(
    (config) => config.section === "budget"
  );
  const preferenceConfig = formConfig.filter(
    (config) => config.section === "preference"
  );
  const yearRangeConfig = formConfig.filter(
    (config) => config.section === "yearRange"
  );
  const mileageConfig = formConfig.filter(
    (config) => config.section === "mileage"
  );
  const powertrainConfig = formConfig.filter(
    (config) => config.section === "powertrain"
  );

  const handleReset = () => {
    setSelectedInterestMakes([]);
    setSelectedInterestCategories([]);
    setSelectedInterestTransmissions([]);
    setSelectedInterestFuelTypes([]);
    setSelectedInterestDriveTypes([]);
    setSelectedInterestModels([]);
    reset({
      min: "",
      max: "",
      mileageMax: "",
      from: "",
      to: "",
    });
    clearErrors([
      "min",
      "max",
      "mileageMax",
      "from",
      "to",
      "interestMakes",
      "interestCategories",
      "interestTransmissions",
      "interestFuelTypes",
      "interestDriveTypes",
      "interestModels",
    ]);
  };

  const handleNext = async () => {
    if (!hasBuyerInterest) {
      setFormStep(4);
    } else {
      const isValid = await trigger(["min", "max", "mileageMax", "from", "to"]);

      if (!isValid) {
        const firstErrorField = Object.keys(errors).reduce((field, key) => {
          return errors[key] ? key : field;
        }, "");

        if (firstErrorField) {
          setFocus(firstErrorField);
        }
      }

      if (isValid) {
        clearErrors([
          "min",
          "max",
          "mileageMax",
          "from",
          "to",
          "interestMakes",
          "interestCategories",
          "interestTransmissions",
          "interestFuelTypes",
          "interestDriveTypes",
          "interestModels",
        ]);
        setFormStep(4);
      }
    }
  };

  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1 h-full bg-white ">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="duration-500 slide-in-from-right-5 animate-in">
        <div className="grid gap-6 p-4 border shadow-sm sm:p-6 rounded-xl bg-background ">
          <div className="p-4 border rounded-lg shadow-sm ">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 ">
                <h3 className="text-lg font-semibold">
                  Buyer Preference Form
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hasBuyerInterest
                    ? "Fill the details of the vehicles the seller is interested in buying"
                    : "Does the seller have any interest in buying another vehicle?"}
                </p>
              </div>

              <Switch
                disabled={true}
                className="hidden"
                checked={hasBuyerInterest}
                onCheckedChange={(value) => {
                  setHasBuyerInterest(value);
                  clearErrors([
                    "min",
                    "max",
                    "mileageMax",
                    "from",
                    "to",
                    "interestMakes",
                    "interestCategories",
                    "interestTransmissions",
                    "interestFuelTypes",
                    "interestDriveTypes",
                    "interestModels",
                  ]);
                }}
              />
            </div>
            {hasBuyerInterest && (
              <div className="grid gap-4 mt-6">
                <h3 className="pb-2 font-semibold border-b">Budget</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {budgetConfig.map((config, index) => (
                    <FormItems key={index} type={config.type} props={config} />
                  ))}
                </div>

                <h3 className="pb-2 font-semibold border-b">Preference</h3>
                <div className="grid grid-cols-3 gap-4">
                  {preferenceConfig.map((config, index) => (
                    <FormItems key={index} type={config.type} props={config} />
                  ))}
                </div>
                <h3 className="pb-2 font-semibold border-b">Year Range</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {yearRangeConfig.map((config, index) => (
                    <FormItems key={index} type={config.type} props={config} />
                  ))}
                </div>
                <h3 className="pb-2 font-semibold border-b">Mileage</h3>
                <div className="grid grid-cols-3 gap-4">
                  {mileageConfig.map((config, index) => (
                    <FormItems key={index} type={config.type} props={config} />
                  ))}
                </div>
                <h3 className="pb-2 font-semibold border-b">Powertrain</h3>
                <div className="grid grid-cols-3 gap-4">
                  {powertrainConfig.map((config, index) => (
                    <FormItems key={index} type={config.type} props={config} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setFormStep(2)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              {hasBuyerInterest && (
                <Button variant="ghost" type="button" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </div>
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Submitting...</span>
              </Button>
            ) : (
              <Button form="new-buyer-interest-form" type="submit">
                Submit <CheckCheck className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default BuyerInterestForm;
