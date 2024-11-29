import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCarwashconfigQuery,
  useCreateParkingVehicleMutation,
  useCreatePaymentModeMutation,
  useDeleteCarWashConfigMutation,
  useDeleteParkingVehicleMutation,
  useDeletePaymentModeMutation,
  useGetParkingVehiclesQuery,
  useGetPaymentModeQuery,
  useUpdateParkingVehicleMutation,
  useUpdatePaymentModeMutation,
} from "../settingsApiSlice";
import QRCode from "react-qr-code";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { CheckCheck, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { isEqual, set } from "lodash";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsSuper } from "@/hooks/useSuper";
import { VEHICLE_ICON_PATHS } from "@/lib/config";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ParkingSettings = () => {
  const isSuper = useIsSuper();

  const [createOpen, setCreateOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useGetParkingVehiclesQuery();

  let content;

  if (isLoading || isFetching) {
    content = (
      <div className="pb-2">
        <div className="border-t py-3  flex gap-4">
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
        </div>
        <div className="border-t py-3  flex gap-4">
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
        </div>
      </div>
    );
  } else if (isSuccess) {
    if (!data) {
      content = (
        <div className="h-20 text-xs flex items-center justify-center text-muted-foreground">
          No Parking Vehicles
        </div>
      );
    } else {
      content = (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">SN</TableHead>
                <TableHead className="pl-1 text-center hidden sm:table-cell">
                  Vehicle
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead className="text-center hidden sm:table-cell">
                  Capacity
                </TableHead>
                {isSuper && (
                  <TableHead className="text-right">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((vehicle, index) => {
                return (
                  <TableRow key={vehicle._id} className="hover:bg-inherit">
                    <TableCell className="p-1 pl-4 hidden sm:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell className="sm:p-1 p-4 text-center hidden sm:table-cell">
                      <img
                        className="w-24 mx-auto animate-in  fade-in duration-500"
                        src={vehicle.vehicleIcon}
                        alt="Vehicle Icon"
                      />
                    </TableCell>
                    <TableCell className="font-medium p-4 ">
                      <div>{vehicle.vehicleTypeName}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {vehicle.billAbbreviation}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm font-semibold">
                        {vehicle.rate}
                      </span>
                      <span className="text-xs text-muted-foreground">/hr</span>
                    </TableCell>
                    <TableCell className="text-center p-1 hidden sm:table-cell">
                      {vehicle.totalAccomodationCapacity}
                    </TableCell>

                    {isSuper && (
                      <TableCell className="text-right p-1">
                        <div className="flex gap-2 items-center justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVehicle(vehicle);
                              setEditOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVehicle(vehicle);
                              setDeleteOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      );
    }
  } else if (isError) {
    content = <ApiError error={error} />;
  }
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">Parking Vehicles</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Configure parking vehicle type for the system
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">{content}</CardContent>
      {deleteOpen && (
        <ConfirmDelete
          setDeleteOpen={setDeleteOpen}
          deleteOpen={deleteOpen}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
        />
      )}
      {editOpen && (
        <EditVehicle
          setEditOpen={setEditOpen}
          editOpen={editOpen}
          selectedVehicle={selectedVehicle}
        />
      )}
      {createOpen && (
        <CreateVehicle createOpen={createOpen} setCreateOpen={setCreateOpen} />
      )}

      {isSuper && (
        <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
          <Button onClick={() => setCreateOpen(true)}>Add Vehicle</Button>
        </CardFooter>
      )}
    </Card>
  );
};

function CreateVehicle({ createOpen, setCreateOpen }) {
  const [selectedVehicleIcon, setSelectedVehicleIcon] = useState("");

  const [createParkingVehicle, { isLoading: isSubmitting }] =
    useCreateParkingVehicleMutation();
  const {
    handleSubmit,
    register,
    reset,

    setError,
    clearErrors,
    formState: { errors },
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
      const res = await createParkingVehicle({
        ...data,
        vehicleIcon: selectedVehicleIcon,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setCreateOpen(false);
        reset();
        toast({
          title: "Vehicle Created",
          description: `${res.data.data.vehicleTypeName}`,
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

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Create New Payemnt Mode</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-2">
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
                placeholder="Name"
                autoComplete="off"
                {...register("vehicleTypeName", {
                  required: "Name is required",
                })}
                className={errors.vehicleTypeName ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
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
                placeholder="Text to be printed on bill"
                autoComplete="off"
                {...register("billAbbreviation", {
                  required: "Abbreviation is required",
                })}
                className={errors.billAbbreviation ? "border-destructive" : ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-1">
                <Label className="text-xs sm:text-sm">
                  {errors.rate ? (
                    <span className="text-destructive">
                      {errors.rate.message}
                    </span>
                  ) : (
                    <span>Rate</span>
                  )}
                </Label>
                <Input
                  onWheel={(e) => e.target.blur()}
                  id="rate"
                  type="number"
                  placeholder="Per Hour"
                  autoComplete="off"
                  {...register("rate", {
                    required: "Cost is required",
                    min: {
                      value: 1,
                      message: "Cost should be greater than zero",
                    },
                    valueAsNumber: true,
                  })}
                  className={errors.rate ? "border-destructive" : ""}
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label className="text-xs sm:text-sm">
                  {errors.totalAccomodationCapacity ? (
                    <span className="text-destructive">
                      {errors.totalAccomodationCapacity.message}
                    </span>
                  ) : (
                    <span>Parking Capacity</span>
                  )}
                </Label>
                <Input
                  onWheel={(e) => e.target.blur()}
                  id="totalAccomodationCapacity"
                  type="number"
                  autoComplete="off"
                  placeholder="0"
                  {...register("totalAccomodationCapacity", {
                    required: "Capacity is required",
                    min: {
                      value: 1,
                      message: "Capacity should be greater than zero",
                    },
                    valueAsNumber: true,
                  })}
                  className={
                    errors.totalAccomodationCapacity ? "border-destructive" : ""
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                {errors.vehicleIcon ? (
                  <span className="text-destructive">
                    {errors.vehicleIcon.message}
                  </span>
                ) : (
                  <span>
                    Vehicle Icon{" "}
                    <span className="text-muted-foreground">
                      ({selectedVehicleIcon ? "Selected" : "Select One"})
                    </span>
                  </span>
                )}
              </Label>
              <div className="flex flex-wrap gap-2 justify-evenly">
                {VEHICLE_ICON_PATHS.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageSelect(image)}
                    className={`cursor-pointer border-2 hover:border-muted-foreground transition-transform animate-in  fade-in duration-500 rounded-md border-transparent ${
                      selectedVehicleIcon === image
                        ? "!border-muted-foreground"
                        : ""
                    }`}
                  >
                    <img
                      loading="lazy"
                      src={`${image}`}
                      alt={image}
                      className="h-16 object-cover  rounded-md  "
                    />
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              {isSubmitting ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating
                </Button>
              ) : (
                <Button type="submit">Create</Button>
              )}
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDelete({
  deleteOpen,
  setDeleteOpen,
  selectedVehicle,
  setSelectedVehicle,
}) {
  const [deleteParkingVehicle, { isLoading }] =
    useDeleteParkingVehicleMutation();

  const handleDelete = async () => {
    try {
      if (!selectedVehicle) return;
      const res = await deleteParkingVehicle({
        vehicleTypeId: selectedVehicle._id,
      });
      setDeleteOpen(false);
      if (res.error) {
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        setSelectedVehicle({});

        toast({
          title: "Vehicle Deleted!",
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
  return (
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will remove your vehicle type
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditVehicle({ selectedVehicle, editOpen, setEditOpen }) {
  const [vehicleIcon, setVehicleIcon] = useState(selectedVehicle.vehicleIcon);
  const [updateParkingVehicle, { isLoading: isSubmitting }] =
    useUpdateParkingVehicleMutation();
  const {
    handleSubmit,
    register,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm();

  const handleImageSelect = (image) => {
    setVehicleIcon(image);
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
      const res = await updateParkingVehicle({
        vehicleTypeId: selectedVehicle._id,
        updates: { ...data, vehicleIcon: vehicleIcon },
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setEditOpen(false);
        reset();
        toast({
          title: "Vehicle Updated",
          description: `${res.data.data.vehicleTypeName}`,
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

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Edit Payemnt Mode</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-2">
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
                placeholder="Name"
                defaultValue={selectedVehicle.vehicleTypeName}
                autoComplete="off"
                {...register("vehicleTypeName", {
                  required: "Name is required",
                })}
                className={errors.vehicleTypeName ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
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
                defaultValue={selectedVehicle.billAbbreviation}
                placeholder="Text to be printed on bill"
                autoComplete="off"
                {...register("billAbbreviation", {
                  required: "Abbreviation is required",
                })}
                className={errors.billAbbreviation ? "border-destructive" : ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-1">
                <Label className="text-xs sm:text-sm">
                  {errors.rate ? (
                    <span className="text-destructive">
                      {errors.rate.message}
                    </span>
                  ) : (
                    <span>Rate</span>
                  )}
                </Label>
                <Input
                  onWheel={(e) => e.target.blur()}
                  id="rate"
                  type="number"
                  placeholder="Per Hour"
                  autoComplete="off"
                  defaultValue={selectedVehicle.rate}
                  {...register("rate", {
                    required: "Cost is required",
                    min: {
                      value: 1,
                      message: "Cost should be greater than zero",
                    },
                    valueAsNumber: true,
                  })}
                  className={errors.rate ? "border-destructive" : ""}
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label className="text-xs sm:text-sm">
                  {errors.totalAccomodationCapacity ? (
                    <span className="text-destructive">
                      {errors.totalAccomodationCapacity.message}
                    </span>
                  ) : (
                    <span>Parking Capacity</span>
                  )}
                </Label>
                <Input
                  onWheel={(e) => e.target.blur()}
                  id="totalAccomodationCapacity"
                  type="number"
                  autoComplete="off"
                  defaultValue={selectedVehicle.totalAccomodationCapacity}
                  placeholder="0"
                  {...register("totalAccomodationCapacity", {
                    required: "Capacity is required",
                    min: {
                      value: 1,
                      message: "Capacity should be greater than zero",
                    },
                    valueAsNumber: true,
                  })}
                  className={
                    errors.totalAccomodationCapacity ? "border-destructive" : ""
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                {errors.vehicleIcon ? (
                  <span className="text-destructive">
                    {errors.vehicleIcon.message}
                  </span>
                ) : (
                  <span>
                    Vehicle Icon{" "}
                    <span className="text-muted-foreground">(Change)</span>
                  </span>
                )}
              </Label>
              <div className="flex flex-wrap gap-2 justify-evenly">
                {VEHICLE_ICON_PATHS.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageSelect(image)}
                    className={`cursor-pointer border-2 hover:border-muted-foreground animate-in  fade-in duration-500 transition-transform rounded-md border-transparent ${
                      vehicleIcon && vehicleIcon === image
                        ? "!border-muted-foreground"
                        : ""
                    }`}
                  >
                    <img
                      loading="lazy"
                      src={`${image}`}
                      alt={image}
                      className="h-16 object-cover  rounded-md  "
                    />
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              {isSubmitting ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </Button>
              ) : (
                <Button type="submit">Save</Button>
              )}
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ParkingSettings;
