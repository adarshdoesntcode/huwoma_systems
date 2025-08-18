import PhotoGallery from "@/components/PhotoGallery";
import SmartImage from "@/components/PhotoGallery";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCheck, ChevronLeft, Loader2 } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

function PreviewVehicleListingForm({
  setFormStep,
  getValues,
  selectedSeller,
  selectedMake,
  selectedCategory,
  selectedTransmission,
  selectedDriveType,
  selectedFuelType,
  selectedInterestMakes,
  selectedInterestCategories,
  selectedInterestTransmissions,
  selectedInterestDriveTypes,
  selectedInterestFuelTypes,
  selectedInterestModels,
  finalImageUrls,
  hasBuyerInterest,
  isSubmitting,
}) {
  const formData = getValues();

  return (
    <div className="duration-500 slide-in-from-right-5 animate-in">
      <div className="grid gap-2 p-4 border shadow-sm rounded-xl sm:p-6 bg-background ">
        <div>
          <h3 className="text-lg font-semibold ">Form Review</h3>
          <p className="text-sm text-muted-foreground">
            Double check everything looks right before listing your vehicle
          </p>
        </div>
        <h3 className="pb-2 font-semibold border-b ">Seller</h3>
        <div className="duration-300 fade-in animate-in">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <Label>Information</Label>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">
                  Full Name
                </div>
                <div className="text-xs font-medium">
                  {selectedSeller?.name || "-"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">
                  Contact Number
                </div>
                <div className="text-xs font-medium">
                  {selectedSeller?.contactNumber || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <h3 className="pb-2 font-semibold border-b ">Vehicle</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <Label>Information</Label>
            <Separator className="my-2" />
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Manufacturer
              </div>
              <div className="text-xs font-medium">{selectedMake || "-"}</div>
            </div>
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Model
              </div>
              <div className="text-xs font-medium">{formData.model || "-"}</div>
            </div>

            {formData.variant && (
              <div className="flex items-center justify-between ">
                <div className="text-xs font-medium text-muted-foreground">
                  Variant
                </div>
                <div className="text-xs font-medium">
                  {formData.variant || "-"}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Manufactured Year
              </div>
              <div className="text-xs font-medium">{formData.year || "-"}</div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Label>Registration & Specification</Label>
            <Separator className="my-2" />

            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Number Plate
              </div>
              <div className="text-xs font-medium">
                {formData.numberPlate || "-"}
              </div>
            </div>
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Kilometers Driven
              </div>
              <div className="text-xs font-medium">
                {formData.mileage
                  ? `${Number(formData.mileage)?.toLocaleString("en-IN")} kms`
                  : "-"}
              </div>
            </div>
            {formData.engineCC && (
              <div className="flex items-center justify-between ">
                <div className="text-xs font-medium text-muted-foreground">
                  Engine CC
                </div>
                <div className="text-xs font-medium">
                  {formData.engineCC ? `${formData.engineCC} cc` : "-"}
                </div>
              </div>
            )}

            {formData.colour && (
              <div className="flex items-center justify-between ">
                <div className="text-xs font-medium text-muted-foreground">
                  Colour Name
                </div>
                <div className="text-xs font-medium">{formData.colour}</div>
              </div>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Label>Classsification</Label>
            <Separator className="my-2" />
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Category
              </div>
              <div className="text-xs font-medium">
                {selectedCategory || "-"}
              </div>
            </div>
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Transmission
              </div>
              <div className="text-xs font-medium">
                {selectedTransmission || "-"}
              </div>
            </div>
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Drive Type
              </div>
              <div className="text-xs font-medium">
                {selectedDriveType || "-"}
              </div>
            </div>
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium text-muted-foreground">
                Fuel Type
              </div>
              <div className="text-xs font-medium">
                {selectedFuelType || "-"}
              </div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            {formData.description && (
              <>
                <Label>Description</Label>
                <Separator className="my-2" />
                <div className="text-xs">
                  <div className="flex flex-col items-start justify-between ">
                    {formData.description}
                  </div>
                </div>
              </>
            )}

            <Separator className="mt-6 mb-2" />
            <div className="flex items-center justify-between ">
              <div className="text-xs font-medium ">
                <Label>Expected Price</Label>
              </div>
              <div className="text-sm font-semibold">
                {formData.askingPrice
                  ? `Rs. ${Number(formData?.askingPrice)?.toLocaleString(
                      "en-IN"
                    )}`
                  : "-"}
              </div>
            </div>
          </div>
        </div>
        <Label className="mt-4">Images</Label>
        <Separator className="my-2" />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          <PhotoGallery photos={finalImageUrls} />
        </div>
        {hasBuyerInterest && (
          <>
            <h3 className="pb-2 mt-4 font-semibold border-b ">
              Exhange Interest
            </h3>
            <div className="duration-300 fade-in animate-in">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between ">
                    <div className="text-xs font-medium text-muted-foreground">
                      Budget
                    </div>
                    <div className="text-xs font-medium">
                      {formData.min && formData.max
                        ? `Rs ${Number(formData.min).toLocaleString(
                            "en-IN"
                          )} - Rs ${Number(formData.max).toLocaleString(
                            "en-IN"
                          )}`
                        : formData.min
                        ? `From Rs ${Number(formData.min).toLocaleString(
                            "en-IN"
                          )}`
                        : formData.max
                        ? `Up to Rs ${Number(formData.max).toLocaleString(
                            "en-IN"
                          )}`
                        : "-"}
                    </div>
                  </div>
                  {selectedInterestCategories.length > 0 && (
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xs font-medium text-muted-foreground">
                        Categories
                      </div>
                      <div className="text-xs font-medium text-end">
                        {selectedInterestCategories.join(", ")}
                      </div>
                    </div>
                  )}

                  {selectedInterestMakes.length > 0 && (
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xs font-medium text-muted-foreground">
                        Manufacturers
                      </div>
                      <div className="text-xs font-medium">
                        {selectedInterestMakes.join(", ")}
                      </div>
                    </div>
                  )}

                  {selectedInterestModels.length > 0 && (
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xs font-medium text-muted-foreground">
                        Models
                      </div>
                      <div className="text-xs font-medium">
                        {selectedInterestModels.join(", ")}
                      </div>
                    </div>
                  )}

                  {(formData.from || formData.to) && (
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xs font-medium text-muted-foreground">
                        Year
                      </div>
                      <div className="text-xs font-medium">
                        {formData.from && formData.to
                          ? `${formData.from} - ${formData.to}`
                          : formData.from
                          ? `${formData.from} - Present`
                          : formData.to
                          ? `Untill ${formData.to}`
                          : "-"}
                      </div>
                    </div>
                  )}

                  {formData.mileageMax && (
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xs font-medium text-muted-foreground">
                        Max Driven
                      </div>
                      <div className="text-xs font-medium">
                        {formData.mileageMax
                          ? `${Number(formData.mileageMax).toLocaleString(
                              "en-IN"
                            )} kms`
                          : "-"}
                      </div>
                    </div>
                  )}

                  {selectedInterestTransmissions.length > 0 && (
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xs font-medium text-muted-foreground">
                        Transmissions
                      </div>
                      <div className="text-xs font-medium">
                        {selectedInterestTransmissions.join(", ")}
                      </div>
                    </div>
                  )}

                  {selectedInterestFuelTypes.length > 0 && (
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xs font-medium text-muted-foreground">
                        Fuel Types
                      </div>
                      <div className="text-xs font-medium">
                        {selectedInterestFuelTypes.join(", ")}
                      </div>
                    </div>
                  )}

                  {selectedInterestDriveTypes.length > 0 && (
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xs font-medium text-muted-foreground">
                        Drive Types
                      </div>
                      <div className="text-xs font-medium">
                        {selectedInterestDriveTypes.join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-2 mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setFormStep(3);
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
          {isSubmitting ? (
            <Button disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Submitting...</span>
            </Button>
          ) : (
            <Button form="new-garage-vehicle-form" type="submit">
              Submit <CheckCheck className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewVehicleListingForm;
