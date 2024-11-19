import { useState } from "react";
import {
  useCreatePOSAccessMutation,
  useDeletePOSAccessMutation,
  useGetPOSAccessQuery,
} from "../settingsApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
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
import { Button } from "@/components/ui/button";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsSuper } from "@/hooks/useSuper";

function PosSettings() {
  const isSuper = useIsSuper();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPOSAccess, setSelectedPOSAccess] = useState("");

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useGetPOSAccessQuery();

  let content;

  if (isLoading || isFetching) {
    content = (
      <div className="pb-2">
        <div className="border-t py-3  flex gap-4">
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-4/6" />
          <Skeleton className="h-10 w-2/6" />
        </div>
        <div className="border-t py-3  flex gap-4">
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-4/6" />
          <Skeleton className="h-10 w-2/6" />
        </div>
      </div>
    );
  } else if (isSuccess) {
    if (!data) {
      content = (
        <div className="h-20 text-xs flex items-center justify-center text-muted-foreground">
          No POS Access
        </div>
      );
    } else {
      content = (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">SN</TableHead>
                <TableHead className="hidden md:table-cell">POS Name</TableHead>
                <TableHead>Code</TableHead>

                {isSuper && (
                  <TableHead className="text-right">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((POSAccess, index) => {
                return (
                  <TableRow key={POSAccess._id}>
                    <TableCell className="p-1 pl-4 hidden md:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium p-4 hidden md:table-cell">
                      {POSAccess.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0 md:hidden ">
                        <span className="text-xs text-muted-foreground">
                          {POSAccess.name}
                        </span>
                        <span className="text-lg tracking-widest">
                          {POSAccess.accessCode.toString()}
                        </span>
                      </div>
                      <div className="pointer-events-none hidden md:block">
                        <InputOTP
                          maxLength={6}
                          value={POSAccess.accessCode.toString()}
                          disabled
                          containerClassName=" has-[:disabled]:opacity-100"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </TableCell>
                    {isSuper && (
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPOSAccess(POSAccess);
                            setDeleteOpen(true);
                          }}
                        >
                          Delete
                        </Button>
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
    content = (
      <div className="py-8">
        <ApiError error={error} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">POS Access</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Configure payment modes for the system
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">{content}</CardContent>
      {createOpen && (
        <CreatePOSAccess
          createOpen={createOpen}
          setCreateOpen={setCreateOpen}
        />
      )}
      {deleteOpen && (
        <ConfirmDelete
          setDeleteOpen={setDeleteOpen}
          deleteOpen={deleteOpen}
          selectedPOSAccess={selectedPOSAccess}
          setSelectedPOSAccess={setSelectedPOSAccess}
        />
      )}
      {isSuper && (
        <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
          <Button onClick={() => setCreateOpen(true)}>Add Access</Button>
        </CardFooter>
      )}
    </Card>
  );
}

function CreatePOSAccess({ createOpen, setCreateOpen }) {
  const [createPOSAccess, { isLoading: isSubmitting }] =
    useCreatePOSAccessMutation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await createPOSAccess({
        name: data.posAccessName,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setCreateOpen(false);
        reset();
        toast({
          title: "POS Access Created",
          description: `${res.data.data.name}`,
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
          <DialogTitle>Create New POS Access</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>
                {errors.posAccessName ? (
                  <span className="text-destructive">
                    {errors.posAccessName.message}
                  </span>
                ) : (
                  <span>POS Access Name</span>
                )}
              </Label>
              <Input
                id="posAccessName"
                type="text"
                autoFocus
                autoComplete="off"
                placeholder="Name"
                {...register("posAccessName", {
                  required: "Name is required",
                })}
                className={errors.posAccessName ? "border-destructive" : ""}
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
  selectedPOSAccess,
  setSelectedPOSAccess,
}) {
  const [deletePOSAccess, { isLoading }] = useDeletePOSAccessMutation();

  const handleDelete = async () => {
    try {
      if (!selectedPOSAccess) return;
      const res = await deletePOSAccess({
        id: selectedPOSAccess._id,
      });
      setDeleteOpen(false);
      if (res.error) {
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        setSelectedPOSAccess({});

        toast({
          title: "Access Deleted!",
          description: "Successfully",
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

export default PosSettings;
