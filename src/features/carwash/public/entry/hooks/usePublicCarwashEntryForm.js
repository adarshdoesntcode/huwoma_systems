import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { haptic } from "@/lib/haptic/haptic";
import {
  useCreatePublicCarwashTransactionMutation,
  useGetPublicCarwashConfigQuery,
  useGetPublicCarwashCustomerContextMutation,
} from "../../../carwashApiSlice";
import {
  CUSTOMER_CACHE_KEY,
  CUSTOMER_RECENT_CACHE_KEY,
  HAPTIC_PATTERNS,
  initialFormState,
  MAX_RECENT_CUSTOMERS,
  STEP_TRANSITION_EASE,
} from "../publicEntryShared";
import {
  capitalizeName,
  createLocalVehicleKey,
  normalizeContact,
  normalizeVehicleName,
  normalizeVehicleNumber,
} from "../publicEntryUtils";

function usePublicCarwashEntryForm() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

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

  const stepMotionTransition = useMemo(
    () =>
      shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.2, ease: STEP_TRANSITION_EASE },
    [shouldReduceMotion],
  );

  const triggerHaptic = (type = "selection") => {
    haptic(HAPTIC_PATTERNS[type] || HAPTIC_PATTERNS.selection);
  };

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
    const normalizedModel = normalizeVehicleName(
      vehicleDraft?.vehicleModel || "",
    );
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
    triggerHaptic("selection");
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
      const normalizedPreviousContact = normalizeContact(
        previousCustomerContact,
      );
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

  const fetchContextForContact = async () => {
    const contact = normalizeContact(form.customerContact);

    if (contact.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        customerContact: "Contact number must be 10 digits.",
      }));
      triggerHaptic("error");
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
        nextErrors.vehicleNumber = "Vehicle number is required.";
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
    if (Object.keys(nextErrors).length > 0) {
      triggerHaptic("error");
    }
    return Object.keys(nextErrors).length === 0;
  };

  const resetCustomerAndVehicleSelection = () => {
    setHasSearchedContact(false);
    setSelectedMatchedCustomerId("");
    setContextContact("");
    setCustomVehicles([]);
    setVehicleOverrides({});
    setCustomerContext({ customer: null, vehicles: [] });
  };

  const resetVehicleFormFields = () => ({
    selectedVehicleKey: "",
    vehicleModel: "",
    vehicleNumber: "",
    vehicleColorName: "",
    vehicleColorCode: "",
    vehicleTypeId: "",
    serviceId: "",
  });

  const handleContactChange = (value) => {
    setForm((prev) => ({
      ...prev,
      customerContact: normalizeContact(value),
      customerName: "",
      ...resetVehicleFormFields(),
    }));

    setErrors((prev) => ({
      ...prev,
      customerContact: "",
      customerName: "",
      matchedCustomer: "",
    }));

    resetCustomerAndVehicleSelection();
  };

  const handleSelectRecentCustomer = (recentCustomer) => {
    const isDifferentCustomer =
      normalizeContact(form.customerContact) !==
      normalizeContact(recentCustomer.customerContact);
    if (isDifferentCustomer) {
      triggerHaptic("selection");
    }

    setUseManualCustomerLookup(false);
    setForm((prev) => ({
      ...prev,
      customerContact: normalizeContact(recentCustomer.customerContact),
      customerName: capitalizeName(recentCustomer.customerName),
      ...resetVehicleFormFields(),
    }));

    setErrors((prev) => ({
      ...prev,
      customerContact: "",
      customerName: "",
      matchedCustomer: "",
    }));

    resetCustomerAndVehicleSelection();
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
    resetCustomerAndVehicleSelection();

    if (nextRecentCustomers.length === 0) {
      setUseManualCustomerLookup(true);
      setForm((prev) => ({
        ...prev,
        customerName: "",
        customerContact: "",
        ...resetVehicleFormFields(),
      }));
      return;
    }

    const fallbackCustomer = nextRecentCustomers[0];
    setUseManualCustomerLookup(false);
    setForm((prev) => ({
      ...prev,
      customerName: capitalizeName(fallbackCustomer.customerName),
      customerContact: normalizeContact(fallbackCustomer.customerContact),
      ...resetVehicleFormFields(),
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
    if (selectedMatchedCustomerId !== customerId) {
      triggerHaptic("selection");
    }

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
      triggerHaptic("error");
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
        triggerHaptic("error");
        return;
      }

      setForm((prev) => ({
        ...prev,
        customerName,
      }));
      setErrors({});
      triggerHaptic("step");
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
          matchedCustomer: "Select the customer to continue.",
        }));
        triggerHaptic("error");
        return;
      }

      setForm((prev) => ({
        ...prev,
        customerName: customerContext.customer.customerName,
      }));
      setErrors({});
      triggerHaptic("step");
      setStep(2);
      return;
    }

    const customerName = capitalizeName(form.customerName);
    if (!customerName) {
      setErrors((prev) => ({
        ...prev,
        customerName: "Customer name is required.",
      }));
      triggerHaptic("error");
      return;
    }

    setForm((prev) => ({
      ...prev,
      customerName,
    }));
    setErrors({});
    triggerHaptic("step");
    setStep(2);
  };

  const handleNext = async () => {
    if (step === 1) {
      await handleCustomerStepNext();
      return;
    }

    if (!validateStep(step)) return;

    triggerHaptic("step");
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrors({});
    triggerHaptic("step");
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
      const createdTransactionId = response?.data?.transaction?._id;

      persistPrimaryCustomerCache(
        payload.customerName,
        payload.customerContact,
      );
      saveRecentCustomer(payload.customerName, payload.customerContact);

      toast({
        title: "Entry Submitted",
        description: "You are now in queue.",
      });

      triggerHaptic("success");

      if (createdTransactionId) {
        navigate(`/parknwashbyhuwoma/status/${createdTransactionId}`, {
          replace: true,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not submit entry",
        description:
          error?.data?.message || error?.error || "Please try again.",
      });
    }
  };

  const handleNotYou = () => {
    setErrors({});
    triggerHaptic("selection");
    setUseManualCustomerLookup(true);
    resetCustomerAndVehicleSelection();
    setForm(initialFormState);
  };

  const handleSelectVehicle = (vehicle) => {
    if (form.selectedVehicleKey !== vehicle?.key) {
      triggerHaptic("selection");
    }
    applyExistingVehicle(vehicle);
  };

  const handleSelectService = (serviceId) => {
    if (form.serviceId !== serviceId) {
      triggerHaptic("selection");
    }
    setForm((prev) => ({
      ...prev,
      serviceId,
    }));
    setErrors((prev) => ({
      ...prev,
      serviceId: "",
    }));
  };

  return {
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
  };
}

export default usePublicCarwashEntryForm;
