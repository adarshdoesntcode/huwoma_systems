import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ApiError from "@/components/error/ApiError";
import { cn } from "@/lib/utils";
import { CAR_COLOR_OPTIONS, IMAGE_DATA } from "@/lib/config";
import { resolveVehicleIcon } from "@/lib/vehicleIcon";
import { toast } from "@/hooks/use-toast";
import {
  useCreatePublicCarwashTransactionMutation,
  useGetPublicCarwashConfigQuery,
  useGetPublicCarwashCustomerContextMutation,
} from "../carwashApiSlice";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Edit,
  Loader2,
  X,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import QRCode from "react-qr-code";
import Steps from "@/components/Steps";
import { format } from "date-fns";

const CUSTOMER_CACHE_KEY = "huwoma_carwash_public_customer_v1";
const CUSTOMER_RECENT_CACHE_KEY = "huwoma_carwash_public_recent_customers_v1";
const MAX_RECENT_CUSTOMERS = 6;

const initialFormState = {
  customerName: "",
  customerContact: "",
  selectedVehicleKey: "",
  vehicleModel: "",
  vehicleNumber: "",
  vehicleColorName: "",
  vehicleColorCode: "",
  vehicleTypeId: "",
  serviceId: "",
};

const normalizeContact = (value) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, 10);

