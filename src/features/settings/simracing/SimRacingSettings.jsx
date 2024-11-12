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
  useCreatePaymentModeMutation,
  useCreateSimRacingRigMutation,
  useDeleteCarWashConfigMutation,
  useDeletePaymentModeMutation,
  useDeleteSimRacingRigMutation,
  useGetPaymentModeQuery,
  useGetSimRacingCoordinatesQuery,
  useGetSimRacingRigsQuery,
  useUpdatePaymentModeMutation,
  useUpdateSimRacingCoordinatesMutation,
  useUpdateSimRacingRigMutation,
} from "../settingsApiSlice";
import QRCode from "react-qr-code";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { isEqual } from "lodash";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const SimRacingSettings = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRig, setSelectedRig] = useState("");

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useGetSimRacingRigsQuery();

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
          No Rigs
        </div>
      );
    } else {
      content = (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">SN</TableHead>
                <TableHead className="hidden md:table-cell">Rig</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="pl-1 text-center hidden sm:table-cell">
                  Transactions
                </TableHead>

                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((rig, index) => {
                const totalTransaction = rig.rigTransactions.length;
                return (
                  <TableRow key={rig._id}>
                    <TableCell className="p-1 pl-4 hidden sm:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-4 text-center">
                        <img src={"/rig.webp"} className="w-16 aspect-auto" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium p-4 ">
                      {rig.rigName}
                    </TableCell>
                    <TableCell className="sm:p-1 p-4 text-center hidden sm:table-cell">
                      <div>
                        <Badge
                          variant={
                            totalTransaction > 0 ? "secondary" : "outline"
                          }
                        >
                          {totalTransaction}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="text-right p-1">
                      <div className="flex gap-2 items-center justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRig(rig);
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
                            setSelectedRig(rig);
                            setDeleteOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
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
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">SimRacing Rigs</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Operational SimRacing Rigs
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
          {content}
        </CardContent>
        {deleteOpen && (
          <ConfirmDelete
            setDeleteOpen={setDeleteOpen}
            deleteOpen={deleteOpen}
            selectedRig={selectedRig}
            setSelectedRig={setSelectedRig}
          />
        )}
        {editOpen && (
          <EditPayment
            setEditOpen={setEditOpen}
            editOpen={editOpen}
            selectedRig={selectedRig}
          />
        )}
        {createOpen && (
          <CreatePayment
            createOpen={createOpen}
            setCreateOpen={setCreateOpen}
          />
        )}

        <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
          <Button onClick={() => setCreateOpen(true)}>Add Rig</Button>
        </CardFooter>
      </Card>
      <SimRacingLocation />
    </>
  );
};

function CreatePayment({ createOpen, setCreateOpen }) {
  const [createSimRacingRig, { isLoading: isSubmitting }] =
    useCreateSimRacingRigMutation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await createSimRacingRig({
        ...data,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setCreateOpen(false);
        reset();
        toast({
          title: "New Rig Created",
          description: `${res.data.data.rigName}`,
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
          <DialogTitle>Create New Rig</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>
                {errors.rigName ? (
                  <span className="text-destructive">
                    {errors.rigName.message}
                  </span>
                ) : (
                  <span>Rig Name</span>
                )}
              </Label>
              <Input
                id="rigName"
                type="text"
                placeholder="Name"
                autoFocus
                autoComplete="off"
                {...register("rigName", {
                  required: "Name is required",
                })}
                className={errors.rigName ? "border-destructive" : ""}
              />
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
  selectedRig,
  setSelectedRig,
}) {
  const [deleteSimRacingRig, { isLoading }] = useDeleteSimRacingRigMutation();

  const handleDelete = async () => {
    try {
      if (!selectedRig) return;
      const res = await deleteSimRacingRig({
        rigId: selectedRig._id,
      });
      setDeleteOpen(false);
      if (res.error) {
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        setSelectedRig({});

        toast({
          title: "Rig Deleted!",
          description: res.data.data.rigName,
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
            This action cannot be undone. This will remove your payment mode
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

function EditPayment({ selectedRig, editOpen, setEditOpen }) {
  const [updateSimRacingRig, { isLoading: isSubmitting }] =
    useUpdateSimRacingRigMutation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await updateSimRacingRig({
        rigId: selectedRig._id,
        rigName: data.rigName,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setEditOpen(false);
        reset();
        toast({
          title: "Rig Updated",
          description: `${res.data.data.rigName}`,
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
          <DialogTitle>Edit Rig</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-2">
              <Label>
                {errors.rigName ? (
                  <span className="text-destructive">
                    {errors.rigName.message}
                  </span>
                ) : (
                  <span>Rig Name</span>
                )}
              </Label>
              <Input
                id="rigName"
                type="text"
                defaultValue={selectedRig.rigName}
                placeholder="Name"
                autoComplete="off"
                autoFocus
                {...register("rigName", {
                  required: "Name is required",
                })}
                className={errors.rigName ? "border-destructive" : ""}
              />
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

function SimRacingLocation() {
  const { data, isLoading, isSuccess, isFetching, isError, error } =
    useGetSimRacingCoordinatesQuery();

  const [updateSimRacingCoordinates] = useUpdateSimRacingCoordinatesMutation();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (!data.coordinates) {
      return;
    }
    const coordinates = data.coordinates.split(",").map(Number);
    const lat = coordinates[0];
    const lng = coordinates[1];

    try {
      const res = await updateSimRacingCoordinates({
        simRacingCoordinates: {
          type: "Point",
          coordinates: [lng, lat], // [longitude, latitude]
        },
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Location Updated!",
          description: "Successfully",
        });
        reset();
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
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl ">
            SimRacing Location
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Current Location : Loading..
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
          <div className=" flex flex-col items-start gap-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-11 w-full" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
          <Button disabled>Save</Button>
        </CardFooter>
      </Card>
    );
  } else if (isSuccess) {
    const coordinates = data?.data?.simRacingCoordinates?.coordinates;

    content = (
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl ">
            SimRacing Location
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Current Location :
            {coordinates ? (
              <Button variant="link" className="group" asChild>
                <a
                  href={`https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`}
                  target="_blank"
                >
                  {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
                  <ArrowUpRight className="ml-1 h-4 w-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition" />
                </a>
              </Button>
            ) : (
              "Not Set"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="coordinates-change"
            className="grid gap-2"
          >
            <Label>
              {errors.coordinates ? (
                <span className="text-destructive">
                  {errors.coordinates.message}
                </span>
              ) : (
                <span>Change Coordinates</span>
              )}
            </Label>
            <Input
              id="coordinates"
              type="text"
              autoComplete="off"
              placeholder="Latitude, Longitude"
              {...register("coordinates", {
                required: "Coordinates are required",
                pattern: {
                  value: /^([-+]?\d{1,2}(\.\d+)?),\s*([-+]?\d{1,3}(\.\d+)?)$/,
                  message:
                    "Please enter valid coordinates in 'Latitude, Longitude' format",
                },
                validate: (value) => {
                  const [latitude, longitude] = value.split(",").map(Number);
                  if (latitude < -90 || latitude > 90)
                    return "Latitude must be between -90 and 90";
                  if (longitude < -180 || longitude > 180)
                    return "Longitude must be between -180 and 180";
                  return true;
                },
              })}
              className={errors.coordinates ? "border-destructive" : ""}
            />
          </form>
        </CardContent>
        <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
          {isSubmitting ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </Button>
          ) : (
            <Button type="submit" form="coordinates-change">
              Save
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return content;
}

export default SimRacingSettings;
