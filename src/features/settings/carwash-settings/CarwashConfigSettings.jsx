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

const CarwashConfigSettings = () => {
  const [modelOpen, setIsModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useCarwashconfigQuery();

  const navigate = useNavigate();

  let content;

  if (isLoading || isFetching) {
    content = <Loader />;
  } else if (isSuccess) {
    if (!data) {
      content = (
        <div className="w-full h-20 text-muted-foreground flex items-center justify-center">
          No Configurations
        </div>
      );
    } else {
      content = (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SN</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-center">Services</TableHead>
                <TableHead className="text-center">Packages</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((vehicle, index) => (
                <TableRow
                  key={vehicle._id}
                  className="cursor-pointer"
                  onClick={() => {
                    console.log("object");
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {vehicle.vehicleTypeName}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={vehicle.services.length > 0 ? "" : "outline"}
                    >
                      {vehicle.services.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={vehicle.packages.length > 0 ? "" : "outline"}
                    >
                      {vehicle.packages.length}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
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
                        variant="outline"
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
            setSelectedVehicleId={selectedVehicleId}
          />
        </div>
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
          Configure vehicle type, services and packages
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">{content}</CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button onClick={() => navigate("/settings/c-wash/new")}>
          Add Config
        </Button>
      </CardFooter>
    </Card>
  );
};

function ConfirmDelete({ dialogOpen, setDialogOpen, selectedVehicleId }) {
  const [deleteCarWashConfig, { isLoading }] = useDeleteCarWashConfigMutation();

  const handleDelete = async () => {
    if (!selectedVehicleId) return;
    const res = await deleteCarWashConfig({
      vehicleTypeId: selectedVehicleId,
    });
    console.log(res);
    setDialogOpen(false);
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

export default CarwashConfigSettings;
