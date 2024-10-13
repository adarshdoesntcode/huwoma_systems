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
  useDeleteCarWashConfigMutation,
} from "../settingsApiSlice";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

function getTotalRate(services, key) {
  return services?.reduce((total, service) => total + service[key], 0);
}

const CarwashConfigSettings = () => {
  const [modelOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState({});

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useCarwashconfigQuery();

  const navigate = useNavigate();

  let content;

  if (isLoading || isFetching) {
    content = <Loader />;
  } else if (isSuccess) {
    if (!data) {
      content = (
        <div className="h-20 text-xs flex items-center justify-center text-muted-foreground">
          No Configurations
        </div>
      );
    } else {
      content = (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SN</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead className="pl-1">Type</TableHead>
                <TableHead className="text-center">Services</TableHead>
                {/* <TableHead className="text-center">Packages</TableHead> */}
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((vehicle, index) => (
                <TableRow
                  key={vehicle._id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setModalOpen(true);
                  }}
                >
                  <TableCell className="p-1 pl-4">{index + 1}</TableCell>
                  <TableCell className="font-medium p-1 ">
                    <div className="flex items-center gap-4 text-center">
                      <img src={`${vehicle.vehicleIcon}`} className="h-16" />
                    </div>
                  </TableCell>
                  <TableCell className="p-1 text-left">
                    <div>
                      <p>{vehicle.vehicleTypeName}</p>
                      <p className="text-muted-foreground text-xs">
                        {vehicle.billAbbreviation}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-center p-1">
                    <Badge
                      variant={
                        vehicle.services.length > 0 ? "secondary" : "outline"
                      }
                    >
                      {vehicle.services.length}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="text-center">
                    <Badge
                      variant={
                        vehicle.packages.length > 0 ? "secondary" : "outline"
                      }
                    >
                      {vehicle.packages.length}
                    </Badge>
                  </TableCell> */}

                  <TableCell className="text-right p-1">
                    <div className="flex gap-2 items-center justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicleId(vehicle._id);
                          setDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ConfirmDelete
            setDialogOpen={setDialogOpen}
            dialogOpen={dialogOpen}
            selectedVehicleId={selectedVehicleId}
            setSelectedVehicleId={setSelectedVehicleId}
          />
          <ConfigDetails
            setModalOpen={setModalOpen}
            modelOpen={modelOpen}
            selectedVehicle={selectedVehicle}
          />
        </>
      );
    }
  } else if (isError) {
    content = <ApiError error={error} />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
        <CardDescription>
          Configure vehicle type and its services
        </CardDescription>
      </CardHeader>
      <CardContent className="py-0 overflow-auto">{content}</CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button onClick={() => navigate("/settings/c-wash/new")}>
          Add Config
        </Button>
      </CardFooter>
    </Card>
  );
};

function ConfirmDelete({
  dialogOpen,
  setDialogOpen,
  selectedVehicleId,
  setSelectedVehicleId,
}) {
  const [deleteCarWashConfig, { isLoading }] = useDeleteCarWashConfigMutation();

  const handleDelete = async () => {
    try {
      if (!selectedVehicleId) return;
      const res = await deleteCarWashConfig({
        vehicleTypeId: selectedVehicleId,
      });
      setDialogOpen(false);
      if (res.error) {
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        setSelectedVehicleId("");
        toast({
          title: "Configuration Deleted!",
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
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will remove your vehicle type and
            its associated services and packages from the system.
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

function ConfigDetails({ setModalOpen, modelOpen, selectedVehicle }) {
  const navigate = useNavigate();

  return (
    <Dialog open={modelOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-4">
            <div>
              <img src={`${selectedVehicle.vehicleIcon}`} className="h-16" />
            </div>
            <div>
              <DialogTitle>{selectedVehicle.vehicleTypeName}</DialogTitle>
              <DialogDescription>
                Bill Abbreviation : {selectedVehicle.billAbbreviation}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">
          <div>
            <Label>Services</Label>
            {selectedVehicle?.services?.length === 0 && (
              <div className="h-14 text-xs flex items-center justify-center text-muted-foreground">
                No Services
              </div>
            )}
            {selectedVehicle?.services?.length > 0 && (
              <div className="grid gap-2 mt-2">
                {selectedVehicle.services.map((service) => {
                  return (
                    <Card key={service._id}>
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
            )}
          </div>
          {/* <div className="mt-4">
            <Label>Packages</Label>
            {selectedVehicle?.packages?.length === 0 && (
              <div className="h-14 text-xs flex items-center justify-center text-muted-foreground">
                No Packages
              </div>
            )}
            {selectedVehicle?.packages?.length > 0 && (
              <div className="grid gap-2 mt-2">
                {selectedVehicle.packages.map((pack) => {
                  return (
                    <Card key={pack._id}>
                      <CardHeader className="p-4 flex border-b">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm">
                              {pack.packageTypeName}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Bill Abbreviation : {pack.billAbbreviation}
                            </CardDescription>
                          </div>

                          <Badge>
                            Rs.{" "}
                            {getTotalRate(
                              pack.packageContents,
                              "packageServiceRate"
                            )}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-2 pb-4">
                        <div className="p-2">
                          <Label>Breakdown </Label>
                          {pack.packageContents.map((content) => {
                            return (
                              <ul className="list-disc pl-6" key={content._id}>
                                <li>
                                  <div
                                    className="flex
                                  justify-between
                                  items-start"
                                  >
                                    <div>
                                      <div className="text-sm font-medium">
                                        {content.packageServiceName}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Bill Abbreviation:{" "}
                                        {content.billAbbreviation}
                                      </div>
                                    </div>
                                    <Badge variant="outline">
                                      Rs. {content.packageServiceRate}
                                    </Badge>
                                  </div>
                                </li>
                              </ul>
                            );
                          })}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {pack.includeParking && (
                            <Badge variant="secondary">Includes Parking</Badge>
                          )}
                          {pack.streakApplicable && (
                            <Badge variant="secondary">Offers Free Wash</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div> */}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/settings/c-wash/edit/${selectedVehicle._id}`)
            }
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CarwashConfigSettings;
