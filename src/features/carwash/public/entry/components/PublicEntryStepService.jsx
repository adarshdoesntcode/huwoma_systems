import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TOUCH_CLEAN_INTERACTION_CLASS } from "../publicEntryShared";

function PublicEntryStepService({
  form,
  onSelectService,
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
      <div className="flex items-center justify-between">
        <Label>
          {errors.serviceId ? (
            <span className="text-destructive">{errors.serviceId}</span>
          ) : (
            "Choose Service"
          )}
        </Label>

        <Badge>{selectedVehicleType.vehicleTypeName}</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {availableServices.map((service) => {
          const isSelected = form.serviceId === service._id;

          return (
            <button
              key={service._id}
              type="button"
              onClick={() => onSelectService(service._id)}
              className={cn(
                "rounded-xl border p-5 w-full text-left transition-colors duration-200 min-h-20",
                TOUCH_CLEAN_INTERACTION_CLASS,
                isSelected
                  ? "border-[#058299] bg-gradient-to-r from-[#058299]/10 via-[#058299]/5 to-[#fff] shadow-[0_10px_24px_-16px_rgba(5,130,153,0.55)]"
                  : "",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-primary text-wrap">
                    {service.serviceTypeName}
                  </div>
                  <div className="text-xs text-muted-foreground text-wrap">
                    {service?.serviceDescription?.join(", ")}
                  </div>
                </div>
                <div className="text-sm font-bold text-nowrap">
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

export default PublicEntryStepService;
