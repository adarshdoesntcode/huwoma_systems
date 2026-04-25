export const CUSTOMER_CACHE_KEY = "huwoma_carwash_public_customer_v1";
export const CUSTOMER_RECENT_CACHE_KEY = "huwoma_carwash_public_recent_customers_v1";
export const MAX_RECENT_CUSTOMERS = 6;

export const initialFormState = {
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

export const initialVehicleDraft = {
  vehicleModel: "",
  vehicleNumber: "",
  vehicleColorName: "",
  vehicleColorCode: "",
  vehicleTypeId: "",
};

export const STEP_TRANSITION_EASE = [0.22, 1, 0.36, 1];

export const TOUCH_CLEAN_INTERACTION_CLASS =
  "focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [-webkit-tap-highlight-color:transparent]";

export const HAPTIC_PATTERNS = {
  selection: 14,
  step: 18,
  error: [24, 40, 24],
  success: [18, 48, 30],
};
