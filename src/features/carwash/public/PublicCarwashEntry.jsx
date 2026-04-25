import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ApiError from "@/components/error/ApiError";
import Steps from "@/components/Steps";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IMAGE_DATA } from "@/lib/config";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PublicEntryButtonBusyState from "./entry/components/PublicEntryButtonBusyState";
import PublicEntryLoadingState from "./entry/components/PublicEntryLoadingState";
import PublicEntryStepCustomer from "./entry/components/PublicEntryStepCustomer";
import PublicEntryStepVehicle from "./entry/components/PublicEntryStepVehicle";
import PublicEntryStepService from "./entry/components/PublicEntryStepService";
import PublicEntryStepReview from "./entry/components/PublicEntryStepReview";
import usePublicCarwashEntryForm from "./entry/hooks/usePublicCarwashEntryForm";
import { TOUCH_CLEAN_INTERACTION_CLASS } from "./entry/publicEntryShared";

function PublicCarwashEntry() {
  const {
    step,
    form,
    errors,
    customerContext,
    recentCustomers,
    useManualCustomerLookup,
    hasSearchedContact,
    selectedMatchedCustomerId,
    shouldReduceMotion,
    stepMotionTransition,
    vehicleTypes,
    selectableVehicles,
    selectedVehicleType,
    availableServices,
    selectedService,
    isConfigLoading,
    isConfigError,
    configError,
    refetchConfig,
    isContextLoading,
    isSubmitting,
    handleContactChange,
    handleSelectRecentCustomer,
    handleRemoveRecentCustomer,
    handleSelectMatchedCustomer,
    handleNewCustomerNameChange,
    handleSelectVehicle,
    handleSaveVehicleDraft,
    handleSelectService,
    handleNext,
    handleBack,
    handleSubmit,
    handleNotYou,
  } = usePublicCarwashEntryForm();

  if (isConfigLoading) {
    return <PublicEntryLoadingState />;
  }

  if (isConfigError) {
    return (
      <div className="max-w-3xl px-4 py-10 mx-auto">
        <ApiError error={configError} refetch={refetchConfig} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen ">
      <div className="fixed top-0 left-0 right-0 h-1 overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-in-out"
          style={{
            width: `${(step / 4) * 100}%`,
            background: "linear-gradient(to right, #058299, #058299, white)",
          }}
        />
      </div>

      <div className="w-full max-w-4xl px-4 py-4 mx-auto sm:py-10">
        <Card className="mt-2 mb-4 shadow-xl ">
          <CardHeader className="pb-4 ">
            <div className="mb-1">
              <CardTitle className="flex items-center justify-between text-2xl">
                <div className="w-32 h-20">
                  <img
                    src={IMAGE_DATA.receipt_logo}
                    className="object-cover w-full h-full"
                    alt="Receipt Logo"
                  />
                </div>
                <Steps steps={4} current={step} />
              </CardTitle>
              <CardDescription> </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pb-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`step-${step}`}
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={stepMotionTransition}
              >
                {step === 1 ? (
                  <PublicEntryStepCustomer
                    form={form}
                    errors={errors}
                    recentCustomers={recentCustomers}
                    hasSearchedContact={hasSearchedContact}
                    selectedMatchedCustomerId={selectedMatchedCustomerId}
                    useManualCustomerLookup={useManualCustomerLookup}
                    customerContext={customerContext}
                    onContactChange={handleContactChange}
                    onSelectRecentCustomer={handleSelectRecentCustomer}
                    onRemoveRecentCustomer={handleRemoveRecentCustomer}
                    onSelectMatchedCustomer={handleSelectMatchedCustomer}
                    onNewCustomerNameChange={handleNewCustomerNameChange}
                    isContextLoading={isContextLoading}
                  />
                ) : null}

                {step === 2 ? (
                  <PublicEntryStepVehicle
                    form={form}
                    errors={errors}
                    vehicleTypes={vehicleTypes}
                    vehicles={selectableVehicles}
                    shouldReduceMotion={shouldReduceMotion}
                    isVehiclesLoading={isContextLoading}
                    onSelectVehicle={handleSelectVehicle}
                    onSaveVehicleDraft={handleSaveVehicleDraft}
                  />
                ) : null}

                {step === 3 ? (
                  <PublicEntryStepService
                    form={form}
                    onSelectService={handleSelectService}
                    errors={errors}
                    selectedVehicleType={selectedVehicleType}
                    availableServices={availableServices}
                  />
                ) : null}

                {step === 4 ? (
                  <PublicEntryStepReview
                    form={form}
                    selectedVehicleType={selectedVehicleType}
                    selectedService={selectedService}
                  />
                ) : null}

                <Separator className="my-6" />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex w-full gap-2 sm:w-auto">
                    {step > 1 ? (
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full min-h-12 transition-transform sm:w-auto",
                          TOUCH_CLEAN_INTERACTION_CLASS,
                        )}
                        onClick={handleBack}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full min-h-12 transition-transform sm:w-auto",
                          TOUCH_CLEAN_INTERACTION_CLASS,
                        )}
                        disabled={
                          recentCustomers.length === 0 || useManualCustomerLookup
                        }
                        onClick={handleNotYou}
                      >
                        New Account?
                      </Button>
                    )}

                    {step < 4 ? (
                      <Button
                        className={cn(
                          "w-full min-h-12 transition-transform sm:w-auto",
                          TOUCH_CLEAN_INTERACTION_CLASS,
                        )}
                        onClick={handleNext}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        className={cn(
                          "w-full min-h-12 transition-transform sm:w-auto",
                          TOUCH_CLEAN_INTERACTION_CLASS,
                        )}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <PublicEntryButtonBusyState label="Submitting" />
                        ) : (
                          "Submit To Queue"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PublicCarwashEntry;
