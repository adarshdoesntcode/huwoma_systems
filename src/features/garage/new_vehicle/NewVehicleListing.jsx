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

function NewVehicleListing() {
  const [selectedSeller, setSelectedSeller] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedDriveType, setSelectedDriveType] = useState("");
  const [managedImages, setManagedImages] = useState([]);
  const [finalImageUrls, setFinalImageUrls] = useState([]);

  const [formStep, setFormStep] = useState(3);
  const {
    handleSubmit,
    reset,
    trigger,
    setValue,
    setError,
    clearErrors,
    register,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
  };

  let content;

  content = (
    <div className="grid items-start w-full max-w-4xl gap-6 mx-auto mb-64">
      <NavBackButton buttonText={"Back"} navigateTo={-1} />
      <Card className="p-0 bg-transparent border-none shadow-none">
        <CardHeader className="p-0">
          <CardTitle className="text-xl sm:text-2xl">New Vehicle</CardTitle>
          <CardDescription>Add a new vehicle to your garage</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <form
            id="new-garage-vehicle-form"
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6"
          >
            <Steps steps={4} current={formStep} />

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
            {formStep === 3 && <FormThree setFormStep={setFormStep} />}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end"></CardFooter>
      </Card>
    </div>
  );

  return content;
}

export default NewVehicleListing;
