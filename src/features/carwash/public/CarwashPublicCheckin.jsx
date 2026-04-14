import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { cn } from "@/lib/utils";
import { CAR_COLOR_OPTIONS, IMAGE_DATA } from "@/lib/config";
import {
  useCreatePublicCarwashCheckinMutation,
  useGetPublicCarwashConfigQuery,
  useGetPublicCustomerContextMutation,
} from "../carwashApiSlice";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Clock3,
  Search,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const PROFILE_KEY = "huwoma:carwash:public-profile:v1";

const getSavedProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") return null;

    return parsed;
  } catch (error) {
    return null;
  }
};

const saveProfile = (profile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

const clearProfile = () => {
  localStorage.removeItem(PROFILE_KEY);
};

const normalizeContact = (value) => String(value || "").replace(/\D/g, "");

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function CarwashPublicCheckin() {
  const [contact, setContact] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [contextLoaded, setContextLoaded] = useState(false);
  const [contextData, setContextData] = useState(null);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [successTransaction, setSuccessTransaction] = useState(null);

  const [savedProfile, setSavedProfile] = useState(getSavedProfile());

  const {
    data: configData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetPublicCarwashConfigQuery();

  const [getContext, { isLoading: isContextLoading }] =
    useGetPublicCustomerContextMutation();

  const [createCheckin, { isLoading: isSubmitting }] =
    useCreatePublicCarwashCheckinMutation();

  const vehicleTypes = useMemo(
    () => configData?.data?.vehicleTypes || [],
    [configData?.data?.vehicleTypes],
  );

  const selectedVehicleType = useMemo(
    () => vehicleTypes.find((vehicleType) => vehicleType._id === selectedVehicleTypeId),
    [vehicleTypes, selectedVehicleTypeId],
  );

  const availableServices = selectedVehicleType?.services || [];

  useEffect(() => {
    if (!contextData?.suggestedService || selectedServiceId) return;

    const matchedVehicleType = vehicleTypes.find((vehicleType) =>
      vehicleType.services.some(
        (service) => service._id === contextData.suggestedService._id,
      ),
    );

    if (!matchedVehicleType) return;

    setSelectedVehicleTypeId(matchedVehicleType._id);
    setSelectedServiceId(contextData.suggestedService._id);
  }, [contextData, selectedServiceId, vehicleTypes]);

  const applySavedProfile = async (profile) => {
    if (!profile) return;

    setContact(profile.customerContact || "");
    setCustomerName(profile.customerName || "");
    setVehicleModel(profile.vehicleModel || "");
    setVehicleNumber(profile.vehicleNumber || "");
    setSelectedColor(profile.vehicleColor || "");
    setSelectedVehicleTypeId(profile.vehicleTypeId || "");
    setSelectedServiceId(profile.serviceId || "");

    if (profile.customerContact) {
      await handleContinue(profile.customerContact);
    }
  };

  const resetForNewCheckin = () => {
    setSuccessTransaction(null);
    setDuplicateInfo(null);
    setContextLoaded(false);
    setContextData(null);
  };

  const handleClearSavedProfile = () => {
    clearProfile();
    setSavedProfile(null);
    setContact("");
    setCustomerName("");
    setVehicleModel("");
    setVehicleNumber("");
    setSelectedColor("");
    setSelectedVehicleTypeId("");
    setSelectedServiceId("");
    resetForNewCheckin();
  };

  const handleContinue = async (overrideContact) => {
    const candidateContact = normalizeContact(overrideContact || contact);

    if (candidateContact.length !== 10) {
      toast({
        variant: "destructive",
        title: "Invalid contact",
        description: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    setDuplicateInfo(null);

    try {
      const response = await getContext({ customerContact: candidateContact }).unwrap();
      const payload = response.data;

      setContextData(payload);
      setContextLoaded(true);
      setContact(candidateContact);

      if (payload.customer?.customerName) {
        setCustomerName(payload.customer.customerName);
      }

      if (payload.activeDuplicateTransaction) {
        setDuplicateInfo(payload.activeDuplicateTransaction);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Unable to load details",
        description: err?.data?.message || "Please try again.",
      });
    }
  };

  const handleUseKnownVehicle = (vehicle) => {
    setVehicleModel(vehicle.vehicleModel || "");
    setVehicleNumber(vehicle.vehicleNumber || "");
    setSelectedColor(vehicle.vehicleColor || "");
  };

  const handleSubmit = async () => {
    if (!contextLoaded) {
      toast({
        variant: "destructive",
        title: "Continue first",
        description: "Please verify your contact before submitting.",
      });
      return;
    }

    const normalizedContact = normalizeContact(contact);

    if (normalizedContact.length !== 10) {
      toast({
        variant: "destructive",
        title: "Invalid contact",
        description: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    if (!contextData?.customer && !customerName.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your name.",
      });
      return;
    }

    if (!selectedVehicleTypeId || !selectedServiceId) {
      toast({
        variant: "destructive",
        title: "Service required",
        description: "Please select a vehicle type and wash service.",
      });
      return;
    }

    if (!vehicleModel.trim() || !vehicleNumber.trim() || !selectedColor) {
      toast({
        variant: "destructive",
        title: "Vehicle details required",
        description: "Please complete vehicle model, number and color.",
      });
      return;
    }

    setDuplicateInfo(null);

    try {
      const response = await createCheckin({
        customerContact: normalizedContact,
        customerName: contextData?.customer ? undefined : customerName.trim(),
        serviceId: selectedServiceId,
        vehicleModel: vehicleModel.trim(),
        vehicleNumber: vehicleNumber.trim(),
        vehicleColor: selectedColor,
        website: "",
      }).unwrap();

      const createdTransaction = response.data;

      const profileToSave = {
        customerContact: normalizedContact,
        customerName:
          createdTransaction?.customer?.customerName || customerName.trim(),
        vehicleModel: createdTransaction?.vehicleModel || vehicleModel.trim(),
        vehicleNumber:
          createdTransaction?.vehicleNumber || vehicleNumber.trim(),
        vehicleColor: createdTransaction?.vehicleColor || selectedColor,
        vehicleTypeId: selectedVehicleTypeId,
        serviceId: selectedServiceId,
      };

      saveProfile(profileToSave);
      setSavedProfile(profileToSave);
      setSuccessTransaction(createdTransaction);

      toast({
        title: "Request added to queue",
        description: `Token: ${createdTransaction.billNo}`,
      });
    } catch (err) {
      const existingTransaction =
        err?.data?.error?.details?.existingTransaction || null;

      if (err?.status === 409 && existingTransaction) {
        setDuplicateInfo(existingTransaction);

        toast({
          variant: "warning",
          title: "Active request already exists",
          description: `Token: ${existingTransaction.billNo}`,
        });

        return;
      }

      toast({
        variant: "destructive",
        title: "Check-in failed",
        description: err?.data?.message || "Please try again.",
      });
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <ApiError error={error} refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-sm">
        <div className="max-w-3xl px-4 py-4 mx-auto">
          <div className="flex items-center justify-between gap-4">
            <img
              loading="lazy"
              src={IMAGE_DATA.huwoma_logo}
              className="h-6"
              alt="Huwoma"
            />
            <Badge variant="outline" className="font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Branch: HQ (Fixed)
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-3xl px-4 py-6 mx-auto space-y-4">
        <Card className="border-0 shadow-sm bg-white/80">
          <CardHeader>
            <CardTitle className="text-xl">Carwash Self Check-In</CardTitle>
            <CardDescription>
              Scan, enter your details, and your wash request goes directly to the queue.
            </CardDescription>
          </CardHeader>
        </Card>

        {savedProfile && !contextLoaded && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Use Last Details
              </CardTitle>
              <CardDescription>
                {savedProfile.customerName || "Returning Customer"} • {savedProfile.customerContact}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => applySavedProfile(savedProfile)}
              >
                Use Last Details
              </Button>
              <Button variant="ghost" onClick={handleClearSavedProfile}>
                Not you?
              </Button>
            </CardContent>
          </Card>
        )}

        {!successTransaction && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1. Contact Verification</CardTitle>
              <CardDescription>
                Enter your mobile number to load your previous details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="public-contact">Mobile Number</Label>
                <Input
                  id="public-contact"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={contact}
                  placeholder="98XXXXXXXX"
                  onChange={(event) => setContact(normalizeContact(event.target.value))}
                />
              </div>

              <Button
                className="w-full"
                onClick={() => handleContinue()}
                disabled={isContextLoading}
              >
                {isContextLoading ? (
                  <>Loading...</>
                ) : (
                  <>
                    Continue <Search className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {contextLoaded && !successTransaction && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">2. Wash Details</CardTitle>
              <CardDescription>
                Confirm vehicle and select your wash service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {contextData?.customer ? (
                <div className="px-3 py-2 text-sm border rounded-md bg-muted/40">
                  <div className="font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {contextData.customer.customerName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {contextData.customer.customerContact}
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="public-name">Your Name</Label>
                  <Input
                    id="public-name"
                    value={customerName}
                    placeholder="Full name"
                    onChange={(event) => setCustomerName(event.target.value)}
                  />
                </div>
              )}

              {contextData?.knownVehicles?.length > 0 && (
                <div className="space-y-2">
                  <Label>Known Vehicles</Label>
                  <div className="flex flex-wrap gap-2">
                    {contextData.knownVehicles.map((vehicle, index) => (
                      <Button
                        key={`${vehicle.vehicleNumber}-${index}`}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleUseKnownVehicle(vehicle)}
                      >
                        {vehicle.vehicleModel} · {vehicle.vehicleNumber}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Vehicle Type</Label>
                  <Select
                    value={selectedVehicleTypeId}
                    onValueChange={(value) => {
                      setSelectedVehicleTypeId(value);
                      setSelectedServiceId("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((vehicleType) => (
                        <SelectItem key={vehicleType._id} value={vehicleType._id}>
                          {vehicleType.vehicleTypeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Wash Service</Label>
                  <Select
                    value={selectedServiceId}
                    onValueChange={setSelectedServiceId}
                    disabled={!selectedVehicleTypeId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableServices.map((service) => (
                        <SelectItem key={service._id} value={service._id}>
                          {service.serviceTypeName} · Rs {service.serviceRate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="public-vehicle-model">Vehicle Model</Label>
                  <Input
                    id="public-vehicle-model"
                    value={vehicleModel}
                    placeholder="Company / Model"
                    onChange={(event) => setVehicleModel(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="public-vehicle-number">Vehicle Number</Label>
                  <Input
                    id="public-vehicle-number"
                    value={vehicleNumber}
                    placeholder="Number plate"
                    onChange={(event) => setVehicleNumber(event.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Vehicle Color</Label>
                <div className="flex flex-wrap gap-2">
                  {CAR_COLOR_OPTIONS.map((color) => {
                    const isSelected =
                      selectedColor?.colorCode === color.colorCode;

                    return (
                      <button
                        key={color.colorCode}
                        type="button"
                        className={cn(
                          "flex items-center gap-2 px-2 py-1 text-xs border rounded-md transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground",
                        )}
                        onClick={() => setSelectedColor(color)}
                      >
                        <div
                          className="w-4 h-4 border rounded-full"
                          style={{ backgroundColor: color.colorCode }}
                        />
                        {color.colorName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {duplicateInfo && (
                <div className="p-3 border rounded-md border-amber-400/60 bg-amber-50">
                  <div className="text-sm font-semibold text-amber-800">
                    Active request already exists for this vehicle.
                  </div>
                  <div className="mt-1 text-xs text-amber-700">
                    Token {duplicateInfo.billNo} • {duplicateInfo.transactionStatus}
                  </div>
                </div>
              )}

              {contextData?.activeTransactions?.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Existing Active Requests
                  </Label>
                  <div className="space-y-1">
                    {contextData.activeTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="text-xs px-2 py-1 border rounded-md flex items-center justify-between"
                      >
                        <span>
                          {transaction.billNo} · {transaction.vehicleNumber}
                        </span>
                        <Badge variant="outline">{transaction.transactionStatus}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                className="hidden"
                value=""
                readOnly
              />

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Check-In"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearSavedProfile}
                  disabled={isSubmitting}
                >
                  Not you?
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {successTransaction && (
          <Card className="border-emerald-400/40 bg-emerald-50/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
                Request Added To Queue
              </CardTitle>
              <CardDescription className="text-emerald-800/90">
                Show this token at the counter if needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="p-2 border rounded-md bg-white/70">
                  <div className="text-xs text-muted-foreground">Token</div>
                  <div className="font-semibold">{successTransaction.billNo}</div>
                </div>
                <div className="p-2 border rounded-md bg-white/70">
                  <div className="text-xs text-muted-foreground">Vehicle</div>
                  <div className="font-semibold">{successTransaction.vehicleNumber}</div>
                </div>
                <div className="p-2 border rounded-md bg-white/70">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Clock3 className="w-3.5 h-3.5" />
                    {successTransaction.transactionStatus}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Created at {formatDate(successTransaction.createdAt)}
              </div>

              <Button onClick={resetForNewCheckin}>Create Another Check-In</Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default CarwashPublicCheckin;
