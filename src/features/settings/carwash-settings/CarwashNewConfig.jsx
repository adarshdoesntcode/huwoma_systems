import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { VEHICLE_ICON_PATHS } from "@/lib/config";
import {
  CheckCheck,
  ChevronLeft,
  Loader2,
  PlusCircle,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  useCreateServiceTypeMutation,
  useCreateVehicleTypeMutation,
} from "../settingsApiSlice";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

function CarwashNewConfig() {
  const [vehicle, setVehicle] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <div className=" font-semibold tracking-tight flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        New Configuration
      </div>
      <VehicleType setVehicle={setVehicle} vehicle={vehicle} />
      {vehicle && <Services vehicle={vehicle} />}
      {/* {vehicle && <Packages vehicle={vehicle} />} */}
    </>
  );
}

function VehicleType({ vehicle, setVehicle }) {
  const [selectedVehicleIcon, setSelectedVehicleIcon] = useState("");
  const [createVehicleType, { isLoading }] = useCreateVehicleTypeMutation();

  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleImageSelect = (image) => {
    setSelectedVehicleIcon(image);
    clearErrors("vehicleIcon");
  };
  const onSubmit = async (data) => {
    if (!selectedVehicleIcon) {
      setError("vehicleIcon", {
        type: "manual",
        message: "Vehicle icon is required",
      });
      return;
    }

    try {
      const res = await createVehicleType({
        vehicleTypeName: data.vehicleTypeName,
        billAbbreviation: data.billAbbreviation,
        vehicleIcon: selectedVehicleIcon,
      });

      if (res.error) {
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        setVehicle(res.data.data);
        toast({
          title: "Vehicle Type Created!",
          description: res.data.data.vehicleTypeName,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  if (vehicle) {
    return (
      <Card>
        <CardHeader>
          <div className="flex h-16 items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">
                {vehicle.vehicleTypeName}
              </CardTitle>
              <CardDescription>
                Bill Abbreviation : {vehicle.billAbbreviation}
              </CardDescription>
            </div>

            <div>
              <img
                src={`${vehicle.vehicleIcon}`}
                alt={vehicle.vehicleTypeName}
                className="h-16 object-cover"
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardHeader>
          <div className="flex h-16 items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Vehicle Type</CardTitle>
              <CardDescription>Create a new vehile type</CardDescription>
            </div>
            {selectedVehicleIcon && (
              <div>
                <img
                  src={`${selectedVehicleIcon}`}
                  alt={selectedVehicleIcon}
                  className="h-16 object-cover"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div>
              <div className="grid gap-2 col-span-2">
                <Label>
                  {errors.vehicleTypeName ? (
                    <span className="text-destructive">
                      {errors.vehicleTypeName.message}
                    </span>
                  ) : (
                    <span>Vehicle Name</span>
                  )}
                </Label>
                <Input
                  id="vehicleTypeName"
                  type="vehicleTypeName"
                  placeholder="Vehicle type name"
                  {...register("vehicleTypeName", {
                    required: "Name is required",
                  })}
                  className={errors.vehicleTypeName ? "border-destructive" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label>
                  {errors.billAbbreviation ? (
                    <span className="text-destructive">
                      {errors.billAbbreviation.message}
                    </span>
                  ) : (
                    <span>Bill Abbreviation</span>
                  )}
                </Label>
                <Input
                  id="billAbbreviation"
                  type="billAbbreviation"
                  placeholder="Text printed on the bill"
                  {...register("billAbbreviation", {
                    required: "Abbreviation is required",
                  })}
                  className={
                    errors.billAbbreviation ? "border-destructive" : ""
                  }
                />
              </div>
              <div className="grid gap-2 col-span-1">
                <Label>
                  {errors.vehicleIcon ? (
                    <span className="text-destructive">
                      {errors.vehicleIcon.message}
                    </span>
                  ) : (
                    <span>Vehicle Icon</span>
                  )}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full" type="button">
                      {selectedVehicleIcon ? "Selected" : "Select"}
                      {selectedVehicleIcon && (
                        <CheckCheck className="text-muted-foreground w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="flex flex-wrap gap-2 justify-evenly">
                      {VEHICLE_ICON_PATHS.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => handleImageSelect(image)}
                        >
                          <img
                            src={`${image}`}
                            alt={image}
                            className="h-16 object-cover cursor-pointer hover:scale-110 transition-transform "
                          />
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <CardFooter className="border-t px-6 py-4 pb-0 pr-0 flex justify-end">
              {isSubmitting || isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating
                </Button>
              ) : (
                <Button>Create</Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    );
  }
}

function Services({ vehicle }) {
  const [newServices, setNewServices] = useState([]);
  const [services, setServices] = useState("");
  const [addNewService, setAddNewService] = useState(true);
  const [parkingToggle, setParkingToggle] = useState(false);
  const [streakToggle, setStreakToggle] = useState(false);

  const [createServiceType, { isLoading }] = useCreateServiceTypeMutation();

  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    reset,

    formState: { errors },
  } = useForm();

  const handleServiceRemove = (deleteIndex) => {
    setNewServices((prev) => {
      return prev.filter((service, index) => {
        return index !== deleteIndex;
      });
    });
  };

  const onSubmit = async () => {
    try {
      const res = await createServiceType({
        vehicleTypeId: vehicle._id,
        services: newServices,
      });

      if (res.error) {
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        setServices(res.data.data);
        toast({
          title: "Service Type Created!",
          description: res.data.data.serviceTypeName,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };
  const onAdd = (data) => {
    setNewServices((prev) => {
      return [
        ...prev,
        {
          serviceTypeName: data.serviceTypeName,
          billAbbreviation: data.billAbbreviation,
          serviceRate: data.serviceRate,
          serviceDescription: data.serviceDescription.split(","),
          includeParking: parkingToggle,
          streakApplicable: streakToggle,
        },
      ];
    });
    reset();
    setAddNewService(false);
    setParkingToggle(false);
    setStreakToggle(false);
  };

  if (!services) {
    return (
      <Card className="mb-64">
        <CardHeader>
          <CardTitle className="text-xl">Services</CardTitle>
          <CardDescription>
            Create a new service for the created vehicle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 mt-2">
            {newServices.map((service, index) => {
              return (
                <Card key={index}>
                  <CardHeader className="p-4 flex pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm">
                          {service.serviceTypeName}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Bill Abbreviation : {service.billAbbreviation}
                        </CardDescription>
                      </div>

                      <Badge>Rs. {service.serviceRate}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-2 pb-4">
                    <div>
                      <ul className="ml-6 text-xs mb-2 list-disc">
                        {service.serviceDescription.map(
                          (description, index) => {
                            return <li key={index}>{description}</li>;
                          }
                        )}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="flex flex-wrap gap-2">
                        {service.includeParking && (
                          <Badge variant="secondary">Includes Parking</Badge>
                        )}
                        {service.streakApplicable && (
                          <Badge variant="secondary">Offers Free Wash</Badge>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="mr-2 "
                        onClick={() => handleServiceRemove(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {addNewService && (
            <form
              onSubmit={handleSubmit(onAdd)}
              className="grid gap-4 border p-6 rounded-md mt-4"
            >
              <div>
                <div className="grid gap-2 col-span-2">
                  <Label>
                    {errors.serviceTypeName ? (
                      <span className="text-destructive">
                        {errors.serviceTypeName.message}
                      </span>
                    ) : (
                      <span>Service Name</span>
                    )}
                  </Label>
                  <Input
                    id="serviceTypeName"
                    type="serviceTypeName"
                    placeholder="Service type name"
                    {...register("serviceTypeName", {
                      required: "Name is required",
                    })}
                    className={
                      errors.serviceTypeName ? "border-destructive" : ""
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2 col-span-2">
                  <Label>
                    {errors.billAbbreviation ? (
                      <span className="text-destructive">
                        {errors.billAbbreviation.message}
                      </span>
                    ) : (
                      <span>Bill Abbreviation</span>
                    )}
                  </Label>
                  <Input
                    id="billAbbreviation"
                    type="billAbbreviation"
                    placeholder="Text printed on the bill"
                    {...register("billAbbreviation", {
                      required: "Abbreviation is required",
                    })}
                    className={
                      errors.billAbbreviation ? "border-destructive" : ""
                    }
                  />
                </div>
                <div className="grid gap-2 col-span-1">
                  <Label>
                    {errors.serviceRate ? (
                      <span className="text-destructive">
                        {errors.serviceRate.message}
                      </span>
                    ) : (
                      <span>Service Cost</span>
                    )}
                  </Label>
                  <Input
                    id="serviceRate"
                    type="number"
                    placeholder="Rs."
                    {...register("serviceRate", {
                      required: "Cost is required",
                      min: {
                        value: 1,
                        message: "Cost should be greater than zero",
                      },
                      valueAsNumber: true,
                    })}
                    className={errors.serviceRate ? "border-destructive" : ""}
                  />
                </div>
                <div className="grid gap-2 col-span-3">
                  <Label>
                    {errors.serviceDescription ? (
                      <span className="text-destructive">
                        {errors.serviceDescription.message}
                      </span>
                    ) : (
                      <span>
                        Service Description{" "}
                        <span className="font-normal text-muted-foreground text-xs">
                          (separate with commas)
                        </span>
                      </span>
                    )}
                  </Label>
                  <Input
                    id="serviceDescription"
                    type="text"
                    placeholder="item1,item2,item3.."
                    {...register("serviceDescription", {
                      required: "Desciption is required",
                    })}
                    className={
                      errors.serviceDescription ? "border-destructive" : ""
                    }
                  />
                </div>
                <Separator className="col-span-3" />
                <div className="flex col-span-3 items-center justify-between">
                  <Label>Include Parking Fees</Label>
                  <Switch
                    checked={parkingToggle}
                    onCheckedChange={setParkingToggle}
                  />
                </div>
                <Separator className="col-span-3" />
                <div className="flex col-span-3 items-center justify-between">
                  <Label>Eligible for Free Wash</Label>
                  <Switch
                    checked={streakToggle}
                    onCheckedChange={setStreakToggle}
                  />
                </div>
              </div>
              <CardFooter className="justify-center border-t p-4 pb-0">
                <Button variant="secondary">Done</Button>
              </CardFooter>
            </form>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4  flex justify-between">
          <Button
            variant="outline"
            className="gap-1"
            onClick={() => {
              setAddNewService(!addNewService);
            }}
          >
            {!addNewService && <PlusCircle className="h-3.5 w-3.5" />}
            {addNewService ? "Cancel" : "Add"}
          </Button>
          <div>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating
              </Button>
            ) : (
              <Button onClick={onSubmit}>Submit</Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  } else {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Created Services</CardTitle>
            <CardDescription>
              Service for {vehicle.vehicleTypeName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 mt-2">
              {services.map((service, index) => {
                return (
                  <Card key={index}>
                    <CardHeader className="p-4 flex pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm">
                            {service.serviceTypeName}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Bill Abbreviation : {service.billAbbreviation}
                          </CardDescription>
                        </div>

                        <Badge>Rs. {service.serviceRate}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-2 pb-4">
                      <div>
                        <ul className="ml-6 text-xs mb-2 list-disc">
                          {service.serviceDescription.map(
                            (description, index) => {
                              return <li key={index}>{description}</li>;
                            }
                          )}
                        </ul>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {service.includeParking && (
                          <Badge variant="secondary">Includes Parking</Badge>
                        )}
                        {service.streakApplicable && (
                          <Badge variant="secondary">Offers Free Wash</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <div className=" flex w-full items-center justify-end  mb-64">
          <Button onClick={() => navigate("/settings/c-wash")}>Done</Button>
        </div>
      </>
    );
  }
}

function Packages({ vehicle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Packages</CardTitle>
        <CardDescription>
          Create a new package for the created vehicle
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
export default CarwashNewConfig;