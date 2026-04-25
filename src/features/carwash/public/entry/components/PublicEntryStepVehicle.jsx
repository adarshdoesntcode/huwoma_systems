import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CAR_COLOR_OPTIONS } from "@/lib/config";
import { haptic } from "@/lib/haptic/haptic";
import { cn } from "@/lib/utils";
import { resolveVehicleIcon } from "@/lib/vehicleIcon";
import { Edit, Loader2, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HAPTIC_PATTERNS,
  initialVehicleDraft,
  STEP_TRANSITION_EASE,
  TOUCH_CLEAN_INTERACTION_CLASS,
} from "../publicEntryShared";
import { normalizeVehicleName, normalizeVehicleNumber } from "../publicEntryUtils";

function PublicEntryStepVehicle({
  form,
  errors,
  vehicleTypes,
  vehicles,
  shouldReduceMotion,
  isVehiclesLoading,
  onSelectVehicle,
  onSaveVehicleDraft,
}) {
  const colorOptions = useMemo(() => CAR_COLOR_OPTIONS.slice(0, 20), []);
  const [isVehicleDrawerOpen, setIsVehicleDrawerOpen] = useState(false);
  const [editingVehicleKey, setEditingVehicleKey] = useState("");
  const [vehicleDraft, setVehicleDraft] = useState(initialVehicleDraft);
  const [drawerErrors, setDrawerErrors] = useState({});
  const vehicleNameInputRef = useRef(null);

  useEffect(() => {
    if (!isVehicleDrawerOpen) return;

    const focusTimer = window.setTimeout(() => {
      vehicleNameInputRef.current?.focus({ preventScroll: true });
    }, 120);

    return () => window.clearTimeout(focusTimer);
  }, [isVehicleDrawerOpen, editingVehicleKey]);

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

  const closeVehicleEditor = () => {
    setIsVehicleDrawerOpen(false);
    setEditingVehicleKey("");
    setDrawerErrors({});
  };

  useEffect(() => {
    if (!isVehicleDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVehicleDrawerOpen]);

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
    const normalizedModel = normalizeVehicleName(
      vehicleDraft.vehicleModel || "",
    );
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
      haptic(HAPTIC_PATTERNS.error);
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
    closeVehicleEditor();
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
            <div className="flex items-center justify-center gap-2 p-4 text-sm border py-14 rounded-xl bg-muted/40 text-muted-foreground">
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
                      TOUCH_CLEAN_INTERACTION_CLASS,
                      isSelected
                        ? "border-[#058299] bg-gradient-to-r from-[#058299]/10 via-[#058299]/10 via-[#fff] to-[#fff] shadow-[0_10px_24px_-16px_rgba(5,130,153,0.55)]"
                        : "",
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
                      ) : null}
                    </span>

                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-primary text-wrap">
                            {vehicle.vehicleModel}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Plate: {vehicle.vehicleNumber}
                          </div>
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

                      <div className="flex items-end justify-between gap-2 mt-2">
                        <div className="flex items-end">
                          {vehicle?.vehicleColor?.colorCode ? (
                            <span
                              className="w-5 h-5 mr-3 border rounded-full"
                              style={{
                                backgroundColor: vehicle.vehicleColor.colorCode,
                              }}
                            />
                          ) : (
                            <span />
                          )}

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
                        <div
                          className={cn(
                            "text-muted-foreground/60 text-xs p-1 transition-transform",
                            TOUCH_CLEAN_INTERACTION_CLASS,
                          )}
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditVehicleDrawer(vehicle);
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </div>
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
            className={cn("w-full min-h-12", TOUCH_CLEAN_INTERACTION_CLASS)}
            onClick={openAddVehicleDrawer}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Vehicle
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isVehicleDrawerOpen ? (
          <motion.div
            key="vehicle-editor-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/45"
            onClick={closeVehicleEditor}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={
                editingVehicleKey ? "Edit Vehicle" : "Add New Vehicle"
              }
              initial={shouldReduceMotion ? false : { y: 36, opacity: 0.96 }}
              animate={{ y: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { y: 24, opacity: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.12 }
                  : { duration: 0.24, ease: STEP_TRANSITION_EASE }
              }
              className="absolute inset-x-0 bottom-0 flex flex-col h-[100dvh] overflow-hidden border-t shadow-2xl bg-background sm:inset-x-4 sm:bottom-4 sm:h-[min(900px,95dvh)] sm:rounded-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b">
                <div>
                  <h3 className="text-lg font-semibold leading-tight">
                    {editingVehicleKey ? "Edit Vehicle" : "Add New Vehicle"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fill in vehicle details and select its type.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("w-9 h-9 -mt-1", TOUCH_CLEAN_INTERACTION_CLASS)}
                  onClick={closeVehicleEditor}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 min-h-0 px-4 py-4 space-y-5 overflow-y-auto">
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
                      ref={vehicleNameInputRef}
                      value={vehicleDraft.vehicleModel}
                      className="min-h-12"
                      placeholder="Vehicle name"
                      onChange={(event) =>
                        handleVehicleDraftChange(
                          "vehicleModel",
                          event.target.value,
                        )
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
                            TOUCH_CLEAN_INTERACTION_CLASS,
                            isSelected ? "border-[#058299] bg-white" : "",
                          )}
                        >
                          {isSelected ? (
                            <Badge className="absolute bg-[#058299] top-0 right-0 p-2 rounded-full shadow-lg translate-x-1/4 -translate-y-1/4">
                              <div className="w-1 h-1 bg-white rounded-full" />
                            </Badge>
                          ) : null}
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
                            TOUCH_CLEAN_INTERACTION_CLASS,
                            isSelected ? "border-[#058299] bg-[#058299]/5" : "",
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

              <div className="flex-shrink-0 px-4 py-3 border-t bg-background/95 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("flex-1 h-10", TOUCH_CLEAN_INTERACTION_CLASS)}
                    onClick={closeVehicleEditor}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className={cn("flex-1 h-10", TOUCH_CLEAN_INTERACTION_CLASS)}
                    onClick={handleDrawerSave}
                  >
                    {editingVehicleKey ? "Save Vehicle" : "Add Vehicle"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default PublicEntryStepVehicle;