const normalizeVehicleNumber = (value) =>
  String(value || "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();

const capitalizeName = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`,
    )
    .join(" ");

const normalizeVehicleName = (value) => {
  const trimmedValue = String(value || "").trim();
  if (!trimmedValue) return "";
  return `${trimmedValue.charAt(0).toUpperCase()}${trimmedValue.slice(1)}`;
};

const createLocalVehicleKey = () =>
  `local-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const initialVehicleDraft = {
  vehicleModel: "",
  vehicleNumber: "",
  vehicleColorName: "",
  vehicleColorCode: "",
  vehicleTypeId: "",
};

const STEP_TRANSITION_EASE = [0.22, 1, 0.36, 1];

function PublicCarwashEntry() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [customerContext, setCustomerContext] = useState({
    customer: null,
    vehicles: [],
  });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [useManualCustomerLookup, setUseManualCustomerLookup] = useState(true);
  const [contextContact, setContextContact] = useState("");
  const [hasSearchedContact, setHasSearchedContact] = useState(false);
  const [selectedMatchedCustomerId, setSelectedMatchedCustomerId] =
    useState("");
  const [customVehicles, setCustomVehicles] = useState([]);
  const [vehicleOverrides, setVehicleOverrides] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const stepMotionTransition = useMemo(
    () =>
      shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.2, ease: STEP_TRANSITION_EASE },
    [shouldReduceMotion],
  );

  const {
    data: configData,
    isLoading: isConfigLoading,
    isError: isConfigError,
    error: configError,
    refetch: refetchConfig,
  } = useGetPublicCarwashConfigQuery();

  const [getCustomerContext, { isLoading: isContextLoading }] =
    useGetPublicCarwashCustomerContextMutation();
  const [createPublicTransaction, { isLoading: isSubmitting }] =
    useCreatePublicCarwashTransactionMutation();

  const vehicleTypes = useMemo(
    () => configData?.data?.vehicleTypes || [],
    [configData],
  );

  const selectedVehicleType = useMemo(
    () =>
      vehicleTypes.find(
        (vehicleType) => vehicleType._id === form.vehicleTypeId,
      ),
    [vehicleTypes, form.vehicleTypeId],
  );

  const availableServices = useMemo(
    () => selectedVehicleType?.services || [],
    [selectedVehicleType],
  );

  const selectedService = useMemo(
    () => availableServices.find((service) => service._id === form.serviceId),
    [availableServices, form.serviceId],
  );

  const selectableVehicles = useMemo(() => {
    const existingVehicles = (customerContext?.vehicles || []).map(
      (vehicle) => {
        const override = vehicleOverrides[vehicle.key];
        if (!override) return vehicle;

        return {
          ...vehicle,
          ...override,
          key: vehicle.key,
        };
      },
    );

    return [...existingVehicles, ...customVehicles];
  }, [customerContext?.vehicles, customVehicles, vehicleOverrides]);

  useEffect(() => {
    try {
      const cachedRecent = localStorage.getItem(CUSTOMER_RECENT_CACHE_KEY);
      const parsedRecent = cachedRecent ? JSON.parse(cachedRecent) : [];

      const sanitizedRecent = parsedRecent
        .map((entry) => ({
          customerName: capitalizeName(entry?.customerName || ""),
          customerContact: normalizeContact(entry?.customerContact || ""),
        }))
        .filter((entry) => entry.customerName && entry.customerContact)
        .slice(0, MAX_RECENT_CUSTOMERS);

      setRecentCustomers(sanitizedRecent);
      if (sanitizedRecent.length > 0) {
        setUseManualCustomerLookup(false);
        setForm((prev) => ({
          ...prev,
          customerName: sanitizedRecent[0].customerName,
          customerContact: sanitizedRecent[0].customerContact,
        }));
        return;
      }
    } catch {
      // Ignore invalid cache payloads.
    }

    try {
      const cached = localStorage.getItem(CUSTOMER_CACHE_KEY);
      if (!cached) return;
      const parsed = JSON.parse(cached);
      if (!parsed) return;

      setForm((prev) => ({
        ...prev,
        customerContact: normalizeContact(parsed.customerContact || ""),
      }));
    } catch {
      // Ignore invalid cache payloads.
    }
  }, []);

  useEffect(() => {
    if (!selectedVehicleType) {
      if (form.serviceId) {
        setForm((prev) => ({ ...prev, serviceId: "" }));
      }
      return;
    }

    if (!availableServices.some((service) => service._id === form.serviceId)) {
      setForm((prev) => ({ ...prev, serviceId: "" }));
    }
  }, [availableServices, form.serviceId, selectedVehicleType]);

  const applyExistingVehicle = (vehicle) => {
    const vehicleNumber = normalizeVehicleNumber(vehicle?.vehicleNumber);
    const vehicleModel = normalizeVehicleName(vehicle?.vehicleModel || "");

    setForm((prev) => ({
      ...prev,
      selectedVehicleKey: vehicle?.key || "",
      vehicleModel,
      vehicleNumber,
      vehicleColorName: vehicle?.vehicleColor?.colorName || "",
      vehicleColorCode: vehicle?.vehicleColor?.colorCode || "",
      vehicleTypeId: vehicle?.vehicleTypeId || "",
    }));

    setErrors((prev) => ({
      ...prev,
      vehicleModel: "",
      vehicleNumber: "",
      vehicleTypeId: "",
      vehicleColor: "",
    }));
  };

  const handleSaveVehicleDraft = ({ mode, vehicleKey, vehicleDraft }) => {
    const normalizedModel = normalizeVehicleName(vehicleDraft?.vehicleModel || "");
    const normalizedNumber = normalizeVehicleNumber(
      vehicleDraft?.vehicleNumber || "",
    );
    const normalizedTypeId = String(vehicleDraft?.vehicleTypeId || "");

    const selectedType = vehicleTypes.find(
      (vehicleType) => vehicleType._id === normalizedTypeId,
    );

    const sourceVehicle = selectableVehicles.find(
      (vehicle) => vehicle.key === vehicleKey,
    );

    const normalizedVehicle = {
      key: mode === "edit" && vehicleKey ? vehicleKey : createLocalVehicleKey(),
      vehicleModel: normalizedModel,
      vehicleNumber: normalizedNumber,
      vehicleColor: {
        colorCode: vehicleDraft.vehicleColorCode,
        colorName: vehicleDraft.vehicleColorName,
      },
      vehicleTypeId: normalizedTypeId,
      vehicleTypeName:
        selectedType?.vehicleTypeName || sourceVehicle?.vehicleTypeName || "",
      vehicleIcon:
        selectedType?.vehicleIcon || sourceVehicle?.vehicleIcon || "",
      lastServiceName: sourceVehicle?.lastServiceName || "",
      lastVisitedAt: sourceVehicle?.lastVisitedAt || null,
    };

    if (mode === "edit" && vehicleKey) {
      const isCustomVehicle = customVehicles.some(
        (vehicle) => vehicle.key === vehicleKey,
      );

      if (isCustomVehicle) {
        setCustomVehicles((prev) =>
          prev.map((vehicle) =>
            vehicle.key === vehicleKey ? normalizedVehicle : vehicle,
          ),
        );
      } else {
        setVehicleOverrides((prev) => ({
          ...prev,
          [vehicleKey]: normalizedVehicle,
        }));
      }
    } else {
      setCustomVehicles((prev) => [normalizedVehicle, ...prev]);
    }

    applyExistingVehicle(normalizedVehicle);
  };

  const fetchContextForContact = async () => {
    const contact = normalizeContact(form.customerContact);

    if (contact.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        customerContact: "Contact number must be 10 digits.",
      }));
      return false;
    }

    try {
      const response = await getCustomerContext({
        customerContact: contact,
      }).unwrap();

      const customer = response?.data?.customer || null;
      const vehicles = response?.data?.vehicles || [];
      const resolvedCustomerContact = normalizeContact(
        customer?.customerContact || contact,
      );

      setCustomVehicles([]);
      setVehicleOverrides({});
      setCustomerContext({ customer, vehicles });
      setContextContact(resolvedCustomerContact);
      setHasSearchedContact(true);
      setSelectedMatchedCustomerId(customer?._id || "");

      if (customer?.customerName) {
        setForm((prev) => ({
          ...prev,
          customerName: customer.customerName,
          customerContact: resolvedCustomerContact,
        }));
        persistPrimaryCustomerCache(
          customer.customerName,
          resolvedCustomerContact,
        );
        saveRecentCustomer(customer.customerName, resolvedCustomerContact);
      } else {
        setForm((prev) => ({
          ...prev,
          customerName: "",
        }));
      }

      if (vehicles.length > 0) {
        const matchedVehicle =
          vehicles.find((vehicle) => vehicle.key === form.selectedVehicleKey) ||
          vehicles[0];
        applyExistingVehicle(matchedVehicle);
      } else {
        setForm((prev) => ({
          ...prev,
          selectedVehicleKey: "",
          vehicleModel: "",
          vehicleNumber: "",
          vehicleColorName: "",
          vehicleColorCode: "",
          vehicleTypeId: "",
          serviceId: "",
        }));
      }

      return true;
    } catch (error) {
      setHasSearchedContact(false);
      setSelectedMatchedCustomerId("");
      toast({
        variant: "destructive",
        title: "Could not fetch customer context",
        description:
          error?.data?.message ||
          error?.error ||
          "Please continue with manual vehicle details.",
      });
      return false;
    }
  };

  const validateStep = (currentStep) => {
    const nextErrors = {};

    if (currentStep === 2) {
      if (!String(form.vehicleModel || "").trim()) {
        nextErrors.vehicleModel = "Vehicle name is required.";
      }

      if (!normalizeVehicleNumber(form.vehicleNumber)) {
        nextErrors.vehicleNumber = "Vehicle number (only number) is required.";
      }

      if (!form.vehicleTypeId) {
        nextErrors.vehicleTypeId = "Please select a vehicle type.";
      }

      if (!form.vehicleColorCode || !form.vehicleColorName) {
        nextErrors.vehicleColor = "Please select a vehicle color.";
      }
    }

    if (currentStep === 3) {
      if (!form.serviceId) {
        nextErrors.serviceId = "Please select a service.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const persistPrimaryCustomerCache = (customerName, customerContact) => {
    try {
      localStorage.setItem(
        CUSTOMER_CACHE_KEY,
        JSON.stringify({
          customerName: capitalizeName(customerName),
          customerContact: normalizeContact(customerContact),
        }),
      );
    } catch {
      // Ignore localStorage failures silently.
    }
  };

  const upsertRecentCustomer = (
    customerName,
    customerContact,
    previousCustomerContact = "",
  ) => {
    setRecentCustomers((prev) => {
      const normalizedContact = normalizeContact(customerContact);
      const normalizedPreviousContact = normalizeContact(previousCustomerContact);
      const nextRecentCustomers = [
        {
          customerName: capitalizeName(customerName),
          customerContact: normalizedContact,
        },
        ...prev.filter((entry) => {
          const entryContact = normalizeContact(entry.customerContact);
          return (
            entryContact !== normalizedContact &&
            entryContact !== normalizedPreviousContact
          );
        }),
      ].slice(0, MAX_RECENT_CUSTOMERS);

      try {
        localStorage.setItem(
          CUSTOMER_RECENT_CACHE_KEY,
          JSON.stringify(nextRecentCustomers),
        );
      } catch {
        // Ignore localStorage failures silently.
      }

      return nextRecentCustomers;
    });
  };

  const saveRecentCustomer = (customerName, customerContact) => {
    upsertRecentCustomer(customerName, customerContact);
  };

  const handleContactChange = (value) => {
    setForm((prev) => ({
      ...prev,
      customerContact: normalizeContact(value),
      customerName: "",
      selectedVehicleKey: "",
      vehicleModel: "",
      vehicleNumber: "",
      vehicleColorName: "",
      vehicleColorCode: "",
      vehicleTypeId: "",
      serviceId: "",
    }));

    setErrors((prev) => ({
      ...prev,
      customerContact: "",
      customerName: "",
      matchedCustomer: "",
    }));

    setHasSearchedContact(false);
    setSelectedMatchedCustomerId("");
    setContextContact("");
    setCustomVehicles([]);
    setVehicleOverrides({});
    setCustomerContext({ customer: null, vehicles: [] });
  };

  const handleSelectRecentCustomer = (recentCustomer) => {
    setUseManualCustomerLookup(false);
    setForm((prev) => ({
      ...prev,
      customerContact: normalizeContact(recentCustomer.customerContact),
      customerName: capitalizeName(recentCustomer.customerName),
      selectedVehicleKey: "",
      vehicleModel: "",
      vehicleNumber: "",
      vehicleColorName: "",
      vehicleColorCode: "",
      vehicleTypeId: "",
      serviceId: "",
    }));

    setErrors((prev) => ({
      ...prev,
      customerContact: "",
      customerName: "",
      matchedCustomer: "",
    }));

    setHasSearchedContact(false);
    setSelectedMatchedCustomerId("");
    setContextContact("");
    setCustomVehicles([]);
    setVehicleOverrides({});
    setCustomerContext({ customer: null, vehicles: [] });
  };

  const handleRemoveRecentCustomer = (customerContact) => {
    const normalizedContact = normalizeContact(customerContact);
    const nextRecentCustomers = recentCustomers.filter(
      (entry) => normalizeContact(entry.customerContact) !== normalizedContact,
    );

    setRecentCustomers(nextRecentCustomers);
    try {
      localStorage.setItem(
        CUSTOMER_RECENT_CACHE_KEY,
        JSON.stringify(nextRecentCustomers),
      );
    } catch {
      // Ignore localStorage failures silently.
    }

    const isRemovingSelected =
      normalizeContact(form.customerContact) === normalizedContact;
    if (!isRemovingSelected) return;

    setErrors({});
    setHasSearchedContact(false);
    setSelectedMatchedCustomerId("");
    setContextContact("");
    setCustomVehicles([]);
    setVehicleOverrides({});
    setCustomerContext({ customer: null, vehicles: [] });

    if (nextRecentCustomers.length === 0) {
      setUseManualCustomerLookup(true);
      setForm((prev) => ({
        ...prev,
        customerName: "",
        customerContact: "",
        selectedVehicleKey: "",
        vehicleModel: "",
        vehicleNumber: "",
        vehicleColorName: "",
        vehicleColorCode: "",
        vehicleTypeId: "",
        serviceId: "",
      }));
      return;
    }

    const fallbackCustomer = nextRecentCustomers[0];
    setUseManualCustomerLookup(false);
    setForm((prev) => ({
      ...prev,
      customerName: capitalizeName(fallbackCustomer.customerName),
      customerContact: normalizeContact(fallbackCustomer.customerContact),
      selectedVehicleKey: "",
      vehicleModel: "",
      vehicleNumber: "",
      vehicleColorName: "",
      vehicleColorCode: "",
      vehicleTypeId: "",
      serviceId: "",
    }));
  };

  const handleNewCustomerNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      customerName: value,
    }));
    setErrors((prev) => ({
      ...prev,
      customerName: "",
    }));
  };

  const handleSelectMatchedCustomer = (customerId) => {
    setSelectedMatchedCustomerId(customerId);
    setErrors((prev) => ({
      ...prev,
      matchedCustomer: "",
    }));
  };

  const handleCustomerStepNext = async () => {
    const customerContact = normalizeContact(form.customerContact);
    if (customerContact.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        customerContact: "Contact number must be 10 digits.",
      }));
      return;
    }

    const isSavedCustomerMode =
      !useManualCustomerLookup && recentCustomers.length > 0;

    if (isSavedCustomerMode) {
      const customerName = capitalizeName(form.customerName);
      if (!customerName) {
        setErrors((prev) => ({
          ...prev,
          customerName: "Please select a saved customer.",
        }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        customerName,
      }));
      setErrors({});
      setStep(2);

      if (!hasSearchedContact || customerContact !== contextContact) {
        fetchContextForContact();
      }
      return;
    }

    if (!hasSearchedContact || customerContact !== contextContact) {
      await fetchContextForContact();
      return;
    }

    if (customerContext?.customer) {
      if (selectedMatchedCustomerId !== customerContext.customer._id) {
        setErrors((prev) => ({
          ...prev,
          matchedCustomer: "Select the matched customer to continue.",
        }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        customerName: customerContext.customer.customerName,
      }));
      setErrors({});
      setStep(2);
      return;
    }

    const customerName = capitalizeName(form.customerName);
    if (!customerName) {
      setErrors((prev) => ({
        ...prev,
        customerName: "Customer name is required for a new customer.",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      customerName,
    }));
    setErrors({});
    setStep(2);
  };

  const handleNext = async () => {
    if (step === 1) {
      await handleCustomerStepNext();
      return;
    }

    if (!validateStep(step)) return;

    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    try {
      const selectedVehicleOverride = form.selectedVehicleKey
        ? vehicleOverrides[form.selectedVehicleKey]
        : null;

      const payload = {
        customerName: capitalizeName(form.customerName),
        customerContact: normalizeContact(form.customerContact),
        vehicleNumber: normalizeVehicleNumber(form.vehicleNumber),
        vehicleModel: normalizeVehicleName(form.vehicleModel),
        vehicleTypeId: form.vehicleTypeId,
        serviceId: form.serviceId,
        vehicleColor: {
          colorCode: form.vehicleColorCode,
          colorName: form.vehicleColorName,
        },
      };

      if (selectedVehicleOverride && form.selectedVehicleKey) {
        payload.originalVehicleSignature = form.selectedVehicleKey;
      }

      const response = await createPublicTransaction(payload).unwrap();

      setSubmittedData({
        transaction: response?.data?.transaction,
        checkoutQrValue: response?.data?.checkoutQrValue,
      });

      persistPrimaryCustomerCache(payload.customerName, payload.customerContact);
      saveRecentCustomer(payload.customerName, payload.customerContact);

      toast({
        title: "Entry Submitted",
        description:
          "You are now in queue. Please keep your checkout QR handy.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not submit entry",
        description:
          error?.data?.message || error?.error || "Please try again.",
      });
    }
  };

  const handleStartNewEntry = () => {
    setStep(1);
    setErrors({});
    setHasSearchedContact(false);
    setSelectedMatchedCustomerId("");
    setCustomVehicles([]);
    setVehicleOverrides({});
    setCustomerContext({ customer: null, vehicles: [] });
    setContextContact("");
    setSubmittedData(null);
    if (recentCustomers.length > 0) {
      setUseManualCustomerLookup(false);
      setForm((prev) => ({
        ...prev,
        ...initialFormState,
        customerName: recentCustomers[0].customerName,
        customerContact: recentCustomers[0].customerContact,
      }));
      return;
    }

    setUseManualCustomerLookup(true);
    setForm(initialFormState);
  };

  const handleNotYou = () => {
    setErrors({});
    setUseManualCustomerLookup(true);
    setHasSearchedContact(false);
    setSelectedMatchedCustomerId("");
    setCustomVehicles([]);
    setVehicleOverrides({});
    setCustomerContext({ customer: null, vehicles: [] });
    setContextContact("");
    setForm(initialFormState);
  };

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-[#058299]/20">
      <div className="w-full max-w-4xl px-4 py-4 mx-auto sm:py-10">
        <Card className="relative border-0 mb-20 shadow-xl">
          <CardHeader className="pb-4 space-y-4 ">
            {/* <div className="flex items-center justify-between gap-3"> */}
            <div className="mb-1">
              <CardTitle className="flex items-center justify-between text-2xl">
                <img
                  src={IMAGE_DATA.receipt_logo}
                  height={60}
                  width={120}
                  alt="Receipt Logo"
                />
                <Steps steps={4} current={submittedData ? 4 : step} />
              </CardTitle>
              <CardDescription>Customer Record Entry Portal </CardDescription>
            </div>
            {/* </div> */}
          </CardHeader>
          <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden rounded-t-lg">
            <div
              className="h-full transition-all duration-500 ease-in-out"
              style={{
                width: `${submittedData ? 100 : (step / 4) * 100}%`,
                background: submittedData
                  ? "#058299"
                  : "linear-gradient(to right, #058299, white)",
              }}
            />
          </div>
          <CardContent className="pb-8">
            <AnimatePresence mode="wait" initial={false}>
              {submittedData ? (
                <motion.div
                  key="success-state"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={stepMotionTransition}
                >
                  <SuccessState
                    submittedData={submittedData}
                    onStartNew={handleStartNewEntry}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${step}`}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={stepMotionTransition}
                >
                  {step === 1 && (
                    <StepCustomer
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
                  )}

                  {step === 2 && (
                    <StepVehicle
                      form={form}
                      errors={errors}
                      vehicleTypes={vehicleTypes}
                      vehicles={selectableVehicles}
                      isVehiclesLoading={isContextLoading}
                      onSelectVehicle={applyExistingVehicle}
                      onSaveVehicleDraft={handleSaveVehicleDraft}
                    />
                  )}

                  {step === 3 && (
                    <StepService
                      form={form}
                      setForm={setForm}
                      errors={errors}
                      selectedVehicleType={selectedVehicleType}
                      availableServices={availableServices}
                    />
                  )}

                  {step === 4 && (
                    <StepReview
                      form={form}
                      selectedVehicleType={selectedVehicleType}
                      selectedService={selectedService}
                    />
                  )}

                  <Separator className="my-6" />

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full gap-2 sm:w-auto">
                      {step > 1 ? (
                        <Button
                          variant="outline"
                          className="w-full min-h-12 transition-transform sm:w-auto active:scale-[0.98]"
                          onClick={handleBack}
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full min-h-12 transition-transform sm:w-auto active:scale-[0.98]"
                          disabled={
                            recentCustomers.length === 0 ||
                            useManualCustomerLookup
                          }
                          onClick={handleNotYou}
                        >
                          Not You?
                        </Button>
                      )}

                      {step < 4 ? (
                        <Button
                          className="w-full min-h-12 transition-transform sm:w-auto active:scale-[0.98]"
                          onClick={handleNext}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          className="w-full min-h-12 transition-transform sm:w-auto active:scale-[0.98]"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <ButtonBusyState label="Submitting" />
                          ) : (
                            "Submit To Queue"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PublicEntryLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-[#058299]/20">
      <div className="w-full max-w-4xl px-4 py-4 mx-auto sm:py-10">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-3">
            <div className="w-40 rounded-md h-7 bg-slate-200 animate-pulse" />
            <div className="w-56 h-3 rounded bg-slate-100 animate-pulse [animation-delay:120ms]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-12 rounded-xl bg-slate-100 animate-pulse [animation-delay:140ms]" />
            <div className="h-24 rounded-xl bg-slate-100 animate-pulse [animation-delay:220ms]" />
            <div className="h-24 rounded-xl bg-slate-100 animate-pulse [animation-delay:300ms]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ButtonBusyState({ label }) {
  return (
    <span className="inline-flex items-center">
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      {label}
    </span>
  );
}

function StepCustomer({
  form,
  errors,
  recentCustomers,
  hasSearchedContact,
  selectedMatchedCustomerId,
  useManualCustomerLookup,
  customerContext,
  onContactChange,
  onSelectRecentCustomer,
  onRemoveRecentCustomer,
  onSelectMatchedCustomer,
  onNewCustomerNameChange,
  isContextLoading,
}) {
  const hasMatchedCustomer = Boolean(customerContext?.customer);
  const [pendingDeleteCustomer, setPendingDeleteCustomer] = useState(null);
  const showSavedCustomerCards =
    recentCustomers.length > 0 && !useManualCustomerLookup;
  const isNewCustomer =
    !showSavedCustomerCards && hasSearchedContact && !hasMatchedCustomer;

  return (
    <div className="space-y-5">
      {showSavedCustomerCards && (
        <div className="space-y-2">
          <Label >
            Saved Customer
          </Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {recentCustomers.map((recentCustomer) => (
              <div
                key={recentCustomer.customerContact}
                role="button"
                tabIndex={0}
                className={cn(
                  "relative w-full rounded-xl border p-4 text-left transition-colors transition-shadow duration-200",
                  normalizeContact(form.customerContact) ===
                    normalizeContact(recentCustomer.customerContact)

                        ? "border-[#058299] bg-gradient-to-r from-[#058299]/10 via-[#058299]/5 to-[#fff] shadow-[0_10px_24px_-16px_rgba(5,130,153,0.55)]"
                        : "border-muted hover:border-primary/40 hover:shadow-sm",
                )}
                onClick={() => onSelectRecentCustomer(recentCustomer)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectRecentCustomer(recentCustomer);
                  }
                }}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute w-7 h-7 right-1.5 top-1.5 text-muted-foreground/70 hover:text-destructive"
                  onClick={(event) => {
                    event.stopPropagation();
                    setPendingDeleteCustomer(recentCustomer);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="mb-1 font-semibold text-primary">
                  {recentCustomer.customerName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {recentCustomer.customerContact}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Select a customer to proceed.
          </p>
          <AlertDialog
            open={Boolean(pendingDeleteCustomer)}
            onOpenChange={(open) => {
              if (!open) {
                setPendingDeleteCustomer(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove saved customer?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove{" "}
                  <span className="font-medium text-foreground">
                    {pendingDeleteCustomer?.customerName}
                  </span>{" "}
                  ({pendingDeleteCustomer?.customerContact}) from saved
                  suggestions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!pendingDeleteCustomer) return;
                    onRemoveRecentCustomer(
                      pendingDeleteCustomer.customerContact,
                    );
                    setPendingDeleteCustomer(null);
                  }}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {!showSavedCustomerCards && (
        <div className="space-y-2">
          <div className="grid gap-2">
            <Label >
              {errors.customerContact ? (
                <span className="text-destructive">
                  {errors.customerContact}
                </span>
              ) : (
                "Contact Number"
              )}
            </Label>
            <Input
              value={form.customerContact}
              className="min-h-12"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit number"
              onChange={(event) => onContactChange(event.target.value)}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Enter your contact number and tap <span className="font-medium">Next</span>
          
          </p>
        </div>
      )}

      {isContextLoading && (
        <div className="p-4 space-y-3 border rounded-xl bg-slate-50/80">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-[#058299] animate-ping" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#058299]" />
            </div>
            Checking customer contact...
          </div>
          <div className="space-y-2">
            <div className="w-3/4 h-2 rounded bg-slate-200 animate-pulse" />
            <div className="w-1/2 h-2 rounded bg-slate-200 animate-pulse [animation-delay:160ms]" />
          </div>
        </div>
      )}

      {!showSavedCustomerCards && hasMatchedCustomer && (
        <div className="space-y-2">
          <Label>
            {errors.matchedCustomer ? (
              <span className="text-destructive">{errors.matchedCustomer}</span>
            ) : (
              "Match Found"
            )}
          </Label>
          <button
            type="button"
            className={cn(
              "relative w-full rounded-xl border p-4 text-left transition-all",
              selectedMatchedCustomerId === customerContext.customer._id
                        ? "border-[#058299] bg-gradient-to-r from-[#058299]/10 via-[#058299]/5 to-[#fff] shadow-[0_10px_24px_-16px_rgba(5,130,153,0.55)]"
                        : "border-muted hover:border-primary/40 hover:shadow-sm",
            )}
            onClick={() =>
              onSelectMatchedCustomer(customerContext.customer._id)
            }
          >
            <span className="absolute top-3 right-3">
              {selectedMatchedCustomerId === customerContext.customer._id ? (
                <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#058299]">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-muted" />
              )}
            </span>
            <div className="font-semibold text-primary">
              {customerContext.customer.customerName}
            </div>
            <div className="text-sm text-muted-foreground">
              {customerContext.customer.customerContact}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {customerContext.vehicles.length} saved vehicle
              {customerContext.vehicles.length > 1 ? "s" : ""} found
            </div>
          </button>
        </div>
      )}

      {isNewCustomer && (
        <div className="grid gap-2">
          <Label>
            {errors.customerName ? (
              <span className="text-destructive">{errors.customerName}</span>
            ) : (
              "New Customer Name"
            )}
          </Label>
          <Input
            value={form.customerName}
            className="min-h-12"
            placeholder="Full name"
            autoComplete="name"
            onChange={(event) => onNewCustomerNameChange(event.target.value)}
            onBlur={(event) =>
              onNewCustomerNameChange(capitalizeName(event.target.value))
            }
          />
        </div>
      )}
    </div>
  );
}

function StepVehicle({
  form,
  errors,
  vehicleTypes,
  vehicles,
  isVehiclesLoading,
  onSelectVehicle,
  onSaveVehicleDraft,
}) {
  const colorOptions = useMemo(() => CAR_COLOR_OPTIONS.slice(0, 20), []);
  const [isVehicleDrawerOpen, setIsVehicleDrawerOpen] = useState(false);
  const [editingVehicleKey, setEditingVehicleKey] = useState("");
  const [vehicleDraft, setVehicleDraft] = useState(initialVehicleDraft);
  const [drawerErrors, setDrawerErrors] = useState({});

  const openAddVehicleDrawer = () => {
    setEditingVehicleKey("");
    setVehicleDraft(initialVehicleDraft);
    setDrawerErrors({});
    setIsVehicleDrawerOpen(true);
  };

  const openEditVehicleDrawer = (vehicle) => {
    setEditingVehicleKey(vehicle?.key || "");
    setVehicleDraft({
      vehicleModel: vehicle?.vehicleModel || "",
      vehicleNumber: vehicle?.vehicleNumber || "",
      vehicleColorName: vehicle?.vehicleColor?.colorName || "",
      vehicleColorCode: vehicle?.vehicleColor?.colorCode || "",
      vehicleTypeId: vehicle?.vehicleTypeId || "",
    });
    setDrawerErrors({});
    setIsVehicleDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open) => {
    setIsVehicleDrawerOpen(open);
    if (!open) {
      setEditingVehicleKey("");
      setDrawerErrors({});
    }
  };

  const handleVehicleDraftChange = (field, value) => {
    setVehicleDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
    setDrawerErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleDrawerSave = () => {
    const normalizedModel = normalizeVehicleName(vehicleDraft.vehicleModel || "");
    const normalizedNumber = normalizeVehicleNumber(
      vehicleDraft.vehicleNumber || "",
    );

    const nextErrors = {};
    if (!normalizedModel) {
      nextErrors.vehicleModel = "Vehicle name is required.";
    }
    if (!normalizedNumber) {
      nextErrors.vehicleNumber = "Vehicle number (only number) is required.";
    }
    if (!vehicleDraft.vehicleTypeId) {
      nextErrors.vehicleTypeId = "Please select a vehicle type.";
    }
    if (!vehicleDraft.vehicleColorCode || !vehicleDraft.vehicleColorName) {
      nextErrors.vehicleColor = "Please select a vehicle color.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setDrawerErrors(nextErrors);
      return;
    }

    onSaveVehicleDraft({
      mode: editingVehicleKey ? "edit" : "add",
      vehicleKey: editingVehicleKey,
      vehicleDraft: {
        ...vehicleDraft,
        vehicleModel: normalizedModel,
        vehicleNumber: normalizedNumber,
      },
    });

    setEditingVehicleKey("");
    setDrawerErrors({});
    setVehicleDraft(initialVehicleDraft);
    setIsVehicleDrawerOpen(false);
  };

  const hasVehicleValidationError =
    errors.vehicleModel ||
    errors.vehicleNumber ||
    errors.vehicleTypeId ||
    errors.vehicleColor;


  return (
    <>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>
            {hasVehicleValidationError ? (
              <span className="text-destructive">
                Select or add a valid vehicle to continue.
              </span>
            ) : (
              "Choose Vehicle"
            )}
          </Label>

          {isVehiclesLoading && vehicles.length === 0 ? (
            <div className="flex items-center gap-2 p-4 py-14 text-sm border justify-center rounded-xl bg-muted/40 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading vehicles...
            </div>
          ) : vehicles.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {vehicles.map((vehicle) => {
                const isSelected = form.selectedVehicleKey === vehicle.key;

                return (
                  <div
                    key={vehicle.key}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "relative rounded-xl border p-4 text-left transition-colors transition-shadow duration-200 min-h-24 cursor-pointer",
                      isSelected
                        ? "border-[#058299] bg-gradient-to-r from-[#058299]/10 via-[#058299]/10 via-[#fff] to-[#fff] shadow-[0_10px_24px_-16px_rgba(5,130,153,0.55)]"
                        : "border-muted hover:border-primary/40 hover:shadow-sm",
                    )}
                    onClick={() => onSelectVehicle(vehicle)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectVehicle(vehicle);
                      }
                    }}
                  >
                    <span className="absolute -top-1.5 -right-1.5">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#058299]">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      ) : (
                        null
                      )}
                    </span>

                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-primary">
                            {vehicle.vehicleModel}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.vehicleNumber}
                          </div>
                          {vehicle.lastServiceName && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              Last: {vehicle.lastServiceName}
                            </div>
                          )}
                        </div>
                        {vehicle.vehicleIcon ? (
                          <div className="rounded-md">
                            <img
                              loading="lazy"
                              src={resolveVehicleIcon(vehicle.vehicleIcon)}
                              alt={vehicle.vehicleTypeName || "Vehicle type"}
                              className="object-contain w-12.5 h-10"
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2">

                        <div className="flex items-center ">
                          {
                            vehicle?.vehicleColor?.colorCode ?
                            <span
                          className="w-5 h-5 mr-3 border rounded-full"
                          style={{ backgroundColor: vehicle.vehicleColor.colorCode }}
                          />: <span/>

                          }
                        
                        {vehicle.vehicleTypeName ? (
                          <Badge
                          variant="outline"
                          className="text-[10px] text-center"
                          >
                            {vehicle.vehicleTypeName}
                          </Badge>
                        ) : (
                          <span />
                        )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs transition-transform active:scale-[0.98]"
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditVehicleDrawer(vehicle);
                          }}
                        >
                          <Edit className="w-3 h-3 mr-1.5" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-sm border rounded-xl bg-muted/40 text-muted-foreground">
              No saved vehicles yet. Add your vehicle to continue.
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full min-h-12"
            onClick={openAddVehicleDrawer}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Vehicle
          </Button>
        </div>
      </div>

      <Drawer open={isVehicleDrawerOpen} onOpenChange={handleDrawerOpenChange}>
        <DrawerContent className="h-[88dvh] flex flex-col sm:h-[85dvh] pb-0 overflow-hidden [&>div:first-child]:bg-foreground/25">
          <DrawerHeader>
            <DrawerTitle>
              {editingVehicleKey ? "Edit Vehicle" : "Add New Vehicle"}
            </DrawerTitle>
            <DrawerDescription>
              Fill in vehicle details and select its type.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 px-4 pb-4 space-y-5 overflow-y-auto">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>
                  {drawerErrors.vehicleModel ? (
                    <span className="text-destructive">
                      {drawerErrors.vehicleModel}
                    </span>
                  ) : (
                    "Vehicle Name"
                  )}
                </Label>
                <Input
                  value={vehicleDraft.vehicleModel}
                  className="min-h-12"
                  placeholder="Vehicle name"
                  onChange={(event) =>
                    handleVehicleDraftChange("vehicleModel", event.target.value)
                  }
                  onBlur={() =>
                    handleVehicleDraftChange(
                      "vehicleModel",
                      normalizeVehicleName(vehicleDraft.vehicleModel),
                    )
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>
                  {drawerErrors.vehicleNumber ? (
                    <span className="text-destructive">
                      {drawerErrors.vehicleNumber}
                    </span>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>Vehicle Number</span>{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        Eg: 1234 (only number)
                      </span>
                    </div>
                  )}
                </Label>
                <Input
                  value={vehicleDraft.vehicleNumber}
                  className="min-h-12"
                  placeholder="Plate Number"
                  onChange={(event) =>
                    handleVehicleDraftChange(
                      "vehicleNumber",
                      event.target.value.toUpperCase(),
                    )
                  }
                  onBlur={() =>
                    handleVehicleDraftChange(
                      "vehicleNumber",
                      normalizeVehicleNumber(vehicleDraft.vehicleNumber),
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>
                {drawerErrors.vehicleTypeId ? (
                  <span className="text-destructive">
                    {drawerErrors.vehicleTypeId}
                  </span>
                ) : (
                  "Vehicle Type"
                )}
              </Label>

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {vehicleTypes.map((vehicleType) => {
                  const isSelected =
                    vehicleDraft.vehicleTypeId === vehicleType._id;

                  return (
                    <button
                      key={vehicleType._id}
                      type="button"
                      onClick={() =>
                        handleVehicleDraftChange(
                          "vehicleTypeId",
                          vehicleType._id,
                        )
                      }
                      className={cn(
                        "relative flex flex-col items-center gap-3 px-3 py-2 transition-transform border rounded-lg shadow-sm text-muted-foreground hover:scale-105 hover:text-primary",
                        isSelected
                          ? "border-[#058299] bg-white"
                          : "border-muted hover:border-primary/40",
                      )}
                    >
                      {isSelected && (
                        <Badge className="absolute bg-[#058299] top-0 right-0 p-2 rounded-full shadow-lg translate-x-1/4 -translate-y-1/4">
                          <div className="w-1 h-1 bg-white rounded-full" />
                        </Badge>
                      )}
                      <img
                        loading="lazy"
                        src={resolveVehicleIcon(vehicleType.vehicleIcon)}
                        alt={vehicleType.vehicleTypeName}
                        className="object-contain h-12"
                      />
                      <span className="text-xs font-medium text-center">
                        {vehicleType.vehicleTypeName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>
                {drawerErrors.vehicleColor ? (
                  <span className="text-destructive">
                    {drawerErrors.vehicleColor}
                  </span>
                ) : (
                  "Vehicle Color"
                )}
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {colorOptions.map((color) => {
                  const isSelected =
                    vehicleDraft.vehicleColorCode === color.colorCode;

                  return (
                    <button
                      key={color.colorCode}
                      type="button"
                      onClick={() => {
                        setVehicleDraft((prev) => ({
                          ...prev,
                          vehicleColorCode: color.colorCode,
                          vehicleColorName: color.colorName,
                        }));
                        setDrawerErrors((prev) => ({
                          ...prev,
                          vehicleColor: "",
                        }));
                      }}
                      className={cn(
                        "min-h-12 rounded-lg border px-3 py-2 text-left text-xs sm:text-sm",
                        isSelected
                          ? "border-[#058299] bg-[#058299]/5"
                          : "border-muted hover:border-primary/40",
                      )}
                    >
                      <span className="flex items-center justify-start gap-2">
                        <span
                          className="inline-block w-4 h-4 my-auto border rounded-full"
                          style={{ backgroundColor: color.colorCode }}
                        />
                        {color.colorName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t bg-background">
            <Button
              type="button"
              variant="outline"
              className="min-h-12"
              onClick={() => setIsVehicleDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="min-h-12"
              onClick={handleDrawerSave}
            >
              {editingVehicleKey ? "Save Vehicle" : "Add Vehicle"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function StepService({
  form,
  setForm,
  errors,
  selectedVehicleType,
  availableServices,
}) {
  if (!selectedVehicleType) {
    return (
      <div className="p-6 text-sm border rounded-xl bg-muted/50 text-muted-foreground">
        Select a vehicle type first to see available services.
      </div>
    );
  }

  return (
    <div className="space-y-5">
    
        
        <div className="flex justify-between">

     <Label>
          {errors.serviceId ? (
            <span className="text-destructive">{errors.serviceId}</span>
          ) : (
            "Choose Service"
          )}
        </Label>

<Badge>

        {selectedVehicleType.vehicleTypeName}
        </Badge>
        </div>


      <div className="grid gap-3 sm:grid-cols-2">
        {availableServices.map((service) => {
          const isSelected = form.serviceId === service._id;

          return (
            <button
              key={service._id}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  serviceId: service._id,
                }))
              }
              className={cn(
                "rounded-xl border p-5 text-left transition-colors transition-shadow duration-200 min-h-20",
                isSelected
                        ? "border-[#058299] bg-gradient-to-r from-[#058299]/10 via-[#058299]/5 to-[#fff] shadow-[0_10px_24px_-16px_rgba(5,130,153,0.55)]"
                        : "border-muted hover:border-primary/40 hover:shadow-sm",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-primary">
                    {service.serviceTypeName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {service?.serviceDescription?.join(", ")}
                  </div>
                </div>
                <div className="text-sm font-bold">
                  Rs. {service.serviceRate}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepReview({ form, selectedVehicleType, selectedService }) {
  const hasColor = form.vehicleColorCode && form.vehicleColorName;

  return (
    <div className="space-y-5">
      <div className="p-5 border border-[#058299] rounded-xl bg-gradient-to-r from-[#058299]/5  to-[#fff] ">
        <h3 className="mb-3 text-base font-semibold">Review Entry</h3>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <ReviewItem
            label="Customer"
            value={capitalizeName(form.customerName)}
          />
          <ReviewItem
            label="Contact"
            value={normalizeContact(form.customerContact)}
          />
          <ReviewItem
            label="Vehicle Name"
            value={normalizeVehicleName(form.vehicleModel)}
          />
          <ReviewItem
            label="Vehicle Number"
            value={normalizeVehicleNumber(form.vehicleNumber)}
          />
          <ReviewItem
            label="Color"
            value={hasColor ? form.vehicleColorName : "Not provided"}
          />
          <ReviewItem
            label="Vehicle Type"
            value={selectedVehicleType?.vehicleTypeName || "Not selected"}
          />

          <ReviewItem
            label="Service"
            value={selectedService?.serviceTypeName || "Not selected"}
          />
          {/* <ReviewItem
            label="Rate"
            value={selectedService ? `Rs. ${selectedService.serviceRate}` : "-"}
          /> */}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        On submit, this entry will be queued for wash.
      </p>
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function SuccessState({ submittedData, onStartNew }) {
  const transaction = submittedData?.transaction;

  return (
    <div className="py-4 space-y-6 text-center">
      <div className="space-y-2">
        <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
        <h3 className="text-xl font-semibold">You Are In Queue</h3>
        <p className="text-sm text-muted-foreground">
          Show this QR code during checkout.
        </p>
      </div>

      <div className="inline-flex flex-col items-center gap-4 p-5 border rounded-xl">
        <QRCode value={submittedData?.checkoutQrValue || ""} size={180} />
      </div>

      <div className="grid max-w-xl gap-3 mx-auto text-sm text-left sm:grid-cols-2">
        {/* <ReviewItem label="Bill No" value={transaction?.billNo || "-"} /> */}
        <ReviewItem label="Vehicle" value={transaction?.vehicleModel || "-"} />
        <ReviewItem
          label="Service"
          value={transaction?.service?.id?.serviceTypeName || "-"}
        />
        <ReviewItem
          label="Initiated On"
          value={                          format(transaction.createdAt, "d MMM, yy - h:mm a") || ""}
        />
      </div>

      <Button className="w-full min-h-12" onClick={onStartNew}>
        Create Another Entry
      </Button>
    </div>
  );
}

export default PublicCarwashEntry;
