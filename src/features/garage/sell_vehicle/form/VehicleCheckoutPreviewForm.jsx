import React, { useEffect } from "react";
import {
  Car,
  User,
  DollarSign,
  ArrowRight,
  Loader,
  Loader2,
} from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";

const InfoRow = ({ label, value, children }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    {value && <span className="font-medium text-gray-800 ">{value}</span>}
    {children}
  </div>
);

const VehicleCheckoutMinimalForm = ({
  selectedBuyer,
  selectedInterest,
  selectedVehicle,
  isSubmitting,
  register,
  errors,
  setValue,
  watch,
}) => {
  const commissionAmount = watch("commissionAmount") || 0;
  const finalSellingPrice = watch("finalSellingPrice");


  useEffect(() => {
    if (selectedVehicle.askingPrice) {
      setValue("finalSellingPrice", selectedVehicle.askingPrice);
    }
  }, [selectedVehicle, setValue]);
  return (
    <div className="mb-8 duration-300 animate-in fade-in-10 slide-in-from-bottom-1">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Car className="w-5 h-5 text-muted-foreground" />
                Vehicle Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <img
                  src={selectedVehicle.photos[0].primaryUrl}
                  alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  className="object-cover h-24 border rounded-md w-36"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {selectedVehicle.year} {selectedVehicle.make}{" "}
                    {selectedVehicle.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedVehicle.variant} • {selectedVehicle.fuelType}
                  </p>
                  <div className="mt-1 font-mono text-sm">
                    {selectedVehicle.numberPlate}
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <InfoRow label="Asking Price" />

                <Badge className="text-sm text-green-600 border-green-100 bg-green-50">
                  {formatCurrency(selectedVehicle.askingPrice)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="selling-price">
                    {errors.finalSellingPrice ? (
                      <span className="text-destructive">
                        {errors.finalSellingPrice.message}
                      </span>
                    ) : (
                      <span>Final Selling Price</span>
                    )}
                  </Label>
                  <Input
                    {...register("finalSellingPrice", {
                      valueAsNumber: true,
                      validate: (value) =>
                        value > 0 || "Price cannot be negative",
                    })}
                    onWheel={(e) => e.target.blur()}
                    autoComplete="off"
                    id="selling-price"
                    type="number"
                    className={
                      errors.name ? "border-destructive font-mono" : "font-mono"
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="commission-amount">
                    {" "}
                    {errors.commissionAmount ? (
                      <span className="text-destructive">
                        {errors.commissionAmount.message}
                      </span>
                    ) : (
                      <span>Commission Amount</span>
                    )}
                  </Label>
                  <Input
                    autoComplete="off"
                    onWheel={(e) => e.target.blur()}
                    {...register("commissionAmount", {
                      valueAsNumber: true,
                      validate: (value) => {
                        if (!value) return true;
                        const sellingPrice = finalSellingPrice;
                        if (value > sellingPrice) {
                          return "Cannot be greater than selling price";
                        }
                        return value > 0 || "Commission cannot be negative";
                      },
                    })}
                    placeholder="0"
                    id="commission-amount"
                    type="number"
                    className={
                      errors.name ? "border-destructive font-mono" : "font-mono"
                    }
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="p-4 space-y-3 border rounded-lg bg-gray-50">
                <InfoRow label="Commission Amount">
                  <span className="font-medium text-amber-700">
                    - {formatCurrency(commissionAmount)}
                  </span>
                </InfoRow>
                <InfoRow label="Net to Seller">
                  <span className="text-lg font-bold text-green-700">
                    {formatCurrency(finalSellingPrice - commissionAmount)}
                  </span>
                </InfoRow>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <User className="w-5 h-5 text-muted-foreground" />
                Parties Involved
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Seller</p>
                <InfoRow label="Name" value={selectedVehicle.seller.name} />
                <InfoRow
                  label="Contact"
                  value={selectedVehicle.seller.contactNumber}
                />
              </div>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Buyer</p>
                <InfoRow label="Name" value={selectedBuyer.name} />
                <InfoRow label="Contact" value={selectedBuyer.contactNumber} />
              </div>
              {selectedInterest && (
                <>
                  <Separator />
                  <InfoRow label="Fulfills buyers interest">
                    <Badge
                      variant="outline"
                      className="text-green-700 border-green-200 bg-green-50"
                    >
                      True
                    </Badge>
                  </InfoRow>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Final Confirmation</CardTitle>
              <CardDescription>
                Clicking below will finalize the sale. This action cannot be
                undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full font-semibold"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                form="vehicle-checkout-form"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    Complete Sale <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VehicleCheckoutMinimalForm;
