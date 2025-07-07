import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetVehicleConfigQuery } from "../../garageApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import FormItems from "./form_items";
import { useFormConfig } from "./useFormConfig";

function FormOne({
  register,
  selectedMake,
  setSelectedMake,
  selectedCategory,
  setSelectedCategory,
  selectedTransmission,
  setSelectedTransmission,
  selectedFuelType,
  setSelectedFuelType,
  selectedDriveType,
  setSelectedDriveType,
  setFormStep,
  errors,
  setError,
  trigger,
  setFocus,
  clearErrors,
  reset,
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

  const formConfig = useFormConfig(
    register,
    selectedMake,
    setSelectedMake,
    errors,
    makeData,
    clearErrors,
    selectedCategory,
    setSelectedCategory,
    categoryData,
    selectedTransmission,
    setSelectedTransmission,
    transmissionData,
    selectedFuelType,
    setSelectedFuelType,
    fuelTypeData,
    selectedDriveType,
    setSelectedDriveType,
    driveTypeData
  );

  const handleReset = () => {
    setSelectedMake("");
    setSelectedCategory("");
    setSelectedTransmission("");
    setSelectedFuelType("");
    setSelectedDriveType("");
    clearErrors([
      "make",
      "category",
      "transmission",
      "fuelType",
      "driveType",
      "model",
      "year",
      "numberPlate",
      "mileage",
      "askingPrice",
    ]);
    reset({
      model: "",
      year: "",
      numberPlate: "",
      mileage: "",
      askingPrice: "",
      engineCC: "",
      colour: "",
      description: "",
    });
  };

  const handleNext = async () => {
    const fieldsToValidate = [
      { name: "make", value: selectedMake, message: "Please select a company" },
      {
        name: "category",
        value: selectedCategory,
        message: "Please select a category",
      },
      {
        name: "transmission",
        value: selectedTransmission,
        message: "Please select a transmission type",
      },
      {
        name: "fuelType",
        value: selectedFuelType,
        message: "Please select a fuel type",
      },
      {
        name: "driveType",
        value: selectedDriveType,
        message: "Please select a drive type",
      },
    ];

    let hasError = false;

    fieldsToValidate.forEach((field) => {
      if (!field.value) {
        setError(field.name, { message: field.message });
        hasError = true;
      }
    });

    const isValid = await trigger([
      "model",
      "year",
      "numberPlate",
      "mileage",
      "askingPrice",
      "engineCC",
      "colour",
    ]);

    if (!isValid) {
      const firstErrorField = Object.keys(errors).reduce((field, key) => {
        return errors[key] ? key : field;
      }, "");

      if (firstErrorField) {
        setFocus(firstErrorField);
      }
    }

    if (!hasError && isValid) {
      const fieldNames = fieldsToValidate.map((field) => field.name);
      clearErrors(fieldNames);
      setFormStep(2);
    }
  };

  const vehicleInfoConfig = formConfig.filter(
    (config) => config.section === "vehicle-info"
  );
  const specificationConfig = formConfig.filter(
    (config) => config.section === "specification"
  );
  const classificationConfig = formConfig.filter(
    (config) => config.section === "classification"
  );
  const pricingConfig = formConfig.filter(
    (config) => config.section === "pricing"
  );
  const descriptionConfig = formConfig.filter(
    (config) => config.section === "description"
  );

  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1 h-full ">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="duration-500 slide-in-from-right-5 animate-in">
        <div className="grid gap-6 p-4 border shadow-sm rounded-xl sm:p-6 bg-background ">
          <h3 className="pb-2 font-semibold border-b">Information</h3>
          <div className="grid grid-cols-3 gap-4">
            {vehicleInfoConfig.map((config, index) => (
              <FormItems key={index} type={config.type} props={config} />
            ))}
          </div>

          <h3 className="pb-2 font-semibold border-b">Specification</h3>
          <div className="grid grid-cols-3 gap-4">
            {specificationConfig.map((config, index) => (
              <FormItems key={index} type={config.type} props={config} />
            ))}
          </div>

          <h3 className="pb-2 font-semibold border-b">Classification</h3>
          <div className="grid grid-cols-3 gap-4">
            {classificationConfig.map((config, index) => (
              <FormItems key={index} type={config.type} props={config} />
            ))}
          </div>
          <h3 className="pb-2 font-semibold border-b">Pricing</h3>
          <div className="grid grid-cols-3 gap-4">
            {pricingConfig.map((config, index) => (
              <FormItems key={index} type={config.type} props={config} />
            ))}
          </div>
          <Separator />

          <div className="grid grid-cols-3 gap-4">
            {descriptionConfig.map((config, index) => (
              <FormItems key={index} type={config.type} props={config} />
            ))}
          </div>
          <Separator />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setFormStep(0)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button variant="ghost" type="button" onClick={handleReset}>
                Reset
              </Button>
            </div>
            <Button type="button" onClick={handleNext}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default FormOne;
