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
import { VEHICLE_ICON_PATHS } from "@/lib/config";
import { ChevronLeft, Loader2, PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  useServiceTypeQuery,
  useUpdateServiceTypeMutation,
  useUpdateVehicleTypeMutation,
  useVehicleTypebyIdQuery,
} from "../settingsApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isEqual } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";

function CarwashEditConfig() {
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
        Edit Configuration
      </div>
      <VehicleType />
      <Services />
    </>
  );
}

function VehicleType() {
  const { id } = useParams();

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useVehicleTypebyIdQuery(id);
  const [updateVehicleType] = useUpdateVehicleTypeMutation();

  const {
    handleSubmit,
    register,
    setError,
    watch,
    clearErrors,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      vehicleTypeName: "",
      billAbbreviation: "",
      vehicleIcon: "",
    },
  });
  const vehicleIcon = watch("vehicleIcon");

  useEffect(() => {
    if (isSuccess && data) {
      setValue("vehicleTypeName", data.data.vehicleTypeName, {
        shouldDirty: false,
      });
      setValue("billAbbreviation", data.data.billAbbreviation, {
        shouldDirty: false,
      });
      setValue("vehicleIcon", data.data.vehicleIcon, { shouldDirty: false });
    }
  }, [isSuccess, data, setValue]);

  const handleImageSelect = (image) => {
    setValue("vehicleIcon", image, {
      shouldDirty: true,
    });
    clearErrors("vehicleIcon");
  };
  const onSubmit = async (data) => {
    if (!vehicleIcon) {
      setError("vehicleIcon", {
        type: "manual",
        message: "Vehicle icon is required",
      });
      return;
    }

    try {
      const res = await updateVehicleType({
        vehicleTypeId: id,
        updates: {
          vehicleTypeName: data.vehicleTypeName,
          billAbbreviation: data.billAbbreviation,
          vehicleIcon: data.vehicleIcon,
        },
      });

      if (res.error) {
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        toast({
          title: "Vehicle Type Updated!",
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

  let content;

  if (isLoading || isFetching) {
    content = (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Vehicle Type</CardTitle>
          <CardDescription>Edit vehile type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="pb-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-10 w-1/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  } else if (isSuccess) {
    content = (
      <Card>
        <CardHeader>
          <div className="flex h-16 items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Vehicle Type</CardTitle>
              <CardDescription>Edit vehile type</CardDescription>
            </div>
            {vehicleIcon && (
              <div>
                <img
                  src={`${vehicleIcon}`}
                  alt={vehicleIcon}
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
                  type="text"
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
                  type="text"
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
                      Change
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
              {isSubmitting ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </Button>
              ) : (
                <Button disabled={!isDirty}>Save</Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }
  return content;
}

function Services() {
  const [initialServices, setInitialServices] = useState([]);
  const [services, setServices] = useState([]);
  const [addNewService, setAddNewService] = useState(false);
  const [parkingToggle, setParkingToggle] = useState(false);
  const [streakToggle, setStreakToggle] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const { id } = useParams();

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useServiceTypeQuery(id);

  const [updateServiceType, { isLoading: isSubmitting }] =
    useUpdateServiceTypeMutation();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const newForm = useRef(null);
  const editForm = useRef(null);

  useEffect(() => {
    if (addNewService && newForm.current) {
      newForm.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (editForm && editForm.current) {
      editForm.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [addNewService, editIndex]);

  useEffect(() => {
    if (isSuccess) {
      setServices(data?.data || []);
      setInitialServices(data?.data || []);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (initialServices && !isEqual(services, initialServices)) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [services, initialServices]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleServiceRemove = (deleteIndex) => {
    setServices((prev) => {
      return prev.filter((service, index) => {
        return index !== deleteIndex;
      });
    });
  };

  const onEdit = (data) => {
    setServices((prev) => {
      return prev.map((service, index) => {
        if (index === editIndex) {
          return {
            _id: editId || undefined,
            serviceTypeName: data.serviceTypeName,
            billAbbreviation: data.billAbbreviation,
            serviceRate: data.serviceRate,
            serviceDescription: data.serviceDescription.split(","),
            includeParking: {
              decision: parkingToggle,
              parkingBuffer: parkingToggle
                ? data.parkingBuffer || undefined
                : undefined,
            },
            streakApplicable: {
              decision: streakToggle,
              washCount: streakToggle ? data.washCount || undefined : undefined,
            },
          };
        } else {
          return service;
        }
      });
    });
    reset();
    setEditIndex(null);
    setEditId(null);
    setParkingToggle(false);
    setStreakToggle(false);
  };

  const onAdd = (data) => {
    setServices((prev) => {
      return [
        ...prev,
        {
          serviceTypeName: data.serviceTypeName,
          billAbbreviation: data.billAbbreviation,
          serviceRate: data.serviceRate,
          serviceDescription: data.serviceDescription.split(","),
          includeParking: {
            decision: parkingToggle,
            parkingBuffer: data.parkingBuffer || undefined,
          },
          streakApplicable: {
            decision: streakToggle,
            washCount: data.washCount || undefined,
          },
        },
      ];
    });
    reset();
    setAddNewService(false);
    setParkingToggle(false);
    setStreakToggle(false);
  };

  const onSubmit = async () => {
    try {
      const res = await updateServiceType({
        vehicleTypeId: id,
        services: services,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Services Updated!",
          description: `For ${res.data.data.vehicleTypeName}`,
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

  let content;

  if (isLoading || isFetching) {
    content = (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Services</CardTitle>
          <CardDescription>Edit services for the vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4 space-y-2 mb-4">
            <Skeleton className="h-8 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="h-4 w-1/5" />
          </div>
          <div className="border rounded-md p-4 space-y-2">
            <Skeleton className="h-8 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="h-4 w-1/5" />
          </div>
          {/* <Loader /> */}
        </CardContent>
      </Card>
    );
  } else if (isSuccess) {
    content = (
      <Card className="mb-64">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Services</CardTitle>
              <CardDescription>Edit services for the vehicle</CardDescription>
            </div>
            <div>
              {isDirty && <Badge variant="destructive">Unsaved Changes</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="h-20 text-xs flex items-center justify-center text-muted-foreground">
              No Services
            </div>
          ) : (
            <div className="grid gap-2 mt-2">
              {services.map((service, index) => {
                if (editIndex === index) {
                  return (
                    <form
                      ref={editForm}
                      key={`service-${index}`}
                      onSubmit={handleSubmit(onEdit)}
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
                            type="text"
                            defaultValue={service.serviceTypeName}
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
                            type="text"
                            defaultValue={service.billAbbreviation}
                            placeholder="Text printed on the bill"
                            {...register("billAbbreviation", {
                              required: "Abbreviation is required",
                            })}
                            className={
                              errors.billAbbreviation
                                ? "border-destructive"
                                : ""
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
                            onWheel={(e) => e.target.blur()}
                            id="serviceRate"
                            type="number"
                            defaultValue={service.serviceRate}
                            placeholder="Rs."
                            {...register("serviceRate", {
                              required: "Cost is required",
                              min: {
                                value: 1,
                                message: "Cost should be greater than zero",
                              },
                              valueAsNumber: true,
                            })}
                            className={
                              errors.serviceRate ? "border-destructive" : ""
                            }
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
                            defaultValue={service.serviceDescription.join()}
                            placeholder="item1,item2,item3.."
                            {...register("serviceDescription", {
                              required: "Desciption is required",
                            })}
                            className={
                              errors.serviceDescription
                                ? "border-destructive"
                                : ""
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
                        {parkingToggle && (
                          <div className="flex col-span-3 items-center justify-between">
                            <Label>
                              {errors.parkingBuffer ? (
                                <span className="text-destructive">
                                  {errors.parkingBuffer.message}
                                </span>
                              ) : (
                                <span>Time Buffer</span>
                              )}
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                onWheel={(e) => e.target.blur()}
                                id="parkingBuffer"
                                type="number"
                                placeholder="Minutes"
                                defaultValue={
                                  service.includeParking.parkingBuffer || 60
                                }
                                {...register("parkingBuffer", {
                                  required: "A time is required",
                                  min: {
                                    value: 1,
                                    message: "Must be greater than 0",
                                  },
                                })}
                                className={
                                  errors.parkingBuffer
                                    ? "border-destructive"
                                    : ""
                                }
                              />
                              <Label>minutes</Label>
                            </div>
                          </div>
                        )}
                        <Separator className="col-span-3" />
                        <div className="flex col-span-3 items-center justify-between">
                          <Label>Eligible for Free Wash</Label>
                          <Switch
                            checked={streakToggle}
                            onCheckedChange={setStreakToggle}
                          />
                        </div>
                        {streakToggle && (
                          <div className="flex items-center col-span-3 justify-between">
                            <Label>
                              {errors.washCount ? (
                                <span className="text-destructive">
                                  {errors.washCount.message}
                                </span>
                              ) : (
                                <span>Free Wash After</span>
                              )}
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                onWheel={(e) => e.target.blur()}
                                id="washCount"
                                type="number"
                                placeholder="Washes"
                                defaultValue={
                                  service.streakApplicable.washCount || 5
                                }
                                {...register("washCount", {
                                  required: "Count is required",
                                  min: {
                                    value: 1,
                                    message: "Must be greater than 0",
                                  },
                                })}
                                className={
                                  errors.washCount ? "border-destructive" : ""
                                }
                              />
                              <Label>washes</Label>
                            </div>
                          </div>
                        )}
                      </div>
                      <CardFooter className="justify-center border-t p-4 pb-0">
                        <Button variant="secondary">Done</Button>
                      </CardFooter>
                    </form>
                  );
                } else {
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
                      <CardContent className="px-4 pb-4">
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
                            {service.includeParking.decision && (
                              <Badge variant="secondary">
                                Parking Fees after{" "}
                                {service.includeParking.parkingBuffer}m
                              </Badge>
                            )}
                            {service.streakApplicable.decision && (
                              <Badge variant="secondary">
                                Free Wash after{" "}
                                {service.streakApplicable.washCount} washes
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setStreakToggle(
                                  service.streakApplicable.decision
                                );
                                setParkingToggle(
                                  service.includeParking.decision
                                );
                                setEditIndex(index);
                                setEditId(service._id);
                              }}
                            >
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleServiceRemove(index)}
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              })}
            </div>
          )}
          {addNewService && (
            <form
              ref={newForm}
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
                    type="text"
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
                    type="text"
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
                    onWheel={(e) => e.target.blur()}
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
                {parkingToggle && (
                  <div className="flex col-span-3 items-center justify-between">
                    <Label>
                      {errors.parkingBuffer ? (
                        <span className="text-destructive">
                          {errors.parkingBuffer.message}
                        </span>
                      ) : (
                        <span>Time Buffer</span>
                      )}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        onWheel={(e) => e.target.blur()}
                        id="parkingBuffer"
                        type="number"
                        placeholder="Minutes"
                        {...register("parkingBuffer", {
                          required: "A time is required",
                          min: {
                            value: 1,
                            message: "Must be greater than 0",
                          },
                        })}
                        className={
                          errors.parkingBuffer ? "border-destructive" : ""
                        }
                      />
                    </div>
                  </div>
                )}
                <Separator className="col-span-3" />
                <div className="flex col-span-3 items-center justify-between">
                  <Label>Eligible for Free Wash</Label>
                  <Switch
                    checked={streakToggle}
                    onCheckedChange={setStreakToggle}
                  />
                </div>
                {streakToggle && (
                  <div className="flex items-center col-span-3 justify-between">
                    <Label>
                      {errors.washCount ? (
                        <span className="text-destructive">
                          {errors.washCount.message}
                        </span>
                      ) : (
                        <span>Free Wash After</span>
                      )}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        onWheel={(e) => e.target.blur()}
                        id="washCount"
                        type="number"
                        placeholder="No of Washes"
                        {...register("washCount", {
                          required: "Count is required",
                          min: {
                            value: 1,
                            message: "Must be greater than 0",
                          },
                        })}
                        className={errors.washCount ? "border-destructive" : ""}
                      />
                    </div>
                  </div>
                )}
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
              reset();
              setAddNewService(!addNewService);
            }}
          >
            {!addNewService && <PlusCircle className="h-3.5 w-3.5" />}
            {addNewService ? "Cancel" : "Add"}
          </Button>
          <div>
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </Button>
            ) : (
              <Button disabled={!isDirty} onClick={onSubmit}>
                Save
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  } else if (isError) {
    return <ApiError error={error} />;
  }

  return content;
}
export default CarwashEditConfig;
