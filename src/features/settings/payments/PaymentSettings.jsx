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
  useDeleteCarWashConfigMutation,
  useDeletePaymentModeMutation,
  useGetPaymentModeQuery,
  useUpdatePaymentModeMutation,
} from "../settingsApiSlice";
import QRCode from "react-qr-code";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { isEqual } from "lodash";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsSuper } from "@/hooks/useSuper";

const PaymentSettings = () => {
  const isSuper = useIsSuper();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useGetPaymentModeQuery();

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
          No Payment Modes
        </div>
      );
    } else {
      content = (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">SN</TableHead>
                <TableHead>Payment Name</TableHead>
                {/* <TableHead className="pl-1 text-center hidden sm:table-cell">
                  Transactions
                </TableHead> */}
                <TableHead className="text-center hidden sm:table-cell">
                  QR Data
                </TableHead>
                {isSuper && (
                  <TableHead className="text-right">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((paymentMode, index) => {
                // const totalTransaction =
                //   paymentMode.carWashTransactions.length +
                //   paymentMode.simRacingTransactions.length +
                //   paymentMode.parkingTransactions.length;
                return (
                  <TableRow
                    key={paymentMode._id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPaymentMode(paymentMode);
                      setDetailsOpen(true);
                    }}
                  >
                    <TableCell className="p-1 pl-4 hidden sm:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium p-4 ">
                      {paymentMode.paymentModeName}
                    </TableCell>
                    {/* <TableCell className="sm:p-1 p-4 text-center hidden sm:table-cell">
                      <div>
                        <Badge
                          variant={
                            totalTransaction > 0 ? "secondary" : "outline"
                          }
                        >
                          {totalTransaction}
                        </Badge>
                      </div>
                    </TableCell> */}

                    <TableCell className="text-center p-1 hidden sm:table-cell">
                      {paymentMode.qrCodeData ? (
                        <Badge>Available</Badge>
                      ) : (
                        <Badge variant="outline">None</Badge>
                      )}
                    </TableCell>

                    {isSuper && (
                      <TableCell className="text-right p-1">
                        <div className="flex gap-2 items-center justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPaymentMode(paymentMode);
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
                              setSelectedPaymentMode(paymentMode);
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
        <CardTitle className="text-xl sm:text-2xl">Payment Mode</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Configure payment modes for the system
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">{content}</CardContent>
      {deleteOpen && (
        <ConfirmDelete
          setDeleteOpen={setDeleteOpen}
          deleteOpen={deleteOpen}
          selectedPaymentMode={selectedPaymentMode}
          setSelectedPaymentMode={setSelectedPaymentMode}
        />
      )}
      {editOpen && (
        <EditPayment
          setEditOpen={setEditOpen}
          editOpen={editOpen}
          selectedPaymentMode={selectedPaymentMode}
        />
      )}
      {createOpen && (
        <CreatePayment createOpen={createOpen} setCreateOpen={setCreateOpen} />
      )}
      {detailsOpen && (
        <ConfigDetails
          setDetailsOpen={setDetailsOpen}
          detailsOpen={detailsOpen}
          selectedPaymentMode={selectedPaymentMode}
        />
      )}

      {isSuper && (
        <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
          <Button onClick={() => setCreateOpen(true)}>Add Payment</Button>
        </CardFooter>
      )}
    </Card>
  );
};

function ConfigDetails({ setDetailsOpen, detailsOpen, selectedPaymentMode }) {
  return (
    <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle>{selectedPaymentMode?.paymentModeName}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="max-h-[50vh] overflow-y-auto">
          {/* <div className="space-y-2  mb-2">
            <Label>Transactions</Label>
            <div className="pb-4 text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <span>Car Wash</span>
                <span>{selectedPaymentMode?.carWashTransactions?.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Sim Racing</span>
                <span>
                  {selectedPaymentMode?.simRacingTransactions?.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Parking</span>
                <span>{selectedPaymentMode?.parkingTransactions?.length}</span>
              </div>
            </div>
          </div>
          <Separator /> */}

          {selectedPaymentMode?.qrCodeData && (
            <div className="space-y-4 mt-4">
              <Label>Qr Code</Label>
              <div className="flex items-center flex-col gap-4 justify-center ">
                <div className="p-4 border rounded-md">
                  <QRCode value={selectedPaymentMode.qrCodeData} />
                </div>
                <p className="text-muted-foreground uppercase font-medium">
                  {selectedPaymentMode?.paymentModeName}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreatePayment({ createOpen, setCreateOpen }) {
  const [createPaymentMode, { isLoading: isSubmitting }] =
    useCreatePaymentModeMutation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await createPaymentMode({
        ...data,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setCreateOpen(false);
        reset();
        toast({
          title: "Payment Mode Created",
          description: `${res.data.data.paymentModeName}`,
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>
                {errors.paymentModeName ? (
                  <span className="text-destructive">
                    {errors.paymentModeName.message}
                  </span>
                ) : (
                  <span>Payment Name</span>
                )}
              </Label>
              <Input
                id="paymentModeName"
                type="text"
                placeholder="Name"
                autoComplete="off"
                {...register("paymentModeName", {
                  required: "Name is required",
                })}
                className={errors.paymentModeName ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>
                {errors.qrCodeData ? (
                  <span className="text-destructive">
                    {errors.qrCodeData.message}
                  </span>
                ) : (
                  <span>
                    QR Code Data
                    <span className="font-normal text-muted-foreground text-xs ml-2">
                      (leave empty if not necessary)
                    </span>
                  </span>
                )}
              </Label>
              <Textarea
                id="qrCodeData"
                type="text"
                placeholder="decoded QR Code data"
                autoComplete
                {...register("qrCodeData")}
                className={errors.qrCodeData ? "border-destructive" : ""}
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
  selectedPaymentMode,
  setSelectedPaymentMode,
}) {
  const [deletePaymentMode, { isLoading }] = useDeletePaymentModeMutation();

  const handleDelete = async () => {
    try {
      if (!selectedPaymentMode) return;
      const res = await deletePaymentMode({
        paymentModeId: selectedPaymentMode._id,
      });
      setDeleteOpen(false);
      if (res.error) {
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        setSelectedPaymentMode({});

        toast({
          title: "Payment Mode Deleted!",
          description: res.data.data.paymentModeName,
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

function EditPayment({ selectedPaymentMode, editOpen, setEditOpen }) {
  const [updatePaymentMode, { isLoading: isSubmitting }] =
    useUpdatePaymentModeMutation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await updatePaymentMode({
        paymentModeId: selectedPaymentMode._id,
        updates: { ...data },
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setEditOpen(false);
        reset();
        toast({
          title: "Payment Mode Updated",
          description: `${res.data.data.paymentModeName}`,
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
                {errors.paymentModeName ? (
                  <span className="text-destructive">
                    {errors.paymentModeName.message}
                  </span>
                ) : (
                  <span>Payment Name</span>
                )}
              </Label>
              <Input
                id="paymentModeName"
                type="text"
                autoComplete="off"
                defaultValue={selectedPaymentMode.paymentModeName}
                placeholder="Name"
                {...register("paymentModeName", {
                  required: "Name is required",
                })}
                className={errors.paymentModeName ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>
                {errors.qrCodeData ? (
                  <span className="text-destructive">
                    {errors.qrCodeData.message}
                  </span>
                ) : (
                  <span>
                    QR Code Data
                    <span className="font-normal text-muted-foreground text-xs ml-2">
                      (leave empty if not necessary)
                    </span>
                  </span>
                )}
              </Label>
              <Textarea
                id="qrCodeData"
                autoComplete="off"
                type="text"
                defaultValue={selectedPaymentMode.qrCodeData}
                placeholder="decoded QR Code data"
                {...register("qrCodeData")}
                className={errors.qrCodeData ? "border-destructive" : ""}
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

export default PaymentSettings;
