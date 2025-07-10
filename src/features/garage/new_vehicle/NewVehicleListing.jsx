import NavBackButton from "@/components/NavBackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Steps from "@/components/Steps";
import FormOne from "./form/FormOne";
import FormZero from "./form/FormZero";
import FormTwo from "./form/FormTwo";
import FormThree from "./form/FormThree";
import PreviewVehicleListingForm from "./form/PreviewVehicleListingForm";

function NewVehicleListing() {
  const [selectedSeller, setSelectedSeller] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedInterestMakes, setSelectedInterestMakes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedInterestCategories, setSelectedInterestCategories] = useState(
    []
  );
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedInterestTransmissions, setSelectedInterestTransmissions] =
    useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedInterestFuelTypes, setSelectedInterestFuelTypes] = useState(
    []
  );
  const [selectedDriveType, setSelectedDriveType] = useState("");
  const [selectedInterestDriveTypes, setSelectedInterestDriveTypes] = useState(
    []
  );
  const [selectedInterestModels, setSelectedInterestModels] = useState([]);
  const [managedImages, setManagedImages] = useState([]);
  const [finalImageUrls, setFinalImageUrls] = useState([]);
  const [hasBuyerInterest, setHasBuyerInterest] = useState(false);

  const [formStep, setFormStep] = useState(0);
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
    console.log(data);
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
                New Vehicle Listing Form
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Add a new vehicle to your garage
              </CardDescription>
            </div>
            <Steps steps={5} current={formStep} />
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <form
            id="new-garage-vehicle-form"
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6"
          >
            {formStep === 0 && (
              <FormZero
                register={register}
                watch={watch}
                errors={errors}
                trigger={trigger}
                selectedSeller={selectedSeller}
                setSelectedSeller={setSelectedSeller}
                setValue={setValue}
                clearErrors={clearErrors}
                setFormStep={setFormStep}
                reset={reset}
                setError={setError}
                setFocus={setFocus}
              />
            )}

            {formStep === 1 && (
              <FormOne
                register={register}
                selectedMake={selectedMake}
                setSelectedMake={setSelectedMake}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedTransmission={selectedTransmission}
                setSelectedTransmission={setSelectedTransmission}
                selectedFuelType={selectedFuelType}
                setSelectedFuelType={setSelectedFuelType}
                selectedDriveType={selectedDriveType}
                setSelectedDriveType={setSelectedDriveType}
                setFormStep={setFormStep}
                errors={errors}
                reset={reset}
                setError={setError}
                trigger={trigger}
                clearErrors={clearErrors}
                setFocus={setFocus}
              />
            )}
            {formStep === 2 && (
              <FormTwo
                setFormStep={setFormStep}
                errors={errors}
                managedImages={managedImages}
                setManagedImages={setManagedImages}
                setFinalImageUrls={setFinalImageUrls}
                finalImageUrls={finalImageUrls}
              />
            )}
            {formStep === 3 && (
              <FormThree
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
              />
            )}
            {formStep === 4 && (
              <PreviewVehicleListingForm
                setFormStep={setFormStep}
                getValues={getValues}
                selectedSeller={selectedSeller}
                selectedMake={selectedMake}
                selectedCategory={selectedCategory}
                selectedTransmission={selectedTransmission}
                selectedFuelType={selectedFuelType}
                selectedDriveType={selectedDriveType}
                finalImageUrls={finalImageUrls}
                hasBuyerInterest={hasBuyerInterest}
                selectedInterestMakes={selectedInterestMakes}
                selectedInterestCategories={selectedInterestCategories}
                selectedInterestTransmissions={selectedInterestTransmissions}
                selectedInterestFuelTypes={selectedInterestFuelTypes}
                selectedInterestDriveTypes={selectedInterestDriveTypes}
                selectedInterestModels={selectedInterestModels}
                handleSubmit={onSubmit}
              />
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return content;
}

export default NewVehicleListing;
