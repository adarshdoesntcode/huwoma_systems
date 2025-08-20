import NavBackButton from "@/components/NavBackButton";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Steps from "@/components/Steps";
import { useForm } from "react-hook-form";
import GarageCustomerForm from "./form/GarageCustomerForm";

function SellVehicle() {
  const { state } = useLocation();
  const [formStep, setFormStep] = useState(0);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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

  useEffect(() => {
    if (state) {
      setSelectedBuyer(state.selectedBuyer || null);
      setSelectedInterest(state.selectedInterest || null);
      setSelectedVehicle(state.selectedVehicle || null);
    }
  }, [state]);

  const onSubmit = async (data) => {
    console.log(data);
  };

  if (!selectedVehicle) return null;

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
                Vehicle Checkout Form
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Fill the form to sell the vehicle
              </CardDescription>
            </div>
            <Steps steps={3} current={formStep} />
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <form
            id="vehicle-checkout-form"
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
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return content;
}

export default SellVehicle;
