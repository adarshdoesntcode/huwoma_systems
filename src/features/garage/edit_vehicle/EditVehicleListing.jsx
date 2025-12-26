import { useParams } from "react-router-dom";

import NavBackButton from "@/components/NavBackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Steps from "@/components/Steps";
import PreviewVehicleListingForm from "./form/PreviewVehicleListingForm";
import { cleanObject } from "@/lib/utils";
import {
  useEditVehicleListingsMutation,
  useGetVehicleDetailsQuery,
} from "../garageApiSlice";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import VehicleDetailsForm from "./form/VehicleDetailsForm";
import VehicleImagesForm from "./form/VehicleImagesForm";

function EditVehicleListing() {
  const { id } = useParams();

  const [selectedSeller, setSelectedSeller] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedDriveType, setSelectedDriveType] = useState("");
  const [managedImages, setManagedImages] = useState([]);
  const [finalImageUrls, setFinalImageUrls] = useState([]);
  const [selectedListingType, setSelectedListingType] = useState("");

  const [formStep, setFormStep] = useState(1);

  const { data, isLoading, isFetching, isSuccess, isError, refetch, error } =
    useGetVehicleDetailsQuery(id);

  const [editVehicleListings] = useEditVehicleListingsMutation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    trigger,
    setError,
    clearErrors,
    register,
    getValues,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isSuccess && data) {
      const vehicle = data.data;
      reset(vehicle);
      setSelectedSeller(vehicle.seller);
      setSelectedMake(vehicle.make);
      setSelectedCategory(vehicle.category);
      setSelectedTransmission(vehicle.transmission);
      setSelectedFuelType(vehicle.fuelType);
      setSelectedDriveType(vehicle.driveType);
      setSelectedListingType(vehicle.listingType || "");
      setManagedImages(
        vehicle.photos.map((image) => ({
          urls: {
            primaryUrl: image.primaryUrl,
            fallbackUrl: image.fallbackUrl,
          },
          id: image._id,
          type: "existing",
        }))
      );
      setFinalImageUrls(vehicle.photos);
    }
  }, [isSuccess, data, reset]);

  const onSubmit = async (data) => {
    const vehiclePayload = cleanObject({
      _id: data._id,
      make: selectedMake,
      category: selectedCategory,
      transmission: selectedTransmission,
      fuelType: selectedFuelType,
      driveType: selectedDriveType,
      listingType: selectedListingType,
      model: data.model,
      variant: data.variant,
      year: data.year,
      numberPlate: data?.numberPlate || "NO PLATE",
      mileage: data.mileage,
      askingPrice: data.askingPrice,
      engineCC: data.engineCC,
      colour: data.colour,
      description: data.description,
      photos: finalImageUrls,
    });

    try {
      const res = await editVehicleListings({
        ...vehiclePayload,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Vehicle Listed!",
          description: "Successfully",
          duration: 2000,
        });
        reset();
        navigate(`/garage/vehicle/${id}`, { replace: true });
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
                Edit Vehicle Listing Form
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Edit the listed vehicle details
              </CardDescription>
            </div>
            <Steps steps={3} current={formStep} />
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <form
            id="edit-garage-vehicle-form"
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6"
          >
            {formStep === 1 && (
              <VehicleDetailsForm
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
                selectedListingType={selectedListingType}
                setSelectedListingType={setSelectedListingType}
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
              <VehicleImagesForm
                setFormStep={setFormStep}
                errors={errors}
                managedImages={managedImages}
                setManagedImages={setManagedImages}
                setFinalImageUrls={setFinalImageUrls}
                finalImageUrls={finalImageUrls}
              />
            )}
            {formStep === 3 && (
              <PreviewVehicleListingForm
                setFormStep={setFormStep}
                getValues={getValues}
                selectedSeller={selectedSeller}
                selectedMake={selectedMake}
                selectedCategory={selectedCategory}
                selectedTransmission={selectedTransmission}
                selectedFuelType={selectedFuelType}
                selectedDriveType={selectedDriveType}
                selectedListingType={selectedListingType}
                finalImageUrls={finalImageUrls}
              />
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return content;
}

export default EditVehicleListing;
