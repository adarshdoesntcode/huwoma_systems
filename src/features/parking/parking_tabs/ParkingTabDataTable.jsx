import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Check, CheckCheck, Loader2 } from "lucide-react";

import { toast } from "@/hooks/use-toast";

import { useNavigate } from "react-router-dom";
import { DataTablePagination } from "@/components/DataTablePagination";

import {
  useCancelParkingTabMutation,
  useFinishParkingTabMutation,
} from "../parkingApiSlice";
import { useRole } from "@/hooks/useRole";
import { ROLES_LIST } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { getTimeDifference } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export const ParkingTabDataTable = ({ columns, data, tabId }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showFinish, setShowFinish] = useState(false);
  const [finishTransaction, setFinishTransaction] = useState(null);
  const navigate = useNavigate();
  const role = useRole();

  const [filter, setFilter] = useState("vehicleNumber");

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="items-center mb-4 space-x-2">
        {/* <div className="flex items-center gap-2 space-x-2">
          <Select
            value={filter}
            onValueChange={(value) => {
              setFilter(value);
              table.resetColumnFilters();
              table.resetSorting();
              table.resetColumnVisibility();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vehicleNumber">Vehicle No</SelectItem>
              <SelectItem value="billNo">Bill No</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search.."
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            value={table.getColumn(filter)?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn(filter)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div> */}
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <React.Fragment key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </React.Fragment>
                );
              })}
              {table.getRowModel().rows?.length > 0 && (
                <TableHead className="text-center">Action</TableHead>
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-inherit"
              >
                {row.getVisibleCells().map((cell) => (
                  <React.Fragment key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </React.Fragment>
                ))}
                <TableCell className="px-4 py-2 text-center border-t sm:py-1 sm:px-4">
                  <div className="flex flex-col justify-center gap-2 sm:flex-row">
                    {role !== ROLES_LIST.STAFF && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="order-2 text-xs h-9 sm:order-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDelete(true);
                          setDeleteId(row.original._id);
                        }}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      size="sm"
                      className="order-1 text-xs h-9 sm:order-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFinish(true);
                        setFinishTransaction(row.original);
                      }}
                    >
                      Finish <Check className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No parkings on this tab
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* <div className="py-4 text-muted-foreground">
        <DataTablePagination table={table} />
      </div> */}

      <ConfirmDelete
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        setDeleteId={setDeleteId}
        deleteId={deleteId}
        tabId={tabId}
      />
      <ConfirmFinish
        showFinish={showFinish}
        setShowFinish={setShowFinish}
        setFinishTransaction={setFinishTransaction}
        transaction={finishTransaction}
        tabId={tabId}
      />
    </>
  );
};

function ConfirmDelete({
  showDelete,
  setShowDelete,
  deleteId,
  setDeleteId,
  tabId,
}) {
  const [cancelParkingTab, { isLoading }] = useCancelParkingTabMutation();

  const handleCloseDelete = () => {
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      if (!deleteId || !tabId) return;
      const res = await cancelParkingTab({
        transactionId: deleteId,
        tabId,
      });
      if (res.error) {
        handleCloseDelete();
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        handleCloseDelete();
        toast({
          title: "Parking Cancelled!",
          description: "Successfully",
          duration: 2000,
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
    <AlertDialog open={showDelete} onOpenChange={handleCloseDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to terminate this parking ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will terminate this parking
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Terminating
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete}>
              Terminate
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ConfirmFinish({
  showFinish,
  setShowFinish,
  transaction,
  setFinishTransaction,
  tabId,
}) {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [finishParkingTab, { isLoading }] = useFinishParkingTabMutation();

  const handleCloseFinish = () => {
    setShowFinish(false);
    setFinishTransaction(null);
    reset();
  };

  const handleFinishParkingTab = async (data) => {
    try {
      if (!transaction || !tabId) return;
      const res = await finishParkingTab({
        parkingCost: data.parkingCost,
        transactionId: transaction._id,
      });
      if (res.error) {
        handleCloseFinish();
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        handleCloseFinish();
        toast({
          title: "Parking Finished!",
          description: "Successfully",
          duration: 2000,
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

  const vehicle = transaction?.vehicle || {};
  const parkingStart = transaction?.start;
  const parkingEnd = new Date().toISOString();
  const parkingTime =
    parkingStart && parkingEnd
      ? getTimeDifference(parkingStart, parkingEnd)
      : {};

  return (
    <Dialog open={showFinish} onOpenChange={handleCloseFinish}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finish Parking</DialogTitle>
          <DialogDescription>
            This parking will be saved to the tab with pending payment
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 border rounded-md shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between font-medium">
              <div className="font-semibold">
                {vehicle?.vehicleTypeName} ( {transaction?.vehicleNumber} )
              </div>
              <div>{vehicle?.rate}/hr</div>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">
                Start Time
              </div>
              <div className="text-xs ">
                {parkingStart ? format(parkingStart, "d MMM, yy - h:mm a") : ""}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">
                End Time
              </div>
              <div className="text-xs ">
                {parkingEnd ? format(parkingEnd, "d MMM, yy - h:mm a") : ""}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">
                Total Time
              </div>
              <div className="text-sm font-semibold ">
                {`
                          ${
                            parkingTime?.days > 0
                              ? `${parkingTime?.days}d `
                              : ""
                          }
                          ${
                            parkingTime?.hours > 0
                              ? `${parkingTime?.hours}h `
                              : ""
                          } ${
                  parkingTime?.minutes > 0 ? `${parkingTime?.minutes}m` : ""
                }`}
              </div>
            </div>
            <Separator className="my-2" />
            <form
              id="parking-tab-finish-form"
              onSubmit={handleSubmit(handleFinishParkingTab)}
            >
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <Label>
                  {errors.parkingCost ? (
                    <span className="text-destructive">
                      {errors.parkingCost.message}
                    </span>
                  ) : (
                    <span>Cost</span>
                  )}
                </Label>
                <div className="flex items-center gap-6 sm:gap-2 w-full  sm:w-[180px] ">
                  <Label>Rs.</Label>

                  <Input
                    onWheel={(e) => e.target.blur()}
                    id="parkingCostTab-Checkout"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0"
                    autoFocus
                    {...register("parkingCost", {
                      required: "Cost is required",
                      validate: (value) => {
                        const regex = /^\d+$/;
                        return regex.test(value) || "Not a valid amount";
                      },
                    })}
                    className={
                      errors.parkingCost
                        ? "border-destructive text-end"
                        : "text-end"
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCloseFinish}
              className="w-1/2"
            >
              Cancel
            </Button>
            {/* <DialogCancel>Cancel</DialogCancel> */}
            {isLoading ? (
              <Button disabled className="w-1/2">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finishing..
              </Button>
            ) : (
              <Button
                type="submit"
                form="parking-tab-finish-form"
                className="w-1/2"
              >
                Finish <CheckCheck className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
