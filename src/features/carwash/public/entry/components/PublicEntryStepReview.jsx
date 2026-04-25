import { capitalizeName, normalizeContact, normalizeVehicleName, normalizeVehicleNumber } from "../publicEntryUtils";

function PublicEntryStepReview({ form, selectedVehicleType, selectedService }) {
  const hasColor = form.vehicleColorCode && form.vehicleColorName;

  return (
    <div className="space-y-5">
      <div className="p-5 border rounded-lg bg-muted">
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
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
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

export default PublicEntryStepReview;
